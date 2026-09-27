/**
 * Deterministic, simulated market data.
 *
 * NOTE: this is generated locally with a seeded PRNG so the site renders
 * identically on server and client. It is illustrative, not live fund data.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rnd: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export type Fund = {
  rank: number;
  name: string;
  ticker: string;
  returnPct: number;
  smoothness: number;
  series: number[];
};

/** Names and three-month returns transcribed from the supplied fund screenshots.
 * Snapshot date and NAV histories were not supplied; chart traces remain illustrative. */
const FUND_SNAPSHOT: [string, number][] = [
  ['Allianz Cyber Security AT USD Acc', 29.60],
  ['Jupiter Gold & Silver L USD Acc', 28.60],
  ['CPR Invest Global Gold Mines A USD Acc', 26.88],
  ['GAM Star Galena Commodities B USD', 26.62],
  ['Evli Silver and Gold B', 26.58],
  ['AuAg Gold Rush A', 26.38],
  ['BGF World Gold A2 USD', 25.85],
  ['Franklin Gold and Prec Mtls A(acc)USD', 25.79],
  ['Invesco Commodity Allocation A Acc', 23.67],
  ['Avanza Disruptive Innovation by ARK Invest', 22.66],
  ['SEB Blockchain Economy Exposure A (USD)', 22.49],
  ['Evli UK Value Fund B', 21.46],
  ['AuAg Silver Bullet A', 21.41],
  ['GAM Multistock Japan Special Sits JPY B', 20.71],
  ['CT (Lux) Enhanced Cmdts AU', 20.13],
  ['Skandia Time Global', 19.39],
  ['Lancelot Sverige B', 18.60],
  ['UBS Lux Sec Eq Fd P acc', 18.37],
  ['DNB Teknologi S', 18.05],
  ['GAM Star Japan Ldrs-A EUR', 17.92],
  ['BGF World Energy A2', 17.26],
  ['Alfred Berg Aktiv R (NOK)', 17.25],
  ['TIN Ny Teknik A', 17.10],
  ['JPM Global Natural Resources A acc EUR', 17.06],
  ['Rhenman Healthcare Equity L/S RC1 SEK', 16.38],
  ['Allianz Dynamic Commodities A H2 EUR', 15.84],
  ['Alfred Berg Gambak R (NOK)', 15.68],
  ['Colosseum Global Alpha', 15.63],
  ['Alfred Berg Norge R (NOK)', 15.57],
  ['Barings Global Resources A USD Inc', 15.38],
  ['Pictet-Longevity R USD', 15.15],
  ['Schroder ISF Global Energy A Acc USD', 14.78],
  ['Storebrand Indeks Norge A', 14.75],
  ['Allianz Global Metals and Mining A EUR', 14.63],
  ['Barings Eastern Europe A USD Inc', 14.44],
  ['ODIN Norge C SEK', 14.40],
  ['BGF Natural Resources A2', 14.26],
  ['Pareto Aksje Norge B', 14.19],
  ['Templeton Eastern Europe A(acc)EUR', 13.61],
  ['CPR Invest Global Resources A USD Acc', 13.45],
  ['BGF World Mining A2', 13.15],
  ['Evli Global B', 13.06],
  ['DNB SMB S', 12.93],
  ['Evli Global X B SEK', 12.89],
  ['DNB Critical Materials S SEK', 12.75],
  ['D&G Global All Cap', 12.72],
  ['Evli Hannibal B2', 12.53],
  ['Evli Japan B', 12.51],
  ['Lannebo Teknik A SEK', 12.44],
  ['Amundi Fds Equity Jpn Trgt A JPY C', 12.20],
  ['Fidelity Em Eurp Mdl Est&Afr A Acc USD', 11.89],
  ['East Capital New Europe A1 SEK', 11.82],
  ['PriorNilsson Småbolag A', 11.75],
  ['DNB Fund Nordic Small Cap A SEK Acc', 11.63],
  ['Carnegie Global Quality Companies A', 11.54],
  ['Lancelot Sverige A', 11.50],
  ['Pictet-Digital R USD', 11.31],
  ['FIRST Veritas A SEK', 11.15],
  ['Evli Europe B', 11.09],
  ['Storebrand Norge A', 11.03],
  ['Fidelity Nordic A-Dis-SEK', 10.82],
  ['Schroder ISF Emerging Europe A Acc EUR', 10.78],
  ['Fidelity Thailand A-Dis-USD', 10.69],
  ['Fondita Global Megatrends B', 10.67],
  ['Pictet-Security R USD', 10.56],
  ['MS INVF US Growth A USD', 10.53],
  ['Fidelity ASEAN A-Acc-USD', 10.51],
  ['UBS (Lux) EF Biotech (USD) P-acc', 10.51],
  ['Fidelity ASEAN A-Dis-USD', 10.50],
  ['Danske Invest Defence & Security Acc SEK', 10.26],
  ['Go Blockchain Fund A', 10.24],
  ['Carnegie Small & Micro Cap', 10.23],
  ['SEB US Focus Core Fund C (USD)', 10.12],
  ['Fidelity Global Technology A-Dis-EUR', 9.87],
  ['Evli Finland Select B', 9.83],
  ['Pictet-Japanese Equity Sel R JPY', 9.81],
  ['Fidelity Global Technology A-Acc-USD', 9.80],
  ['DNB European Defence S', 9.77],
  ['BNP Paribas US Growth Classic SEK C', 9.69],
  ['DNB Sport & Entertainment S SEK', 9.65],
  ['Holberg Norge A', 9.58],
  ['Fidelity Asian Smaller Coms A-Acc-USD', 9.53],
  ['Kvartil Nordiska Småbolag+ Faktor C', 9.51],
  ['Schroder ISF Nordic Small Cap', 9.48],
  ['Franklin Natural Resources A(acc)USD', 9.48],
  ['Fidelity Indonesia A-Dis-USD', 9.47],
  ['Kvartil Nordiska Småbolag+ Faktor A', 9.40],
  ['JPM Mdl Est, Afr & Em Eurp Opps A disUSD', 9.37],
  ['JPM Mdl Est, Afr & Em Eurp Opps A accUSD', 9.36],
  ['Espiria Global Innovation A', 9.22],
  ['Centaur Commodity A', 9.19],
  ['Lannebo Oligo Global A SEK', 9.11],
  ['Storebrand Equal Opportunities A2', 9.10],
  ['Being Global Active Value A', 9.10],
  ['Carnegie Global Plus A', 9.09],
  ['JPM Mdl Est, Afr & Em Eurp Opps AdisEURH', 9.03],
  ['Fidelity US Equity Fund A-Dis-USD', 9.02],
  ['UBS (Lux) EF Tech Opp (USD) P acc', 9.01],
  ['Fidelity Transition Materials A EUR Acc', 9.01],
  ['Schroder ISF Gbl Sust Gr A Acc USD', 8.99],
];

/** Builds a 63-point (≈3 trading months) normalised NAV series. */
function buildSeries(rnd: () => number, totalMove: number, noise: number) {
  const n = 63;
  const out: number[] = [];
  let level = 100;
  const drift = totalMove / n;
  for (let i = 0; i < n; i += 1) {
    level *= 1 + drift / 100 + (gauss(rnd) * noise) / 100;
    out.push(level);
  }
  // Force the final point to land exactly on the stated return.
  const scale = (100 * (1 + totalMove / 100)) / out[out.length - 1];
  return out.map((v, i) => v * (1 + (scale - 1) * (i / (n - 1))));
}

export function buildFunds(count = 100): Fund[] {
  const rnd = mulberry32(20260927);
  return FUND_SNAPSHOT.slice(0, count).map(([name, returnPct], i) => {
    const noise = 0.25 + rnd() * 1.8;
    const series = buildSeries(rnd, returnPct, noise);
    return {
      rank: i + 1,
      name,
      ticker: "",
      returnPct,
      smoothness: Math.max(1, Math.min(99, Math.round(100 - noise * 42))),
      series,
    };
  });
}

export type SimPoint = { year: number; rule: number; hold: number };

/** Backtest-shaped simulation: rotation rule vs. buy-and-hold, 1950 → 2025. */
export function buildSimulation(): SimPoint[] {
  const rnd = mulberry32(1950);
  const out: SimPoint[] = [];
  let rule = 1;
  let hold = 1;
  for (let year = 1950; year <= 2025; year += 1) {
    const market = 0.082 + gauss(rnd) * 0.16;
    hold *= 1 + market;
    // The rule sidesteps part of the drawdowns and keeps most of the upside.
    const ruleReturn = market > 0 ? market * (1.18 + rnd() * 0.25) : market * (0.42 + rnd() * 0.2);
    rule *= 1 + ruleReturn;
    out.push({ year, rule, hold });
  }
  return out;
}

export function cagr(multiple: number, years: number) {
  return (Math.pow(multiple, 1 / years) - 1) * 100;
}

/** Two same-return sparklines: one jagged, one smooth. */
export function buildContrastPair() {
  const smooth = buildSeries(mulberry32(7), 18, 0.22);
  const jagged = buildSeries(mulberry32(91), 18, 2.6);
  return { smooth, jagged };
}

export function noisySingle() {
  return buildSeries(mulberry32(404), 3, 3.4);
}
