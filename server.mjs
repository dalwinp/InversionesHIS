import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

// ── Caché en memoria ──────────────────────────────────────────
// Guarda las últimas respuestas de Yahoo Finance para evitar
// bloqueos intermitentes. TTL: 4 horas.
const CACHE = new Map();
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 horas

function cacheKey(ticker, startDate, endDate) {
  return `${ticker}|${startDate}|${endDate}`;
}
function cacheGet(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    CACHE.delete(key);
    return null;
  }
  return entry.data;
}
function cacheSet(key, data) {
  CACHE.set(key, { data, ts: Date.now() });
  // Limpiar entradas viejas si el caché crece mucho
  if (CACHE.size > 200) {
    const oldest = [...CACHE.entries()]
      .sort((a, b) => a[1].ts - b[1].ts)
      .slice(0, 50)
      .map((e) => e[0]);
    oldest.forEach((k) => CACHE.delete(k));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  FETCH YAHOO FINANCE
//  Obtiene: precios de cierre RAW (sin ajuste por dividendos) + dividendos reales
//
//  ¿Por qué precio RAW y no adjclose?
//  adjclose ya incorpora los dividendos en el precio (lo reduce retroactivamente).
//  Si usamos adjclose Y sumamos dividendos aparte → doble conteo.
//  Usamos rawClose (ajustado solo por splits) + dividendos explícitos.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchYahooMonthly(ticker, startDate, endDate) {
  const p1 = Math.floor(new Date(startDate).getTime() / 1000);
  const p2 = Math.floor(new Date(endDate).getTime() / 1000);

  const params = `period1=${p1}&period2=${p2}&interval=1mo&includeAdjustedClose=true&events=div%7Csplit`;

  // Intentar con query1 y query2 como fallback
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?${params}`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?${params}`,
    `https://query1.finance.yahoo.com/v7/finance/chart/${encodeURIComponent(
      ticker
    )}?${params}`,
  ];

  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Referer: "https://finance.yahoo.com/",
    Origin: "https://finance.yahoo.com",
    "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
  };

  let lastError = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (res.ok) {
        const json = await res.json();
        const result = json?.chart?.result?.[0];
        if (result) {
          // Éxito — procesar y retornar
          const timestamps = result.timestamp || [];
          const rawCloses = result.indicators?.quote?.[0]?.close || [];
          const adjCloses = result.indicators?.adjclose?.[0]?.adjclose || [];

          let splitFactor = 1;
          const splitFactors = new Array(timestamps.length).fill(1);
          const splitEvents = Object.values(result.events?.splits || {});
          for (let i = timestamps.length - 1; i >= 0; i--) {
            splitFactors[i] = splitFactor;
            const monthEnd = timestamps[i];
            const monthStart = i > 0 ? timestamps[i - 1] : 0;
            for (const sp of splitEvents) {
              if (sp.date >= monthStart && sp.date < monthEnd)
                splitFactor *= sp.denominator / sp.numerator;
            }
          }

          const quotes = timestamps
            .map((ts, i) => {
              const raw = rawCloses[i];
              if (raw == null || isNaN(raw)) return null;
              const close = Number(raw) / splitFactors[i];
              return {
                date: new Date(ts * 1000).toISOString().split("T")[0],
                close: Number.isFinite(close) && close > 0 ? close : NaN,
                div: 0,
              };
            })
            .filter((q) => q && Number.isFinite(q.close) && q.close > 0);

          const divEvents = Object.values(result.events?.dividends || {});
          const divByMonth = {};
          for (const d of divEvents) {
            const ym = new Date(d.date * 1000).toISOString().slice(0, 7);
            divByMonth[ym] = (divByMonth[ym] || 0) + Number(d.amount);
          }
          for (const q of quotes) q.div = divByMonth[q.date.slice(0, 7)] || 0;

          if (quotes.length < 2)
            throw new Error(`Datos insuficientes para "${ticker}"`);

          const totalDiv = quotes.reduce((s, q) => s + q.div, 0);
          console.log(
            `[${ticker}] ${quotes.length} meses | divs: ${
              divEvents.length
            } | total/acción: $${totalDiv.toFixed(4)}`
          );
          return quotes;
        }
      }
      lastError = new Error(`Yahoo respondió ${res.status} para "${ticker}"`);
    } catch (err) {
      lastError = err;
      console.warn(
        `[${ticker}] falló ${url.includes("query1") ? "query1" : "query2"}: ${
          err.message
        }`
      );
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw lastError || new Error(`No se pudieron obtener datos para "${ticker}"`);
}

// ── Alinear por año-mes (YYYY-MM) ─────────────────────────────
function alignByYearMonth(allQuotes) {
  const maps = allQuotes.map((quotes) => {
    const m = {};
    quotes.forEach((q) => {
      m[q.date.slice(0, 7)] = q;
    });
    return m;
  });
  const keys0 = Object.keys(maps[0]);
  const common = keys0.filter((k) => maps.every((m) => m[k])).sort();
  if (common.length < 2)
    throw new Error("No hay fechas comunes suficientes entre los activos.");
  return {
    aligned: maps.map((m) => common.map((k) => m[k])),
    dates: common,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  RETORNO MENSUAL PONDERADO CON DIVIDENDOS Y TASA DE IMPUESTO
//
//  Modelo matemático:
//    r_precio   = (close[i] - close[i-1]) / close[i-1]   ← plusvalía de precio
//    r_div_bruto = div[i] / close[i-1]                   ← rendimiento dividendo
//    r_div_neto  = r_div_bruto × (1 − taxRate)           ← después de impuesto
//    r_total     = r_precio + r_div_neto
//
//  Al usar rawClose (no adjclose), los dividendos NO están ya incorporados
//  en la variación de precio, evitando doble conteo.
// ─────────────────────────────────────────────────────────────────────────────
function blendedReturn(aligned, allocations, i, taxRate) {
  if (i === 0) return 0;
  let total = 0;
  for (let a = 0; a < aligned.length; a++) {
    const curr = Number(aligned[a][i]?.close);
    const prev = Number(aligned[a][i - 1]?.close);
    const div = Number(aligned[a][i]?.div ?? 0);
    if (!Number.isFinite(curr) || !Number.isFinite(prev) || prev <= 0) continue;

    const priceReturn = (curr - prev) / prev;
    const divYield = div / prev; // rendimiento bruto
    const divAfterTax = divYield * (1 - taxRate); // rendimiento neto de impuesto
    const totalReturn = priceReturn + divAfterTax;

    if (
      !Number.isFinite(totalReturn) ||
      totalReturn > 1.5 ||
      totalReturn < -0.9
    )
      continue;
    total += totalReturn * (Number(allocations[a]) / 100);
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────────────────
//  PER-ASSET BREAKDOWN
//  Calcula métricas individuales para cada activo del portafolio.
//  Permite entender qué activo aportó más/menos al resultado global.
// ─────────────────────────────────────────────────────────────────────────────
function calcAssetBreakdown(
  aligned,
  allocations,
  assetTickers,
  dates,
  initialAmount,
  taxRate,
  years
) {
  return aligned.map((quotes, a) => {
    const ticker = assetTickers[a];
    const allocation = allocations[a];
    const rets = [];
    let nav = 1;
    let peakNav = 1;
    let maxDD = 0;
    let grossDiv = 0;
    let posCount = 0;
    const yearlyMap = {};

    for (let i = 1; i < quotes.length; i++) {
      const curr = Number(quotes[i]?.close);
      const prev = Number(quotes[i - 1]?.close);
      const div = Number(quotes[i]?.div ?? 0);
      if (!Number.isFinite(curr) || !Number.isFinite(prev) || prev <= 0)
        continue;

      const priceRet = (curr - prev) / prev;
      const divYield = div / prev;
      const divNet = divYield * (1 - taxRate);
      const totalRet = priceRet + divNet;
      if (!Number.isFinite(totalRet) || totalRet > 1.5 || totalRet < -0.9)
        continue;

      rets.push(totalRet);
      if (totalRet > 0) posCount++;

      // Dividendos brutos: aproximación sobre capital inicial proporcional
      if (div > 0) grossDiv += ((initialAmount * allocation) / 100) * divYield;

      nav *= 1 + totalRet;
      if (nav > peakNav) peakNav = nav;
      const dd = (nav - peakNav) / peakNav;
      if (dd < maxDD) maxDD = dd;

      // Rendimiento anual
      const yr = dates[i].slice(0, 4);
      if (!yearlyMap[yr]) yearlyMap[yr] = 1;
      yearlyMap[yr] *= 1 + totalRet;
    }

    // Métricas
    const totalReturn = (nav - 1) * 100;
    const cagr =
      years > 0 && nav > 0 ? (Math.pow(nav, 1 / years) - 1) * 100 : 0;

    let vol = 0;
    const N = rets.length;
    if (N > 1) {
      const mean = rets.reduce((a, b) => a + b, 0) / N;
      const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (N - 1);
      vol = Math.sqrt(variance * 12) * 100;
    }
    const sharpe = vol > 0 ? (cagr - 4) / vol : 0;
    const winRate = N > 0 ? (posCount / N) * 100 : 0;

    const yearlyReturns = Object.entries(yearlyMap)
      .map(([year, m]) => ({ year, ret: +((m - 1) * 100).toFixed(2) }))
      .sort((a, b) => a.year.localeCompare(b.year));
    const bestYear = yearlyReturns.length
      ? yearlyReturns.reduce((b, y) => (y.ret > b.ret ? y : b))
      : null;
    const worstYear = yearlyReturns.length
      ? yearlyReturns.reduce((w, y) => (y.ret < w.ret ? y : w))
      : null;

    // Contribución al portafolio = retorno_activo × peso
    const contribution = totalReturn * (allocation / 100);

    return {
      ticker,
      allocation,
      totalReturn: +totalReturn.toFixed(2),
      cagr: +cagr.toFixed(2),
      maxDrawdown: +(maxDD * 100).toFixed(2),
      volatility: +vol.toFixed(2),
      sharpe: +sharpe.toFixed(2),
      winRate: +winRate.toFixed(1),
      contribution: +contribution.toFixed(2),
      grossDiv: +grossDiv.toFixed(2),
      bestYear,
      worstYear,
      yearlyReturns,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  MOTOR DE SIMULACIÓN
// ─────────────────────────────────────────────────────────────────────────────
function simulate(
  aligned,
  allocations,
  dates,
  initialAmount,
  periodicContribution,
  frequency,
  startDate,
  endDate,
  taxRate
) {
  const n0 = Number(initialAmount);
  let value = n0;
  let contributed = n0;
  let nav = n0;
  let peakNav = n0;
  let maxDrawdown = 0;
  // Tracking de dividendos en dólares reales
  let grossDividends = 0; // dividendos brutos acumulados ($)
  let taxPaid = 0; // impuestos pagados acumulados ($)

  const evolution = [];
  const divHistory = []; // pagos de dividendo mes a mes
  const monthlyRets = [];
  const monthlyDates = [];
  let divCumulative = 0; // acumulado de dividendos netos ($)

  for (let i = 0; i < dates.length; i++) {
    const ret = blendedReturn(aligned, allocations, i, taxRate);

    // ── Dividendos de este mes ─────────────────────────────────────────────
    let monthGross = 0;
    let monthTax = 0;

    if (i > 0) {
      monthlyRets.push(ret);
      monthlyDates.push(dates[i]);

      for (let a = 0; a < aligned.length; a++) {
        const prev = Number(aligned[a][i - 1]?.close);
        const div = Number(aligned[a][i]?.div ?? 0);
        if (div > 0 && Number.isFinite(prev) && prev > 0) {
          const assetValue = value * (Number(allocations[a]) / 100);
          const gross = assetValue * (div / prev);
          const tax = gross * taxRate;
          monthGross += gross;
          monthTax += tax;
          grossDividends += gross;
          taxPaid += tax;
        }
      }

      // Registrar pago de dividendo si hubo alguno este mes
      if (monthGross > 0.001) {
        divCumulative += monthGross - monthTax;
        divHistory.push({
          date: dates[i],
          gross: +monthGross.toFixed(2),
          tax: +monthTax.toFixed(2),
          net: +(monthGross - monthTax).toFixed(2),
          cumulative: +divCumulative.toFixed(2),
        });
      }
    }

    nav *= 1 + ret;
    value *= 1 + ret;

    if (nav > peakNav) peakNav = nav;
    const dd = (nav - peakNav) / peakNav;
    if (dd < maxDrawdown) maxDrawdown = dd;

    const isMonthly = frequency === "mensual" && i > 0;
    const isQuarterly = frequency === "trimestral" && i > 0 && i % 3 === 0;
    if (isMonthly || isQuarterly) {
      value += Number(periodicContribution);
      contributed += Number(periodicContribution);
    }

    evolution.push({
      date: dates[i],
      value: +value.toFixed(2),
      nav: +nav.toFixed(2),
      contributed: +contributed.toFixed(2),
      divNet: +(monthGross - monthTax).toFixed(2), // dividendo neto este mes
    });
  }

  // ── Métricas de retorno ────────────────────────────────────────────────────
  const finalValue = value;
  const profit = value - contributed;
  const totalReturnPct = (profit / contributed) * 100;
  const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  const years = ms / (1000 * 60 * 60 * 24 * 365.25);
  const cagr =
    years > 0 && nav > 0 ? (Math.pow(nav / n0, 1 / years) - 1) * 100 : 0;

  // ── Riesgo ────────────────────────────────────────────────────────────────
  let volatility = 0,
    sharpe = 0;
  const N = monthlyRets.length;
  if (N > 1) {
    const mean = monthlyRets.reduce((a, b) => a + b, 0) / N;
    const variance =
      monthlyRets.reduce((a, b) => a + (b - mean) ** 2, 0) / (N - 1);
    volatility = Math.sqrt(variance * 12) * 100;
    sharpe = volatility > 0 ? (cagr - 4) / volatility : 0;
  }

  // ── Win Rate ──────────────────────────────────────────────────────────────
  const posCount = monthlyRets.filter((r) => r > 0).length;
  const negCount = monthlyRets.filter((r) => r < 0).length;
  const winRate = N > 0 ? (posCount / N) * 100 : 0;

  // ── Mejor y peor mes ──────────────────────────────────────────────────────
  let bestMonth = null,
    worstMonth = null;
  for (let i = 0; i < monthlyRets.length; i++) {
    const r = monthlyRets[i],
      d = monthlyDates[i];
    if (!bestMonth || r > bestMonth.ret) bestMonth = { date: d, ret: r };
    if (!worstMonth || r < worstMonth.ret) worstMonth = { date: d, ret: r };
  }

  // ── Rendimiento anual ─────────────────────────────────────────────────────
  const yearlyMap = {};
  for (let i = 0; i < dates.length; i++) {
    const yr = dates[i].slice(0, 4);
    const ret = blendedReturn(aligned, allocations, i, taxRate);
    if (!yearlyMap[yr]) yearlyMap[yr] = 1;
    yearlyMap[yr] *= 1 + ret;
  }
  const yearlyReturns = Object.entries(yearlyMap)
    .map(([year, navMult]) => ({
      year,
      ret: +((navMult - 1) * 100).toFixed(2),
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
  const bestYear = yearlyReturns.length
    ? yearlyReturns.reduce((b, y) => (y.ret > b.ret ? y : b))
    : null;
  const worstYear = yearlyReturns.length
    ? yearlyReturns.reduce((w, y) => (y.ret < w.ret ? y : w))
    : null;

  // ── Log ───────────────────────────────────────────────────────────────────
  console.log("─".repeat(60));
  console.log(
    `[simulate] meses=${dates.length} | válidos=${N} | taxRate=${(
      taxRate * 100
    ).toFixed(0)}%`
  );
  console.log(
    `[simulate] winRate=${winRate.toFixed(1)}% (${posCount}+ / ${negCount}-)`
  );
  console.log(
    `[simulate] CAGR=${cagr.toFixed(2)}% | vol=${volatility.toFixed(
      2
    )}% | sharpe=${sharpe.toFixed(2)}`
  );
  console.log(
    `[simulate] grossDiv=$${grossDividends.toFixed(
      2
    )} | taxPaid=$${taxPaid.toFixed(2)} | netDiv=$${(
      grossDividends - taxPaid
    ).toFixed(2)}`
  );
  console.log(
    `[simulate] bestMonth=${bestMonth?.date} ${
      bestMonth ? (bestMonth.ret * 100).toFixed(2) + "%" : "null"
    }`
  );
  console.log(
    `[simulate] yearlyReturns:`,
    yearlyReturns.map((y) => `${y.year}:${y.ret}%`).join(" ")
  );
  console.log("─".repeat(60));

  return {
    finalValue,
    totalContributed: contributed,
    profit,
    totalReturnPct: +totalReturnPct.toFixed(4),
    cagr: +cagr.toFixed(4),
    maxDrawdown: +(maxDrawdown * 100).toFixed(4),
    volatility: +volatility.toFixed(4),
    sharpe: +sharpe.toFixed(4),
    years: +years.toFixed(2),
    winRate: +winRate.toFixed(2),
    // Métricas de dividendos
    grossDividends: +grossDividends.toFixed(2),
    taxPaid: +taxPaid.toFixed(2),
    netDividends: +(grossDividends - taxPaid).toFixed(2),
    dividendYield: n0 > 0 ? +((grossDividends / n0) * 100).toFixed(2) : 0,
    // Estadísticas extremas
    bestMonth: bestMonth
      ? { date: bestMonth.date, ret: +(bestMonth.ret * 100).toFixed(2) }
      : null,
    worstMonth: worstMonth
      ? { date: worstMonth.date, ret: +(worstMonth.ret * 100).toFixed(2) }
      : null,
    bestYear,
    worstYear,
    yearlyReturns,
    evolution,
    divHistory,
    _debug: {
      posCount,
      negCount,
      N,
      grossDividends: +grossDividends.toFixed(2),
      divPayments: divHistory.length,
    },
    // breakdown se agrega en el endpoint después de llamar a simulate
  };
}

// ── POST /api/backtest ─────────────────────────────────────────────────────
app.post("/api/backtest", async (req, res) => {
  const {
    assets,
    startDate,
    endDate,
    initialAmount,
    periodicContribution,
    frequency,
    taxRate,
  } = req.body;

  if (!assets?.length || !startDate || !endDate)
    return res.status(400).json({ error: "Faltan parámetros obligatorios." });
  if (new Date(startDate) >= new Date(endDate))
    return res
      .status(400)
      .json({ error: "Fecha inicio debe ser anterior a fecha fin." });

  const totalAlloc = assets.reduce((s, a) => s + Number(a.allocation), 0);
  if (Math.abs(totalAlloc - 100) > 0.1)
    return res
      .status(400)
      .json({
        error: `Las asignaciones deben sumar 100% (actual: ${totalAlloc.toFixed(
          1
        )}%).`,
      });

  // taxRate: porcentaje (ej: 15) → fracción (0.15). Default 0.
  const tax = Math.min(Math.max(Number(taxRate ?? 0) / 100, 0), 1);

  try {
    const rawQuotes = [];
    for (const asset of assets) {
      const ticker = asset.ticker.toUpperCase();
      const key = cacheKey(ticker, startDate, endDate);
      const cached = cacheGet(key);

      if (cached) {
        console.log(`[CACHE HIT] ${ticker}`);
        rawQuotes.push(cached);
      } else {
        await new Promise((r) => setTimeout(r, 350));
        const quotes = await fetchYahooMonthly(ticker, startDate, endDate);
        cacheSet(key, quotes);
        rawQuotes.push(quotes);
      }
    }

    const { aligned, dates } = alignByYearMonth(rawQuotes);
    const allocations = assets.map((a) => Number(a.allocation));

    console.log(
      `[backtest] ${assets.map((a) => a.ticker).join("+")} | ${
        dates.length
      } meses comunes | taxRate=${(tax * 100).toFixed(0)}%`
    );

    const result = simulate(
      aligned,
      allocations,
      dates,
      initialAmount,
      periodicContribution,
      frequency,
      startDate,
      endDate,
      tax
    );

    // Calcular métricas individuales por activo
    const assetTickers = assets.map((a) => a.ticker.toUpperCase());
    result.assetBreakdown = calcAssetBreakdown(
      aligned,
      allocations,
      assetTickers,
      dates,
      initialAmount,
      tax,
      result.years
    );

    return res.json(result);
  } catch (err) {
    console.error("[Error]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅  Servidor listo en http://localhost:${PORT}`)
);
