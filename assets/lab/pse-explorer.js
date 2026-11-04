/* Interactive grid telemetry charts & 2-lens power-plant / episode explorer — RolePlayingTech Issue 04
   Zero external dependencies. Supports PL & EN and ?embed=1 newsroom mode. */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pl').toLowerCase().indexOf('en') === 0 ? 'en' : 'pl';
  var IS_EMBED = document.documentElement.classList.contains('is-embed');

  var T = {
    pl: {
      fig1TabRegime: '01 · Przedziały cenowe (2025 vs 2026)',
      fig1TabMonth: '02 · Fala miesięczna i luka 355 vs 105 mln zł',
      fig1TabGuil: '03 · Gilotyna pełnej godziny (:00)',
      fig1LeftTitle: 'Rozkład zredysponowanej energii OZE wg ceny w tym samym kwadransie (01.01–02.11)',
      fig1LeftSub: 'Porównanie identycznych sezonów 2025 YTD (1 326,29 GWh) i 2026 YTD (1 805,05 GWh) w 29 376 kwadransach',
      fig1RightTitle: 'Wycena rynkowa RCE kontra ustawowe CEN (KC) i gotówka wypłacona przez PSE',
      fig1RightSub: 'Dlaczego rachunek ustawowy za 2026 YTD (355,09 mln zł) jest 3,4× wyższy od dotychczasowych wypłat z lat 2023–VII 2026',
      rPos: 'Cena dodatnia (RCE > 0 zł/MWh)',
      rNeg: 'Cena zerowa lub ujemna (RCE ≤ 0 zł/MWh)',
      rGe250: 'Drogi prąd (RCE ≥ 250 zł/MWh)',
      rGe400: 'Bardzo drogi prąd (RCE ≥ 400 zł/MWh)',
      rCen250: 'Ustawowa cena niezbilansowania CEN ≥ 250 zł/MWh',
      rWkd: 'Dni robocze (poniedziałek – piątek)',
      vCen: 'Wycena ustawowa KC wg max(0, CEN) · 2026 YTD',
      vRce: 'Wartość rynkowa brutto wg max(0, RCE) · 2026 YTD',
      vCash26: 'Gotówka wypłacona w I–VII 2026 (wnioski z lat 2023–2025)',
      vCashTot: 'Łączna gotówka wypłacona 2023 – VII 2026 (+ ~45 mln zł w kolejce)',
      monthTitle: 'Miesięczny wolumen wyłączeń OZE (2025-01 – 2026-10) z podziałem na reżim cenowy RCE',
      monthSub: 'Rdzawy: RCE ≥ 250 zł/MWh · Bursztynowy: 0 < RCE < 250 zł/MWh · Szary: RCE ≤ 0 zł/MWh',
      guilTitle: 'W której minucie godziny PSE i OSD włączają lub zdejmują duże pakiety redukcji OZE (2025–2026)',
      guilSub: 'Rozliczenia rynku są 15-minutowe od czerwca 2024 r., ale polecenia operacyjne idą pełnymi godzinami zegarowymi',
      guilMin00: 'Minuta :00 (pełna godzina)',
      guilMin15: 'Minuta :15 (I kwadrans)',
      guilMin30: 'Minuta :30 (pół godziny)',
      guilMin45: 'Minuta :45 (III kwadrans)',
      jumpsWord: 'skoków',
      duck9d: 'Średnia 9 dni roboczych (wzorzec)',
      duck0624: 'Śr 24.06.2026 (szczyt 2 568 zł/MWh)',
      duck0708: 'Śr 08.07.2026 (33,28 GWh ścięć)',
      duck0810: 'Pn 10.08.2026 (RCE śr. 636 zł)',
      duck0909: 'Śr 09.09.2026 (6,67 GWh ścięć)',
      duck0910: 'Cz 10.09.2026 (dzień kontrolny 0 GWh)',
      duckKpiFloor: 'Podłoga cieplna 12:00 (gen-jw)',
      duckKpiPeak: 'Szczyt cieplny 20:00 (gen-jw)',
      duckKpiCurt: 'Ścięte OZE w ciągu doby',
      duckKpiPrice: 'Cena wieczorna RCE (20:00)',
      legThermal: 'Bloki cieplne gen-jw (węgiel + gaz)',
      legPv: 'Generacja słoneczna PV w KSE',
      legCurt: 'Przymusowo ścięte OZE (MW)',
      legEsp: 'ESP (pompowanie <0 / generacja >0)',
      bRegGe250: 'Drogie redukcje: RCE ≥ 250 zł (3 276 kwadr.)',
      bRegGe400: 'Bardzo drogie: RCE ≥ 400 zł (1 691 kwadr.)',
      bRegImport: 'Polska importerem netto (862 kwadr.)',
      bRegAll: 'Wszystkie redukcje 2026 (6 993 kwadr.)',
      bRegNeg: 'Ujemne ceny: RCE < 0 zł (1 294 kwadr.)',
      bPhys: 'Przepływ fizyczny netto:',
      bSched: 'Grafik handlowy RDN+RDB:',
      bLoop: 'Przepływ kołowy (fiz. − handl.):',
      bInflowPct: 'Kwadr. z wpływem fiz. do PL:',
      cDE: 'Niemcy (synchronicznie)',
      cCZ: 'Czechy (synchronicznie)',
      cSK: 'Słowacja (synchronicznie)',
      cSE: 'Szwecja · kabel HVDC SwePol',
      cLT: 'Litwa · most HVDC LitPol',
      cUA: 'Ukraina (Zamość / Rzeszów)',
      lensPlantsKicker: 'Soczewka 01 · Jednostki wytwórcze JWCD',
      lensPlantsTitle: '37 elektrowni i 106 bloków w gen-jw',
      lensDaysKicker: 'Soczewka 02 · Epizody dobowe 2025–2026',
      lensDaysTitle: '140 największych dób redukcji OZE',
      presetsLbl: 'Szybkie filtry:',
      pAllPlants: 'Wszystkie elektrownie (37)',
      pCoal: 'Węgiel brunatny i kamienny (19)',
      pGas: 'Bloki gazowe CCGT/EC (10)',
      pEsp: 'Szczytowo-pompowe ESP (6)',
      pAllDays: 'Wszystkie doby ≥3 GWh (140)',
      pExpWeekdays: 'Robocze z drogim prądem ≥250 zł',
      pNetImportDays: 'Doby z importem fizycznym netto',
      pYear2026: 'Tylko 2026 r.',
      searchPlantsPh: 'Szukaj elektrowni, grupy kapitałowej (PGE, Enea, Tauron, Orlen), województwa…',
      searchDaysPh: 'Szukaj daty (np. 2026-06-24, 2026-07, 2025-04)…',
      allTechs: 'Wszystkie technologie (6)',
      allOwners: 'Wszyscy właściciele',
      allYears: 'Lata 2025–2026',
      allDayTypes: 'Dni robocze i weekendy',
      optWeekday: 'Tylko dni robocze (pon.–pt.)',
      optWeekend: 'Tylko weekendy / święta',
      resetBtn: 'Wyczyść',
      csvBtn: 'Pobierz CSV',
      jsonBtn: 'Pełny JSON (124 KB)',
      embedBtn: 'Osadź (iframe)',
      embedInfo: 'Skopiuj kod HTML, aby bezpłatnie osadzić interaktywną wyszukiwarkę w artykule prasowym (z zachowaniem atrybucji):',
      embedHeadTitle: 'Wyłączamy tanie słońce, gdy prąd jest drogi — baza elektrowni i redukcji PSE',
      embedFullLink: 'Pełne śledztwo i metodologia (RolePlayingTech) ↗',
      colPlant: 'Elektrownia / właściciel',
      colTech: 'Technologia i bloki',
      colMidday: 'Południe (12:00 / RCE ≥250)',
      colEvening: 'Szczyt wieczorny (20:00)',
      colRamp: 'Rampa 12:00 → 20:00',
      colVerify: 'Źródło PSE',
      colDate: 'Data i typ dnia',
      colVol: 'Ścięte OZE (PV + wiatr)',
      colExpShare: 'W tym przy RCE ≥ 250 zł',
      colSysRamp: 'Bloki JG (12:00 → 20:00)',
      colValBorder: 'Wycena CEN / granica DE',
      tech_lignite: 'Węgiel brunatny',
      tech_hard_coal: 'Węgiel kamienny',
      tech_gas_ccgt: 'Gaz ziemny CCGT/EC',
      tech_chp_coal_bio: 'Elektrociepłownia',
      tech_pumped_storage: 'Szczytowo-pompowa (ESP)',
      tech_res_jw: 'Wielkoskalowe OZE w RB',
      unitsSpinLbl: 'w ruchu (z',
      loadLbl: 'obciążenia południe/wieczór',
      wkdBadge: 'Dzień roboczy',
      wkndBadge: 'Weekend',
      showing: 'Widoczne:',
      of: 'z',
      records: 'rekordów',
      moreBtn: 'Pokaż kolejne wiersze',
      verifyBtn: 'Raport PSE ↗'
    },
    en: {
      fig1TabRegime: '01 · Price brackets (2025 vs 2026)',
      fig1TabMonth: '02 · Monthly wave & 355M vs 105M PLN gap',
      fig1TabGuil: '03 · Full-hour (:00) guillotine',
      fig1LeftTitle: 'Curtailed renewable energy by co-temporal wholesale price (Jan 1 – Nov 2)',
      fig1LeftSub: 'Apples-to-apples comparison of 2025 YTD (1,326.29 GWh) vs 2026 YTD (1,805.05 GWh) across 29,376 intervals each',
      fig1RightTitle: 'Market RCE value vs statutory CEN (KC) formula & cash paid out by PSE',
      fig1RightSub: 'Why 2026 YTD statutory gross valuation (355.09M PLN) is 3.4× total cash transferred from 2023 through July 2026',
      rPos: 'Positive price (RCE > 0 PLN/MWh)',
      rNeg: 'Zero or negative price (RCE ≤ 0 PLN/MWh)',
      rGe250: 'Expensive power (RCE ≥ 250 PLN/MWh)',
      rGe400: 'Very expensive power (RCE ≥ 400 PLN/MWh)',
      rCen250: 'Statutory imbalance price CEN ≥ 250 PLN/MWh',
      rWkd: 'Working weekdays (Monday – Friday)',
      vCen: 'Statutory KC formula max(0, CEN) · 2026 YTD',
      vRce: 'Market spot value max(0, RCE) · 2026 YTD',
      vCash26: 'Cash paid out Jan–Jul 2026 (for 2023–2025 claims)',
      vCashTot: 'Cumulative cash paid 2023 – Jul 2026 (+ ~45M queued)',
      monthTitle: 'Monthly curtailed RES volume (2025-01 – 2026-10) stacked by RCE price bracket',
      monthSub: 'Rust: RCE ≥ 250 PLN/MWh · Amber: 0 < RCE < 250 PLN/MWh · Grey: RCE ≤ 0 PLN/MWh',
      guilTitle: 'Clock minute of large RES curtailment steps (≥ threshold MW, 2025–2026)',
      guilSub: 'Poland introduced 15-minute balancing settlement in June 2024, yet curtailment dispatch still moves in hourly blocks',
      guilMin00: 'Minute :00 (top of the hour)',
      guilMin15: 'Minute :15 (first quarter)',
      guilMin30: 'Minute :30 (half hour)',
      guilMin45: 'Minute :45 (third quarter)',
      jumpsWord: 'jumps',
      duck9d: '9-weekday benchmark mean',
      duck0624: 'Wed 2026-06-24 (2,568 PLN/MWh peak)',
      duck0708: 'Wed 2026-07-08 (33.28 GWh cut)',
      duck0810: 'Mon 2026-08-10 (636 PLN mean RCE)',
      duck0909: 'Wed 2026-09-09 (6.67 GWh cut)',
      duck0910: 'Thu 2026-09-10 (0 GWh control day)',
      duckKpiFloor: '12:00 thermal floor (gen-jw)',
      duckKpiPeak: '20:00 thermal peak (gen-jw)',
      duckKpiCurt: 'Daily curtailed RES volume',
      duckKpiPrice: 'Evening 20:00 RCE price',
      legThermal: 'Thermal units gen-jw (coal + gas)',
      legPv: 'National solar PV generation',
      legCurt: 'Curtailed RES power (MW)',
      legEsp: 'Pumped storage (<0 pump / >0 gen)',
      bRegGe250: 'Expensive cuts: RCE ≥ 250 (3,276 q)',
      bRegGe400: 'Very expensive: RCE ≥ 400 (1,691 q)',
      bRegImport: 'Poland net importer (862 q)',
      bRegAll: 'All 2026 cuts (6,993 q)',
      bRegNeg: 'Negative RCE < 0 (1,294 q)',
      bPhys: 'Physical net flow:',
      bSched: 'Scheduled commercial RDN+RDB:',
      bLoop: 'Unscheduled loop flow:',
      bInflowPct: 'Quarters with inflow into PL:',
      cDE: 'Germany (synchronous AC)',
      cCZ: 'Czechia (synchronous AC)',
      cSK: 'Slovakia (synchronous AC)',
      cSE: 'Sweden · SwePol HVDC cable',
      cLT: 'Lithuania · LitPol HVDC link',
      cUA: 'Ukraine (Zamość / Rzeszów)',
      lensPlantsKicker: 'Lens 01 · Dispatchable units (gen-jw)',
      lensPlantsTitle: '37 power plants & 106 units',
      lensDaysKicker: 'Lens 02 · Daily episodes (2025–2026)',
      lensDaysTitle: '140 largest curtailment days',
      presetsLbl: 'Quick filters:',
      pAllPlants: 'All power plants (37)',
      pCoal: 'Lignite & hard coal (19)',
      pGas: 'Gas CCGT / CHP units (10)',
      pEsp: 'Pumped-storage hydro (6)',
      pAllDays: 'All days ≥3 GWh (140)',
      pExpWeekdays: 'Weekdays w/ expensive cuts',
      pNetImportDays: 'Days w/ physical net import',
      pYear2026: '2026 only',
      searchPlantsPh: 'Search plant, utility group (PGE, Enea, Tauron, Orlen), region…',
      searchDaysPh: 'Search date (e.g. 2026-06-24, 2026-07, 2025-04)…',
      allTechs: 'All technologies (6)',
      allOwners: 'All owner groups',
      allYears: 'Years 2025–2026',
      allDayTypes: 'Weekdays & weekends',
      optWeekday: 'Weekdays only (Mon–Fri)',
      optWeekend: 'Weekends / holidays only',
      resetBtn: 'Reset',
      csvBtn: 'Download CSV',
      jsonBtn: 'Full JSON (124 KB)',
      embedBtn: 'Embed (iframe)',
      embedInfo: 'Copy the HTML snippet below to embed this interactive explorer in your article for free (with attribution):',
      embedHeadTitle: 'Shutting off cheap solar when power is expensive — PSE plant & curtailment explorer',
      embedFullLink: 'Full investigation & methodology (RolePlayingTech) ↗',
      colPlant: 'Power plant / owner',
      colTech: 'Technology & units',
      colMidday: 'Midday (12:00 / RCE ≥250)',
      colEvening: 'Evening peak (20:00)',
      colRamp: '12:00 → 20:00 ramp',
      colVerify: 'PSE source',
      colDate: 'Date & day type',
      colVol: 'Curtailed RES (PV + wind)',
      colExpShare: 'At RCE ≥ 250 PLN/MWh',
      colSysRamp: 'System JG (12:00 → 20:00)',
      colValBorder: 'CEN value / DE border',
      tech_lignite: 'Lignite coal',
      tech_hard_coal: 'Hard coal',
      tech_gas_ccgt: 'Natural gas CCGT/CHP',
      tech_chp_coal_bio: 'Coal/biomass CHP',
      tech_pumped_storage: 'Pumped-storage hydro',
      tech_res_jw: 'Utility RES in balancing',
      unitsSpinLbl: 'spinning (of',
      loadLbl: 'midday/evening load',
      wkdBadge: 'Weekday',
      wkndBadge: 'Weekend',
      showing: 'Showing',
      of: 'of',
      records: 'records',
      moreBtn: 'Load more rows',
      verifyBtn: 'PSE report ↗'
    }
  }[LANG];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmt(n, d) {
    if (n == null || isNaN(n)) return '—';
    var v = Number(n).toFixed(d == null ? 1 : d);
    var parts = v.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, LANG === 'pl' ? '\u00a0' : ',');
    return parts.length > 1 ? parts.join(LANG === 'pl' ? ',' : '.') : parts[0];
  }

  function fmtSigned(n, d) {
    if (n == null || isNaN(n)) return '—';
    var num = Number(n);
    var sign = num > 0 ? '+' : '';
    return sign + fmt(num, d == null ? 1 : d);
  }

  function renderFig1(mount, data) {
    if (!mount) return;
    var state = { tab: 'regime', guilThr: 'ge200' };
    var summ = data.summary;
    var p25 = summ.periods.ytd_2025;
    var p26 = summ.periods.ytd_2026;
    var cash = summ.cashPayouts;

    function paint() {
      var tabsHtml =
        '<div class="pse-tab-bar" role="tablist">' +
        '<button type="button" class="pse-tab-btn' + (state.tab === 'regime' ? ' is-active' : '') + '" data-f1-tab="regime">' + esc(T.fig1TabRegime) + '</button>' +
        '<button type="button" class="pse-tab-btn' + (state.tab === 'month' ? ' is-active' : '') + '" data-f1-tab="month">' + esc(T.fig1TabMonth) + '</button>' +
        '<button type="button" class="pse-tab-btn' + (state.tab === 'guil' ? ' is-active' : '') + '" data-f1-tab="guil">' + esc(T.fig1TabGuil) + '</button>' +
        '</div>';

      if (state.tab === 'regime') {
        var rows = [
          { lbl: T.rPos, p25: p25.rcePositiveSharePct, g25: p25.rcePositiveGwh, p26: p26.rcePositiveSharePct, g26: p26.rcePositiveGwh, cls: 'pse-fill-rust' },
          { lbl: T.rGe250, p25: p25.rceGe250SharePct, g25: p25.rceGe250Gwh, p26: p26.rceGe250SharePct, g26: p26.rceGe250Gwh, cls: 'pse-fill-rust' },
          { lbl: T.rGe400, p25: p25.rceGe400SharePct, g25: p25.rceGe400Gwh, p26: p26.rceGe400SharePct, g26: p26.rceGe400Gwh, cls: 'pse-fill-rust' },
          { lbl: T.rCen250, p25: p25.cenGe250SharePct, g25: p25.cenGe250Gwh, p26: p26.cenGe250SharePct, g26: p26.cenGe250Gwh, cls: 'pse-fill-slate' },
          { lbl: T.rWkd, p25: p25.weekdaySharePct, g25: p25.weekdayCurtailedGwh, p26: p26.weekdaySharePct, g26: p26.weekdayCurtailedGwh, cls: 'pse-fill-amber' },
          { lbl: T.rNeg, p25: p25.rceNonPositiveSharePct, g25: p25.rceNonPositiveGwh, p26: p26.rceNonPositiveSharePct, g26: p26.rceNonPositiveGwh, cls: 'pse-fill-muted' }
        ];
        var leftBars = rows.map(function (r) {
          return (
            '<div class="pse-bar-item">' +
            '<div class="pse-bar-top"><strong>' + esc(r.lbl) + '</strong><span class="pse-bar-val">2026: ' + fmt(r.p26, 1) + '% (' + fmt(r.g26, 1) + ' GWh)</span></div>' +
            '<div class="pse-track"><div class="' + r.cls + '" style="width:' + Math.min(100, r.p26) + '%"></div></div>' +
            '<div class="pse-bar-sub"><span>2025 YTD: ' + fmt(r.p25, 1) + '% (' + fmt(r.g25, 1) + ' GWh)</span><span>Δ wolumenu: ' + fmtSigned((r.g26 / r.g25 - 1) * 100, 1) + '%</span></div>' +
            '</div>'
          );
        }).join('');

        var valRows = [
          { lbl: T.vCen, v: p26.valCenMax0Mln, max: 360, cls: 'pse-fill-rust', sub: (LANG === 'pl' ? '29,5% wolumenu przy CEN ≥ 400 zł/MWh (296,1 mln zł)' : '29.5% of volume at CEN ≥ 400 PLN/MWh (296.1M PLN)') },
          { lbl: T.vRce, v: p26.valRceMax0Mln, max: 360, cls: 'pse-fill-amber', sub: (LANG === 'pl' ? 'zgodne z CSDAC RDN: 254,27 mln zł (+86,9% r/r)' : 'matches day-ahead CSDAC: 254.27M PLN (+86.9% YoY)') },
          { lbl: T.vCash26, v: cash.paidJanJul2026Mln, max: 360, cls: 'pse-fill-slate', sub: (LANG === 'pl' ? 'wypłaty z opłaty jakościowej (33,16 zł/MWh od II 2026)' : 'funded via PSE quality tariff (33.16 PLN/MWh from Feb 2026)') },
          { lbl: T.vCashTot, v: cash.paidTotal2023ToJul2026Mln, max: 360, cls: 'pse-fill-muted', sub: (LANG === 'pl' ? 'Tauron za 2025 rozliczony w 36%, Enea 68% zatwierdzonych' : 'Tauron 2025 claims 36% settled, Enea 68% approved by Aug 2026') }
        ].map(function (vr) {
          var unit = LANG === 'pl' ? ' mln zł' : 'M PLN';
          return (
            '<div class="pse-bar-item">' +
            '<div class="pse-bar-top"><strong>' + esc(vr.lbl) + '</strong><span class="pse-bar-val">' + fmt(vr.v, 2) + unit + '</span></div>' +
            '<div class="pse-track"><div class="' + vr.cls + '" style="width:' + Math.min(100, (vr.v / vr.max) * 100) + '%"></div></div>' +
            '<div class="pse-bar-sub"><span>' + esc(vr.sub) + '</span></div>' +
            '</div>'
          );
        }).join('');

        mount.innerHTML =
          tabsHtml +
          '<div class="pse-two-col">' +
          '<div class="pse-panel"><div class="pse-panel-head"><h4>' + esc(T.fig1LeftTitle) + '</h4><p>' + esc(T.fig1LeftSub) + '</p></div><div class="pse-bar-list">' + leftBars + '</div></div>' +
          '<div class="pse-panel"><div class="pse-panel-head"><h4>' + esc(T.fig1RightTitle) + '</h4><p>' + esc(T.fig1RightSub) + '</p></div><div class="pse-bar-list">' + valRows + '</div></div>' +
          '</div>';
      } else if (state.tab === 'month') {
        var mSeries = summ.monthlySeries;
        var maxGwh = 420;
        var colsHtml = mSeries.map(function (m) {
          var hTot = Math.max(2, (m.totalGwh / maxGwh) * 126);
          var pHi = m.totalGwh > 0 ? (m.rceGe250Gwh / m.totalGwh) * 100 : 0;
          var pMid = m.totalGwh > 0 ? (m.rce0To250Gwh / m.totalGwh) * 100 : 0;
          var pNeg = Math.max(0, 100 - pHi - pMid);
          var is26 = m.ym.indexOf('2026') === 0;
          var shortLbl = m.ym.slice(2, 4) + '/' + m.ym.slice(5, 7);
          return (
            '<div class="pse-m-col' + (is26 ? ' is-2026' : '') + '" title="' + esc(m.ym + ': ' + fmt(m.totalGwh, 1) + ' GWh (RCE≥250: ' + fmt(m.rceGe250Gwh, 1) + ' GWh, CEN: ' + fmt(m.valCenMln, 1) + 'M)') + '">' +
            '<span class="pse-m-val">' + (m.totalGwh >= 15 ? fmt(m.totalGwh, 0) : '') + '</span>' +
            '<div class="pse-m-stack" style="height:' + hTot.toFixed(1) + 'px">' +
            '<div class="pse-m-seg-hi" style="height:' + pHi.toFixed(1) + '%"></div>' +
            '<div class="pse-m-seg-mid" style="height:' + pMid.toFixed(1) + '%"></div>' +
            '<div class="pse-m-seg-neg" style="height:' + pNeg.toFixed(1) + '%"></div>' +
            '</div>' +
            '<span class="pse-m-lbl">' + esc(shortLbl) + '</span>' +
            '</div>'
          );
        }).join('');
        mount.innerHTML =
          tabsHtml +
          '<div class="pse-panel">' +
          '<div class="pse-panel-head"><h4>' + esc(T.monthTitle) + '</h4><p>' + esc(T.monthSub) + '</p></div>' +
          '<div class="pse-month-chart">' + colsHtml + '</div>' +
          '<div class="pse-legend-row">' +
          '<span><i class="pse-leg-dot" style="background:var(--rust)"></i>RCE ≥ 250 PLN/MWh (2026 YTD: 497,42 GWh)</span>' +
          '<span><i class="pse-leg-dot" style="background:#d19b66"></i>0 &lt; RCE &lt; 250 PLN/MWh (704,18 GWh)</span>' +
          '<span><i class="pse-leg-dot" style="background:#8b8478"></i>RCE ≤ 0 PLN/MWh (603,45 GWh)</span>' +
          '</div>' +
          '</div>';
      } else {
        var gObj = summ.guillotine.period2025_2026[state.guilThr];
        var thrBtns = ['ge100', 'ge200', 'ge300', 'ge500'].map(function (k) {
          var mw = k.replace('ge', '≥ ') + ' MW';
          return '<button type="button" class="pse-tab-btn' + (state.guilThr === k ? ' is-active' : '') + '" data-guil-thr="' + k + '">' + mw + '</button>';
        }).join('');
        var qItems = [
          { min: T.guilMin00, n: gObj.at00, pct: (gObj.at00 / gObj.totalJumps) * 100, is00: true },
          { min: T.guilMin15, n: gObj.at15, pct: (gObj.at15 / gObj.totalJumps) * 100, is00: false },
          { min: T.guilMin30, n: gObj.at30, pct: (gObj.at30 / gObj.totalJumps) * 100, is00: false },
          { min: T.guilMin45, n: gObj.at45, pct: (gObj.at45 / gObj.totalJumps) * 100, is00: false }
        ].map(function (q) {
          return (
            '<div class="pse-guil-card' + (q.is00 ? ' is-00' : '') + '">' +
            '<span class="pse-guil-min">' + esc(q.min) + '</span>' +
            '<strong class="pse-guil-pct">' + fmt(q.pct, 2) + '%</strong>' +
            '<span class="pse-guil-cnt">' + fmt(q.n, 0) + ' / ' + fmt(gObj.totalJumps, 0) + ' ' + esc(T.jumpsWord) + '</span>' +
            '</div>'
          );
        }).join('');
        mount.innerHTML =
          tabsHtml +
          '<div class="pse-panel">' +
          '<div class="pse-panel-head"><h4>' + esc(T.guilTitle) + '</h4><p>' + esc(T.guilSub) + '</p></div>' +
          '<div class="pse-tab-bar">' + thrBtns + '</div>' +
          '<div class="pse-guil-grid">' + qItems + '</div>' +
          '</div>';
      }

      Array.prototype.forEach.call(mount.querySelectorAll('[data-f1-tab]'), function (btn) {
        btn.addEventListener('click', function () {
          state.tab = btn.getAttribute('data-f1-tab');
          paint();
        });
      });
      Array.prototype.forEach.call(mount.querySelectorAll('[data-guil-thr]'), function (btn) {
        btn.addEventListener('click', function () {
          state.guilThr = btn.getAttribute('data-guil-thr');
          paint();
        });
      });
    }

    paint();
  }

  function renderFig2Duck(mount, data) {
    if (!mount) return;
    var state = { key: '9d' };
    var ramp9 = data.summary.thermalRamp9Days;
    var days = data.summary.showcaseDays;

    var opts = [
      { key: '9d', lbl: T.duck9d },
      { key: '2026-06-24', lbl: T.duck0624 },
      { key: '2026-07-08', lbl: T.duck0708 },
      { key: '2026-08-10', lbl: T.duck0810 },
      { key: '2026-09-09', lbl: T.duck0909 },
      { key: '2026-09-10', lbl: T.duck0910 }
    ];

    function paint() {
      var series = state.key === '9d' ? ramp9.hourly : days[state.key].hourly;
      var h12 = series[12];
      var h20 = series[20];
      var curtGwh = state.key === '9d'
        ? series.reduce(function (acc, x) { return acc + x.curtailedMw; }, 0) / 1000.0
        : days[state.key].curtailedGwh;

      var W = 820, H = 290, padL = 52, padR = 22, padT = 20, padB = 34;
      var cW = W - padL - padR, cH = H - padT - padB;
      var maxMw = 19000, minMw = -2000, span = maxMw - minMw;
      function yOf(mw) {
        return padT + ((maxMw - mw) / span) * cH;
      }
      function xOf(i) {
        return padL + ((i + 0.5) / 24) * cW;
      }

      var yZero = yOf(0);
      var gridSvg = [-1000, 0, 5000, 10000, 15000, 18000].map(function (v) {
        var y = yOf(v).toFixed(1);
        var stroke = v === 0 ? '#22211f' : '#e4e0d6';
        var lbl = (v / 1000) + ' GW';
        return '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + stroke + '" stroke-width="' + (v === 0 ? '1.2' : '1') + '"/>' +
          '<text x="' + (padL - 7) + '" y="' + (Number(y) + 4) + '" text-anchor="end" font-family="ui-monospace,Consolas,monospace" font-size="10.5" fill="#68655f">' + lbl + '</text>';
      }).join('');

      var barsSvg = '';
      var espBarsSvg = '';
      var thPts = [], pvPts = [];
      var barW = (cW / 24) * 0.56;
      series.forEach(function (pt, idx) {
        var cx = xOf(idx);
        if (pt.curtailedMw > 10) {
          var yTop = yOf(pt.curtailedMw);
          barsSvg += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + yTop.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + (yZero - yTop).toFixed(1) + '" fill="#d79681" stroke="#98513c" stroke-width="0.9"/>';
        }
        if (Math.abs(pt.espNetMw) > 15) {
          var yEsp = yOf(pt.espNetMw);
          var rY = Math.min(yZero, yEsp);
          var rH = Math.abs(yEsp - yZero);
          espBarsSvg += '<rect x="' + (cx - barW * 0.28).toFixed(1) + '" y="' + rY.toFixed(1) + '" width="' + (barW * 0.56).toFixed(1) + '" height="' + rH.toFixed(1) + '" fill="#26455b" opacity="0.65"/>';
        }
        thPts.push(cx.toFixed(1) + ',' + yOf(pt.thermalTotalMw).toFixed(1));
        pvPts.push(cx.toFixed(1) + ',' + yOf(pt.pvMw).toFixed(1));
      });

      var xAxisSvg = [0, 4, 8, 12, 16, 20, 23].map(function (hr) {
        return '<text x="' + xOf(hr).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="10.5" fill="#514e49">' + (hr < 10 ? '0' + hr : hr) + ':00</text>';
      }).join('');

      var svgHtml =
        '<svg class="pse-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="24-hour KSE dispatch profile">' +
        gridSvg + espBarsSvg + barsSvg +
        '<polyline fill="none" stroke="#b87832" stroke-width="2.3" points="' + pvPts.join(' ') + '"/>' +
        '<polyline fill="none" stroke="#22211f" stroke-width="3" points="' + thPts.join(' ') + '"/>' +
        '<circle cx="' + xOf(12).toFixed(1) + '" cy="' + yOf(h12.thermalTotalMw).toFixed(1) + '" r="4.5" fill="#26455b" stroke="#fbfaf6" stroke-width="1.5"/>' +
        '<circle cx="' + xOf(20).toFixed(1) + '" cy="' + yOf(h20.thermalTotalMw).toFixed(1) + '" r="4.5" fill="#98513c" stroke="#fbfaf6" stroke-width="1.5"/>' +
        xAxisSvg +
        '</svg>';

      var tabsHtml = opts.map(function (o) {
        return '<button type="button" class="pse-tab-btn' + (state.key === o.key ? ' is-active' : '') + '" data-duck-key="' + o.key + '">' + esc(o.lbl) + '</button>';
      }).join('');

      var rampDelta = h20.thermalTotalMw - h12.thermalTotalMw;
      var unitPln = LANG === 'pl' ? ' zł/MWh' : ' PLN/MWh';
      mount.innerHTML =
        '<div class="pse-duck-wrap">' +
        '<div class="pse-tab-bar">' + tabsHtml + '</div>' +
        '<div class="pse-svg-box">' + svgHtml + '</div>' +
        '<div class="pse-legend-row">' +
        '<span><i class="pse-leg-dot" style="background:#22211f"></i>' + esc(T.legThermal) + '</span>' +
        '<span><i class="pse-leg-dot" style="background:#b87832"></i>' + esc(T.legPv) + '</span>' +
        '<span><i class="pse-leg-dot" style="background:#d79681"></i>' + esc(T.legCurt) + '</span>' +
        '<span><i class="pse-leg-dot" style="background:#26455b"></i>' + esc(T.legEsp) + '</span>' +
        '</div>' +
        '<div class="pse-duck-kpis">' +
        '<div class="pse-duck-kpi"><small>' + esc(T.duckKpiFloor) + '</small><strong>' + fmt(h12.thermalTotalMw / 1000, 2) + ' GW</strong><span>RCE 12:00: ' + fmt(h12.rcePln, 0) + unitPln + ' · ESP: ' + fmtSigned(h12.espNetMw, 0) + ' MW</span></div>' +
        '<div class="pse-duck-kpi"><small>' + esc(T.duckKpiPeak) + '</small><strong>' + fmt(h20.thermalTotalMw / 1000, 2) + ' GW</strong><span>Rampa 12→20: ' + fmtSigned(rampDelta / 1000, 2) + ' GW (' + fmtSigned(rampDelta, 0) + ' MW)</span></div>' +
        '<div class="pse-duck-kpi"><small>' + esc(T.duckKpiCurt) + '</small><strong>' + fmt(curtGwh, 2) + ' GWh</strong><span>PV 12:00: ' + fmt(h12.pvMw / 1000, 2) + ' GW · ścięte 12:00: ' + fmt(h12.curtailedMw, 0) + ' MW</span></div>' +
        '<div class="pse-duck-kpi"><small>' + esc(T.duckKpiPrice) + '</small><strong>' + fmt(h20.rcePln, 0) + '<small style="display:inline;font-size:12px;margin-left:4px">' + esc(unitPln) + '</small></strong><span>CEN 20:00: ' + fmt(h20.cenPln, 0) + unitPln + '</span></div>' +
        '</div>' +
        '</div>';

      Array.prototype.forEach.call(mount.querySelectorAll('[data-duck-key]'), function (btn) {
        btn.addEventListener('click', function () {
          state.key = btn.getAttribute('data-duck-key');
          paint();
        });
      });
    }

    paint();
  }

  function renderFig3Borders(mount, data) {
    if (!mount) return;
    var state = { regime: 'rce_ge250' };
    var regs = data.summary.borderRegimes2026;
    var order = [
      { code: 'DE', name: T.cDE, cls: 'is-loop' },
      { code: 'CZ', name: T.cCZ, cls: 'is-loop' },
      { code: 'SK', name: T.cSK, cls: '' },
      { code: 'LT', name: T.cLT, cls: 'is-hvdc' },
      { code: 'SE', name: T.cSE, cls: 'is-hvdc' },
      { code: 'UA', name: T.cUA, cls: '' }
    ];
    var tabDefs = [
      { k: 'rce_ge250', lbl: T.bRegGe250 },
      { k: 'rce_ge400', lbl: T.bRegGe400 },
      { k: 'net_import', lbl: T.bRegImport },
      { k: 'all_curt', lbl: T.bRegAll },
      { k: 'rce_neg', lbl: T.bRegNeg }
    ];

    function clsVal(v) {
      return v > 5 ? 'pse-pos' : (v < -5 ? 'pse-neg' : '');
    }

    function paint() {
      var cur = regs[state.regime];
      var tabsHtml = tabDefs.map(function (t) {
        return '<button type="button" class="pse-tab-btn' + (state.regime === t.k ? ' is-active' : '') + '" data-b-reg="' + t.k + '">' + esc(t.lbl) + '</button>';
      }).join('');
      var cardsHtml = order.map(function (item) {
        var b = cur.borders[item.code];
        return (
          '<div class="pse-border-card ' + item.cls + '">' +
          '<div class="pse-border-head"><strong>' + esc(item.name) + '</strong><span class="pse-border-code">' + item.code + '</span></div>' +
          '<div class="pse-border-metrics">' +
          '<div><span>' + esc(T.bPhys) + '</span><span class="' + clsVal(b.physMw) + '">' + fmtSigned(b.physMw, 1) + ' MW</span></div>' +
          '<div><span>' + esc(T.bSched) + '</span><span class="' + clsVal(b.schedMw) + '">' + fmtSigned(b.schedMw, 1) + ' MW</span></div>' +
          '<div><span>' + esc(T.bLoop) + '</span><span class="' + clsVal(b.loopMw) + '">' + fmtSigned(b.loopMw, 1) + ' MW</span></div>' +
          '<div><span>' + esc(T.bInflowPct) + '</span><span>' + fmt(b.inflowSharePct, 1) + '%</span></div>' +
          '</div>' +
          '</div>'
        );
      }).join('');

      mount.innerHTML =
        '<div class="pse-panel">' +
        '<div class="pse-tab-bar">' + tabsHtml + '</div>' +
        '<div class="pse-border-grid">' + cardsHtml + '</div>' +
        '</div>';

      Array.prototype.forEach.call(mount.querySelectorAll('[data-b-reg]'), function (btn) {
        btn.addEventListener('click', function () {
          state.regime = btn.getAttribute('data-b-reg');
          paint();
        });
      });
    }

    paint();
  }

  function renderExplorer(mount, data) {
    if (!mount) return;
    var params = new URLSearchParams(window.location.search);
    var state = {
      lens: params.get('lens') === 'days' ? 'days' : 'plants',
      q: params.get('q') || '',
      tech: params.get('tech') || '',
      owner: params.get('owner') || '',
      year: params.get('year') || '',
      dtype: params.get('dtype') || '',
      preset: params.get('preset') || '',
      limit: 40,
      showEmbed: false
    };

    var owners = [];
    data.plants.forEach(function (p) {
      var shortOwner = p.owner.split(' ')[0];
      if (owners.indexOf(shortOwner) === -1) owners.push(shortOwner);
    });

    function syncUrl() {
      if (IS_EMBED) return;
      var sp = new URLSearchParams();
      if (state.lens !== 'plants') sp.set('lens', state.lens);
      if (state.q) sp.set('q', state.q);
      if (state.tech) sp.set('tech', state.tech);
      if (state.owner) sp.set('owner', state.owner);
      if (state.year) sp.set('year', state.year);
      if (state.dtype) sp.set('dtype', state.dtype);
      if (state.preset) sp.set('preset', state.preset);
      var qs = sp.toString();
      var next = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
      window.history.replaceState(null, '', next);
    }

    function normStr(s) {
      var raw = String(s || '').toLowerCase().replace(/ł/g, 'l');
      if (raw.normalize) raw = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return raw;
    }

    function filterPlants() {
      var ql = normStr(state.q.trim());
      return data.plants.filter(function (p) {
        if (state.preset === 'coal' && p.techGroup !== 'lignite' && p.techGroup !== 'hard_coal') return false;
        if (state.preset === 'gas' && p.techGroup !== 'gas_ccgt') return false;
        if (state.preset === 'esp' && p.techGroup !== 'pumped_storage') return false;
        if (state.tech && p.techGroup !== state.tech) return false;
        if (state.owner && p.owner.indexOf(state.owner) !== 0) return false;
        if (ql) {
          var hay = normStr(p.plant + ' ' + p.owner + ' ' + p.voivodeship + ' ' + (T['tech_' + p.techGroup] || ''));
          if (hay.indexOf(ql) === -1) return false;
        }
        return true;
      });
    }

    function filterDays() {
      var ql = state.q.trim().toLowerCase();
      return data.days.filter(function (d) {
        if (state.preset === 'exp_wkd' && (d.isWeekend || d.rceGe250Gwh < 2.0)) return false;
        if (state.preset === 'net_imp' && d.netImportQuarters <= 0) return false;
        if (state.preset === 'y2026' && d.year !== 2026) return false;
        if (state.year && String(d.year) !== state.year) return false;
        if (state.dtype === 'wkd' && d.isWeekend) return false;
        if (state.dtype === 'wknd' && !d.isWeekend) return false;
        if (ql && d.date.toLowerCase().indexOf(ql) === -1) return false;
        return true;
      });
    }

    function exportCsv(rows) {
      var lines = [];
      if (state.lens === 'plants') {
        lines.push(['id', 'plant', 'techGroup', 'owner', 'voivodeship', 'unitsTotal', 'unitsSpinningExpCurt', 'mwGenExpCurt', 'mwNet12h', 'mwNet20h', 'rampNet12To20Mw'].join(','));
        rows.forEach(function (r) {
          lines.push([r.id, '"' + r.plant + '"', r.techGroup, '"' + r.owner + '"', r.voivodeship, r.unitsTotal, r.unitsSpinningExpCurt, r.mwGenExpCurt, r.mwNet12h, r.mwNet20h, r.rampNet12To20Mw].join(','));
        });
      } else {
        lines.push(['date', 'isWeekend', 'curtailedGwh', 'pvGwh', 'windGwh', 'rceGe250Gwh', 'rceGe250Pct', 'jg12hMw', 'jg20hMw', 'rce20hPln', 'valCenMln', 'deLoopMw'].join(','));
        rows.forEach(function (r) {
          lines.push([r.date, r.isWeekend, r.curtailedGwh, r.pvGwh, r.windGwh, r.rceGe250Gwh, r.rceGe250Pct, r.jg12hMw, r.jg20hMw, r.rce20hPln, r.valCenMln, r.deLoopMw == null ? '' : r.deLoopMw].join(','));
        });
      }
      var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'pse-grid-' + state.lens + '-2026.csv';
      a.click();
    }

    function paint() {
      var rows = state.lens === 'plants' ? filterPlants() : filterDays();
      var visible = rows.slice(0, state.limit);

      var embedBanner = IS_EMBED
        ? '<div class="bzp-embed-head"><strong>' + esc(T.embedHeadTitle) + '</strong><a href="' + (LANG === 'pl' ? 'https://roleplayingtech.com/pl/lab/redysponowanie-oze-pse/' : 'https://roleplayingtech.com/en/lab/polish-grid-curtailment/') + '" target="_blank" rel="noopener noreferrer">' + esc(T.embedFullLink) + '</a></div>'
        : '';

      var lensTabs =
        '<div class="pse-lens-tabs">' +
        '<button type="button" class="pse-lens-tab' + (state.lens === 'plants' ? ' is-active' : '') + '" data-lens="plants">' +
        '<span class="pse-lens-kicker">' + esc(T.lensPlantsKicker) + '</span>' +
        '<span class="pse-lens-title">' + esc(T.lensPlantsTitle) + '</span>' +
        '<span class="pse-lens-count">' + data.plants.length + '</span>' +
        '</button>' +
        '<button type="button" class="pse-lens-tab' + (state.lens === 'days' ? ' is-active' : '') + '" data-lens="days">' +
        '<span class="pse-lens-kicker">' + esc(T.lensDaysKicker) + '</span>' +
        '<span class="pse-lens-title">' + esc(T.lensDaysTitle) + '</span>' +
        '<span class="pse-lens-count">' + data.days.length + '</span>' +
        '</button>' +
        '</div>';

      var presetsHtml = state.lens === 'plants'
        ? '<div class="bzp-presets"><span class="micro">' + esc(T.presetsLbl) + '</span>' +
          '<button type="button" class="bzp-chip' + (!state.preset ? ' is-active' : '') + '" data-preset="">' + esc(T.pAllPlants) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'coal' ? ' is-active' : '') + '" data-preset="coal">' + esc(T.pCoal) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'gas' ? ' is-active' : '') + '" data-preset="gas">' + esc(T.pGas) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'esp' ? ' is-active' : '') + '" data-preset="esp">' + esc(T.pEsp) + '</button></div>'
        : '<div class="bzp-presets"><span class="micro">' + esc(T.presetsLbl) + '</span>' +
          '<button type="button" class="bzp-chip' + (!state.preset ? ' is-active' : '') + '" data-preset="">' + esc(T.pAllDays) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'exp_wkd' ? ' is-active' : '') + '" data-preset="exp_wkd">' + esc(T.pExpWeekdays) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'net_imp' ? ' is-active' : '') + '" data-preset="net_imp">' + esc(T.pNetImportDays) + '</button>' +
          '<button type="button" class="bzp-chip' + (state.preset === 'y2026' ? ' is-active' : '') + '" data-preset="y2026">' + esc(T.pYear2026) + '</button></div>';

      var filtersHtml = '';
      if (state.lens === 'plants') {
        var techOpts = ['lignite', 'hard_coal', 'gas_ccgt', 'chp_coal_bio', 'pumped_storage', 'res_jw'].map(function (tk) {
          return '<option value="' + tk + '"' + (state.tech === tk ? ' selected' : '') + '>' + esc(T['tech_' + tk]) + '</option>';
        }).join('');
        var ownerOpts = owners.map(function (ow) {
          return '<option value="' + esc(ow) + '"' + (state.owner === ow ? ' selected' : '') + '>' + esc(ow) + '</option>';
        }).join('');
        filtersHtml =
          '<div class="pse-filters-grid">' +
          '<input type="search" class="bzp-input" data-f-q value="' + esc(state.q) + '" placeholder="' + esc(T.searchPlantsPh) + '">' +
          '<select class="bzp-select" data-f-tech><option value="">' + esc(T.allTechs) + '</option>' + techOpts + '</select>' +
          '<select class="bzp-select" data-f-owner><option value="">' + esc(T.allOwners) + '</option>' + ownerOpts + '</select>' +
          '<button type="button" class="bzp-reset-btn" data-f-reset>' + esc(T.resetBtn) + '</button>' +
          '</div>';
      } else {
        filtersHtml =
          '<div class="pse-filters-grid">' +
          '<input type="search" class="bzp-input" data-f-q value="' + esc(state.q) + '" placeholder="' + esc(T.searchDaysPh) + '">' +
          '<select class="bzp-select" data-f-year><option value="">' + esc(T.allYears) + '</option><option value="2026"' + (state.year === '2026' ? ' selected' : '') + '>2026</option><option value="2025"' + (state.year === '2025' ? ' selected' : '') + '>2025</option></select>' +
          '<select class="bzp-select" data-f-dtype><option value="">' + esc(T.allDayTypes) + '</option><option value="wkd"' + (state.dtype === 'wkd' ? ' selected' : '') + '>' + esc(T.optWeekday) + '</option><option value="wknd"' + (state.dtype === 'wknd' ? ' selected' : '') + '>' + esc(T.optWeekend) + '</option></select>' +
          '<button type="button" class="bzp-reset-btn" data-f-reset>' + esc(T.resetBtn) + '</button>' +
          '</div>';
      }

      var tableHtml = '';
      if (state.lens === 'plants') {
        var head = '<div class="pse-row is-head"><div>' + esc(T.colPlant) + '</div><div>' + esc(T.colTech) + '</div><div>' + esc(T.colMidday) + '</div><div>' + esc(T.colEvening) + '</div><div>' + esc(T.colRamp) + '</div><div>' + esc(T.colVerify) + '</div></div>';
        var body = visible.map(function (p) {
          var badgeCls = (p.techGroup === 'lignite' || p.techGroup === 'hard_coal') ? 'is-rust' : (p.techGroup === 'pumped_storage' ? 'is-slate' : '');
          return (
            '<div class="pse-row">' +
            '<div class="pse-cell-main"><strong>' + esc(p.plant) + '</strong><span>' + esc(p.owner) + ' · ' + esc(p.voivodeship) + '</span></div>' +
            '<div><span class="pse-badge ' + badgeCls + '">' + esc(T['tech_' + p.techGroup]) + '</span><div class="pse-num"><small>' + fmt(p.unitsSpinningExpCurt, 1) + ' ' + esc(T.unitsSpinLbl) + ' ' + p.unitsTotal + ')</small></div></div>' +
            '<div class="pse-num">' + fmt(p.mwNet12h, 1) + ' MW<small>RCE≥250: ' + fmt(p.mwGenExpCurt, 1) + ' MW</small></div>' +
            '<div class="pse-num">' + fmt(p.mwNet20h, 1) + ' MW<small>' + fmt(p.unitsSpinning20h, 1) + ' / ' + p.unitsTotal + ' bl.</small></div>' +
            '<div class="pse-num">' + fmtSigned(p.rampNet12To20Mw, 1) + ' MW<small>' + (p.loadRatio12Vs20Pct != null ? fmt(p.loadRatio12Vs20Pct, 1) + '% ' + esc(T.loadLbl) : '—') + '</small></div>' +
            '<div><a class="pse-verify-a" href="' + esc(p.pseVerifyUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(T.verifyBtn) + '</a></div>' +
            '</div>'
          );
        }).join('');
        tableHtml = '<div class="pse-table-wrap">' + head + body + '</div>';
      } else {
        var dHead = '<div class="pse-row is-head"><div>' + esc(T.colDate) + '</div><div>' + esc(T.colVol) + '</div><div>' + esc(T.colExpShare) + '</div><div>' + esc(T.colSysRamp) + '</div><div>' + esc(T.colValBorder) + '</div><div>' + esc(T.colVerify) + '</div></div>';
        var dBody = visible.map(function (d) {
          var unitM = LANG === 'pl' ? ' mln zł' : 'M PLN';
          return (
            '<div class="pse-row">' +
            '<div class="pse-cell-main"><strong>' + esc(d.date) + '</strong><span>' + esc(d.isWeekend ? T.wkndBadge : T.wkdBadge) + ' · szczyt ścięć ' + fmt(d.peakCurtailedMw, 0) + ' MW</span></div>' +
            '<div class="pse-num">' + fmt(d.curtailedGwh, 2) + ' GWh<small>PV ' + fmt(d.pvGwh, 1) + ' · WI ' + fmt(d.windGwh, 1) + ' GWh</small></div>' +
            '<div class="pse-num">' + fmt(d.rceGe250Gwh, 2) + ' GWh<small>' + fmt(d.rceGe250Pct, 1) + '% doby · śr. RCE ' + fmt(d.weightedCurtRcePln, 0) + ' zł</small></div>' +
            '<div class="pse-num">' + fmt(d.jg12hMw / 1000, 2) + ' → ' + fmt(d.jg20hMw / 1000, 2) + ' GW<small>20:00 RCE: ' + fmt(d.rce20hPln, 0) + ' zł/MWh</small></div>' +
            '<div class="pse-num">' + fmt(d.valCenMln, 2) + unitM + '<small>' + (d.deLoopMw != null ? 'DE kołowy: ' + fmtSigned(d.deLoopMw, 0) + ' MW' : 'DE fiz.: ' + fmtSigned(d.dePhysMw, 0) + ' MW') + '</small></div>' +
            '<div><a class="pse-verify-a" href="' + esc(d.pseVerifyUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(T.verifyBtn) + '</a></div>' +
            '</div>'
          );
        }).join('');
        tableHtml = '<div class="pse-table-wrap">' + dHead + dBody + '</div>';
      }

      var embedUrl = (LANG === 'pl' ? 'https://roleplayingtech.com/pl/lab/redysponowanie-oze-pse/' : 'https://roleplayingtech.com/en/lab/polish-grid-curtailment/') + '?embed=1&lens=' + state.lens;
      var embedDrawer = state.showEmbed
        ? '<div class="bzp-embed-drawer"><p>' + esc(T.embedInfo) + '</p><textarea readonly rows="3">&lt;iframe src="' + esc(embedUrl) + '" width="100%" height="760" style="border:1px solid #dbd7cd;background:#f7f6f2" loading="lazy"&gt;&lt;/iframe&gt;</textarea></div>'
        : '';

      mount.innerHTML =
        embedBanner +
        lensTabs +
        presetsHtml +
        '<div class="bzp-controls">' + filtersHtml + '</div>' +
        '<div class="bzp-toolbar">' +
        '<span class="micro">' + esc(T.showing) + ' <strong>' + visible.length + '</strong> ' + esc(T.of) + ' <strong>' + rows.length + '</strong> ' + esc(T.records) + '</span>' +
        '<div class="bzp-toolbar-actions">' +
        '<button type="button" class="bzp-tool-btn" data-act-csv>' + esc(T.csvBtn) + '</button>' +
        '<a class="bzp-tool-btn" href="/assets/lab/pse-grid-2026.json" download>' + esc(T.jsonBtn) + '</a>' +
        (!IS_EMBED ? '<button type="button" class="bzp-tool-btn" data-act-embed>' + esc(T.embedBtn) + '</button>' : '') +
        '</div>' +
        '</div>' +
        embedDrawer +
        tableHtml +
        (visible.length < rows.length ? '<div style="margin-top:14px;text-align:center"><button type="button" class="bzp-tool-btn" data-act-more>' + esc(T.moreBtn) + ' (' + (rows.length - visible.length) + ')</button></div>' : '');

      Array.prototype.forEach.call(mount.querySelectorAll('[data-lens]'), function (btn) {
        btn.addEventListener('click', function () {
          state.lens = btn.getAttribute('data-lens');
          state.preset = '';
          state.q = '';
          state.limit = 40;
          syncUrl();
          paint();
        });
      });
      Array.prototype.forEach.call(mount.querySelectorAll('[data-preset]'), function (btn) {
        btn.addEventListener('click', function () {
          state.preset = btn.getAttribute('data-preset');
          state.limit = 40;
          syncUrl();
          paint();
        });
      });
      var qInput = mount.querySelector('[data-f-q]');
      if (qInput) {
        qInput.addEventListener('input', function () {
          state.q = qInput.value;
          state.limit = 40;
          syncUrl();
          paint();
          var nextInput = mount.querySelector('[data-f-q]');
          if (nextInput) {
            nextInput.focus();
            nextInput.setSelectionRange(state.q.length, state.q.length);
          }
        });
      }
      var techSel = mount.querySelector('[data-f-tech]');
      if (techSel) techSel.addEventListener('change', function () { state.tech = techSel.value; syncUrl(); paint(); });
      var ownSel = mount.querySelector('[data-f-owner]');
      if (ownSel) ownSel.addEventListener('change', function () { state.owner = ownSel.value; syncUrl(); paint(); });
      var yrSel = mount.querySelector('[data-f-year]');
      if (yrSel) yrSel.addEventListener('change', function () { state.year = yrSel.value; syncUrl(); paint(); });
      var dtSel = mount.querySelector('[data-f-dtype]');
      if (dtSel) dtSel.addEventListener('change', function () { state.dtype = dtSel.value; syncUrl(); paint(); });
      var rst = mount.querySelector('[data-f-reset]');
      if (rst) rst.addEventListener('click', function () {
        state.q = ''; state.tech = ''; state.owner = ''; state.year = ''; state.dtype = ''; state.preset = ''; state.limit = 40;
        syncUrl(); paint();
      });
      var csvB = mount.querySelector('[data-act-csv]');
      if (csvB) csvB.addEventListener('click', function () { exportCsv(rows); });
      var embB = mount.querySelector('[data-act-embed]');
      if (embB) embB.addEventListener('click', function () { state.showEmbed = !state.showEmbed; paint(); });
      var moreB = mount.querySelector('[data-act-more]');
      if (moreB) moreB.addEventListener('click', function () { state.limit += 50; paint(); });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-pse-preset]'), function (a) {
      a.addEventListener('click', function (ev) {
        var raw = a.getAttribute('data-pse-preset') || '';
        if (!raw) return;
        ev.preventDefault();
        var sp = new URLSearchParams(raw);
        state.lens = sp.get('lens') === 'days' ? 'days' : 'plants';
        state.q = sp.get('q') || '';
        state.tech = sp.get('tech') || '';
        state.owner = sp.get('owner') || '';
        state.year = sp.get('year') || '';
        state.dtype = sp.get('dtype') || '';
        state.preset = sp.get('preset') || '';
        state.limit = 40;
        syncUrl();
        paint();
        var sec = document.getElementById('explorer') || mount;
        if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    paint();
  }

  fetch('/assets/lab/pse-grid-2026.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      renderFig1(document.getElementById('fig-pse-price'), data);
      renderFig2Duck(document.getElementById('fig-pse-duck'), data);
      renderFig3Borders(document.getElementById('fig-pse-borders'), data);
      renderExplorer(document.getElementById('pse-explorer'), data);
    })
    .catch(function (err) {
      console.error('PSE explorer load failed:', err);
    });
})();
