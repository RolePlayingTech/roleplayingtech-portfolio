(function () {
  var root = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  if (params.get('embed') === '1') {
    root.classList.add('is-embed');
  }

  var mount = document.getElementById('bzp-explorer');
  var figIllusion = document.getElementById('fig-illusion');
  var figComp = document.getElementById('fig-competition');
  if (!mount && !figIllusion && !figComp) return;

  var lang = (root.getAttribute('lang') || 'pl').toLowerCase().indexOf('en') === 0 ? 'en' : 'pl';

  var CAT_COLORS = {
    software_deploy: '#98513c',
    hardware_lab: '#2d546b',
    training: '#8c6d23',
    consulting: '#4a6b53',
    incidental: '#8d867c'
  };

  var I18N = {
    pl: {
      loading: 'Wczytywanie zweryfikowanego zbioru ogłoszeń BZP (2024–2026)…',
      loadErr: 'Nie udało się wczytać pliku danych JSON.',
      kpiProc: 'Postępowania w widoku',
      kpiProcSubAll: 'z {total} w bazie (01.2024–11.2026)',
      kpiSigned: 'Podpisane umowy',
      kpiSignedSub: '{open} w toku · {cancel} unieważn.',
      kpiSpend: 'Suma podpisanych umów',
      kpiSpendSub: 'mediana umowy: {median}',
      kpiSingle: 'Tylko 1 oferta',
      kpiSingleSub: '{num} z {den} umów z podaną l. ofert',
      kpiEu: 'Środki UE / KPO',
      kpiEuSub: '{amt} w umowach z udziałem UE',
      panelYear: '01 · Dynamika roczna',
      panelCat: '02 · Kategoria wydatku',
      panelGroupSector: '03 · Sektor instytucji',
      panelGroupProv: '03 · Top województwa',
      switchSector: 'Sektory',
      switchProv: 'Województwa',
      clickFilter: 'kliknij, aby filtrować',
      contractsShort: 'umów',
      procShort: 'post.',
      searchPh: 'Szukaj: instytucja, miasto, przedmiot, wykonawca, VoiceBot, PACS, GPU, BZP…',
      sortDate: 'Sortuj: najnowsze ogłoszenia',
      sortAmountDesc: 'Sortuj: najwyższa kwota umowy',
      sortAmountAsc: 'Sortuj: najniższa kwota umowy',
      sortBidsDesc: 'Sortuj: najwięcej ofert',
      sortBidsAsc: 'Sortuj: najmniej ofert (od 1)',
      reset: 'Resetuj filtry',
      stAll: 'Wszystkie ({n})',
      stResolved: 'Rozstrzygnięte / umowa ({n})',
      stOpen: 'W toku / otwarte ({n})',
      stCancel: 'Unieważnione ({n})',
      chkSingle: 'Tylko 1 oferta',
      chkEu: 'Tylko ze wsparciem UE / KPO',
      chkIncidental: 'Włącz wydatki poboczne (remonty, meble, catering „AI”)',
      incidentalHint: '+5,20 mln zł',
      btnCsv: 'Pobierz CSV ({n})',
      btnShare: 'Kopiuj link do widoku',
      btnCopied: 'Skopiowano link ✓',
      btnEmbed: 'Osadź w artykule (iframe)',
      embedDesc: 'Możesz bezpłatnie osadzić aktualnie przefiltrowany eksplorator w artykule prasowym lub wpisie blogowym (zachowaj link źródłowy):',
      showing: 'Wyświetlono <strong>{shown}</strong> z <strong>{total}</strong> postępowań pasujących do filtrów.',
      noResults: 'Brak postępowań spełniających wybrane kryteria. Spróbuj zmienić lub zresetować filtry.',
      colDate: 'Data / BZP',
      colOrg: 'Zamawiający',
      colTitle: 'Przedmiot zamówienia i wykonawca',
      colCat: 'Kategoria',
      colMoney: 'Kwota brutto / oferty',
      colSrc: 'Źródło',
      statusOpenBadge: 'W toku',
      statusCancelBadge: 'Unieważnione',
      deadlinePrefix: 'oferty do ',
      euBadge: 'UE / KPO',
      incidentalBadge: 'Wydatek poboczny',
      typoBadge: 'Skorygowano omyłkę pisarską z BZP (5,44 mln → 544 tys. zł)',
      contractorLabel: 'Wykonawca: ',
      noAmountOpen: 'w trakcie naboru / oceny',
      noAmountCancel: 'unieważnione',
      bidsOne: '1 oferta',
      bidsFew: '{n} oferty',
      bidsMany: '{n} ofert',
      bidsUnknown: 'brak danych o l. ofert',
      srcBtn: 'BZP ↗',
      showMore: 'Pokaż kolejne ({rem} pozostało)',
      allShown: 'Wyświetlono wszystkie pasujące rekordy ({total}).',
      illProcBar: 'Udział w ogłoszeniach',
      illPlnBar: 'Udział w kwocie umów',
      illMedian: 'mediana: {m}',
      illFilterBtn: 'Pokaż w bazie ↓',
      illSignedLine: '{proc} postępowań · {signed} umów',
      compAll: 'Wszystkie umowy ({n})',
      compSoft: 'Wdrożenia oprogramowania (68% z 1 ofertą)',
      compHealth: 'Szpitale i kliniki',
      compTrain: 'Szkolenia (tłok ofertowy)',
      compZone: 'STREFA 1 OFERTY — 41 z 93 umów (44,1%) bez realnej konkurencji cenowej',
      compAxisX: 'Wartość podpisanej umowy brutto (skala logarytmiczna)',
      compAxisY: 'Liczba ofert',
      compCardKicker: 'Podgląd kontraktu (najedź lub kliknij kropkę na wykresie)',
      compCardAmount: 'Wartość umowy brutto',
      compCardBids: 'Złożone oferty',
      compCardOpenBzp: 'Karta w BZP ↗',
      compCardInTable: 'Pokaż w tabeli ↓',
      compPin1: '23 oferty o kurs za 7,2 tys. zł',
      compPin2: '1 oferta · 916,5 tys. zł (awatary AI w CZD)',
      compPin3: '3 oferty · 4,94 mln zł (laboratorium UJD)',
      cats: {
        software_deploy: 'Wdrożenia i systemy AI',
        hardware_lab: 'Sprzęt GPU, laboratoria i aparatura',
        training: 'Szkolenia, kursy i warsztaty',
        consulting: 'Badania, audyty i analizy',
        incidental: 'Poboczne (remonty, meble, catering)'
      },
      sectors: {
        'Uczelnie i nauka': 'Uczelnie i instytuty naukowe',
        'Ochrona zdrowia': 'Szpitale i ochrona zdrowia',
        'Samorządy, WUP i instytucje reg.': 'Samorządy i urzędy pracy (WUP)',
        'Administracja centralna i agencje': 'Administracja centralna i agencje',
        'Szkoły i oświata': 'Szkoły i placówki oświatowe'
      }
    },
    en: {
      loading: 'Loading verified Polish public procurement dataset (BZP 2024–2026)…',
      loadErr: 'Could not load the JSON dataset.',
      kpiProc: 'Matching proceedings',
      kpiProcSubAll: 'out of {total} in dataset (01.2024–11.2026)',
      kpiSigned: 'Signed contracts',
      kpiSignedSub: '{open} open · {cancel} cancelled',
      kpiSpend: 'Signed contract value',
      kpiSpendSub: 'median contract: {median}',
      kpiSingle: 'Single-bid contracts',
      kpiSingleSub: '{num} of {den} contracts with bid counts',
      kpiEu: 'EU / Recovery Fund',
      kpiEuSub: '{amt} in EU co-financed contracts',
      panelYear: '01 · Annual trajectory',
      panelCat: '02 · Spending category',
      panelGroupSector: '03 · Public sector',
      panelGroupProv: '03 · Top regions (voivodeships)',
      switchSector: 'Sectors',
      switchProv: 'Regions',
      clickFilter: 'click to filter',
      contractsShort: 'signed',
      procShort: 'proc.',
      searchPh: 'Search: institution, city, tender title, vendor, VoiceBot, PACS, GPU, BZP…',
      sortDate: 'Sort: newest notices',
      sortAmountDesc: 'Sort: highest contract value',
      sortAmountAsc: 'Sort: lowest contract value',
      sortBidsDesc: 'Sort: most bids',
      sortBidsAsc: 'Sort: fewest bids (from 1)',
      reset: 'Reset filters',
      stAll: 'All ({n})',
      stResolved: 'Awarded / signed ({n})',
      stOpen: 'Open / pending ({n})',
      stCancel: 'Cancelled ({n})',
      chkSingle: 'Single-bid only',
      chkEu: 'EU / KPO co-financed only',
      chkIncidental: 'Include incidental spend (renovations, furniture, “AI” catering)',
      incidentalHint: '+5.20M PLN',
      btnCsv: 'Export CSV ({n})',
      btnShare: 'Copy filtered link',
      btnCopied: 'Link copied ✓',
      btnEmbed: 'Embed in article (iframe)',
      embedDesc: 'Newsrooms and bloggers can embed this filtered interactive explorer free of charge (please keep source attribution):',
      showing: 'Showing <strong>{shown}</strong> of <strong>{total}</strong> matching procurement proceedings.',
      noResults: 'No proceedings match your active filters. Try adjusting or resetting the filters.',
      colDate: 'Date / BZP',
      colOrg: 'Contracting authority',
      colTitle: 'Tender scope & awarded vendor',
      colCat: 'Category',
      colMoney: 'Gross PLN / bids',
      colSrc: 'Official record',
      statusOpenBadge: 'Open / pending',
      statusCancelBadge: 'Cancelled',
      deadlinePrefix: 'due ',
      euBadge: 'EU / KPO',
      incidentalBadge: 'Incidental spend',
      typoBadge: 'Clerical 10× typo corrected (5.44M → 544k PLN)',
      contractorLabel: 'Vendor: ',
      noAmountOpen: 'open / awaiting award',
      noAmountCancel: 'cancelled',
      bidsOne: '1 bid',
      bidsFew: '{n} bids',
      bidsMany: '{n} bids',
      bidsUnknown: 'bid count n/a',
      srcBtn: 'BZP ↗',
      showMore: 'Show more ({rem} remaining)',
      allShown: 'All matching records shown ({total}).',
      illProcBar: 'Share of notices',
      illPlnBar: 'Share of contract value',
      illMedian: 'median: {m}',
      illFilterBtn: 'Filter below ↓',
      illSignedLine: '{proc} notices · {signed} signed',
      compAll: 'All contracts ({n})',
      compSoft: 'AI software (68% single-bid)',
      compHealth: 'Hospitals & clinics',
      compTrain: 'Trainings (crowded bidding)',
      compZone: 'SINGLE-BID ZONE — 41 of 93 contracts (44.1%) awarded with zero competing bids',
      compAxisX: 'Signed gross contract value in PLN (logarithmic scale)',
      compAxisY: 'Bids submitted',
      compCardKicker: 'Contract inspector (hover or click any dot)',
      compCardAmount: 'Gross contract value',
      compCardBids: 'Submitted bids',
      compCardOpenBzp: 'Official BZP record ↗',
      compCardInTable: 'Show in database ↓',
      compPin1: '23 bids for a 7.2k PLN workshop',
      compPin2: '1 bid · 916.5k PLN (hospital AI avatars)',
      compPin3: '3 bids · 4.94M PLN (imaging AI lab)',
      cats: {
        software_deploy: 'AI software & deployments',
        hardware_lab: 'GPU servers, labs & medical gear',
        training: 'Trainings, courses & workshops',
        consulting: 'Research studies, audits & advisory',
        incidental: 'Incidental (renovations, furniture, catering)'
      },
      sectors: {
        'Uczelnie i nauka': 'Universities & research institutes',
        'Ochrona zdrowia': 'Hospitals & healthcare',
        'Samorządy, WUP i instytucje reg.': 'Local gov & regional labour offices',
        'Administracja centralna i agencje': 'Central gov & national agencies',
        'Szkoły i oświata': 'Schools & K-12 education'
      }
    }
  }[lang];

  var state = {
    q: params.get('q') || '',
    status: params.get('status') || 'all',
    cat: params.get('cat') || '',
    sector: params.get('sector') || '',
    prov: params.get('prov') || '',
    year: params.get('year') || '',
    single: params.get('single') === '1',
    eu: params.get('eu') === '1',
    incidental: params.get('incidental') === '1' || params.get('cat') === 'incidental',
    sort: params.get('sort') || 'amount_desc',
    groupMode: params.get('prov') ? 'prov' : 'sector',
    limit: 25
  };

  var DATA = [];
  var dataUrl = (mount && mount.getAttribute('data-src')) || '/assets/lab/bzp-ai-2024-2026.json';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtPlnCompact(n) {
    if (!n || n <= 0) return lang === 'en' ? '0 PLN' : '0 zł';
    if (n >= 1000000) {
      var m = (n / 1000000).toFixed(2);
      return lang === 'en' ? m + 'M PLN' : m.replace('.', ',') + ' mln zł';
    }
    if (n >= 1000) {
      var k = Math.round(n / 1000);
      return lang === 'en' ? k + 'k PLN' : k + ' tys. zł';
    }
    return Math.round(n) + (lang === 'en' ? ' PLN' : ' zł');
  }

  function fmtPlnExact(n) {
    if (n == null) return '';
    var parts = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    return lang === 'en' ? parts + ' PLN' : parts + ' zł';
  }

  function fmtPct(v) {
    var s = v.toFixed(1);
    return (lang === 'pl' ? s.replace('.', ',') : s) + '%';
  }

  function calcMedian(nums) {
    if (!nums.length) return 0;
    var s = nums.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(s.length / 2);
    return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }

  function fmtBids(b) {
    if (b == null) return I18N.bidsUnknown;
    if (b === 1) return I18N.bidsOne;
    if (lang === 'pl') {
      var mod10 = b % 10;
      var mod100 = b % 100;
      if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return I18N.bidsFew.replace('{n}', b);
      }
    }
    return I18N.bidsMany.replace('{n}', b);
  }

  /* ---------- Inline Editorial Figure 1: Headlines vs Money ---------- */
  function renderIllusionFigure() {
    if (!figIllusion || !DATA.length) return;
    var core = DATA.filter(function (r) { return r.category !== 'incidental'; });
    var signedAll = core.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
    var totalProc = core.length || 1;
    var totalPln = 0;
    signedAll.forEach(function (r) { totalPln += r.amountPln; });

    var cats = ['software_deploy', 'hardware_lab', 'training', 'consulting'];
    var rowsHtml = cats.map(function (ck) {
      var cp = core.filter(function (r) { return r.category === ck; });
      var cs = signedAll.filter(function (r) { return r.category === ck; });
      var sum = 0;
      var vals = [];
      cs.forEach(function (r) { sum += r.amountPln; vals.push(r.amountPln); });
      var procPct = (cp.length / totalProc) * 100;
      var plnPct = totalPln > 0 ? (sum / totalPln) * 100 : 0;
      var med = calcMedian(vals);
      return (
        '<div class="ill-row">' +
          '<div class="ill-cat">' +
            '<strong>' + esc(I18N.cats[ck]) + '</strong>' +
            '<span>' + esc(I18N.illSignedLine.replace('{proc}', cp.length).replace('{signed}', cs.length)) + '</span>' +
          '</div>' +
          '<div class="ill-bars">' +
            '<div class="ill-bar-line">' +
              '<span>' + esc(I18N.illProcBar) + '</span>' +
              '<div class="ill-track"><div class="ill-fill-proc" style="width:' + Math.max(2, procPct * 1.8).toFixed(1) + '%"></div></div>' +
              '<span class="ill-pct">' + esc(fmtPct(procPct)) + '</span>' +
            '</div>' +
            '<div class="ill-bar-line">' +
              '<span>' + esc(I18N.illPlnBar) + '</span>' +
              '<div class="ill-track"><div class="ill-fill-pln" style="width:' + Math.max(2, plnPct * 1.8).toFixed(1) + '%"></div></div>' +
              '<span class="ill-pct" style="color:var(--rust)">' + esc(fmtPct(plnPct)) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="ill-meta">' +
            '<div><b>' + esc(fmtPlnCompact(sum)) + '</b>' + esc(I18N.illMedian.replace('{m}', fmtPlnCompact(med))) + '</div>' +
            '<button type="button" data-bzp-preset="cat=' + esc(ck) + '">' + esc(I18N.illFilterBtn) + '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var yearsHtml = ['2024', '2025', '2026'].map(function (y) {
      var yp = core.filter(function (r) { return String(r.year) === y; });
      var ys = signedAll.filter(function (r) { return String(r.year) === y; });
      var sum = 0;
      ys.forEach(function (r) { sum += r.amountPln; });
      var yLabel = y === '2026' ? (lang === 'en' ? '2026 (to Nov 3)' : '2026 (do 3 XI)') : y;
      return (
        '<div class="ill-year-card">' +
          '<div><strong>' + esc(yLabel) + '</strong><small style="text-align:left">' + yp.length + ' ' + esc(I18N.procShort) + '</small></div>' +
          '<div><span>' + esc(fmtPlnCompact(sum)) + '</span><small>' + ys.length + ' ' + esc(I18N.contractsShort) + '</small></div>' +
        '</div>'
      );
    }).join('');

    figIllusion.innerHTML =
      '<div class="ill-rows">' + rowsHtml + '</div>' +
      '<div class="ill-years">' + yearsHtml + '</div>';
  }

  /* ---------- Inline Editorial Figure 2: Competition Dot-Plot ---------- */
  function renderCompetitionFigure() {
    if (!figComp || !DATA.length) return;
    var pts = DATA.filter(function (r) {
      return r.category !== 'incidental' && r.status === 'resolved' && r.amountPln != null && r.bids != null && r.bids >= 1;
    }).slice();
    if (!pts.length) return;

    // Sort by amount so jitter inside bids===1 is deterministic and clean
    pts.sort(function (a, b) { return a.amountPln - b.amountPln; });

    var W = 680;
    var H = 360;
    var padL = 48;
    var padR = 20;
    var padT = 22;
    var padB = 44;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var minLog = Math.log10(1500);
    var maxLog = Math.log10(6000000);
    function xOf(amt) {
      var cl = Math.max(1500, Math.min(6000000, amt));
      return padL + ((Math.log10(cl) - minLog) / (maxLog - minLog)) * plotW;
    }

    // Sqrt scale on Y (1 -> 24) so lower bid counts have generous breathing room
    function yBase(bids) {
      var t = (Math.sqrt(Math.min(24, Math.max(1, bids))) - 1) / (Math.sqrt(24) - 1);
      return padT + plotH - t * plotH;
    }

    var singleBandTop = (yBase(1) + yBase(2)) / 2;
    var singleIdx = 0;

    var plotted = pts.map(function (r, idx) {
      var cx = xOf(r.amountPln);
      var cy = yBase(r.bids);
      if (r.bids === 1) {
        var offsetPattern = [-7, 0, 7, -4, 4];
        cy += offsetPattern[singleIdx % offsetPattern.length];
        singleIdx += 1;
      } else if (r.bids === 2) {
        cy += (idx % 2 === 0 ? -3 : 3);
      }
      return { r: r, cx: cx, cy: cy };
    });

    var xTicks = [
      { v: 2000, pl: '2 tys.', en: '2k' },
      { v: 10000, pl: '10 tys.', en: '10k' },
      { v: 50000, pl: '50 tys.', en: '50k' },
      { v: 250000, pl: '250 tys.', en: '250k' },
      { v: 1000000, pl: '1 mln', en: '1M' },
      { v: 5000000, pl: '5 mln zł', en: '5M PLN' }
    ];
    var yTicks = [1, 2, 3, 5, 10, 15, 23];

    var gridSvg = '';
    xTicks.forEach(function (tk) {
      var x = xOf(tk.v).toFixed(1);
      gridSvg +=
        '<line x1="' + x + '" y1="' + padT + '" x2="' + x + '" y2="' + (H - padB) + '" stroke="#e3dfd6" stroke-dasharray="2,3"/>' +
        '<text x="' + x + '" y="' + (H - padB + 16) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#68655f">' + esc(tk[lang]) + '</text>';
    });
    yTicks.forEach(function (yv) {
      var y = yBase(yv).toFixed(1);
      gridSvg +=
        '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + (yv === 1 ? '#d4b5ab' : '#e6e2d9') + '"/>' +
        '<text x="' + (padL - 9) + '" y="' + (Number(y) + 3.5) + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" font-weight="' + (yv === 1 ? '700' : '400') + '" fill="' + (yv === 1 ? '#98513c' : '#68655f') + '">' + yv + '</text>';
    });

    // Annotations for 3 landmark points
    function findPoint(bzpSub) {
      for (var i = 0; i < plotted.length; i++) {
        if (plotted[i].r.bzp && plotted[i].r.bzp.indexOf(bzpSub) !== -1) return plotted[i];
      }
      return null;
    }
    var pTopBids = findPoint('00465518'); // 23 bids, 7.2k
    var pCzd = findPoint('00137744');     // 1 bid, 916.5k CZD avatars
    var pUjd = findPoint('00163288');     // 3 bids, 4.94M UJD

    var annSvg = '';
    if (pTopBids) {
      annSvg += '<g pointer-events="none"><line x1="' + (pTopBids.cx + 8).toFixed(1) + '" y1="' + pTopBids.cy.toFixed(1) + '" x2="' + (pTopBids.cx + 34).toFixed(1) + '" y2="' + (pTopBids.cy + 2).toFixed(1) + '" stroke="#68655f"/><text x="' + (pTopBids.cx + 38).toFixed(1) + '" y="' + (pTopBids.cy + 5).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" fill="#3d3a36">' + esc(I18N.compPin1) + '</text></g>';
    }
    if (pCzd) {
      annSvg += '<g pointer-events="none"><line x1="' + pCzd.cx.toFixed(1) + '" y1="' + (pCzd.cy - 8).toFixed(1) + '" x2="' + (pCzd.cx - 26).toFixed(1) + '" y2="' + (pCzd.cy - 44).toFixed(1) + '" stroke="#98513c"/><text x="' + (pCzd.cx - 30).toFixed(1) + '" y="' + (pCzd.cy - 48).toFixed(1) + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" fill="#98513c">' + esc(I18N.compPin2) + '</text></g>';
    }
    if (pUjd) {
      annSvg += '<g pointer-events="none"><line x1="' + (pUjd.cx - 7).toFixed(1) + '" y1="' + (pUjd.cy - 5).toFixed(1) + '" x2="' + (pUjd.cx - 32).toFixed(1) + '" y2="' + (pUjd.cy - 28).toFixed(1) + '" stroke="#2d546b"/><text x="' + (pUjd.cx - 10).toFixed(1) + '" y="' + (pUjd.cy - 33).toFixed(1) + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" fill="#2d546b">' + esc(I18N.compPin3) + '</text></g>';
    }

    var circlesSvg = plotted.map(function (pt, idx) {
      var col = CAT_COLORS[pt.r.category] || '#68655f';
      return '<circle class="comp-dot" data-idx="' + idx + '" cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="5.6" fill="' + col + '" fill-opacity="0.86" stroke="#fbfaf6" stroke-width="1.2"><title>' + esc(pt.r.org + ' — ' + fmtPlnExact(pt.r.amountPln) + ' (' + fmtBids(pt.r.bids) + ')') + '</title></circle>';
    }).join('');

    var singleZoneHeight = (H - padB + 11) - singleBandTop;

    figComp.innerHTML =
      '<div class="comp-toolbar">' +
        '<button type="button" class="bzp-pill is-active" data-cfilter="all">' + esc(I18N.compAll.replace('{n}', plotted.length)) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="software">' + esc(I18N.compSoft) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="health">' + esc(I18N.compHealth) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="training">' + esc(I18N.compTrain) + '</button>' +
      '</div>' +
      '<div class="comp-layout">' +
        '<div class="comp-stage">' +
          '<svg class="comp-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(I18N.compAxisX) + '">' +
            '<rect x="' + padL + '" y="' + singleBandTop.toFixed(1) + '" width="' + plotW + '" height="' + singleZoneHeight.toFixed(1) + '" fill="rgba(152,81,60,0.08)"/>' +
            '<text x="' + (padL + 8) + '" y="' + (singleBandTop + 12).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.3" font-weight="700" fill="#98513c">' + esc(I18N.compZone) + '</text>' +
            gridSvg +
            annSvg +
            circlesSvg +
            '<text x="' + (padL + plotW / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#514e49">' + esc(I18N.compAxisX) + '</text>' +
            '<text x="13" y="' + (padT + plotH / 2).toFixed(1) + '" text-anchor="middle" transform="rotate(-90 13 ' + (padT + plotH / 2).toFixed(1) + ')" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#514e49">' + esc(I18N.compAxisY) + '</text>' +
          '</svg>' +
        '</div>' +
        '<div class="comp-card" id="comp-inspector"></div>' +
      '</div>';

    var dots = figComp.querySelectorAll('.comp-dot');
    var inspector = document.getElementById('comp-inspector');

    function showCard(idx) {
      var item = plotted[idx];
      if (!item) return;
      var r = item.r;
      Array.prototype.forEach.call(dots, function (d) {
        d.classList.toggle('is-selected', Number(d.getAttribute('data-idx')) === idx);
      });
      var vendorStr = (r.contractors && r.contractors.length)
        ? '<strong>' + esc(I18N.contractorLabel) + '</strong>' + esc(r.contractors.join('; '))
        : '';
      inspector.innerHTML =
        '<div>' +
          '<div class="comp-card-kicker">' + esc(I18N.compCardKicker) + '</div>' +
          '<h4>' + esc(r.org) + '</h4>' +
          '<div class="comp-card-org">' + esc([r.city, r.bzp, I18N.cats[r.category] || r.category].filter(Boolean).join(' · ')) + '</div>' +
          '<div class="comp-card-title">' + esc(r.title) + '</div>' +
          '<div class="comp-card-metrics">' +
            '<div><small>' + esc(I18N.compCardAmount) + '</small><strong>' + esc(fmtPlnExact(r.amountPln)) + '</strong></div>' +
            '<div><small>' + esc(I18N.compCardBids) + '</small><strong class="' + (r.bids === 1 ? 'is-alert' : '') + '">' + esc(fmtBids(r.bids)) + '</strong></div>' +
          '</div>' +
          (vendorStr ? '<div class="comp-card-vendor">' + vendorStr + '</div>' : '') +
        '</div>' +
        '<div class="comp-card-foot">' +
          '<a href="?q=' + encodeURIComponent(r.bzp) + '#explorer" data-bzp-preset="q=' + esc(r.bzp) + '">' + esc(I18N.compCardInTable) + '</a>' +
          '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(I18N.compCardOpenBzp) + '</a>' +
        '</div>';
      bindPresetLinks(inspector);
    }

    Array.prototype.forEach.call(dots, function (dot) {
      var i = Number(dot.getAttribute('data-idx'));
      dot.addEventListener('mouseenter', function () { showCard(i); });
      dot.addEventListener('click', function () { showCard(i); });
    });

    // Default selected dot: CZD AI avatars (or highest contract)
    var defaultIdx = plotted.length - 1;
    plotted.forEach(function (pt, idx) {
      if (pt.r.bzp && pt.r.bzp.indexOf('00137744') !== -1) defaultIdx = idx;
    });
    showCard(defaultIdx);

    Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-cfilter');
        Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var firstMatch = -1;
        Array.prototype.forEach.call(dots, function (dot) {
          var idx = Number(dot.getAttribute('data-idx'));
          var r = plotted[idx].r;
          var ok = true;
          if (mode === 'software') ok = r.category === 'software_deploy';
          else if (mode === 'health') ok = r.sector === 'Ochrona zdrowia';
          else if (mode === 'training') ok = r.category === 'training';
          dot.classList.toggle('is-dim', !ok);
          if (ok && firstMatch === -1) firstMatch = idx;
        });
        if (mode === 'training' && pTopBids) {
          showCard(plotted.indexOf(pTopBids));
        } else if (firstMatch !== -1 && mode !== 'all') {
          showCard(firstMatch);
        }
      });
    });
  }

  /* ---------- Full Database Explorer ---------- */
  function syncUrl() {
    if (!mount) return;
    var p = new URLSearchParams();
    if (root.classList.contains('is-embed')) p.set('embed', '1');
    if (state.q) p.set('q', state.q);
    if (state.status !== 'all') p.set('status', state.status);
    if (state.cat) p.set('cat', state.cat);
    if (state.sector) p.set('sector', state.sector);
    if (state.prov) p.set('prov', state.prov);
    if (state.year) p.set('year', state.year);
    if (state.single) p.set('single', '1');
    if (state.eu) p.set('eu', '1');
    if (state.incidental && state.cat !== 'incidental') p.set('incidental', '1');
    if (state.sort !== 'amount_desc') p.set('sort', state.sort);
    var qs = p.toString();
    var next = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    try {
      window.history.replaceState(null, '', next);
    } catch (e) {}
  }

  function buildShareUrl(forEmbed) {
    var base = 'https://roleplayingtech.com' + window.location.pathname;
    var p = new URLSearchParams();
    if (forEmbed) p.set('embed', '1');
    if (state.q) p.set('q', state.q);
    if (state.status !== 'all') p.set('status', state.status);
    if (state.cat) p.set('cat', state.cat);
    if (state.sector) p.set('sector', state.sector);
    if (state.prov) p.set('prov', state.prov);
    if (state.year) p.set('year', state.year);
    if (state.single) p.set('single', '1');
    if (state.eu) p.set('eu', '1');
    if (state.incidental && state.cat !== 'incidental') p.set('incidental', '1');
    if (state.sort !== 'amount_desc') p.set('sort', state.sort);
    var qs = p.toString();
    return base + (qs ? '?' + qs : '');
  }

  function matchesRow(r, ignoreKey) {
    if (!state.incidental && state.cat !== 'incidental' && r.category === 'incidental') {
      return false;
    }
    if (ignoreKey !== 'status' && state.status !== 'all' && r.status !== state.status) return false;
    if (ignoreKey !== 'cat' && state.cat && r.category !== state.cat) return false;
    if (ignoreKey !== 'sector' && state.sector && r.sector !== state.sector) return false;
    if (ignoreKey !== 'prov' && state.prov && r.province !== state.prov) return false;
    if (ignoreKey !== 'year' && state.year && String(r.year) !== String(state.year)) return false;
    if (state.single && r.bids !== 1) return false;
    if (state.eu && !r.eu) return false;
    if (state.q) {
      var needle = state.q.toLowerCase();
      var hay = (
        r.title + ' ' +
        r.org + ' ' +
        (r.city || '') + ' ' +
        (r.province || '') + ' ' +
        (r.bzp || '') + ' ' +
        (r.cpv || '') + ' ' +
        (r.contractors || []).join(' ')
      ).toLowerCase();
      if (hay.indexOf(needle) === -1) return false;
    }
    return true;
  }

  function sortRows(rows) {
    var copy = rows.slice();
    copy.sort(function (a, b) {
      if (state.sort === 'date_desc') {
        return (b.date || '').localeCompare(a.date || '');
      }
      if (state.sort === 'amount_asc') {
        var aa = a.amountPln != null ? a.amountPln : Infinity;
        var ba = b.amountPln != null ? b.amountPln : Infinity;
        if (aa !== ba) return aa - ba;
        return (b.date || '').localeCompare(a.date || '');
      }
      if (state.sort === 'bids_desc') {
        var ab = a.bids != null ? a.bids : -1;
        var bb = b.bids != null ? b.bids : -1;
        if (bb !== ab) return bb - ab;
        return (b.amountPln || 0) - (a.amountPln || 0);
      }
      if (state.sort === 'bids_asc') {
        var ab2 = a.bids != null ? a.bids : 9999;
        var bb2 = b.bids != null ? b.bids : 9999;
        if (ab2 !== bb2) return ab2 - bb2;
        return (b.amountPln || 0) - (a.amountPln || 0);
      }
      var av = a.amountPln != null ? a.amountPln : -1;
      var bv = b.amountPln != null ? b.amountPln : -1;
      if (bv !== av) return bv - av;
      return (b.date || '').localeCompare(a.date || '');
    });
    return copy;
  }

  function buildSkeleton() {
    if (!mount) return;
    mount.innerHTML =
      '<div class="bzp-kpis" id="bzp-kpis"></div>' +
      '<div class="bzp-charts">' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head"><span class="bzp-panel-title">' + I18N.panelYear + '</span><span class="bzp-panel-hint">' + I18N.clickFilter + '</span></div>' +
          '<div class="bzp-bars" id="bzp-bars-year"></div>' +
        '</div>' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head"><span class="bzp-panel-title">' + I18N.panelCat + '</span><span class="bzp-panel-hint">' + I18N.clickFilter + '</span></div>' +
          '<div class="bzp-bars" id="bzp-bars-cat"></div>' +
        '</div>' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head">' +
            '<span class="bzp-panel-title" id="bzp-group-title">' + I18N.panelGroupSector + '</span>' +
            '<span style="display:inline-flex;gap:4px">' +
              '<button type="button" class="bzp-pill" id="bzp-tab-sector" style="padding:2px 7px;font-size:10.5px">' + I18N.switchSector + '</button>' +
              '<button type="button" class="bzp-pill" id="bzp-tab-prov" style="padding:2px 7px;font-size:10.5px">' + I18N.switchProv + '</button>' +
            '</span>' +
          '</div>' +
          '<div class="bzp-bars" id="bzp-bars-group"></div>' +
        '</div>' +
      '</div>' +
      '<div class="bzp-controls">' +
        '<div class="bzp-search-row">' +
          '<input type="search" class="bzp-input" id="bzp-q" placeholder="' + esc(I18N.searchPh) + '" value="' + esc(state.q) + '" aria-label="' + esc(I18N.searchPh) + '">' +
          '<select class="bzp-select" id="bzp-sort" aria-label="Sort">' +
            '<option value="amount_desc">' + I18N.sortAmountDesc + '</option>' +
            '<option value="date_desc">' + I18N.sortDate + '</option>' +
            '<option value="bids_desc">' + I18N.sortBidsDesc + '</option>' +
            '<option value="bids_asc">' + I18N.sortBidsAsc + '</option>' +
            '<option value="amount_asc">' + I18N.sortAmountAsc + '</option>' +
          '</select>' +
          '<button type="button" class="bzp-reset-btn" id="bzp-reset">' + I18N.reset + '</button>' +
        '</div>' +
        '<div class="bzp-filter-pills" id="bzp-status-pills"></div>' +
        '<div class="bzp-toggles">' +
          '<div class="bzp-check-group">' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-single"' + (state.single ? ' checked' : '') + '><span>' + I18N.chkSingle + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-eu"' + (state.eu ? ' checked' : '') + '><span>' + I18N.chkEu + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-inc"' + (state.incidental ? ' checked' : '') + '><span>' + I18N.chkIncidental + ' <small>(' + I18N.incidentalHint + ')</small></span></label>' +
          '</div>' +
          '<div class="bzp-utils">' +
            '<button type="button" class="bzp-util-btn" id="bzp-csv"></button>' +
            '<button type="button" class="bzp-util-btn" id="bzp-share">' + I18N.btnShare + '</button>' +
            '<button type="button" class="bzp-util-btn" id="bzp-embed-btn">' + I18N.btnEmbed + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="bzp-embed-box" id="bzp-embed-box">' +
          '<p>' + I18N.embedDesc + '</p>' +
          '<code class="bzp-embed-code" id="bzp-embed-code"></code>' +
        '</div>' +
      '</div>' +
      '<div class="bzp-status-bar"><div id="bzp-summary-line"></div><div class="bzp-active-tags" id="bzp-active-tags"></div></div>' +
      '<div class="bzp-table-wrap">' +
        '<div class="bzp-row is-head">' +
          '<div>' + I18N.colDate + '</div>' +
          '<div>' + I18N.colOrg + '</div>' +
          '<div>' + I18N.colTitle + '</div>' +
          '<div>' + I18N.colCat + '</div>' +
          '<div style="text-align:right">' + I18N.colMoney + '</div>' +
          '<div style="text-align:right">' + I18N.colSrc + '</div>' +
        '</div>' +
        '<div id="bzp-rows"></div>' +
      '</div>' +
      '<div class="bzp-more-wrap">' +
        '<span class="micro" id="bzp-foot-count" style="color:var(--muted)"></span>' +
        '<button type="button" class="bzp-util-btn" id="bzp-more"></button>' +
      '</div>' +
      '<div class="bzp-embed-credit">' +
        '<span>RolePlayingTech · Grzegorz Stuczyński · Źródło danych: Biuletyn Zamówień Publicznych (ezamowienia.gov.pl, 2024–2026)</span>' +
        '<a href="' + (lang === 'en' ? 'https://roleplayingtech.com/en/lab/ai-tenders/' : 'https://roleplayingtech.com/pl/lab/przetargi-ai/') + '" target="_blank" rel="noopener noreferrer">' + (lang === 'en' ? 'Read full analysis & methodology ↗' : 'Pełna analiza i metodologia ↗') + '</a>' +
      '</div>';

    var sortEl = document.getElementById('bzp-sort');
    sortEl.value = state.sort;

    var qEl = document.getElementById('bzp-q');
    qEl.addEventListener('input', function () {
      state.q = qEl.value.trim();
      state.limit = 25;
      render();
    });

    sortEl.addEventListener('change', function () {
      state.sort = sortEl.value;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-reset').addEventListener('click', function () {
      state.q = '';
      state.status = 'all';
      state.cat = '';
      state.sector = '';
      state.prov = '';
      state.year = '';
      state.single = false;
      state.eu = false;
      state.incidental = false;
      state.sort = 'amount_desc';
      state.limit = 25;
      qEl.value = '';
      sortEl.value = 'amount_desc';
      document.getElementById('bzp-chk-single').checked = false;
      document.getElementById('bzp-chk-eu').checked = false;
      document.getElementById('bzp-chk-inc').checked = false;
      render();
    });

    document.getElementById('bzp-chk-single').addEventListener('change', function (e) {
      state.single = e.target.checked;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-chk-eu').addEventListener('change', function (e) {
      state.eu = e.target.checked;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-chk-inc').addEventListener('change', function (e) {
      state.incidental = e.target.checked;
      if (!state.incidental && state.cat === 'incidental') state.cat = '';
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-tab-sector').addEventListener('click', function () {
      state.groupMode = 'sector';
      render();
    });

    document.getElementById('bzp-tab-prov').addEventListener('click', function () {
      state.groupMode = 'prov';
      render();
    });

    document.getElementById('bzp-more').addEventListener('click', function () {
      state.limit += 30;
      render();
    });

    document.getElementById('bzp-share').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      var url = buildShareUrl(false);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = I18N.btnCopied;
          setTimeout(function () { btn.textContent = I18N.btnShare; }, 2000);
        });
      }
    });

    document.getElementById('bzp-embed-btn').addEventListener('click', function () {
      var box = document.getElementById('bzp-embed-box');
      box.classList.toggle('is-open');
    });

    document.getElementById('bzp-csv').addEventListener('click', function () {
      var filtered = sortRows(DATA.filter(function (r) { return matchesRow(r, null); }));
      var headers = ['bzp', 'status', 'publication_date', 'contract_or_deadline', 'year', 'organization', 'city', 'province', 'sector', 'category', 'amount_pln_gross', 'bids', 'eu_cofinanced', 'contractors', 'title', 'url'];
      var lines = [headers.join(',')];
      filtered.forEach(function (r) {
        var vals = [
          r.bzp,
          r.status,
          r.date,
          r.contractDate || r.deadline || '',
          r.year,
          r.org,
          r.city || '',
          r.province || '',
          r.sector,
          r.category,
          r.amountPln != null ? r.amountPln : '',
          r.bids != null ? r.bids : '',
          r.eu ? '1' : '0',
          (r.contractors || []).join(' | '),
          r.title,
          r.url
        ].map(function (v) {
          var s = String(v == null ? '' : v).replace(/"/g, '""');
          return '"' + s + '"';
        });
        lines.push(vals.join(','));
      });
      var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'przetargi-ai-bzp-2024-2026.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  function renderBars(containerId, items, activeKey, onToggle, useCountMetric) {
    var el = document.getElementById(containerId);
    var maxMetric = 1;
    items.forEach(function (it) {
      var m = useCountMetric ? it.count : it.sum;
      if (m > maxMetric) maxMetric = m;
    });
    el.innerHTML = items.map(function (it) {
      var metric = useCountMetric ? it.count : it.sum;
      var pct = metric > 0 ? Math.max(3, Math.round((metric / maxMetric) * 100)) : 0;
      var rightLabel = useCountMetric
        ? it.count + ' ' + I18N.procShort
        : fmtPlnCompact(it.sum) + ' · ' + it.signed + ' ' + I18N.contractsShort;
      return (
        '<button type="button" class="bzp-bar-btn' + (activeKey === String(it.key) ? ' is-active' : '') + '" data-key="' + esc(it.key) + '">' +
          '<div class="bzp-bar-top">' +
            '<span class="bzp-bar-name">' + esc(it.label) + '</span>' +
            '<span class="bzp-bar-val">' + esc(rightLabel) + '</span>' +
          '</div>' +
          '<div class="bzp-bar-track"><div class="bzp-bar-fill' + (it.muted ? ' is-muted' : '') + '" style="width:' + pct + '%"></div></div>' +
        '</button>'
      );
    }).join('');

    Array.prototype.forEach.call(el.querySelectorAll('.bzp-bar-btn'), function (btn) {
      btn.addEventListener('click', function () {
        onToggle(btn.getAttribute('data-key'));
      });
    });
  }

  function render() {
    if (!mount) return;
    syncUrl();
    var filtered = sortRows(DATA.filter(function (r) { return matchesRow(r, null); }));
    var basePoolTotal = DATA.filter(function (r) {
      return state.incidental || state.cat === 'incidental' || r.category !== 'incidental';
    }).length;

    var signedRows = filtered.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
    var openCount = filtered.filter(function (r) { return r.status === 'open_or_pending'; }).length;
    var cancelCount = filtered.filter(function (r) { return r.status === 'cancelled'; }).length;
    var spendSum = 0;
    var amounts = [];
    signedRows.forEach(function (r) {
      spendSum += r.amountPln;
      amounts.push(r.amountPln);
    });
    var median = calcMedian(amounts);

    var withBids = signedRows.filter(function (r) { return r.bids != null; });
    var singleBids = withBids.filter(function (r) { return r.bids === 1; });
    var singlePct = withBids.length ? ((singleBids.length / withBids.length) * 100).toFixed(1) : '0.0';
    if (lang === 'pl') singlePct = singlePct.replace('.', ',');

    var euSigned = signedRows.filter(function (r) { return r.eu; });
    var euSum = 0;
    euSigned.forEach(function (r) { euSum += r.amountPln; });
    var euPct = signedRows.length ? ((euSigned.length / signedRows.length) * 100).toFixed(1) : '0.0';
    if (lang === 'pl') euPct = euPct.replace('.', ',');

    document.getElementById('bzp-kpis').innerHTML =
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + I18N.kpiProc + '</span><span class="bzp-kpi-val">' + filtered.length + '</span><span class="bzp-kpi-sub">' + I18N.kpiProcSubAll.replace('{total}', basePoolTotal) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + I18N.kpiSigned + '</span><span class="bzp-kpi-val">' + signedRows.length + '</span><span class="bzp-kpi-sub">' + I18N.kpiSignedSub.replace('{open}', openCount).replace('{cancel}', cancelCount) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + I18N.kpiSpend + '</span><span class="bzp-kpi-val">' + fmtPlnCompact(spendSum) + '</span><span class="bzp-kpi-sub">' + I18N.kpiSpendSub.replace('{median}', fmtPlnCompact(median)) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + I18N.kpiSingle + '</span><span class="bzp-kpi-val">' + singlePct + '<small>%</small></span><span class="bzp-kpi-sub">' + I18N.kpiSingleSub.replace('{num}', singleBids.length).replace('{den}', withBids.length) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + I18N.kpiEu + '</span><span class="bzp-kpi-val">' + euPct + '<small>%</small></span><span class="bzp-kpi-sub">' + I18N.kpiEuSub.replace('{amt}', fmtPlnCompact(euSum)) + '</span></div>';

    var useCountForCharts = state.status === 'open_or_pending' || state.status === 'cancelled';

    var yearBase = DATA.filter(function (r) { return matchesRow(r, 'year'); });
    var years = ['2024', '2025', '2026'].map(function (y) {
      var yr = yearBase.filter(function (r) { return String(r.year) === y; });
      var ys = yr.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
      var sum = 0;
      ys.forEach(function (r) { sum += r.amountPln; });
      return { key: y, label: y + (y === '2026' ? (lang === 'en' ? ' (to Nov 3)' : ' (do 03.11)') : ''), count: yr.length, signed: ys.length, sum: sum };
    });
    renderBars('bzp-bars-year', years, state.year, function (k) {
      state.year = state.year === k ? '' : k;
      state.limit = 25;
      render();
    }, useCountForCharts);

    var catKeys = ['software_deploy', 'hardware_lab', 'training', 'consulting'];
    if (state.incidental || state.cat === 'incidental') catKeys.push('incidental');
    var catBase = DATA.filter(function (r) { return matchesRow(r, 'cat'); });
    var cats = catKeys.map(function (ck) {
      var cr = catBase.filter(function (r) { return r.category === ck; });
      var cs = cr.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
      var sum = 0;
      cs.forEach(function (r) { sum += r.amountPln; });
      return { key: ck, label: I18N.cats[ck] || ck, count: cr.length, signed: cs.length, sum: sum, muted: ck === 'incidental' };
    });
    renderBars('bzp-bars-cat', cats, state.cat, function (k) {
      state.cat = state.cat === k ? '' : k;
      state.limit = 25;
      render();
    }, useCountForCharts);

    document.getElementById('bzp-tab-sector').classList.toggle('is-active', state.groupMode === 'sector');
    document.getElementById('bzp-tab-prov').classList.toggle('is-active', state.groupMode === 'prov');
    document.getElementById('bzp-group-title').textContent = state.groupMode === 'prov' ? I18N.panelGroupProv : I18N.panelGroupSector;

    if (state.groupMode === 'sector') {
      var secBase = DATA.filter(function (r) { return matchesRow(r, 'sector'); });
      var secOrder = ['Uczelnie i nauka', 'Ochrona zdrowia', 'Samorządy, WUP i instytucje reg.', 'Administracja centralna i agencje', 'Szkoły i oświata'];
      var secItems = secOrder.map(function (sk) {
        var sr = secBase.filter(function (r) { return r.sector === sk; });
        var ss = sr.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
        var sum = 0;
        ss.forEach(function (r) { sum += r.amountPln; });
        return { key: sk, label: I18N.sectors[sk] || sk, count: sr.length, signed: ss.length, sum: sum };
      });
      renderBars('bzp-bars-group', secItems, state.sector, function (k) {
        state.sector = state.sector === k ? '' : k;
        state.limit = 25;
        render();
      }, useCountForCharts);
    } else {
      var provBase = DATA.filter(function (r) { return matchesRow(r, 'prov'); });
      var mapP = {};
      provBase.forEach(function (r) {
        var p = r.province || 'Inne';
        if (!mapP[p]) mapP[p] = { key: p, label: p, count: 0, signed: 0, sum: 0 };
        mapP[p].count += 1;
        if (r.status === 'resolved' && r.amountPln != null) {
          mapP[p].signed += 1;
          mapP[p].sum += r.amountPln;
        }
      });
      var provList = Object.keys(mapP).map(function (k) { return mapP[k]; });
      provList.sort(function (a, b) {
        return useCountForCharts ? (b.count - a.count) : (b.sum - a.sum || b.count - a.count);
      });
      renderBars('bzp-bars-group', provList.slice(0, 6), state.prov, function (k) {
        state.prov = state.prov === k ? '' : k;
        state.limit = 25;
        render();
      }, useCountForCharts);
    }

    var stBase = DATA.filter(function (r) { return matchesRow(r, 'status'); });
    var stCounts = {
      all: stBase.length,
      resolved: stBase.filter(function (r) { return r.status === 'resolved'; }).length,
      open_or_pending: stBase.filter(function (r) { return r.status === 'open_or_pending'; }).length,
      cancelled: stBase.filter(function (r) { return r.status === 'cancelled'; }).length
    };
    var pillDefs = [
      { k: 'all', lbl: I18N.stAll.replace('{n}', stCounts.all) },
      { k: 'resolved', lbl: I18N.stResolved.replace('{n}', stCounts.resolved) },
      { k: 'open_or_pending', lbl: I18N.stOpen.replace('{n}', stCounts.open_or_pending) },
      { k: 'cancelled', lbl: I18N.stCancel.replace('{n}', stCounts.cancelled) }
    ];
    var pillsEl = document.getElementById('bzp-status-pills');
    pillsEl.innerHTML = pillDefs.map(function (pd) {
      return '<button type="button" class="bzp-pill' + (state.status === pd.k ? ' is-active' : '') + '" data-st="' + pd.k + '">' + esc(pd.lbl) + '</button>';
    }).join('');
    Array.prototype.forEach.call(pillsEl.querySelectorAll('.bzp-pill'), function (btn) {
      btn.addEventListener('click', function () {
        state.status = btn.getAttribute('data-st');
        state.limit = 25;
        render();
      });
    });

    document.getElementById('bzp-csv').textContent = I18N.btnCsv.replace('{n}', filtered.length);
    document.getElementById('bzp-embed-code').textContent =
      '<iframe src="' + buildShareUrl(true) + '" width="100%" height="820" style="border:1px solid #dbd7cd;background:#f7f6f2" loading="lazy" title="Przetargi AI w Polsce (BZP 2024–2026) — RolePlayingTech"></iframe>';

    var tags = [];
    if (state.year) tags.push({ label: state.year + ' ×', clear: function () { state.year = ''; } });
    if (state.cat) tags.push({ label: (I18N.cats[state.cat] || state.cat) + ' ×', clear: function () { state.cat = ''; } });
    if (state.sector) tags.push({ label: (I18N.sectors[state.sector] || state.sector) + ' ×', clear: function () { state.sector = ''; } });
    if (state.prov) tags.push({ label: state.prov + ' ×', clear: function () { state.prov = ''; } });
    if (state.single) tags.push({ label: I18N.chkSingle + ' ×', clear: function () { state.single = false; document.getElementById('bzp-chk-single').checked = false; } });
    if (state.eu) tags.push({ label: I18N.chkEu + ' ×', clear: function () { state.eu = false; document.getElementById('bzp-chk-eu').checked = false; } });

    var tagsEl = document.getElementById('bzp-active-tags');
    tagsEl.innerHTML = tags.map(function (t, idx) {
      return '<button type="button" class="bzp-active-tag" data-idx="' + idx + '">' + esc(t.label) + '</button>';
    }).join('');
    Array.prototype.forEach.call(tagsEl.querySelectorAll('.bzp-active-tag'), function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-idx'));
        if (tags[i]) {
          tags[i].clear();
          state.limit = 25;
          render();
        }
      });
    });

    var visible = filtered.slice(0, state.limit);
    document.getElementById('bzp-summary-line').innerHTML = I18N.showing
      .replace('{shown}', visible.length)
      .replace('{total}', filtered.length);

    var rowsEl = document.getElementById('bzp-rows');
    if (!visible.length) {
      rowsEl.innerHTML = '<div style="padding:28px 16px;color:var(--muted);font-size:14px">' + esc(I18N.noResults) + '</div>';
    } else {
      rowsEl.innerHTML = visible.map(function (r) {
        var badges = [];
        if (r.status === 'open_or_pending') {
          var dl = r.deadline ? ' · ' + I18N.deadlinePrefix + r.deadline : '';
          badges.push('<span class="bzp-badge is-open">' + esc(I18N.statusOpenBadge + dl) + '</span>');
        } else if (r.status === 'cancelled') {
          badges.push('<span class="bzp-badge is-cancel">' + esc(I18N.statusCancelBadge) + '</span>');
        }
        if (r.eu) {
          badges.push('<span class="bzp-badge is-eu">' + esc(I18N.euBadge) + '</span>');
        }
        if (r.category === 'incidental') {
          badges.push('<span class="bzp-badge is-rust">' + esc(I18N.incidentalBadge) + '</span>');
        }
        if (r.typoFixed) {
          badges.push('<span class="bzp-badge is-rust">' + esc(I18N.typoBadge) + '</span>');
        }

        var contractorHtml = '';
        if (r.contractors && r.contractors.length) {
          contractorHtml = '<div class="bzp-contractor"><b>' + esc(I18N.contractorLabel) + '</b>' + esc(r.contractors.join('; ')) + '</div>';
        }

        var moneyHtml = '';
        if (r.status === 'resolved' && r.amountPln != null) {
          var bidCls = r.bids === 1 ? ' class="is-single-bid"' : '';
          moneyHtml = fmtPlnExact(r.amountPln) + '<small' + bidCls + '>' + esc(fmtBids(r.bids)) + '</small>';
        } else if (r.status === 'cancelled') {
          moneyHtml = '<span style="color:var(--muted);font-weight:400">' + esc(I18N.noAmountCancel) + '</span>' +
            (r.bids != null ? '<small>' + esc(fmtBids(r.bids)) + '</small>' : '');
        } else {
          moneyHtml = '<span style="color:#26455b;font-weight:400">' + esc(I18N.noAmountOpen) + '</span>';
        }

        var locLine = [r.city, r.province, I18N.sectors[r.sector] || r.sector].filter(Boolean).join(' · ');

        return (
          '<div class="bzp-row' + (r.category === 'incidental' ? ' is-incidental' : '') + '">' +
            '<div class="bzp-date">' + esc(r.date) + '<span>' + esc(r.bzp) + '</span></div>' +
            '<div class="bzp-org"><strong>' + esc(r.org) + '</strong><span>' + esc(locLine) + '</span></div>' +
            '<div class="bzp-title-cell">' +
              '<div class="bzp-title">' + esc(r.title) + '</div>' +
              (badges.length ? '<div class="bzp-badges">' + badges.join('') + '</div>' : '') +
              contractorHtml +
            '</div>' +
            '<div class="bzp-cat-cell">' + esc(I18N.cats[r.category] || r.category) + '</div>' +
            '<div class="bzp-money">' + moneyHtml + '</div>' +
            '<div class="bzp-src"><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + I18N.srcBtn + '</a></div>' +
          '</div>'
        );
      }).join('');
    }

    var moreBtn = document.getElementById('bzp-more');
    var footCount = document.getElementById('bzp-foot-count');
    var rem = filtered.length - visible.length;
    if (rem > 0) {
      moreBtn.style.display = 'inline-block';
      moreBtn.textContent = I18N.showMore.replace('{rem}', rem);
      footCount.textContent = '';
    } else {
      moreBtn.style.display = 'none';
      footCount.textContent = filtered.length ? I18N.allShown.replace('{total}', filtered.length) : '';
    }
  }

  function applyQueryString(qs) {
    if (!mount) return;
    var p = new URLSearchParams(qs);
    state.q = p.get('q') || '';
    state.status = p.get('status') || 'all';
    state.cat = p.get('cat') || '';
    state.sector = p.get('sector') || '';
    state.prov = p.get('prov') || '';
    state.year = p.get('year') || '';
    state.single = p.get('single') === '1';
    state.eu = p.get('eu') === '1';
    state.incidental = p.get('incidental') === '1' || state.cat === 'incidental';
    state.sort = p.get('sort') || 'amount_desc';
    state.groupMode = state.prov ? 'prov' : 'sector';
    state.limit = 25;
    var qEl = document.getElementById('bzp-q');
    var sEl = document.getElementById('bzp-sort');
    var cSingle = document.getElementById('bzp-chk-single');
    var cEu = document.getElementById('bzp-chk-eu');
    var cInc = document.getElementById('bzp-chk-inc');
    if (qEl) qEl.value = state.q;
    if (sEl) sEl.value = state.sort;
    if (cSingle) cSingle.checked = state.single;
    if (cEu) cEu.checked = state.eu;
    if (cInc) cInc.checked = state.incidental;
    render();
  }

  function bindPresetLinks(scope) {
    var rootEl = scope || document;
    Array.prototype.forEach.call(rootEl.querySelectorAll('[data-bzp-preset]'), function (link) {
      if (link.__bzpBound) return;
      link.__bzpBound = true;
      link.addEventListener('click', function (e) {
        if (!DATA.length || !mount) return;
        e.preventDefault();
        applyQueryString(link.getAttribute('data-bzp-preset') || '');
        var target = document.getElementById('explorer') || mount;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initWithData(arr) {
    DATA = Array.isArray(arr) ? arr : [];
    renderIllusionFigure();
    renderCompetitionFigure();
    buildSkeleton();
    render();
    bindPresetLinks(document);
  }

  if (window.__BZP_DATA__) {
    initWithData(window.__BZP_DATA__);
  } else {
    if (mount) {
      mount.innerHTML = '<p class="micro" style="padding:28px 0;color:var(--muted)">' + esc(I18N.loading) + '</p>';
    }
    fetch(dataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(initWithData)
      .catch(function () {
        if (mount) {
          mount.innerHTML = '<p class="micro" style="padding:28px 0;color:var(--rust)">' + esc(I18N.loadErr) + '</p>';
        }
      });
  }
})();
