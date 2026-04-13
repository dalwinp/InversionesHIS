// ─────────────────────────────────────────────────────────────
//  index.mjs  –  InvestLab · Frontend
// ─────────────────────────────────────────────────────────────

const PALETTE = [
  "#6c63ff",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#14b8a6",
  "#a855f7",
  "#eab308",
  "#3b82f6",
];

const PRESETS = {
  // ── 🛡 S&P PUROS ─────────────────────────────────────────
  sp500: [{ ticker: "VOO", allocation: 100 }],
  nasdaq: [{ ticker: "QQQ", allocation: 100 }],
  clasico6040: [
    { ticker: "VOO", allocation: 60 },
    { ticker: "BND", allocation: 40 },
  ],
  income: [
    { ticker: "SCHD", allocation: 35 },
    { ticker: "DGRO", allocation: 30 },
    { ticker: "VNQ", allocation: 20 },
    { ticker: "BND", allocation: 15 },
  ],
  value_def: [
    { ticker: "VTV", allocation: 35 },
    { ticker: "SCHD", allocation: 30 },
    { ticker: "XLF", allocation: 20 },
    { ticker: "BND", allocation: 15 },
  ],

  // ── 📈 MODERADO – GROWTH ──────────────────────────────────
  core_growth_g: [
    { ticker: "VOO", allocation: 40 },
    { ticker: "VXUS", allocation: 25 },
    { ticker: "QQQ", allocation: 25 },
    { ticker: "GLD", allocation: 10 },
  ],
  mundo_factor: [
    { ticker: "VTI", allocation: 40 },
    { ticker: "VEA", allocation: 25 },
    { ticker: "AVUV", allocation: 20 },
    { ticker: "GLD", allocation: 15 },
  ],
  growth_equity: [
    { ticker: "VOO", allocation: 35 },
    { ticker: "QQQ", allocation: 30 },
    { ticker: "IWM", allocation: 20 },
    { ticker: "VXUS", allocation: 15 },
  ],
  simple_moderno: [
    { ticker: "VTI", allocation: 40 },
    { ticker: "VXUS", allocation: 20 },
    { ticker: "QQQ", allocation: 20 },
    { ticker: "BTC-USD", allocation: 20 },
  ],
  antifrágil: [
    { ticker: "VTI", allocation: 40 },
    { ticker: "VXUS", allocation: 20 },
    { ticker: "GLD", allocation: 25 },
    { ticker: "BTC-USD", allocation: 15 },
  ],
  macro_global: [
    { ticker: "XLE", allocation: 25 },
    { ticker: "GLD", allocation: 30 },
    { ticker: "SLV", allocation: 20 },
    { ticker: "VWO", allocation: 25 },
  ],

  // ── ⚡ AGRESIVO ────────────────────────────────────────────
  core_cripto: [
    { ticker: "VOO", allocation: 40 },
    { ticker: "QQQ", allocation: 30 },
    { ticker: "BTC-USD", allocation: 20 },
    { ticker: "ETH-USD", allocation: 10 },
  ],
  tech_dominante: [
    { ticker: "QQQ", allocation: 35 },
    { ticker: "SMH", allocation: 30 },
    { ticker: "XLK", allocation: 25 },
    { ticker: "NVDA", allocation: 10 },
  ],
  megatrends_ai: [
    { ticker: "QQQ", allocation: 35 },
    { ticker: "SMH", allocation: 30 },
    { ticker: "MSFT", allocation: 20 },
    { ticker: "GOOGL", allocation: 15 },
  ],
  oro_plata: [
    { ticker: "VTI", allocation: 40 },
    { ticker: "VXUS", allocation: 20 },
    { ticker: "GLD", allocation: 25 },
    { ticker: "SLV", allocation: 15 },
  ],
  growth_cripto: [
    { ticker: "QQQ", allocation: 40 },
    { ticker: "SMH", allocation: 30 },
    { ticker: "BTC-USD", allocation: 20 },
    { ticker: "ETH-USD", allocation: 10 },
  ],

  // ── 🧪 ESPECULATIVO ───────────────────────────────────────
  innovacion: [
    { ticker: "ARKK", allocation: 30 },
    { ticker: "SOXX", allocation: 30 },
    { ticker: "BOTZ", allocation: 20 },
    { ticker: "TSLA", allocation: 20 },
  ],
  cripto_max: [
    { ticker: "QQQ", allocation: 30 },
    { ticker: "SMH", allocation: 20 },
    { ticker: "BTC-USD", allocation: 30 },
    { ticker: "ETH-USD", allocation: 20 },
  ],
  emergentes: [
    { ticker: "VWO", allocation: 35 },
    { ticker: "INDA", allocation: 25 },
    { ticker: "EWZ", allocation: 20 },
    { ticker: "FXI", allocation: 20 },
  ],
};

// ── Nombres de ETFs / activos ─────────────────────────────────
const NAMES = {
  // ETFs índice
  VOO: "Vanguard S&P 500",
  VTI: "Vanguard Total Market",
  QQQ: "Nasdaq 100",
  IWM: "Russell 2000 Small Cap",
  VUG: "Vanguard Growth",
  VTV: "Vanguard Value",
  SPY: "SPDR S&P 500",
  DIA: "Dow Jones Industrial",
  // Internacional
  VXUS: "Vanguard Ex-USA",
  VEA: "Vanguard Dev. Markets",
  VWO: "Vanguard Emergentes",
  AVUV: "Avantis US Small Value",
  INDA: "iShares MSCI India",
  EWZ: "iShares MSCI Brasil",
  FXI: "iShares China Large-Cap",
  // Bonos
  BND: "Vanguard Total Bond",
  TLT: "iShares 20yr Treasury",
  AGG: "iShares Core Bond",
  LQD: "iShares Corp Bond",
  // Dividendos / Income
  SCHD: "Schwab US Dividend",
  DGRO: "iShares Dividend Growth",
  VYM: "Vanguard High Dividend",
  VNQ: "Vanguard Real Estate",
  // Tech / Sectores
  XLK: "SPDR Technology",
  XLF: "SPDR Financials",
  XLE: "SPDR Energy",
  SMH: "VanEck Semiconductors",
  SOXX: "iShares Semiconductors",
  ARKK: "ARK Innovation",
  BOTZ: "Global X Robotics / AI",
  ICLN: "iShares Clean Energy",
  // Acciones
  AAPL: "Apple",
  MSFT: "Microsoft",
  NVDA: "NVIDIA",
  GOOGL: "Alphabet (Google)",
  AMZN: "Amazon",
  META: "Meta Platforms",
  TSLA: "Tesla",
  "BRK.B": "Berkshire Hathaway",
  JPM: "JPMorgan Chase",
  // Metales / Commodities
  GLD: "SPDR Gold Shares",
  SLV: "iShares Silver",
  IAU: "iShares Gold",
  GDX: "VanEck Gold Miners",
  // Cripto
  "BTC-USD": "Bitcoin",
  "ETH-USD": "Ethereum",
  "SOL-USD": "Solana",
  "BNB-USD": "BNB",
};

let mainChart = null;
let annualChart = null;
let divChart = null;
let assetCompChart = null;
let assetAnnChart = null;
let savedStrategies = [];
let lastResult = null;
let assets = [{ ticker: "VOO", allocation: 100 }];

try {
  const raw = JSON.parse(localStorage.getItem("strategies") || "[]");
  // v2 = strategies computed with NaN-safe server (winRate/bestMonth/yearlyReturns valid)
  // Strategies without _v or with _v < 2 are stale — drop them automatically
  const stale = raw.filter((s) => !s._v || s._v < 2);
  savedStrategies = raw.filter((s) => s._v >= 2);
  if (stale.length) {
    console.warn(
      `[InvestLab] ${stale.length} estrategia(s) obsoleta(s) eliminadas. Re-ejecuta y vuelve a guardar.`
    );
    // persist the cleaned list right away
    localStorage.setItem("strategies", JSON.stringify(savedStrategies));
  }
} catch {
  savedStrategies = [];
}

// ── DOM ───────────────────────────────────────────────────────
const form = document.getElementById("backtestForm");
const errEl = document.getElementById("errorMsg");
const emptyState = document.getElementById("emptyState");
const resultsEl = document.getElementById("results");
const savedSection = document.getElementById("savedSection");
const savedList = document.getElementById("savedList");
const btnCompare = document.getElementById("btnCompare");
const btnSave = document.getElementById("btnSave");
const btnClearAll = document.getElementById("btnClearAll");

// ── Asset rows ─────────────────────────────────────────────────
function renderAssetRows() {
  const container = document.getElementById("assetRows");
  container.innerHTML = "";
  assets.forEach((a, i) => {
    const row = document.createElement("div");
    row.className = "asset-row";
    const assetName = NAMES[a.ticker?.toUpperCase()] || "";
    row.innerHTML = `
      <span class="asset-dot" style="background:${
        PALETTE[i % PALETTE.length]
      }"></span>
      <div class="asset-ticker-wrap">
        <input class="asset-ticker" type="text" value="${
          a.ticker
        }" placeholder="Ticker" maxlength="10"
          onchange="updateAsset(${i},'ticker',this.value.toUpperCase());this.value=this.value.toUpperCase();refreshAssetName(this);"/>
        <span class="asset-name">${assetName}</span>
      </div>
      <div class="alloc-input-wrap">
        <input class="asset-alloc" type="number" value="${
          a.allocation
        }" min="1" max="100" step="1"
          onchange="updateAsset(${i},'allocation',+this.value)"/>
        <span>%</span>
      </div>
      ${
        assets.length > 1
          ? `<button type="button" class="asset-remove" onclick="removeAsset(${i})">✕</button>`
          : `<span class="asset-remove-ph"></span>`
      }
    `;
    container.appendChild(row);
  });
  updateAllocBar();
}

window.updateAsset = (i, f, v) => {
  assets[i][f] = v;
  updateAllocBar();
};
window.refreshAssetName = (input) => {
  const nameEl = input.parentElement?.querySelector(".asset-name");
  if (nameEl) nameEl.textContent = NAMES[input.value.toUpperCase()] || "";
};
window.removeAsset = (i) => {
  assets.splice(i, 1);
  renderAssetRows();
};

document.getElementById("btnAddAsset").addEventListener("click", () => {
  if (assets.length >= 8) return;
  assets.push({ ticker: "", allocation: 0 });
  renderAssetRows();
  document.querySelectorAll(".asset-ticker").at(-1)?.focus();
});

function updateAllocBar() {
  const total = assets.reduce((s, a) => s + Number(a.allocation), 0);
  const bar = document.getElementById("allocBar");
  bar.innerHTML = "";
  assets.forEach((a, i) => {
    const pct = Math.min((a.allocation / Math.max(total, 1)) * 100, 100);
    const seg = document.createElement("div");
    seg.className = "alloc-seg";
    seg.style.cssText = `width:${pct}%;background:${
      PALETTE[i % PALETTE.length]
    }`;
    bar.appendChild(seg);
  });
  const sum = document.getElementById("allocSum");
  sum.textContent = `Total: ${total}%`;
  sum.className =
    "alloc-sum " +
    (Math.abs(total - 100) < 0.1 ? "ok" : total > 100 ? "over" : "under");
}

// ── Presets ───────────────────────────────────────────────────
document.querySelectorAll(".pill[data-preset]").forEach((pill) => {
  pill.addEventListener("click", () => {
    assets = PRESETS[pill.dataset.preset].map((a) => ({ ...a }));
    renderAssetRows();
    document
      .querySelectorAll(".pill")
      .forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
  });
});

// ── Submit ────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  setLoading(true);

  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const initial = Number(document.getElementById("initialAmount").value);
  const monthly = Number(document.getElementById("periodicContribution").value);
  const freq = document.getElementById("frequency").value;
  const total = assets.reduce((s, a) => s + Number(a.allocation), 0);

  if (!assets.length || assets.some((a) => !a.ticker))
    return finish("Todos los activos necesitan un símbolo.");
  if (Math.abs(total - 100) > 0.1)
    return finish(
      `Las asignaciones deben sumar 100% (actual: ${total.toFixed(1)}%).`
    );
  if (!start || !end) return finish("Selecciona ambas fechas.");
  if (new Date(start) >= new Date(end))
    return finish("Fecha inicio debe ser anterior a fecha fin.");

  try {
    const res = await fetch("/api/backtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assets: assets.map((a) => ({ ...a })),
        startDate: start,
        endDate: end,
        initialAmount: initial,
        periodicContribution: monthly,
        frequency: freq,
        taxRate: Number(document.getElementById("taxRate")?.value ?? 0),
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error);

    lastResult = {
      ...data,
      assets: assets.map((a) => ({ ...a })),
      startDate: start,
      endDate: end,
      initialAmount: initial,
      periodicContribution: monthly,
      frequency: freq,
      name: buildName(assets, start, end),
    };

    document.getElementById("compareTableWrap").style.display = "none";
    showResults(lastResult);
    renderRanking();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

// ── showResults ───────────────────────────────────────────────
function showResults(r) {
  emptyState.style.display = "none";
  resultsEl.style.display = "block";

  const tickers = r.assets
    .map((a) => `${a.ticker} ${a.allocation}%`)
    .join(" · ");
  setEl("resultTitle", tickers);
  setEl(
    "resultSubtitle",
    `${r.startDate} → ${r.endDate}  ·  ${(r.years ?? 0).toFixed(
      1
    )} años  ·  $${(r.initialAmount || 0).toLocaleString()} inicial`
  );

  renderComposition(r.assets);

  const vl = r.volatility ?? 0,
    sh = r.sharpe ?? 0,
    dd = r.maxDrawdown ?? 0;
  const pr = r.profit ?? 0,
    rt = r.totalReturnPct ?? 0,
    cg = r.cagr ?? 0;
  const wr = r.winRate ?? 0;

  set("mFinal", fmt$(r.finalValue ?? 0));
  set("mContrib", fmt$(r.totalContributed ?? 0));
  set("mProfit", (pr >= 0 ? "+" : "") + fmt$(pr));
  set("mReturn", pct(rt));
  set("mCagr", pct(cg) + " / año");
  set("mDrawdown", dd.toFixed(2) + "%");
  set("mVol", vl.toFixed(1) + "%");
  set("mSharpe", sh.toFixed(2));
  set("mWinRate", wr.toFixed(1) + "%");
  set("mYears", (r.years ?? 0).toFixed(1) + " años");

  // Dividendos
  const hasDivs = (r.grossDividends ?? 0) > 0.01;
  const divWrap = document.getElementById("divMetricsWrap");
  if (divWrap) divWrap.style.display = hasDivs ? "block" : "none";
  if (hasDivs) {
    set("mGrossDivs", fmt$(r.grossDividends ?? 0));
    set("mTaxPaid", fmt$(r.taxPaid ?? 0));
    set("mNetDivs", fmt$(r.netDividends ?? 0));
    set("mDivYield", (r.dividendYield ?? 0).toFixed(2) + "% / año");
    renderDivPanel(r);
  }

  const divDetail = document.getElementById("divDetailWrap");
  if (divDetail) divDetail.style.display = hasDivs ? "block" : "none";

  // Breakdown por activo
  const bdWrap = document.getElementById("assetBreakdownWrap");
  if (bdWrap) {
    bdWrap.style.display = r.assetBreakdown?.length > 0 ? "block" : "none";
    if (r.assetBreakdown?.length > 0) renderAssetBreakdown(r.assetBreakdown);
  }

  // Mejor/peor mes y año
  const bm = r.bestMonth,
    wm = r.worstMonth;
  const by = r.bestYear,
    wy = r.worstYear;
  set("sBestMonth", bm ? `${fmtMonth(bm.date)}  +${bm.ret.toFixed(1)}%` : "—");
  set("sWorstMonth", wm ? `${fmtMonth(wm.date)}  ${wm.ret.toFixed(1)}%` : "—");
  set("sBestYear", by ? `${by.year}  +${by.ret.toFixed(1)}%` : "—");
  set("sWorstYear", wy ? `${wy.year}  ${wy.ret.toFixed(1)}%` : "—");

  renderLineChart([r]);
  renderAnnualChart([r]);
}

function renderComposition(list) {
  document.getElementById("compositionWrap").innerHTML = list
    .map(
      (a, i) => `
    <div class="comp-pill" style="border-color:${
      PALETTE[i % PALETTE.length]
    }30;background:${PALETTE[i % PALETTE.length]}18">
      <span class="comp-dot" style="background:${
        PALETTE[i % PALETTE.length]
      }"></span>
      <span class="comp-ticker">${a.ticker}</span>
      <span class="comp-alloc" style="color:${PALETTE[i % PALETTE.length]}">${
        a.allocation
      }%</span>
    </div>`
    )
    .join("");
}

// ── Asset breakdown ──────────────────────────────────────────
let _currentBreakdown = null; // para re-renderizar al cambiar tab

function renderAssetBreakdown(breakdown) {
  _currentBreakdown = breakdown;

  // ── Tarjetas de resumen ───────────────────────────────────
  const grid = document.getElementById("assetCards");
  if (grid) {
    grid.innerHTML = breakdown
      .map((a, i) => {
        const col = PALETTE[i % PALETTE.length];
        const sign = a.cagr >= 0 ? "+" : "";
        const ddCls =
          a.maxDrawdown <= -30
            ? "red"
            : a.maxDrawdown <= -15
            ? "orange"
            : "yellow";
        return `
        <div class="asset-card" style="border-top-color:${col}">
          <div class="ac-header">
            <span class="ac-dot" style="background:${col}"></span>
            <span class="ac-ticker">${a.ticker}</span>
            <span class="ac-alloc">${a.allocation}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">CAGR</span>
            <span class="ac-val" style="color:${
              a.cagr >= 0 ? "#22c55e" : "#ef4444"
            }">${sign}${a.cagr.toFixed(2)}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Retorno total</span>
            <span class="ac-val" style="color:${
              a.totalReturn >= 0 ? "#22c55e" : "#ef4444"
            }">${a.totalReturn >= 0 ? "+" : ""}${a.totalReturn.toFixed(
          1
        )}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Max Drawdown</span>
            <span class="ac-val" style="color:#ef4444">${a.maxDrawdown.toFixed(
              1
            )}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Volatilidad</span>
            <span class="ac-val" style="color:#eab308">${a.volatility.toFixed(
              1
            )}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Sharpe</span>
            <span class="ac-val" style="color:#6c63ff">${a.sharpe.toFixed(
              2
            )}</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Win Rate</span>
            <span class="ac-val" style="color:#14b8a6">${a.winRate.toFixed(
              1
            )}%</span>
          </div>
          <div class="ac-row">
            <span class="ac-label">Contrib. portafolio</span>
            <span class="ac-val" style="color:${
              a.contribution >= 0 ? "#a855f7" : "#ef4444"
            }">${a.contribution >= 0 ? "+" : ""}${a.contribution.toFixed(
          1
        )}%</span>
          </div>
          ${
            a.bestYear
              ? `<div class="ac-row"><span class="ac-label">Mejor año</span><span class="ac-val" style="color:#22c55e">${
                  a.bestYear.year
                } +${a.bestYear.ret.toFixed(1)}%</span></div>`
              : ""
          }
          ${
            a.worstYear
              ? `<div class="ac-row"><span class="ac-label">Peor año</span><span class="ac-val" style="color:#ef4444">${
                  a.worstYear.year
                } ${a.worstYear.ret.toFixed(1)}%</span></div>`
              : ""
          }
          ${
            a.grossDiv > 0
              ? `<div class="ac-row"><span class="ac-label">Dividendos brutos</span><span class="ac-val" style="color:#84cc16">${fmt$(
                  a.grossDiv
                )}</span></div>`
              : ""
          }
        </div>`;
      })
      .join("");
  }

  // ── Gráfica comparativa (default: CAGR) ───────────────────
  renderAssetCompChart(breakdown, "cagr");

  // ── Tabs — remove old listeners by cloning the container ────
  const tabsContainer = document.querySelector(".asset-chart-tabs");
  if (tabsContainer) {
    const fresh = tabsContainer.cloneNode(true); // strips all event listeners
    tabsContainer.parentNode.replaceChild(fresh, tabsContainer);
    fresh.querySelectorAll(".tab-btn[data-metric]").forEach((btn) => {
      btn.addEventListener("click", () => {
        fresh
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderAssetCompChart(_currentBreakdown, btn.dataset.metric);
      });
    });
  }

  // ── Tabla detallada ───────────────────────────────────────
  const tbody = document.getElementById("assetBreakdownBody");
  if (tbody) {
    const maxCagr = Math.max(...breakdown.map((a) => a.cagr));
    tbody.innerHTML = breakdown
      .map((a, i) => {
        const col = PALETTE[i % PALETTE.length];
        const best = Math.abs(a.cagr - maxCagr) < 0.01;
        return `
        <tr>
          <td><span class="tbl-dot" style="background:${col}"></span><strong>${
          a.ticker
        }</strong></td>
          <td style="color:${col};font-weight:700">${a.allocation}%</td>
          <td class="${best ? "td-best" : ""}">
            <span style="color:${a.cagr >= 0 ? "#22c55e" : "#ef4444"}">${
          a.cagr >= 0 ? "+" : ""
        }${a.cagr.toFixed(2)}%</span>
          </td>
          <td><span style="color:${
            a.totalReturn >= 0 ? "#22c55e" : "#ef4444"
          }">${a.totalReturn >= 0 ? "+" : ""}${a.totalReturn.toFixed(
          1
        )}%</span></td>
          <td style="color:#ef4444">${a.maxDrawdown.toFixed(2)}%</td>
          <td style="color:#eab308">${a.volatility.toFixed(1)}%</td>
          <td style="color:#6c63ff">${a.sharpe.toFixed(2)}</td>
          <td style="color:#14b8a6">${a.winRate.toFixed(1)}%</td>
          <td>
            <span style="color:${
              a.contribution >= 0 ? "#a855f7" : "#ef4444"
            };font-weight:700">
              ${a.contribution >= 0 ? "+" : ""}${a.contribution.toFixed(1)}%
            </span>
          </td>
          <td class="td-green">${
            a.bestYear
              ? `${a.bestYear.year}  +${a.bestYear.ret.toFixed(1)}%`
              : "—"
          }</td>
          <td class="td-red">${
            a.worstYear
              ? `${a.worstYear.year}  ${a.worstYear.ret.toFixed(1)}%`
              : "—"
          }</td>
        </tr>`;
      })
      .join("");
  }

  // ── Gráfica anual por activo ──────────────────────────────
  renderAssetAnnualChart(breakdown);
}

function renderAssetCompChart(breakdown, metric) {
  if (assetCompChart) {
    assetCompChart.destroy();
    assetCompChart = null;
  }
  const ctx = document.getElementById("assetCompChart")?.getContext("2d");
  if (!ctx) return;

  const labels = {
    cagr: "CAGR (%)",
    totalReturn: "Retorno total (%)",
    maxDrawdown: "Max Drawdown (%)",
    volatility: "Volatilidad (%)",
    sharpe: "Sharpe Ratio",
    winRate: "Win Rate (%)",
  };

  const data = breakdown.map((a) => a[metric] ?? 0);
  const colors = breakdown.map((a, i) => {
    const v = data[i];
    if (metric === "maxDrawdown")
      return v < -25 ? "#ef444488" : v < -15 ? "#f9731688" : "#eab30888";
    return v >= 0 ? PALETTE[i % PALETTE.length] + "cc" : "#ef444488";
  });

  assetCompChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: breakdown.map((a) => `${a.ticker} (${a.allocation}%)`),
      datasets: [
        {
          label: labels[metric] || metric,
          data,
          backgroundColor: colors,
          borderColor: breakdown.map((_, i) => PALETTE[i % PALETTE.length]),
          borderWidth: 1.5,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e2235",
          borderColor: "#2e3347",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (c) => `  ${c.dataset.label}: ${c.parsed.x.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", callback: (v) => v + "%" },
          grid: { color: "#1a1d2e" },
        },
        y: {
          ticks: { color: "#e2e8f0", font: { weight: "700" } },
          grid: { display: false },
        },
      },
    },
  });
}

function renderAssetAnnualChart(breakdown) {
  if (assetAnnChart) {
    assetAnnChart.destroy();
    assetAnnChart = null;
  }
  const ctx = document.getElementById("assetAnnualChart")?.getContext("2d");
  if (!ctx) return;

  const allYears = [
    ...new Set(
      breakdown.flatMap((a) => (a.yearlyReturns || []).map((y) => y.year))
    ),
  ].sort();

  if (!allYears.length) return;

  const datasets = breakdown.map((a, i) => {
    const col = PALETTE[i % PALETTE.length];
    const map = Object.fromEntries(
      (a.yearlyReturns || []).map((y) => [y.year, y.ret])
    );
    return {
      label: `${a.ticker} (${a.allocation}%)`,
      data: allYears.map((y) => map[y] ?? null),
      backgroundColor: col + "99",
      borderColor: col,
      borderWidth: 1,
      borderRadius: 3,
    };
  });

  assetAnnChart = new Chart(ctx, {
    type: "bar",
    data: { labels: allYears, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#94a3b8", font: { size: 11 } } },
        tooltip: {
          backgroundColor: "#1e2235",
          borderColor: "#2e3347",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (c) =>
              `  ${c.dataset.label}: ${
                c.parsed.y >= 0 ? "+" : ""
              }${c.parsed.y?.toFixed(2)}%`,
          },
        },
      },
      scales: {
        x: { ticks: { color: "#64748b" }, grid: { color: "#1a1d2e" } },
        y: {
          ticks: {
            color: "#64748b",
            callback: (v) => (v >= 0 ? "+" : "") + v + "%",
          },
          grid: { color: "#1a1d2e" },
          border: { dash: [4, 4] },
        },
      },
    },
  });
}

// ── Dividend chart + table ──────────────────────────────────────
function renderDivPanel(r) {
  const history = r.divHistory || [];
  const divDetail = document.getElementById("divDetailWrap");
  if (divDetail) divDetail.style.display = history.length ? "block" : "none";
  if (!history.length) return;

  // ── Tabla ──────────────────────────────────────────────────
  const tbody = document.getElementById("divTableBody");
  const count = document.getElementById("divTableCount");
  if (tbody) {
    tbody.innerHTML = "";
    let totGross = 0,
      totTax = 0,
      totNet = 0;
    history.forEach((d) => {
      totGross += d.gross;
      totTax += d.tax;
      totNet += d.net;
      const evoPt = (r.evolution || []).find((e) => e.date === d.date);
      const portPct = evoPt ? ((d.gross / evoPt.value) * 100).toFixed(3) : "—";
      tbody.innerHTML += `
        <tr>
          <td>${fmtMonth(d.date)}</td>
          <td class="td-green">+${fmt$(d.gross)}</td>
          <td class="td-red">−${fmt$(d.tax)}</td>
          <td class="td-cyan">+${fmt$(d.net)}</td>
          <td style="color:#94a3b8;font-weight:700">${fmt$(d.cumulative)}</td>
          <td style="color:#64748b">${portPct}%</td>
        </tr>`;
    });
    tbody.innerHTML += `
      <tr class="div-totals-row">
        <td><strong>TOTAL</strong></td>
        <td class="td-green"><strong>+${fmt$(totGross)}</strong></td>
        <td class="td-red"><strong>−${fmt$(totTax)}</strong></td>
        <td class="td-cyan"><strong>+${fmt$(totNet)}</strong></td>
        <td></td><td></td>
      </tr>`;
    if (count) count.textContent = `${history.length} pagos registrados`;
  }

  // ── Gráfica ────────────────────────────────────────────────
  if (divChart) {
    divChart.destroy();
    divChart = null;
  }
  const ctx = document.getElementById("divChart")?.getContext("2d");
  if (!ctx) return;

  divChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: history.map((d) => fmtMonth(d.date)),
      datasets: [
        {
          type: "line",
          label: "Acumulado neto",
          data: history.map((d) => d.cumulative),
          borderColor: "#22d3ee",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: history.length > 36 ? 0 : 3,
          pointHoverRadius: 5,
          tension: 0.35,
          yAxisID: "yCum",
          order: 0,
        },
        {
          type: "bar",
          label: "Dividendo neto/mes",
          data: history.map((d) => d.net),
          backgroundColor: "#84cc1680",
          borderColor: "#84cc16",
          borderWidth: 1,
          borderRadius: 3,
          yAxisID: "yBar",
          order: 1,
        },
        {
          type: "bar",
          label: "Impuesto/mes",
          data: history.map((d) => d.tax),
          backgroundColor: "#fb718540",
          borderColor: "#fb7185",
          borderWidth: 1,
          borderRadius: 3,
          yAxisID: "yBar",
          order: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e2235",
          borderColor: "#2e3347",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (c) => `  ${c.dataset.label}: ${fmt$(c.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", maxTicksLimit: 16, maxRotation: 45 },
          grid: { color: "#1a1d2e" },
        },
        yBar: {
          position: "left",
          ticks: {
            color: "#84cc16",
            callback: (v) =>
              v >= 1000 ? "$" + (v / 1000).toFixed(1) + "k" : "$" + v,
          },
          grid: { color: "#1a1d2e" },
          title: {
            display: true,
            text: "Por mes ($)",
            color: "#64748b",
            font: { size: 10 },
          },
        },
        yCum: {
          position: "right",
          ticks: {
            color: "#22d3ee",
            callback: (v) =>
              v >= 1000 ? "$" + (v / 1000).toFixed(1) + "k" : "$" + v,
          },
          grid: { display: false },
          title: {
            display: true,
            text: "Acumulado ($)",
            color: "#64748b",
            font: { size: 10 },
          },
        },
      },
    },
  });
}

// ── Line chart ────────────────────────────────────────────────
function renderLineChart(strategies) {
  if (mainChart) {
    mainChart.destroy();
    mainChart = null;
  }
  const ctx = document.getElementById("mainChart").getContext("2d");
  if (!strategies[0]?.evolution?.length) return;

  const showValue = document.getElementById("showValue").checked;
  const showNav = document.getElementById("showNav").checked;
  const showContrib = document.getElementById("showContrib").checked;
  const showDivs = document.getElementById("showDivs").checked;

  const labels = strategies[0].evolution.map((e) =>
    new Date(e.date + "T00:00:00").toLocaleDateString("es-DO", {
      month: "short",
      year: "2-digit",
    })
  );

  const datasets = [];
  // ¿Alguna estrategia tiene dividendos?
  const hasDivData =
    showDivs &&
    strategies.some((r) =>
      (r.evolution || []).some((e) => (e.divNet ?? 0) > 0)
    );

  strategies.forEach((r, si) => {
    const col = PALETTE[si % PALETTE.length];
    const tag = strategies.length > 1 ? ` (${r.name ?? ""})` : "";
    const yAx = hasDivData ? "yPort" : "y"; // eje principal

    if (showValue) {
      const g = ctx.createLinearGradient(0, 0, 0, 300);
      g.addColorStop(0, col + "28");
      g.addColorStop(1, col + "00");
      datasets.push({
        type: "line",
        label: `Portafolio${tag}`,
        data: r.evolution.map((e) => e.value),
        borderColor: col,
        backgroundColor: g,
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: r.evolution.length > 60 ? 0 : 3,
        pointHoverRadius: 5,
        yAxisID: yAx,
        order: 1,
      });
    }
    if (showNav)
      datasets.push({
        type: "line",
        label: `NAV${tag}`,
        data: r.evolution.map((e) => e.nav),
        borderColor: col,
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [5, 4],
        fill: false,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: yAx,
        order: 2,
      });
    if (showContrib && si === 0)
      datasets.push({
        type: "line",
        label: "Capital aportado",
        data: r.evolution.map((e) => e.contributed),
        borderColor: "#475569",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        yAxisID: yAx,
        order: 3,
      });

    // Barras de dividendo neto mensual (eje secundario)
    if (showDivs && si === 0) {
      const divData = r.evolution.map((e) =>
        (e.divNet ?? 0) > 0 ? e.divNet : null
      );
      const hasDivs_ = divData.some((v) => v !== null);
      if (hasDivs_) {
        datasets.push({
          type: "bar",
          label: "Dividendo neto/mes",
          data: divData,
          backgroundColor: "#84cc1666",
          borderColor: "#84cc16",
          borderWidth: 1,
          borderRadius: 2,
          yAxisID: "yDiv",
          order: 0,
        });
      }
    }
  });

  // Construir escalas dinámicamente
  const scaleY = {
    ticks: {
      color: "#94a3b8",
      callback: (v) =>
        v >= 1e6
          ? "$" + (v / 1e6).toFixed(1) + "M"
          : v >= 1e3
          ? "$" + (v / 1e3).toFixed(0) + "k"
          : "$" + v,
    },
    grid: { color: "#1a1d2e" },
  };
  const scales = hasDivData
    ? {
        x: {
          ticks: { color: "#64748b", maxTicksLimit: 12, maxRotation: 0 },
          grid: { color: "#1a1d2e" },
        },
        yPort: {
          ...scaleY,
          position: "left",
          title: {
            display: true,
            text: "Portafolio ($)",
            color: "#64748b",
            font: { size: 10 },
          },
        },
        yDiv: {
          position: "right",
          ticks: {
            color: "#84cc16",
            callback: (v) =>
              v >= 1e3 ? "$" + (v / 1e3).toFixed(1) + "k" : "$" + v.toFixed(0),
          },
          grid: { display: false },
          title: {
            display: true,
            text: "Dividendo/mes ($)",
            color: "#84cc16",
            font: { size: 10 },
          },
        },
      }
    : {
        x: {
          ticks: { color: "#64748b", maxTicksLimit: 12, maxRotation: 0 },
          grid: { color: "#1a1d2e" },
        },
        y: scaleY,
      };

  mainChart = new Chart(ctx, {
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#94a3b8", font: { size: 11 } } },
        tooltip: {
          backgroundColor: "#1e2235",
          borderColor: "#2e3347",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (c) =>
              c.parsed.y != null
                ? `  ${c.dataset.label}: ${fmt$(c.parsed.y)}`
                : null,
          },
        },
      },
      scales,
    },
  });
}

// ── Annual bar chart ──────────────────────────────────────────
function renderAnnualChart(strategies) {
  if (annualChart) {
    annualChart.destroy();
    annualChart = null;
  }
  const ctx = document.getElementById("annualChart").getContext("2d");

  // Merge all years across strategies
  const allYears = [
    ...new Set(
      strategies.flatMap((r) => (r.yearlyReturns || []).map((y) => y.year))
    ),
  ].sort();

  if (!allYears.length) return;

  const datasets = strategies.map((r, si) => {
    const col = PALETTE[si % PALETTE.length];
    const map = Object.fromEntries(
      (r.yearlyReturns || []).map((y) => [y.year, y.ret])
    );
    const data = allYears.map((y) => map[y] ?? null);
    return {
      label:
        strategies.length > 1
          ? r.name ?? r.assets?.map((a) => a.ticker).join("+")
          : "Retorno anual",
      data,
      backgroundColor: data.map((v) => (v >= 0 ? col + "cc" : "#ef4444cc")),
      borderColor: data.map((v) => (v >= 0 ? col : "#ef4444")),
      borderWidth: 1,
      borderRadius: 4,
    };
  });

  annualChart = new Chart(ctx, {
    type: "bar",
    data: { labels: allYears, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: strategies.length > 1,
          labels: { color: "#94a3b8", font: { size: 11 } },
        },
        tooltip: {
          backgroundColor: "#1e2235",
          borderColor: "#2e3347",
          borderWidth: 1,
          titleColor: "#e2e8f0",
          bodyColor: "#94a3b8",
          callbacks: {
            label: (c) =>
              `  ${c.dataset.label}: ${
                c.parsed.y >= 0 ? "+" : ""
              }${c.parsed.y?.toFixed(2)}%`,
          },
        },
      },
      scales: {
        x: { ticks: { color: "#64748b" }, grid: { color: "#1a1d2e" } },
        y: {
          ticks: {
            color: "#64748b",
            callback: (v) => (v >= 0 ? "+" : "") + v + "%",
          },
          grid: { color: "#1a1d2e" },
          border: { dash: [4, 4] },
        },
      },
    },
  });
}

// Refresh line chart on toggle change
["showValue", "showNav", "showContrib", "showDivs"].forEach((id) =>
  document.getElementById(id).addEventListener("change", () => {
    const sel = getCompareSelection();
    renderLineChart(sel.length > 1 ? sel : lastResult ? [lastResult] : []);
  })
);

// ── Guardar ───────────────────────────────────────────────────
btnSave.addEventListener("click", () => {
  if (!lastResult) return;
  if (savedStrategies.find((s) => s.name === lastResult.name))
    return showError("Esta estrategia ya está guardada.");
  savedStrategies.push({ ...lastResult, _v: 2 });
  persist();
  renderSaved();
  renderRanking();
  toast("✅ Estrategia guardada", "success", 2000);
});

btnClearAll.addEventListener("click", () => {
  if (!confirm("¿Eliminar todas las estrategias guardadas?")) return;
  savedStrategies = [];
  persist();
  renderSaved();
  renderRanking();
  toast("🗑 Estrategias eliminadas", "info", 1500);
});

// ── Comparar ──────────────────────────────────────────────────
btnCompare.addEventListener("click", () => {
  const sel = getCompareSelection();
  if (sel.length < 2) return showError("Selecciona al menos 2 estrategias.");

  emptyState.style.display = "none";
  resultsEl.style.display = "block";

  // Usar la mejor estrategia por CAGR para las métricas superiores
  const best = sel.reduce(
    (b, s) => ((s.cagr ?? 0) > (b.cagr ?? 0) ? s : b),
    sel[0]
  );
  setEl("resultTitle", `Comparando ${sel.length} estrategias`);
  setEl("resultSubtitle", sel.map((s) => s.name).join("  vs  "));
  renderComposition(best.assets);

  const vl = best.volatility ?? 0,
    sh = best.sharpe ?? 0,
    dd = best.maxDrawdown ?? 0,
    wr = best.winRate ?? 0;
  const stale = best._v < 2 || !best._v;
  const staleHint = stale ? "⚠ re-ejecuta" : "—";
  set("mFinal", fmt$(best.finalValue ?? 0) + (stale ? "" : " 🏆"));
  set("mContrib", fmt$(best.totalContributed ?? 0));
  set("mProfit", (best.profit >= 0 ? "+" : "") + fmt$(best.profit ?? 0));
  set("mReturn", pct(best.totalReturnPct ?? 0));
  set("mCagr", pct(best.cagr ?? 0) + " / año");
  set("mDrawdown", dd.toFixed(2) + "%");
  set("mVol", vl.toFixed(1) + "%");
  set("mSharpe", sh.toFixed(2));
  set("mWinRate", wr > 0 ? wr.toFixed(1) + "%" : staleHint);
  set("mYears", (best.years ?? 0).toFixed(1) + " años");
  set(
    "sBestMonth",
    best.bestMonth?.ret != null
      ? `${fmtMonth(best.bestMonth.date)}  +${Number(
          best.bestMonth.ret
        ).toFixed(1)}%`
      : staleHint
  );
  set(
    "sWorstMonth",
    best.worstMonth?.ret != null
      ? `${fmtMonth(best.worstMonth.date)}  ${Number(
          best.worstMonth.ret
        ).toFixed(1)}%`
      : staleHint
  );
  set(
    "sBestYear",
    best.bestYear?.ret != null
      ? `${best.bestYear.year}  +${Number(best.bestYear.ret).toFixed(1)}%`
      : staleHint
  );
  set(
    "sWorstYear",
    best.worstYear?.ret != null
      ? `${best.worstYear.year}  ${Number(best.worstYear.ret).toFixed(1)}%`
      : staleHint
  );
  if (stale)
    showError(
      "⚠️ Estrategias guardadas con versión anterior. Re-ejecútalas y vuelve a guardarlas para ver todas las métricas."
    );

  renderLineChart(sel);
  renderAnnualChart(sel);
  renderCompareTable(sel);
});

// ── Tabla comparativa ─────────────────────────────────────────
function renderCompareTable(strategies) {
  const wrap = document.getElementById("compareTableWrap");
  const tbody = document.getElementById("compareTableBody");
  wrap.style.display = "block";
  tbody.innerHTML = "";

  // Encontrar mejores valores para resaltar
  const best = {
    cagr: Math.max(...strategies.map((s) => s.cagr ?? 0)),
    sharpe: Math.max(...strategies.map((s) => s.sharpe ?? 0)),
    maxDrawdown: Math.max(...strategies.map((s) => s.maxDrawdown ?? 0)), // menos negativo = mejor
    winRate: Math.max(...strategies.map((s) => s.winRate ?? 0)),
    finalValue: Math.max(...strategies.map((s) => s.finalValue ?? 0)),
  };

  strategies.forEach((s, i) => {
    const col = PALETTE[i % PALETTE.length];
    const by = s.bestYear,
      wy = s.worstYear;
    const td = (val, field, isGood) => {
      const isBest = field && Math.abs((s[field] ?? 0) - best[field]) < 0.001;
      return `<td class="${isBest ? "td-best" : ""}">${val}</td>`;
    };
    tbody.innerHTML += `
      <tr>
        <td><span class="tbl-dot" style="background:${col}"></span>${
      s.name
    }</td>
        ${td(fmt$(s.finalValue ?? 0), "finalValue")}
        ${td(pct(s.cagr ?? 0) + "/año", "cagr")}
        ${td((s.maxDrawdown ?? 0).toFixed(2) + "%", null)}
        ${td((s.volatility ?? 0).toFixed(1) + "%", null)}
        ${td((s.sharpe ?? 0).toFixed(2), "sharpe")}
        ${td((s.winRate ?? 0).toFixed(1) + "%", "winRate")}
        <td class="td-green">${
          by?.ret != null ? `${by.year} +${Number(by.ret).toFixed(1)}%` : "—"
        }</td>
        <td class="td-red">${
          wy?.ret != null ? `${wy.year} ${Number(wy.ret).toFixed(1)}%` : "—"
        }</td>
      </tr>`;
  });
}

// ── Ranking ───────────────────────────────────────────────────
function renderRanking() {
  const wrap = document.getElementById("rankingWrap");
  if (savedStrategies.length < 2) {
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "block";

  const sel = document.getElementById("rankBy").value;
  const sorted = [...savedStrategies].sort((a, b) => {
    const av = a[sel] ?? 0,
      bv = b[sel] ?? 0;
    // maxDrawdown: menos negativo = mejor → sort ascending (least negative first is worst, so reverse)
    return sel === "maxDrawdown" ? av - bv : bv - av;
  });

  const list = document.getElementById("rankingList");
  list.innerHTML = "";
  sorted.forEach((s, rank) => {
    const col = PALETTE[savedStrategies.indexOf(s) % PALETTE.length];
    const val =
      sel === "finalValue"
        ? fmt$(s[sel] ?? 0)
        : sel === "maxDrawdown"
        ? (s[sel] ?? 0).toFixed(2) + "%"
        : sel === "winRate"
        ? (s[sel] ?? 0).toFixed(1) + "%"
        : sel === "volatility"
        ? (s[sel] ?? 0).toFixed(1) + "%"
        : pct(s[sel] ?? 0);
    const medals = ["🥇", "🥈", "🥉"];
    const div = document.createElement("div");
    div.className = "rank-item";
    div.innerHTML = `
      <span class="rank-pos">${medals[rank] ?? `#${rank + 1}`}</span>
      <span class="rank-dot" style="background:${col}"></span>
      <span class="rank-name">${s.name}</span>
      <span class="rank-val">${val}</span>
      <button class="saved-load" onclick="loadStrategy(${savedStrategies.indexOf(
        s
      )})">Ver</button>
    `;
    list.appendChild(div);
  });
}

document.getElementById("rankBy").addEventListener("change", renderRanking);

// ── Saved list ────────────────────────────────────────────────
function renderSaved() {
  savedList.innerHTML = "";
  if (!savedStrategies.length) {
    savedSection.style.display = "none";
    btnCompare.style.display = "none";
    return;
  }
  savedSection.style.display = "block";
  savedStrategies.forEach((s, i) => {
    const col = PALETTE[i % PALETTE.length];
    const div = document.createElement("div");
    div.className = "saved-item";
    div.innerHTML = `
      <label class="saved-check">
        <input type="checkbox" id="chk-${i}" onchange="onChkChange()"/>
        <span class="saved-dot" style="background:${col}"></span>
        <span class="saved-name">${s.name}</span>
      </label>
      <span class="saved-cagr">${pct(s.cagr ?? 0)}/año</span>
      <button class="saved-load" onclick="loadStrategy(${i})">Ver</button>
      <button class="saved-del"  onclick="delStrategy(${i})">✕</button>
    `;
    savedList.appendChild(div);
  });
}

window.onChkChange = () => {
  btnCompare.style.display =
    getCompareSelection().length >= 2 ? "block" : "none";
};
window.loadStrategy = (i) => {
  lastResult = savedStrategies[i];
  document.getElementById("compareTableWrap").style.display = "none";
  showResults(savedStrategies[i]);
};
window.delStrategy = (i) => {
  savedStrategies.splice(i, 1);
  persist();
  renderSaved();
  renderRanking();
  toast("Eliminada", "info", 1200);
};

function getCompareSelection() {
  return savedStrategies.filter(
    (_, i) => document.getElementById(`chk-${i}`)?.checked
  );
}
function persist() {
  localStorage.setItem("strategies", JSON.stringify(savedStrategies));
}

// ── Helpers ───────────────────────────────────────────────────
const setEl = (id, v) => {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
};
const fmt$ = (n) => "$" + Math.round(n).toLocaleString("es-DO");
const pct = (n) => (n >= 0 ? "+" : "") + Number(n).toFixed(2) + "%";
const set = (id, v) => {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
};
const fmtMonth = (d) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("es-DO", {
        month: "short",
        year: "numeric",
      })
    : "—";
const buildName = (list, s, e) =>
  list
    .map((a) => `${a.ticker}${list.length > 1 ? " " + a.allocation + "%" : ""}`)
    .join("+") + ` · ${s.slice(0, 4)}–${e.slice(0, 4)}`;

function setLoading(on) {
  document.getElementById("btnSubmit").disabled = on;
  document.getElementById("btnText").style.display = on ? "none" : "inline";
  document.getElementById("btnSpinner").style.display = on
    ? "inline-block"
    : "none";
}
// ── Toast notification system ──────────────────────────────────
let _toastTimer = null;
function toast(msg, type = "info", duration = 2500) {
  const el = document.getElementById("toast");
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.className = `toast ${type}`;
  // Force reflow so transition fires
  void el.offsetWidth;
  el.classList.add("show");
  _toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}

// Keep old names for backward compat but use toast
function showError(msg) {
  // Also hide inline error
  if (errEl) {
    errEl.style.display = "none";
  }
  toast(msg, "error", 3500);
}
function hideError() {
  /* no-op — toast auto-dismisses */
}
function finish(msg) {
  showError(msg);
  setLoading(false);
}

// ── Mobile sidebar toggle ─────────────────────────────────────
(function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (!hamburger || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add("open");
    hamburger.classList.add("open");
    if (overlay) overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    hamburger.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () =>
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar()
  );

  // Solo cierra al tocar el overlay oscuro (fuera del sidebar)
  overlay?.addEventListener("click", closeSidebar);

  // Cierra SOLO al presionar Ejecutar (submit del form)
  document.getElementById("btnSubmit")?.addEventListener("click", () => {
    if (window.innerWidth <= 768) setTimeout(closeSidebar, 200);
  });

  // Cierra al presionar Comparar
  document.getElementById("btnCompare")?.addEventListener("click", () => {
    if (window.innerWidth <= 768) setTimeout(closeSidebar, 200);
  });

  // NO cierra al tocar presets, campos, ni cualquier otra cosa dentro del sidebar
})();

// ── Init ──────────────────────────────────────────────────────
window.setTax = (v) => {
  const el = document.getElementById("taxRate");
  if (el) {
    el.value = v;
    updateTaxHint(v);
  }
};
function updateTaxHint(v) {
  const el = document.getElementById("taxHint");
  if (!el) return;
  const n = Number(v);
  if (n === 0)
    el.textContent = "Sin impuesto — dividendos reinvertidos al 100%";
  else if (n <= 10)
    el.textContent = `Retención baja — reinviertes el ${
      100 - n
    }% del dividendo`;
  else if (n <= 20)
    el.textContent = "Retención típica (IRPF 15–20%) — efecto moderado";
  else if (n <= 30)
    el.textContent = `Retención alta — reinviertes solo el ${
      100 - n
    }% del dividendo`;
  else
    el.textContent =
      "Retención muy alta — impacto significativo en retorno compuesto";
}
document
  .getElementById("taxRate")
  ?.addEventListener("input", (e) => updateTaxHint(e.target.value));

renderAssetRows();
renderSaved();
renderRanking();
