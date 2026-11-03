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
  var SNAPSHOT_DATE = '2026-11-03';

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
      embedHeadTitle: 'Baza przetargów AI w Polsce (BZP 2024–2026)',
      embedHeadMeta: 'Stan na 03.11.2026 · RolePlayingTech',
      embedShowCharts: 'Pokaż wykresy i filtry kategorii ▾',
      embedHideCharts: 'Ukryj wykresy ▴',
      kpiProc: 'Postępowania w widoku',
      kpiProcSubAll: 'z {total} w bazie (01.2024–11.2026)',
      kpiSigned: 'Podpisane umowy',
      kpiSignedSub: '{open} bez wyniku · {cancel} unieważn.',
      kpiSpend: 'Suma podpisanych umów',
      kpiSpendSub: 'mediana umowy: {median}',
      kpiSingle: 'Tylko 1 oferta',
      kpiSingleSub: '{num} z {den} {contractsGen} z podaną l. ofert',
      kpiEu: 'Środki UE / KPO',
      kpiEuSub: '{amt} w umowach z udziałem UE',
      panelYear: '01 · Dynamika roczna',
      switchYearNotice: 'Ogłoszenie',
      switchYearContract: 'Umowa',
      panelCat: '02 · Kategoria zamówienia',
      panelGroupSector: '03 · Sektor instytucji',
      panelGroupProv: '03 · Top województwa',
      switchSector: 'Sektory',
      switchProv: 'Województwa',
      otherProv: 'Inne',
      clickFilter: 'kliknij, aby filtrować',
      searchPh: 'Szukaj: instytucja, miasto, przedmiot, wykonawca, VoiceBot, PACS, GPU, BZP…',
      sortAria: 'Sortowanie listy przetargów',
      sortDate: 'Sortuj: najnowsze ogłoszenia',
      sortAmountDesc: 'Sortuj: najwyższa kwota umowy',
      sortAmountAsc: 'Sortuj: najniższa kwota umowy',
      sortBidsDesc: 'Sortuj: najwięcej ofert',
      sortBidsAsc: 'Sortuj: najmniej ofert (od 1)',
      reset: 'Resetuj filtry',
      stAll: 'Wszystkie ({n})',
      stResolved: 'Rozstrzygnięte / umowa ({n})',
      stOpen: 'Bez wyniku w BZP ({n})',
      stCancel: 'Unieważnione ({n})',
      chkSingle: 'Tylko 1 oferta',
      chkEu: 'Tylko ze wsparciem UE / KPO',
      chkPure: 'Bez zamówień łączonych (tylko czyste AI)',
      chkIncidental: 'Włącz wydatki poboczne (remonty, meble, catering „AI”)',
      btnCsv: 'Pobierz CSV ({n})',
      csvFilename: 'przetargi-ai-bzp-2024-2026.csv',
      btnShare: 'Kopiuj link do widoku',
      btnCopied: 'Skopiowano link ✓',
      btnQuote: 'Kopiuj cytat z linkiem',
      btnQuoteCopied: 'Skopiowano cytat ✓',
      btnEmbed: 'Osadź w artykule (iframe)',
      lensesLabel: 'Szybkie ścieżki:',
      lensAll: 'Wszystkie podstawowe',
      lensItSingle: 'Wdrożenia IT: 1 oferta',
      lensHospSingle: 'Szpitale: 1 oferta',
      lensSole: 'Z wolnej ręki',
      lensPure: 'Tylko czyste AI',
      lensTrainCrowd: 'Tłok na szkoleniach',
      lensOpenNow: 'Trwające nabory',
      lensIncidental: 'Remonty i meble „AI”',
      embedDesc: 'Możesz bezpłatnie osadzić aktualnie przefiltrowany eksplorator w artykule prasowym lub wpisie blogowym (zachowaj link źródłowy):',
      embedIframeTitle: 'Przetargi AI w Polsce (BZP 2024–2026) — RolePlayingTech',
      embedCredit: 'RolePlayingTech · Grzegorz Stuczyński · Źródło danych: Biuletyn Zamówień Publicznych (ezamowienia.gov.pl, 2024–2026)',
      embedReadFull: 'Pełna analiza i metodologia ↗',
      showingOne: 'Wyświetlono <strong>{shown}</strong> z <strong>{total}</strong> postępowania pasującego do filtrów.',
      showingMany: 'Wyświetlono <strong>{shown}</strong> z <strong>{total}</strong> postępowań pasujących do filtrów.',
      noResults: 'Brak postępowań spełniających wybrane kryteria. Spróbuj zmienić lub zresetować filtry.',
      colDate: 'Data / BZP',
      colOrg: 'Zamawiający',
      colTitle: 'Przedmiot zamówienia i wykonawca',
      colCat: 'Kategoria',
      colMoney: 'Kwota brutto / oferty',
      colSrc: 'Źródło',
      contractDatePrefix: 'umowa: ',
      resultNoticePrefix: 'wynik: ',
      statusOpenBidsBadge: 'Nabór otwarty',
      statusOpenBidsDue: 'Nabór otwarty · oferty do {d}',
      statusPendingBadge: 'Po terminie · brak wyniku w BZP',
      statusPendingDue: 'Po terminie · brak wyniku w BZP (oferty do {d})',
      statusCancelBadge: 'Unieważnione',
      euBadge: 'UE / KPO',
      mixedBadge: 'Zakres łączony',
      incidentalBadge: 'Wydatek poboczny',
      typoBadgeTpl: 'Skorygowano omyłkę pisarską z BZP ({raw} → {fixed})',
      contractorLabel: 'Wykonawca: ',
      noAmountOpenBids: 'trwa nabór ofert',
      noAmountPending: 'brak wyniku w BZP',
      noAmountCancel: 'unieważnione',
      bidsOne: '1 oferta',
      bidsFew: '{n} oferty',
      bidsMany: '{n} ofert',
      bidsUnknown: 'brak danych o l. ofert',
      bidsSoleSource: 'z wolnej ręki (bez przetargu)',
      tagSole: 'Z wolnej ręki',
      tagOpenNow: 'Trwający nabór ofert',
      tagPending: 'Po terminie (brak wyniku)',
      srcBtn: 'BZP ↗',
      showMore: 'Pokaż kolejne ({rem} pozostało)',
      allShown: 'Wyświetlono wszystkie pasujące rekordy ({total}).',
      tagNoticeYear: 'Ogłoszenie: {y}',
      tagContractYear: 'Umowa: {y}',
      illProcBar: 'Udział w ogłoszeniach',
      illPlnBar: 'Udział w kwocie umów',
      illMedian: 'mediana: {m}',
      illFilterBtn: 'Pokaż w bazie ↓',
      illYearBasis: 'wg roku ogłoszenia',
      illContractVal: 'wartość umów',
      compAll: 'Wszystkie umowy ({n})',
      compSoftTpl: 'Wdrożenia oprogramowania ({pct} z 1 ofertą)',
      compHealth: 'Szpitale i kliniki',
      compTrain: 'Szkolenia (tłok ofertowy)',
      compZoneTpl: 'STREFA 1 OFERTY — {single} z {total} {contractsGen} ({pct}) bez realnej konkurencji cenowej',
      compZoneShortTpl: 'STREFA 1 OFERTY — {single}/{total} ({pct})',
      compAxisX: 'Wartość podpisanej umowy brutto (skala logarytmiczna)',
      compAxisY: 'Liczba ofert',
      compCardKicker: 'Podgląd kontraktu (najedź lub kliknij kropkę na wykresie)',
      compCardAmount: 'Wartość umowy brutto',
      compCardBids: 'Złożone oferty',
      compCardOpenBzp: 'Karta w BZP ↗',
      compCardInTable: 'Pokaż w tabeli ↓',
      compPinsHeading: 'Wyróżnione punkty skrajne (kliknij, aby zbadać):',
      compPin1Tpl: '{bids} o kurs za {amt}',
      compPin2Tpl: '{bids} · {amt} (awatary AI w CZD)',
      compPin3Tpl: '{bids} · {amt} (laboratorium UJD)',
      compPinGenericTpl: '{bids} · {amt} ({org})',
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
      },
      sectorsShort: {
        'Uczelnie i nauka': 'Uczelnie i instytuty naukowe',
        'Ochrona zdrowia': 'Szpitale i ochrona zdrowia',
        'Samorządy, WUP i instytucje reg.': 'Samorządy i urzędy pracy',
        'Administracja centralna i agencje': 'Administracja centralna',
        'Szkoły i oświata': 'Szkoły i placówki oświatowe'
      }
    },
    en: {
      loading: 'Loading verified Polish public procurement dataset (BZP 2024–2026)…',
      loadErr: 'Could not load the JSON dataset.',
      embedHeadTitle: 'Polish Public-Sector AI Tenders (BZP 2024–2026)',
      embedHeadMeta: 'Data through 03.11.2026 · RolePlayingTech',
      embedShowCharts: 'Show category & year charts ▾',
      embedHideCharts: 'Hide charts ▴',
      kpiProc: 'Matching proceedings',
      kpiProcSubAll: 'out of {total} in dataset (01.2024–11.2026)',
      kpiSigned: 'Signed contracts',
      kpiSignedSub: '{open} no BZP result · {cancel} cancelled',
      kpiSpend: 'Signed contract value',
      kpiSpendSub: 'median contract: {median}',
      kpiSingle: 'Single-bid contracts',
      kpiSingleSub: '{num} of {den} {contractsGen} with bid counts',
      kpiEu: 'EU / Recovery Fund',
      kpiEuSub: '{amt} in EU co-financed contracts',
      panelYear: '01 · Annual trajectory',
      switchYearNotice: 'Notice',
      switchYearContract: 'Contract',
      panelCat: '02 · Tender category',
      panelGroupSector: '03 · Public sector',
      panelGroupProv: '03 · Top regions (voivodeships)',
      switchSector: 'Sectors',
      switchProv: 'Regions',
      otherProv: 'Other',
      clickFilter: 'click to filter',
      searchPh: 'Search: institution, city, tender title, vendor, hospital, university, GPU, BZP…',
      sortAria: 'Sort tenders',
      sortDate: 'Sort: newest notices',
      sortAmountDesc: 'Sort: highest contract value',
      sortAmountAsc: 'Sort: lowest contract value',
      sortBidsDesc: 'Sort: most bids',
      sortBidsAsc: 'Sort: fewest bids (from 1)',
      reset: 'Reset filters',
      stAll: 'All ({n})',
      stResolved: 'Awarded / signed ({n})',
      stOpen: 'No BZP result ({n})',
      stCancel: 'Cancelled ({n})',
      chkSingle: 'Single-bid only',
      chkEu: 'EU / KPO co-financed only',
      chkPure: 'Exclude mixed-scope bundles',
      chkIncidental: 'Include incidental spend (renovations, furniture, “AI” catering)',
      btnCsv: 'Export CSV ({n})',
      csvFilename: 'polish-ai-tenders-bzp-2024-2026.csv',
      btnShare: 'Copy filtered link',
      btnCopied: 'Link copied ✓',
      btnQuote: 'Copy quote + link',
      btnQuoteCopied: 'Quote copied ✓',
      btnEmbed: 'Embed in article (iframe)',
      lensesLabel: 'Quick lenses:',
      lensAll: 'All core tenders',
      lensItSingle: 'Software: single bid',
      lensHospSingle: 'Hospitals: single bid',
      lensSole: 'Sole-source awards',
      lensPure: 'Pure AI only',
      lensTrainCrowd: 'Training crowd (up to 23 bids)',
      lensOpenNow: 'Open for bids now',
      lensIncidental: '‘AI’ renovations & catering',
      embedDesc: 'Newsrooms and bloggers can embed this filtered interactive explorer free of charge (please keep source attribution):',
      embedIframeTitle: 'Polish Public-Sector AI Tenders (BZP 2024–2026) — RolePlayingTech',
      embedCredit: 'RolePlayingTech · Grzegorz Stuczyński · Data source: Polish Public Procurement Bulletin (ezamowienia.gov.pl, 2024–2026)',
      embedReadFull: 'Read full analysis & methodology ↗',
      showingOne: 'Showing <strong>{shown}</strong> of <strong>{total}</strong> matching procurement proceeding.',
      showingMany: 'Showing <strong>{shown}</strong> of <strong>{total}</strong> matching procurement proceedings.',
      noResults: 'No proceedings match your active filters. Try adjusting or resetting the filters.',
      colDate: 'Date / BZP',
      colOrg: 'Contracting authority',
      colTitle: 'Tender scope & awarded vendor',
      colCat: 'Category',
      colMoney: 'Gross PLN / bids',
      colSrc: 'Official record',
      contractDatePrefix: 'signed: ',
      resultNoticePrefix: 'award: ',
      statusOpenBidsBadge: 'Open for bids',
      statusOpenBidsDue: 'Open for bids · due {d}',
      statusPendingBadge: 'Past deadline · no BZP result',
      statusPendingDue: 'Past deadline · no BZP result (due {d})',
      statusCancelBadge: 'Cancelled',
      euBadge: 'EU / KPO',
      mixedBadge: 'Mixed scope',
      incidentalBadge: 'Incidental spend',
      typoBadgeTpl: 'Clerical 10× typo corrected ({raw} → {fixed})',
      contractorLabel: 'Vendor: ',
      noAmountOpenBids: 'open for bids',
      noAmountPending: 'no result in BZP',
      noAmountCancel: 'cancelled',
      bidsOne: '1 bid',
      bidsFew: '{n} bids',
      bidsMany: '{n} bids',
      bidsUnknown: 'bid count n/a',
      bidsSoleSource: 'sole-source (no open tender)',
      tagSole: 'Sole-source award',
      tagOpenNow: 'Open for bids',
      tagPending: 'Past deadline (no result)',
      srcBtn: 'BZP ↗',
      showMore: 'Show more ({rem} remaining)',
      allShown: 'All matching records shown ({total}).',
      tagNoticeYear: 'Notice: {y}',
      tagContractYear: 'Contract: {y}',
      illProcBar: 'Share of notices',
      illPlnBar: 'Share of contract value',
      illMedian: 'median: {m}',
      illFilterBtn: 'Filter below ↓',
      illYearBasis: 'by notice year',
      illContractVal: 'contract value',
      compAll: 'All contracts ({n})',
      compSoftTpl: 'AI software ({pct} single-bid)',
      compHealth: 'Hospitals & clinics',
      compTrain: 'Trainings (crowded bidding)',
      compZoneTpl: 'SINGLE-BID ZONE — {single} of {total} {contractsGen} ({pct}) awarded with zero competing bids',
      compZoneShortTpl: 'SINGLE-BID ZONE — {single}/{total} ({pct})',
      compAxisX: 'Signed gross contract value in PLN (logarithmic scale)',
      compAxisY: 'Bids submitted',
      compCardKicker: 'Contract inspector (hover or click any dot)',
      compCardAmount: 'Gross contract value',
      compCardBids: 'Submitted bids',
      compCardOpenBzp: 'Official BZP record ↗',
      compCardInTable: 'Show in database ↓',
      compPinsHeading: 'Highlighted landmark contracts (tap to inspect):',
      compPin1Tpl: '{bids} for a {amt} workshop',
      compPin2Tpl: '{bids} · {amt} (hospital AI avatars)',
      compPin3Tpl: '{bids} · {amt} (imaging AI lab)',
      compPinGenericTpl: '{bids} · {amt} ({org})',
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
      },
      sectorsShort: {
        'Uczelnie i nauka': 'Universities & institutes',
        'Ochrona zdrowia': 'Hospitals & healthcare',
        'Samorządy, WUP i instytucje reg.': 'Local gov & labour offices',
        'Administracja centralna i agencje': 'Central gov & agencies',
        'Szkoły i oświata': 'Schools & K-12 education'
      }
    }
  }[lang];

  /* Practical English-to-Polish word-prefix lexicon (matched on word boundaries to prevent substring collisions like katedra/edr or zasad/sad) */
  var EN_SEARCH_LEXICON = [
    { keys: ['hospital', 'hospitals', 'clinic', 'clinics', 'clinical', 'medical', 'medicine', 'health', 'healthcare', 'patient', 'patients', 'doctor', 'doctors'], stems: ['szpital', 'klinik', 'klinicz', 'zdrow', 'medycz', 'pacjent', 'lekar', 'zoz', 'spzoz'] },
    { keys: ['university', 'universities', 'faculty', 'faculties', 'department', 'college', 'academic', 'polytechnic', 'science', 'scientific', 'research', 'institute', 'institutes'], stems: ['uniwersytet', 'politechnik', 'akademi', 'uczelni', 'wydzial', 'katedr', 'nauk', 'badawcz', 'badan', 'instytut', 'lukasiewicz'] },
    { keys: ['training', 'trainings', 'workshop', 'workshops', 'course', 'courses', 'seminar', 'seminars', 'elearning', 'education', 'teacher', 'teachers'], stems: ['szkoleni', 'warsztat', 'kurs', 'edukac', 'learning', 'nauczyciel', 'ksztalceni'] },
    { keys: ['software', 'deployment', 'deployments', 'system', 'systems', 'platform', 'application', 'integration', 'license', 'licence', 'subscription', 'cloud'], stems: ['oprogramowani', 'wdrozeni', 'wdrazani', 'system', 'platform', 'aplikacj', 'integracj', 'licencj', 'subskrypcj', 'chmur'] },
    { keys: ['hardware', 'server', 'servers', 'supercomputer', 'workstation', 'cluster', 'computer', 'computers', 'laptop', 'laptops', 'notebook', 'tablet', 'lab', 'labs', 'laboratory', 'laboratories', 'equipment'], stems: ['sprzet', 'serwer', 'superkomputer', 'stacj', 'komputer', 'notebook', 'laptop', 'tablet', 'laboratori', 'aparatur', 'stanowisk'] },
    { keys: ['municipality', 'municipal', 'county', 'counties', 'city', 'town', 'council', 'office', 'offices', 'administration', 'labour', 'labor', 'marshal', 'regional', 'ministry', 'agency'], stems: ['urzad', 'urzed', 'gmin', 'miast', 'miejsk', 'powiat', 'starostw', 'marszalk', 'wojewodz', 'pracy', 'agencj', 'ministerstw'] },
    { keys: ['imaging', 'radiology', 'diagnostic', 'diagnostics', 'ultrasound', 'microscope', 'microscopy', 'fluorescence'], stems: ['obrazow', 'radiolog', 'diagnostyk', 'pacs', 'ris ', 'ultrasonograf', 'usg ', 'mikroskop', 'fluorescenc'] },
    { keys: ['pharmacy', 'pharmacies', 'pharmacotherapy', 'drug', 'drugs', 'medication'], stems: ['aptek', 'farmakoterap', 'farmaceut', 'lek ', 'leki ', 'lekow', 'pharmdiver'] },
    { keys: ['security', 'cybersecurity', 'threat', 'threats', 'detection', 'network', 'firewall'], stems: ['bezpieczenstw', 'cyber', 'zagrozen', 'detekcj', 'edr ', 'siem ', 'stinet'] },
    { keys: ['court', 'courts', 'justice', 'tribunal'], stems: ['sad ', 'sadu ', 'sadow', 'sprawiedliw', 'trybunal'] },
    { keys: ['legal', 'law', 'lawyer', 'counsel'], stems: ['prawn', 'radc', 'kancelari'] },
    { keys: ['school', 'schools', 'kindergarten', 'preschool', 'student', 'students'], stems: ['szkol', 'oswiat', 'przedszkol', 'uczni', 'studen'] },
    { keys: ['avatar', 'avatars', 'reception', 'kiosk'], stems: ['awatar', 'avatar', 'wirtualn'] },
    { keys: ['voicebot', 'voice', 'hotline', 'callcenter', 'phone', 'registration'], stems: ['voicebot', 'glosow', 'telefoniczn', 'infolini', 'rejestracj'] },
    { keys: ['chatbot', 'chat', 'assistant', 'agent', 'agents', 'intranet'], stems: ['chatbot', 'czatbot', 'asystent', 'agent', 'rag ', 'intranet'] },
    { keys: ['robot', 'robots', 'robotics', 'humanoid', 'manipulator', 'drone', 'motion'], stems: ['robot', 'humanoidaln', 'manipulator', 'drony', 'ruchu'] },
    { keys: ['audit', 'audits', 'survey', 'surveys', 'study', 'studies', 'consulting', 'advisory', 'analysis'], stems: ['audyt', 'badani', 'ankiet', 'cawi', 'doradz', 'analiz'] },
    { keys: ['renovation', 'construction', 'building', 'catering', 'hotel', 'conference', 'furniture', 'chairs'], stems: ['przebudow', 'budowlan', 'remont', 'gastronom', 'hotel', 'konferencj', 'mebl', 'krzes'] },
    { keys: ['warsaw', 'mazovia', 'masovia'], stems: ['warszaw', 'mazowieckie'] },
    { keys: ['silesia', 'silesian'], stems: ['slaskie', 'katowic', 'czestochow', 'gliwic'] },
    { keys: ['krakow', 'cracow', 'malopolska'], stems: ['krakow', 'malopolskie'] },
    { keys: ['wroclaw'], stems: ['wroclaw', 'dolnoslaskie'] },
    { keys: ['poznan'], stems: ['poznan', 'wielkopolskie'] },
    { keys: ['gdansk', 'gdynia', 'pomerania', 'pomeranian'], stems: ['gdansk', 'gdyni', 'pomorskie'] }
  ];

  var state = {
    q: params.get('q') || '',
    status: params.get('status') || 'all',
    sub: params.get('sub') || '',
    cat: params.get('cat') || '',
    sector: params.get('sector') || '',
    prov: params.get('prov') || '',
    yearMode: (params.get('ymode') === 'contract' || params.get('cyear')) ? 'contract' : 'notice',
    year: params.get('year') || '',
    cyear: params.get('cyear') || '',
    single: params.get('single') === '1',
    sole: params.get('sole') === '1',
    eu: params.get('eu') === '1',
    pure: params.get('pure') === '1',
    incidental: params.get('incidental') === '1' || params.get('cat') === 'incidental',
    sort: params.get('sort') || 'amount_desc',
    groupMode: params.get('prov') ? 'prov' : 'sector',
    embedChartsOpen: false,
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

  function foldAscii(str) {
    return String(str == null ? '' : str)
      .toLowerCase()
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z');
  }

  function fmtPlNoun(n, one, few, many) {
    var abs = Math.abs(Math.round(Number(n) || 0));
    if (abs === 1) return one;
    var mod10 = abs % 10;
    var mod100 = abs % 100;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
    return many;
  }

  function fmtContractsCount(n) {
    if (lang === 'pl') return n + ' ' + fmtPlNoun(n, 'umowa', 'umowy', 'umów');
    return n + ' ' + (n === 1 ? 'contract' : 'contracts');
  }

  function fmtProceedingsCount(n) {
    if (lang === 'pl') return n + ' ' + fmtPlNoun(n, 'postępowanie', 'postępowania', 'postępowań');
    return n + ' ' + (n === 1 ? 'proceeding' : 'proceedings');
  }

  function fmtContractsGenitive(n) {
    if (lang === 'pl') return n === 1 ? 'umowy' : 'umów';
    return n === 1 ? 'contract' : 'contracts';
  }

  function getSubStatus(r) {
    if (r.status !== 'open_or_pending') return null;
    if (r.subStatus === 'open_for_bids' || r.subStatus === 'pending_result') return r.subStatus;
    return (r.deadline && r.deadline >= SNAPSHOT_DATE) ? 'open_for_bids' : 'pending_result';
  }

  function getAiScope(r) {
    if (r.aiScope === 'pure' || r.aiScope === 'mixed' || r.aiScope === 'incidental') return r.aiScope;
    return r.category === 'incidental' ? 'incidental' : 'pure';
  }

  function getScopeNote(r) {
    if (lang === 'en') return r.scopeNoteEn || r.scopeNotePl || '';
    return r.scopeNotePl || r.scopeNoteEn || '';
  }

  function getLotsBidsNote(r) {
    if (!r.lotsInfo) return '';
    if (lang === 'en') return r.lotsInfo.bidsNoteEn || r.lotsInfo.bidsNotePl || '';
    return r.lotsInfo.bidsNotePl || r.lotsInfo.bidsNoteEn || '';
  }

  function getContractYear(r) {
    return (r.contractDate && r.contractDate.length >= 4) ? r.contractDate.slice(0, 4) : '';
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

  function fmtPlnMedian(n) {
    if (!n || n <= 0) return lang === 'en' ? '0 PLN' : '0 zł';
    if (n >= 1000000) return fmtPlnCompact(n);
    if (n >= 1000) {
      var k1 = (n / 1000).toFixed(1);
      return lang === 'en' ? k1 + 'k PLN' : k1.replace('.', ',') + ' tys. zł';
    }
    return Math.round(n) + (lang === 'en' ? ' PLN' : ' zł');
  }

  function isSoleSource(r) {
    return r.status === 'resolved' && r.bids == null;
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
    if (lang === 'pl') {
      return fmtPlNoun(
        b,
        I18N.bidsOne,
        I18N.bidsFew.replace('{n}', b),
        I18N.bidsMany.replace('{n}', b)
      );
    }
    return b === 1 ? I18N.bidsOne : I18N.bidsMany.replace('{n}', b);
  }

  function calcIncidentalSum() {
    var sum = 0;
    DATA.forEach(function (r) {
      if ((r.category === 'incidental' || getAiScope(r) === 'incidental') && r.status === 'resolved' && r.amountPln != null) {
        sum += r.amountPln;
      }
    });
    return sum;
  }

  function calcMixedStats() {
    var count = 0;
    var sum = 0;
    DATA.forEach(function (r) {
      if (r.category !== 'incidental' && getAiScope(r) === 'mixed') {
        count += 1;
        if (r.status === 'resolved' && r.amountPln != null) sum += r.amountPln;
      }
    });
    return { count: count, sum: sum };
  }

  function buildSearchHay(r) {
    var raw = [
      r.title,
      r.org,
      r.city || '',
      r.province || '',
      r.bzp || '',
      r.resultBzp || '',
      r.cpv || '',
      (r.contractors || []).join(' '),
      I18N.cats[r.category] || '',
      I18N.sectors[r.sector] || '',
      getScopeNote(r),
      getLotsBidsNote(r),
      isSoleSource(r) ? 'zamowienie z wolnej reki bez przetargu sole source single source art 214' : ''
    ].join(' ').toLowerCase();
    var folded = foldAscii(raw);
    return {
      raw: raw,
      folded: folded,
      words: ' ' + folded.replace(/[^a-z0-9]+/g, ' ') + ' '
    };
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
            '<span>' + esc(fmtProceedingsCount(cp.length) + ' · ' + fmtContractsCount(cs.length)) + '</span>' +
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
            '<div><b>' + esc(fmtPlnCompact(sum)) + '</b>' + esc(I18N.illMedian.replace('{m}', fmtPlnMedian(med))) + '</div>' +
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
          '<div>' +
            '<strong>' + esc(yLabel) + '</strong>' +
            '<small class="ill-year-basis" style="text-align:left">' + esc(I18N.illYearBasis) + '</small>' +
            '<small style="text-align:left">' + esc(fmtProceedingsCount(yp.length)) + '</small>' +
          '</div>' +
          '<div>' +
            '<span>' + esc(fmtPlnCompact(sum)) + '</span>' +
            '<small>' + esc(fmtContractsCount(ys.length) + ' · ' + I18N.illContractVal) + '</small>' +
          '</div>' +
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

    pts.sort(function (a, b) { return a.amountPln - b.amountPln; });

    var isCompactSvg = window.innerWidth <= 639;
    var W = isCompactSvg ? 500 : 680;
    var H = isCompactSvg ? 344 : 386;
    var padL = isCompactSvg ? 40 : 48;
    var padR = isCompactSvg ? 20 : 20;
    var padT = isCompactSvg ? 18 : 22;
    var padB = isCompactSvg ? 44 : 46;
    var plotW = W - padL - padR;

    var minLog = Math.log10(1500);
    var maxLog = Math.log10(6000000);
    function xOf(amt) {
      var cl = Math.max(1500, Math.min(6000000, amt));
      return padL + ((Math.log10(cl) - minLog) / (maxLog - minLog)) * plotW;
    }

    // Dedicated single-bid band at bottom with clear header strip above jittered dots
    var singleBandTop = isCompactSvg ? 255 : 293;
    var ySingleCenter = isCompactSvg ? 286 : 326;
    var yTwo = isCompactSvg ? 238 : 276;
    var yTop = padT + 4;
    function yBase(bids) {
      if (bids <= 1) return ySingleCenter;
      var t = (Math.sqrt(Math.min(24, bids)) - Math.sqrt(2)) / (Math.sqrt(24) - Math.sqrt(2));
      return yTwo - t * (yTwo - yTop);
    }

    var singleIdx = 0;
    var plotted = pts.map(function (r, idx) {
      var cx = xOf(r.amountPln);
      var cy = yBase(r.bids);
      if (r.bids === 1) {
        var offsetPattern = [-5, 0, 5, -2.5, 2.5];
        var off = offsetPattern[singleIdx % offsetPattern.length];
        if (r.bzp && r.bzp.indexOf('00137744') !== -1) off = -4.5;
        else if (r.bzp && r.bzp.indexOf('00183188') !== -1) off = 5;
        cy += off;
        singleIdx += 1;
      } else if (r.bids === 2) {
        cy += (idx % 2 === 0 ? -2.2 : 2.2);
      }
      return { r: r, cx: cx, cy: cy, idx: idx };
    });

    // Dynamic statistics for Figure 02 toolbar & single-bid zone banner
    var softPts = plotted.filter(function (pt) { return pt.r.category === 'software_deploy'; });
    var softSingle = softPts.filter(function (pt) { return pt.r.bids === 1; });
    var softSinglePct = softPts.length ? fmtPct((softSingle.length / softPts.length) * 100) : '0%';

    var singleTotal = plotted.filter(function (pt) { return pt.r.bids === 1; }).length;
    var singleSharePct = plotted.length ? fmtPct((singleTotal / plotted.length) * 100) : '0%';

    var compSoftLabel = I18N.compSoftTpl.replace('{pct}', softSinglePct);
    var compZoneFull = I18N.compZoneTpl
      .replace('{single}', singleTotal)
      .replace('{total}', plotted.length)
      .replace('{contractsGen}', fmtContractsGenitive(plotted.length))
      .replace('{pct}', singleSharePct);
    var compZoneShort = I18N.compZoneShortTpl
      .replace('{single}', singleTotal)
      .replace('{total}', plotted.length)
      .replace('{pct}', singleSharePct);

    var xTicks = [
      { v: 2000, pl: '2 tys.', en: '2k' },
      { v: 10000, pl: '10 tys.', en: '10k' },
      { v: 50000, pl: '50 tys.', en: '50k' },
      { v: 250000, pl: '250 tys.', en: '250k' },
      { v: 1000000, pl: '1 mln', en: '1M' },
      { v: 5000000, pl: isCompactSvg ? '5 mln' : '5 mln zł', en: isCompactSvg ? '5M' : '5M PLN' }
    ];
    var yTicks = [1, 2, 3, 5, 10, 15, 23];

    var gridSvg = '';
    xTicks.forEach(function (tk) {
      var x = xOf(tk.v).toFixed(1);
      gridSvg +=
        '<line x1="' + x + '" y1="' + padT + '" x2="' + x + '" y2="' + (H - padB + 8) + '" stroke="#e3dfd6" stroke-dasharray="2,3"/>' +
        '<text class="comp-tick" x="' + x + '" y="' + (H - padB + 22) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#68655f">' + esc(tk[lang]) + '</text>';
    });
    yTicks.forEach(function (yv) {
      var y = yBase(yv).toFixed(1);
      gridSvg +=
        '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + (yv === 1 ? '#d4b5ab' : '#e6e2d9') + '"/>' +
        '<text class="comp-tick" x="' + (padL - 9) + '" y="' + (Number(y) + 3.5) + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" font-weight="' + (yv === 1 ? '700' : '400') + '" fill="' + (yv === 1 ? '#98513c' : '#68655f') + '">' + yv + '</text>';
    });

    function findPoint(bzpSub) {
      for (var i = 0; i < plotted.length; i++) {
        if (plotted[i].r.bzp && plotted[i].r.bzp.indexOf(bzpSub) !== -1) return plotted[i];
      }
      return null;
    }

    // Dynamic selection of 3 landmark contracts
    var pTopBids = null;
    plotted.forEach(function (pt) {
      if (pt.r.category === 'training') {
        if (!pTopBids || pt.r.bids > pTopBids.r.bids || (pt.r.bids === pTopBids.r.bids && pt.r.amountPln < pTopBids.r.amountPln)) {
          pTopBids = pt;
        }
      }
    });
    if (!pTopBids) {
      plotted.forEach(function (pt) {
        if (!pTopBids || pt.r.bids > pTopBids.r.bids) pTopBids = pt;
      });
    }

    var pCzd = findPoint('00137744');
    var pCzdIsSpecific = Boolean(pCzd);
    if (!pCzd) {
      var softSingleHealth = plotted.filter(function (pt) { return pt.r.category === 'software_deploy' && pt.r.bids === 1; });
      if (softSingleHealth.length) pCzd = softSingleHealth[softSingleHealth.length - 1];
    }

    var pUjd = findPoint('00163288');
    var pUjdIsSpecific = Boolean(pUjd);
    if (!pUjd) pUjd = plotted[plotted.length - 1];

    var pin1Label = pTopBids
      ? I18N.compPin1Tpl.replace('{bids}', fmtBids(pTopBids.r.bids)).replace('{amt}', fmtPlnCompact(pTopBids.r.amountPln))
      : '';
    var pin2Label = pCzd
      ? (pCzdIsSpecific ? I18N.compPin2Tpl : I18N.compPinGenericTpl.replace('{org}', pCzd.r.city || pCzd.r.org))
          .replace('{bids}', fmtBids(pCzd.r.bids))
          .replace('{amt}', fmtPlnCompact(pCzd.r.amountPln))
      : '';
    var pin3Label = pUjd
      ? (pUjdIsSpecific ? I18N.compPin3Tpl : I18N.compPinGenericTpl.replace('{org}', pUjd.r.city || pUjd.r.org))
          .replace('{bids}', fmtBids(pUjd.r.bids))
          .replace('{amt}', fmtPlnCompact(pUjd.r.amountPln))
      : '';

    var circlesSvg = plotted.map(function (pt, idx) {
      var col = CAT_COLORS[pt.r.category] || '#68655f';
      return '<circle class="comp-dot" data-idx="' + idx + '" cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="5.6" fill="' + col + '" fill-opacity="0.86" stroke="#fbfaf6" stroke-width="1.2"><title>' + esc(pt.r.org + ' — ' + fmtPlnExact(pt.r.amountPln) + ' (' + fmtBids(pt.r.bids) + ')') + '</title></circle>';
    }).join('');

    // Render callout annotations AFTER circles (top layer), placed in verified dot-free corridors with halo stroke
    var haloAttr = 'paint-order="stroke" stroke="#fbfaf6" stroke-width="3.5" stroke-linejoin="round"';
    var annSvg = '';
    if (pTopBids) {
      var p1TextX = Math.max(padL + 10, Math.min(285, pTopBids.cx - 84));
      var p1TextY = 78;
      annSvg +=
        '<g class="comp-ann" data-pin-idx="' + pTopBids.idx + '" pointer-events="none">' +
          '<line x1="' + pTopBids.cx.toFixed(1) + '" y1="' + (pTopBids.cy + 7).toFixed(1) + '" x2="' + pTopBids.cx.toFixed(1) + '" y2="' + (p1TextY - 11).toFixed(1) + '" stroke="#8c6d23" stroke-width="1.15"/>' +
          '<text class="comp-ann-text" x="' + p1TextX.toFixed(1) + '" y="' + p1TextY + '" text-anchor="start" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" font-weight="600" fill="#5e4915" ' + haloAttr + '>' + esc(pin1Label) + '</text>' +
        '</g>';
    }
    if (pUjd && pUjd !== pTopBids) {
      var p3TextX = W - padR - 4;
      var p3TextY = 144;
      var p3LineEndX = Math.max(padL + 40, Math.min(W - padR - 10, pUjd.cx - 5));
      annSvg +=
        '<g class="comp-ann" data-pin-idx="' + pUjd.idx + '" pointer-events="none">' +
          '<line x1="' + pUjd.cx.toFixed(1) + '" y1="' + (pUjd.cy - 7).toFixed(1) + '" x2="' + p3LineEndX.toFixed(1) + '" y2="' + (p3TextY + 5) + '" stroke="#2d546b" stroke-width="1.15"/>' +
          '<text class="comp-ann-text" x="' + p3TextX.toFixed(1) + '" y="' + p3TextY + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" font-weight="600" fill="#2d546b" ' + haloAttr + '>' + esc(pin3Label) + '</text>' +
        '</g>';
    }
    if (pCzd && pCzd !== pUjd && pCzd !== pTopBids) {
      var p2TextX = Math.min(W - padR - 18, pCzd.cx + 115);
      var p2TextY = 178;
      annSvg +=
        '<g class="comp-ann" data-pin-idx="' + pCzd.idx + '" pointer-events="none">' +
          '<line x1="' + pCzd.cx.toFixed(1) + '" y1="' + (pCzd.cy - 7).toFixed(1) + '" x2="' + (pCzd.cx + 2).toFixed(1) + '" y2="' + (p2TextY + 5) + '" stroke="#98513c" stroke-width="1.15"/>' +
          '<text class="comp-ann-text" x="' + p2TextX.toFixed(1) + '" y="' + p2TextY + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.8" font-weight="600" fill="#98513c" ' + haloAttr + '>' + esc(pin2Label) + '</text>' +
        '</g>';
    }

    var mobilePins = [];
    if (pTopBids) mobilePins.push({ idx: pTopBids.idx, label: pin1Label, color: CAT_COLORS[pTopBids.r.category] || '#8c6d23' });
    if (pCzd && pCzd !== pTopBids) mobilePins.push({ idx: pCzd.idx, label: pin2Label, color: CAT_COLORS[pCzd.r.category] || '#98513c' });
    if (pUjd && pUjd !== pCzd && pUjd !== pTopBids) mobilePins.push({ idx: pUjd.idx, label: pin3Label, color: CAT_COLORS[pUjd.r.category] || '#2d546b' });

    var mobilePinsHtml = mobilePins.length
      ? '<div class="comp-pins-mobile">' +
          '<span class="comp-pins-title">' + esc(I18N.compPinsHeading) + '</span>' +
          mobilePins.map(function (mp) {
            return '<button type="button" class="comp-pin-btn" data-pin-select="' + mp.idx + '"><i style="background:' + mp.color + '"></i><span>' + esc(mp.label) + '</span></button>';
          }).join('') +
        '</div>'
      : '';

    var singleZoneHeight = (H - padB + 8) - singleBandTop;
    var plotMidY = ((padT + (H - padB + 8)) / 2).toFixed(1);

    figComp.innerHTML =
      '<div class="comp-toolbar">' +
        '<button type="button" class="bzp-pill is-active" data-cfilter="all">' + esc(I18N.compAll.replace('{n}', plotted.length)) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="software">' + esc(compSoftLabel) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="health">' + esc(I18N.compHealth) + '</button>' +
        '<button type="button" class="bzp-pill" data-cfilter="training">' + esc(I18N.compTrain) + '</button>' +
      '</div>' +
      '<div class="comp-layout">' +
        '<div class="comp-stage-col">' +
          '<div class="comp-stage">' +
            '<svg class="comp-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(I18N.compAxisX) + '">' +
              '<rect x="' + padL + '" y="' + singleBandTop.toFixed(1) + '" width="' + plotW + '" height="' + singleZoneHeight.toFixed(1) + '" fill="rgba(152,81,60,0.08)"/>' +
              '<line x1="' + padL + '" y1="' + singleBandTop.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + singleBandTop.toFixed(1) + '" stroke="#d9bfb6" stroke-dasharray="3,3"/>' +
              '<text class="comp-zone-label comp-zone-full" x="' + (padL + 8) + '" y="' + (singleBandTop + 13).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.3" font-weight="700" fill="#98513c">' + esc(compZoneFull) + '</text>' +
              '<text class="comp-zone-label comp-zone-short" x="' + (padL + 8) + '" y="' + (singleBandTop + 14).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="12" font-weight="700" fill="#98513c">' + esc(compZoneShort) + '</text>' +
              gridSvg +
              circlesSvg +
              annSvg +
              '<text class="comp-axis-lbl" x="' + (padL + plotW / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#514e49">' + esc(I18N.compAxisX) + '</text>' +
              '<text class="comp-axis-lbl" x="13" y="' + plotMidY + '" text-anchor="middle" transform="rotate(-90 13 ' + plotMidY + ')" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#514e49">' + esc(I18N.compAxisY) + '</text>' +
            '</svg>' +
          '</div>' +
          mobilePinsHtml +
        '</div>' +
        '<div class="comp-card" id="comp-inspector"></div>' +
      '</div>';

    var dots = figComp.querySelectorAll('.comp-dot');
    var anns = figComp.querySelectorAll('.comp-ann');
    var pinBtns = figComp.querySelectorAll('[data-pin-select]');
    var inspector = document.getElementById('comp-inspector');

    function showCard(idx) {
      var item = plotted[idx];
      if (!item) return;
      var r = item.r;
      Array.prototype.forEach.call(dots, function (d) {
        d.classList.toggle('is-selected', Number(d.getAttribute('data-idx')) === idx);
      });
      Array.prototype.forEach.call(pinBtns, function (pb) {
        pb.classList.toggle('is-active', Number(pb.getAttribute('data-pin-select')) === idx);
      });
      var vendorStr = (r.contractors && r.contractors.length)
        ? '<strong>' + esc(I18N.contractorLabel) + '</strong>' + esc(r.contractors.join('; '))
        : '';
      var sn = getScopeNote(r);
      var scopeBadgeHtml = '';
      if (getAiScope(r) === 'mixed') {
        scopeBadgeHtml = '<div class="comp-card-badges"><span class="bzp-badge is-mixed"' + (sn ? ' title="' + esc(sn) + '"' : '') + '>' + esc(I18N.mixedBadge) + '</span></div>';
      }
      if (sn) {
        scopeBadgeHtml += '<div class="comp-card-note">' + esc(sn) + '</div>';
      }
      var lotsNote = getLotsBidsNote(r);
      var lotsHtml = lotsNote ? '<div class="comp-card-note is-lots">' + esc(lotsNote) + '</div>' : '';

      inspector.innerHTML =
        '<div>' +
          '<div class="comp-card-kicker">' + esc(I18N.compCardKicker) + '</div>' +
          '<h4>' + esc(r.org) + '</h4>' +
          '<div class="comp-card-org">' + esc([r.city, r.bzp, I18N.cats[r.category] || r.category].filter(Boolean).join(' · ')) + '</div>' +
          '<div class="comp-card-title">' + esc(r.title) + '</div>' +
          scopeBadgeHtml +
          '<div class="comp-card-metrics">' +
            '<div><small>' + esc(I18N.compCardAmount) + '</small><strong>' + esc(fmtPlnExact(r.amountPln)) + '</strong></div>' +
            '<div><small>' + esc(I18N.compCardBids) + '</small><strong class="' + (r.bids === 1 ? 'is-alert' : '') + '">' + esc(fmtBids(r.bids)) + '</strong></div>' +
          '</div>' +
          lotsHtml +
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

    Array.prototype.forEach.call(pinBtns, function (btn) {
      var i = Number(btn.getAttribute('data-pin-select'));
      btn.addEventListener('click', function () {
        showCard(i);
      });
    });

    var defaultIdx = pCzd ? pCzd.idx : (plotted.length - 1);
    showCard(defaultIdx);

    Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-cfilter');
        Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        var firstMatch = -1;
        function matchesMode(r) {
          if (mode === 'software') return r.category === 'software_deploy';
          if (mode === 'health') return r.sector === 'Ochrona zdrowia';
          if (mode === 'training') return r.category === 'training';
          return true;
        }
        Array.prototype.forEach.call(dots, function (dot) {
          var idx = Number(dot.getAttribute('data-idx'));
          var ok = matchesMode(plotted[idx].r);
          dot.classList.toggle('is-dim', !ok);
          if (ok && firstMatch === -1) firstMatch = idx;
        });
        Array.prototype.forEach.call(anns, function (ann) {
          var idx = Number(ann.getAttribute('data-pin-idx'));
          var ok = plotted[idx] ? matchesMode(plotted[idx].r) : true;
          ann.classList.toggle('is-dim', !ok);
        });
        if (mode === 'training' && pTopBids) {
          showCard(pTopBids.idx);
        } else if (firstMatch !== -1 && mode !== 'all') {
          showCard(firstMatch);
        }
      });
    });
  }

  /* ---------- Full Database Explorer ---------- */
  function buildFilterParams(forEmbed) {
    var p = new URLSearchParams();
    if (forEmbed) p.set('embed', '1');
    if (state.q) p.set('q', state.q);
    if (state.status !== 'all') p.set('status', state.status);
    if (state.sub) p.set('sub', state.sub);
    if (state.cat) p.set('cat', state.cat);
    if (state.sector) p.set('sector', state.sector);
    if (state.prov) p.set('prov', state.prov);
    if (state.yearMode === 'contract') p.set('ymode', 'contract');
    if (state.year) p.set('year', state.year);
    if (state.cyear) p.set('cyear', state.cyear);
    if (state.single) p.set('single', '1');
    if (state.sole) p.set('sole', '1');
    if (state.eu) p.set('eu', '1');
    if (state.pure) p.set('pure', '1');
    if (state.incidental && state.cat !== 'incidental') p.set('incidental', '1');
    if (state.sort !== 'amount_desc') p.set('sort', state.sort);
    return p;
  }

  function syncUrl() {
    if (!mount) return;
    var p = buildFilterParams(root.classList.contains('is-embed'));
    var qs = p.toString();
    var next = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    try {
      window.history.replaceState(null, '', next);
    } catch (e) {}
  }

  function buildShareUrl(forEmbed) {
    var base = 'https://roleplayingtech.com' + window.location.pathname;
    var p = buildFilterParams(Boolean(forEmbed));
    var qs = p.toString();
    return base + (qs ? '?' + qs : '');
  }

  function matchesQueryToken(hayObj, tok, tokFolded) {
    if (hayObj.raw.indexOf(tok) !== -1 || hayObj.folded.indexOf(tokFolded) !== -1) {
      return true;
    }
    if (lang !== 'en') return false;
    for (var i = 0; i < EN_SEARCH_LEXICON.length; i++) {
      var entry = EN_SEARCH_LEXICON[i];
      var keyMatched = false;
      for (var k = 0; k < entry.keys.length; k++) {
        var key = entry.keys[k];
        if (key === tokFolded || (tokFolded.length >= 3 && key.indexOf(tokFolded) === 0)) {
          keyMatched = true;
          break;
        }
      }
      if (keyMatched) {
        for (var s = 0; s < entry.stems.length; s++) {
          if (hayObj.words.indexOf(' ' + entry.stems[s]) !== -1) return true;
        }
      }
    }
    return false;
  }

  function matchesRow(r, ignoreKey) {
    if (!state.incidental && state.cat !== 'incidental' && (r.category === 'incidental' || getAiScope(r) === 'incidental')) {
      return false;
    }
    if (state.pure && getAiScope(r) === 'mixed') return false;
    if (ignoreKey !== 'status' && state.status !== 'all' && r.status !== state.status) return false;
    if (ignoreKey !== 'status' && state.sub && getSubStatus(r) !== state.sub) return false;
    if (ignoreKey !== 'cat' && state.cat && r.category !== state.cat) return false;
    if (ignoreKey !== 'sector' && state.sector && r.sector !== state.sector) return false;
    if (ignoreKey !== 'prov' && state.prov && r.province !== state.prov) return false;
    if (ignoreKey !== 'year' && state.year && String(r.year) !== String(state.year)) return false;
    if (ignoreKey !== 'cyear' && state.cyear && getContractYear(r) !== String(state.cyear)) return false;
    if (state.single && r.bids !== 1) return false;
    if (state.sole && !isSoleSource(r)) return false;
    if (state.eu && !r.eu) return false;
    if (state.q) {
      var hayObj = r._searchHay || (r._searchHay = buildSearchHay(r));
      var needle = state.q.toLowerCase().trim();
      var needleFolded = foldAscii(needle);
      if (hayObj.raw.indexOf(needle) !== -1 || hayObj.folded.indexOf(needleFolded) !== -1) {
        return true;
      }
      var tokens = needle.split(/\s+/).filter(Boolean);
      for (var i = 0; i < tokens.length; i++) {
        if (!matchesQueryToken(hayObj, tokens[i], foldAscii(tokens[i]))) return false;
      }
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
    var incHint = '+' + fmtPlnCompact(calcIncidentalSum());
    var mixedStats = calcMixedStats();
    var pureHintHtml = mixedStats.count > 0
      ? ' <small>(−' + esc(fmtPlnCompact(mixedStats.sum)) + ')</small>'
      : '';
    var fullReportUrl = lang === 'en'
      ? 'https://roleplayingtech.com/en/lab/ai-tenders/'
      : 'https://roleplayingtech.com/pl/lab/przetargi-ai/';

    mount.innerHTML =
      '<div class="bzp-embed-head">' +
        '<strong>' + esc(I18N.embedHeadTitle) + '</strong>' +
        '<a href="' + fullReportUrl + '" target="_blank" rel="noopener noreferrer">' + esc(I18N.embedHeadMeta) + ' ↗</a>' +
      '</div>' +
      '<div class="bzp-lenses" id="bzp-lenses" role="region" aria-label="' + esc(I18N.lensesLabel) + '"></div>' +
      '<div class="bzp-kpis" id="bzp-kpis"></div>' +
      '<button type="button" class="bzp-charts-toggle" id="bzp-charts-toggle" aria-expanded="false">' + esc(I18N.embedShowCharts) + '</button>' +
      '<div class="bzp-charts" id="bzp-charts">' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head">' +
            '<span class="bzp-panel-title">' + esc(I18N.panelYear) + '</span>' +
            '<span style="display:inline-flex;gap:4px">' +
              '<button type="button" class="bzp-pill" id="bzp-tab-ynotice" style="padding:2px 7px;font-size:10.5px">' + esc(I18N.switchYearNotice) + '</button>' +
              '<button type="button" class="bzp-pill" id="bzp-tab-ycontract" style="padding:2px 7px;font-size:10.5px">' + esc(I18N.switchYearContract) + '</button>' +
            '</span>' +
          '</div>' +
          '<div class="bzp-bars" id="bzp-bars-year"></div>' +
        '</div>' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head"><span class="bzp-panel-title">' + esc(I18N.panelCat) + '</span><span class="bzp-panel-hint">' + esc(I18N.clickFilter) + '</span></div>' +
          '<div class="bzp-bars" id="bzp-bars-cat"></div>' +
        '</div>' +
        '<div class="bzp-panel">' +
          '<div class="bzp-panel-head">' +
            '<span class="bzp-panel-title" id="bzp-group-title">' + esc(I18N.panelGroupSector) + '</span>' +
            '<span style="display:inline-flex;gap:4px">' +
              '<button type="button" class="bzp-pill" id="bzp-tab-sector" style="padding:2px 7px;font-size:10.5px">' + esc(I18N.switchSector) + '</button>' +
              '<button type="button" class="bzp-pill" id="bzp-tab-prov" style="padding:2px 7px;font-size:10.5px">' + esc(I18N.switchProv) + '</button>' +
            '</span>' +
          '</div>' +
          '<div class="bzp-bars" id="bzp-bars-group"></div>' +
        '</div>' +
      '</div>' +
      '<div class="bzp-controls">' +
        '<div class="bzp-search-row">' +
          '<input type="search" class="bzp-input" id="bzp-q" placeholder="' + esc(I18N.searchPh) + '" value="' + esc(state.q) + '" aria-label="' + esc(I18N.searchPh) + '">' +
          '<select class="bzp-select" id="bzp-sort" aria-label="' + esc(I18N.sortAria) + '">' +
            '<option value="amount_desc">' + esc(I18N.sortAmountDesc) + '</option>' +
            '<option value="date_desc">' + esc(I18N.sortDate) + '</option>' +
            '<option value="bids_desc">' + esc(I18N.sortBidsDesc) + '</option>' +
            '<option value="bids_asc">' + esc(I18N.sortBidsAsc) + '</option>' +
            '<option value="amount_asc">' + esc(I18N.sortAmountAsc) + '</option>' +
          '</select>' +
          '<button type="button" class="bzp-reset-btn" id="bzp-reset">' + esc(I18N.reset) + '</button>' +
        '</div>' +
        '<div class="bzp-filter-pills" id="bzp-status-pills"></div>' +
        '<div class="bzp-toggles">' +
          '<div class="bzp-check-group">' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-single"' + (state.single ? ' checked' : '') + '><span>' + esc(I18N.chkSingle) + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-eu"' + (state.eu ? ' checked' : '') + '><span>' + esc(I18N.chkEu) + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-pure"' + (state.pure ? ' checked' : '') + '><span>' + esc(I18N.chkPure) + pureHintHtml + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="bzp-chk-inc"' + (state.incidental ? ' checked' : '') + '><span>' + esc(I18N.chkIncidental) + ' <small>(' + esc(incHint) + ')</small></span></label>' +
          '</div>' +
          '<div class="bzp-utils">' +
            '<button type="button" class="bzp-util-btn" id="bzp-csv"></button>' +
            '<button type="button" class="bzp-util-btn" id="bzp-quote">' + esc(I18N.btnQuote) + '</button>' +
            '<button type="button" class="bzp-util-btn" id="bzp-share">' + esc(I18N.btnShare) + '</button>' +
            '<button type="button" class="bzp-util-btn" id="bzp-embed-btn">' + esc(I18N.btnEmbed) + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="bzp-embed-box" id="bzp-embed-box">' +
          '<p>' + esc(I18N.embedDesc) + '</p>' +
          '<code class="bzp-embed-code" id="bzp-embed-code"></code>' +
        '</div>' +
      '</div>' +
      '<div class="bzp-status-bar"><div id="bzp-summary-line"></div><div class="bzp-active-tags" id="bzp-active-tags"></div></div>' +
      '<div class="bzp-table-wrap">' +
        '<div class="bzp-row is-head">' +
          '<div>' + esc(I18N.colDate) + '</div>' +
          '<div>' + esc(I18N.colOrg) + '</div>' +
          '<div>' + esc(I18N.colTitle) + '</div>' +
          '<div>' + esc(I18N.colCat) + '</div>' +
          '<div style="text-align:right">' + esc(I18N.colMoney) + '</div>' +
          '<div style="text-align:right">' + esc(I18N.colSrc) + '</div>' +
        '</div>' +
        '<div id="bzp-rows"></div>' +
      '</div>' +
      '<div class="bzp-more-wrap">' +
        '<span class="micro" id="bzp-foot-count" style="color:var(--muted)"></span>' +
        '<button type="button" class="bzp-util-btn" id="bzp-more"></button>' +
      '</div>' +
      '<div class="bzp-embed-credit">' +
        '<span>' + esc(I18N.embedCredit) + '</span>' +
        '<a href="' + fullReportUrl + '" target="_blank" rel="noopener noreferrer">' + esc(I18N.embedReadFull) + '</a>' +
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

    document.getElementById('bzp-charts-toggle').addEventListener('click', function () {
      state.embedChartsOpen = !state.embedChartsOpen;
      var chartsEl = document.getElementById('bzp-charts');
      var toggleBtn = document.getElementById('bzp-charts-toggle');
      chartsEl.classList.toggle('is-embed-open', state.embedChartsOpen);
      toggleBtn.setAttribute('aria-expanded', state.embedChartsOpen ? 'true' : 'false');
      toggleBtn.textContent = state.embedChartsOpen ? I18N.embedHideCharts : I18N.embedShowCharts;
    });

    document.getElementById('bzp-reset').addEventListener('click', function () {
      state.q = '';
      state.status = 'all';
      state.sub = '';
      state.cat = '';
      state.sector = '';
      state.prov = '';
      state.yearMode = 'notice';
      state.year = '';
      state.cyear = '';
      state.single = false;
      state.sole = false;
      state.eu = false;
      state.pure = false;
      state.incidental = false;
      state.sort = 'amount_desc';
      state.limit = 25;
      qEl.value = '';
      sortEl.value = 'amount_desc';
      document.getElementById('bzp-chk-single').checked = false;
      document.getElementById('bzp-chk-eu').checked = false;
      document.getElementById('bzp-chk-pure').checked = false;
      document.getElementById('bzp-chk-inc').checked = false;
      render();
    });

    document.getElementById('bzp-chk-single').addEventListener('change', function (e) {
      state.single = e.target.checked;
      if (state.single) state.sole = false;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-chk-eu').addEventListener('change', function (e) {
      state.eu = e.target.checked;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-chk-pure').addEventListener('change', function (e) {
      state.pure = e.target.checked;
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-chk-inc').addEventListener('change', function (e) {
      state.incidental = e.target.checked;
      if (!state.incidental && state.cat === 'incidental') state.cat = '';
      state.limit = 25;
      render();
    });

    document.getElementById('bzp-tab-ynotice').addEventListener('click', function () {
      if (state.yearMode !== 'notice') {
        state.yearMode = 'notice';
        state.cyear = '';
        state.limit = 25;
        render();
      }
    });

    document.getElementById('bzp-tab-ycontract').addEventListener('click', function () {
      if (state.yearMode !== 'contract') {
        state.yearMode = 'contract';
        state.year = '';
        state.limit = 25;
        render();
      }
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
      var url = buildShareUrl(false) + '#explorer';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = I18N.btnCopied;
          setTimeout(function () { btn.textContent = I18N.btnShare; }, 2000);
        });
      }
    });

    document.getElementById('bzp-quote').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      var quoteText = buildCitationText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(quoteText).then(function () {
          btn.textContent = I18N.btnQuoteCopied;
          setTimeout(function () { btn.textContent = I18N.btnQuote; }, 2200);
        });
      }
    });

    document.getElementById('bzp-embed-btn').addEventListener('click', function () {
      var box = document.getElementById('bzp-embed-box');
      box.classList.toggle('is-open');
    });

    document.getElementById('bzp-csv').addEventListener('click', function () {
      var filtered = sortRows(DATA.filter(function (r) { return matchesRow(r, null); }));
      var headers = ['bzp', 'result_bzp', 'status', 'sub_status', 'publication_date', 'contract_or_deadline', 'year', 'organization', 'city', 'province', 'sector', 'category', 'ai_scope', 'amount_pln_gross', 'bids', 'eu_cofinanced', 'contractors', 'title', 'url'];
      var lines = [headers.join(',')];
      filtered.forEach(function (r) {
        var vals = [
          r.bzp,
          r.resultBzp || '',
          r.status,
          getSubStatus(r) || '',
          r.date,
          r.contractDate || r.deadline || '',
          r.year,
          r.org,
          r.city || '',
          r.province || '',
          r.sector,
          r.category,
          getAiScope(r),
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
      a.download = I18N.csvFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  function buildCitationText() {
    var filtered = DATA.filter(function (r) { return matchesRow(r, null); });
    var signed = filtered.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
    var sum = 0;
    signed.forEach(function (r) { sum += r.amountPln; });
    var withBids = signed.filter(function (r) { return r.bids != null; });
    var single = withBids.filter(function (r) { return r.bids === 1; });

    var parts = [];
    if (state.q) parts.push('„' + state.q + '”');
    if (state.cat) parts.push(I18N.cats[state.cat] || state.cat);
    if (state.sector) parts.push(I18N.sectors[state.sector] || state.sector);
    if (state.prov) parts.push(state.prov);
    if (state.year) parts.push((lang === 'en' ? 'notice ' : 'ogł. ') + state.year);
    if (state.cyear) parts.push((lang === 'en' ? 'signed ' : 'umowa ') + state.cyear);
    if (state.single) parts.push(I18N.chkSingle.toLowerCase());
    if (state.sole) parts.push(I18N.tagSole.toLowerCase());
    if (state.sub === 'open_for_bids') parts.push(I18N.tagOpenNow.toLowerCase());
    if (state.eu) parts.push('UE/KPO');
    if (state.pure) parts.push(lang === 'en' ? 'pure AI only' : 'tylko czyste AI');

    var url = buildShareUrl(false) + '#explorer';
    if (lang === 'en') {
      var scopeEn = parts.length ? ' [' + parts.join(' · ') + ']' : ' [core dataset]';
      var bodyEn = signed.length > 0
        ? (fmtProceedingsCount(filtered.length) + ', incl. ' + fmtContractsCount(signed.length) + ' worth ' + fmtPlnCompact(sum) + ' gross' +
            (withBids.length >= 3 && !state.single ? ' (' + single.length + '/' + withBids.length + ' single-bid)' : ''))
        : fmtProceedingsCount(filtered.length);
      return 'Polish public-sector AI tenders (BZP 01.2024–11.2026)' + scopeEn + ': ' + bodyEn + '. Source & filings: ' + url;
    }
    var scopePl = parts.length ? ' [' + parts.join(' · ') + ']' : ' [zbiór podstawowy]';
    var bodyPl = signed.length > 0
      ? (fmtProceedingsCount(filtered.length) + ', w tym ' + fmtContractsCount(signed.length) + ' na łącznie ' + fmtPlnCompact(sum) + ' brutto' +
          (withBids.length >= 3 && !state.single ? ' (1 oferta: ' + single.length + ' z ' + withBids.length + ')' : ''))
      : fmtProceedingsCount(filtered.length);
    return 'Przetargi AI w Polsce (BZP 01.2024–11.2026)' + scopePl + ': ' + bodyPl + '. Karty źródłowe: ' + url;
  }

  function getLensesSpec() {
    var core = DATA.filter(function (r) { return r.category !== 'incidental'; });
    var itSingle = core.filter(function (r) { return r.status === 'resolved' && r.category === 'software_deploy' && r.bids === 1; }).length;
    var hospSingle = core.filter(function (r) { return r.status === 'resolved' && r.sector === 'Ochrona zdrowia' && r.bids === 1; }).length;
    var soleCnt = core.filter(function (r) { return isSoleSource(r); }).length;
    var pureSigned = core.filter(function (r) { return r.status === 'resolved' && getAiScope(r) === 'pure'; }).length;
    var trainSigned = core.filter(function (r) { return r.status === 'resolved' && r.category === 'training'; }).length;
    var openNow = core.filter(function (r) { return getSubStatus(r) === 'open_for_bids'; }).length;
    var incCnt = DATA.filter(function (r) { return r.category === 'incidental'; }).length;

    return [
      {
        id: 'all',
        qs: '',
        label: I18N.lensAll,
        badge: String(core.length),
        isActive: function () {
          return !state.q && state.status === 'all' && !state.sub && !state.cat && !state.sector && !state.prov &&
            !state.year && !state.cyear && !state.single && !state.sole && !state.eu && !state.pure && !state.incidental;
        }
      },
      {
        id: 'it_single',
        qs: 'status=resolved&cat=software_deploy&single=1',
        label: I18N.lensItSingle,
        badge: String(itSingle),
        isActive: function () {
          return state.status === 'resolved' && state.cat === 'software_deploy' && state.single && !state.sector && !state.incidental;
        }
      },
      {
        id: 'hosp_single',
        qs: 'status=resolved&sector=Ochrona+zdrowia&single=1',
        label: I18N.lensHospSingle,
        badge: String(hospSingle),
        isActive: function () {
          return state.status === 'resolved' && state.sector === 'Ochrona zdrowia' && state.single && !state.cat;
        }
      },
      {
        id: 'sole',
        qs: 'sole=1',
        label: I18N.lensSole,
        badge: String(soleCnt),
        isActive: function () { return state.sole && !state.incidental; }
      },
      {
        id: 'pure',
        qs: 'status=resolved&pure=1',
        label: I18N.lensPure,
        badge: String(pureSigned),
        isActive: function () { return state.pure && state.status === 'resolved' && !state.cat && !state.sector && !state.single; }
      },
      {
        id: 'train',
        qs: 'status=resolved&cat=training&sort=bids_desc',
        label: I18N.lensTrainCrowd,
        badge: String(trainSigned),
        isActive: function () { return state.cat === 'training' && state.sort === 'bids_desc' && !state.single; }
      },
      {
        id: 'open_now',
        qs: 'status=open_or_pending&sub=open_for_bids&sort=date_desc',
        label: I18N.lensOpenNow,
        badge: String(openNow),
        isActive: function () { return state.sub === 'open_for_bids'; }
      },
      {
        id: 'inc',
        qs: 'incidental=1&cat=incidental',
        label: I18N.lensIncidental,
        badge: String(incCnt),
        isActive: function () { return state.cat === 'incidental'; }
      }
    ];
  }

  function renderLenses() {
    var el = document.getElementById('bzp-lenses');
    if (!el) return;
    var specs = getLensesSpec();
    el.innerHTML =
      '<span class="bzp-lenses-label">' + esc(I18N.lensesLabel) + '</span>' +
      specs.map(function (sp, idx) {
        var act = sp.isActive();
        return '<button type="button" class="bzp-lens' + (act ? ' is-active' : '') + '" data-lens-idx="' + idx + '">' +
          esc(sp.label) + ' <b>(' + esc(sp.badge) + ')</b></button>';
      }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('.bzp-lens'), function (btn) {
      btn.addEventListener('click', function () {
        var sp = specs[Number(btn.getAttribute('data-lens-idx'))];
        if (!sp) return;
        if (sp.id !== 'all' && sp.isActive()) {
          applyQueryString('');
        } else {
          applyQueryString(sp.qs);
        }
      });
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
        ? fmtProceedingsCount(it.count)
        : fmtPlnCompact(it.sum) + ' · ' + fmtContractsCount(it.signed);
      return (
        '<button type="button" class="bzp-bar-btn' + (activeKey === String(it.key) ? ' is-active' : '') + '" data-key="' + esc(it.key) + '" title="' + esc(it.fullLabel || it.label) + '">' +
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
      var incOk = state.incidental || state.cat === 'incidental' || (r.category !== 'incidental' && getAiScope(r) !== 'incidental');
      var pureOk = !state.pure || getAiScope(r) !== 'mixed';
      return incOk && pureOk;
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

    renderLenses();

    document.getElementById('bzp-kpis').innerHTML =
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(I18N.kpiProc) + '</span><span class="bzp-kpi-val">' + filtered.length + '</span><span class="bzp-kpi-sub">' + esc(I18N.kpiProcSubAll.replace('{total}', basePoolTotal)) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(I18N.kpiSigned) + '</span><span class="bzp-kpi-val">' + signedRows.length + '</span><span class="bzp-kpi-sub">' + esc(I18N.kpiSignedSub.replace('{open}', openCount).replace('{cancel}', cancelCount)) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(I18N.kpiSpend) + '</span><span class="bzp-kpi-val">' + esc(fmtPlnCompact(spendSum)) + '</span><span class="bzp-kpi-sub">' + esc(I18N.kpiSpendSub.replace('{median}', fmtPlnMedian(median))) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(I18N.kpiSingle) + '</span><span class="bzp-kpi-val">' + singlePct + '<small>%</small></span><span class="bzp-kpi-sub">' + esc(I18N.kpiSingleSub.replace('{num}', singleBids.length).replace('{den}', withBids.length).replace('{contractsGen}', fmtContractsGenitive(withBids.length))) + '</span></div>' +
      '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(I18N.kpiEu) + '</span><span class="bzp-kpi-val">' + euPct + '<small>%</small></span><span class="bzp-kpi-sub">' + esc(I18N.kpiEuSub.replace('{amt}', fmtPlnCompact(euSum))) + '</span></div>';

    var useCountForCharts = state.status === 'open_or_pending' || state.status === 'cancelled';

    document.getElementById('bzp-tab-ynotice').classList.toggle('is-active', state.yearMode === 'notice');
    document.getElementById('bzp-tab-ycontract').classList.toggle('is-active', state.yearMode === 'contract');

    if (state.yearMode === 'contract') {
      var cyearBase = DATA.filter(function (r) { return matchesRow(r, 'cyear'); });
      var cyearKeys = ['2023', '2024', '2025', '2026'];
      var cyears = cyearKeys.map(function (cy) {
        var yr = cyearBase.filter(function (r) { return getContractYear(r) === cy; });
        var ys = yr.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
        var sum = 0;
        ys.forEach(function (r) { sum += r.amountPln; });
        var lbl = cy;
        if (cy === '2023') lbl = lang === 'en' ? '2023 (XII / Dec)' : '2023 (XII)';
        else if (cy === '2026') lbl = lang === 'en' ? '2026 (to Nov 3)' : '2026 (do 03.11)';
        return { key: cy, label: lbl, count: yr.length, signed: ys.length, sum: sum };
      });
      renderBars('bzp-bars-year', cyears, state.cyear, function (k) {
        state.cyear = state.cyear === k ? '' : k;
        state.limit = 25;
        render();
      }, false);
    } else {
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
    }

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
        return {
          key: sk,
          label: (I18N.sectorsShort && I18N.sectorsShort[sk]) || I18N.sectors[sk] || sk,
          fullLabel: I18N.sectors[sk] || sk,
          count: sr.length,
          signed: ss.length,
          sum: sum
        };
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
        var p = r.province || I18N.otherProv;
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
        if (state.status !== 'open_or_pending') state.sub = '';
        state.limit = 25;
        render();
      });
    });

    document.getElementById('bzp-csv').textContent = I18N.btnCsv.replace('{n}', filtered.length);
    document.getElementById('bzp-embed-code').textContent =
      '<iframe src="' + buildShareUrl(true) + '" width="100%" height="820" style="border:1px solid #dbd7cd;background:#f7f6f2" loading="lazy" title="' + I18N.embedIframeTitle + '"></iframe>';

    var tags = [];
    if (state.year) tags.push({ label: I18N.tagNoticeYear.replace('{y}', state.year) + ' ×', clear: function () { state.year = ''; } });
    if (state.cyear) tags.push({ label: I18N.tagContractYear.replace('{y}', state.cyear === '2023' ? '2023 (XII)' : state.cyear) + ' ×', clear: function () { state.cyear = ''; } });
    if (state.sub) tags.push({ label: (state.sub === 'open_for_bids' ? I18N.tagOpenNow : I18N.tagPending) + ' ×', clear: function () { state.sub = ''; } });
    if (state.cat) tags.push({ label: (I18N.cats[state.cat] || state.cat) + ' ×', clear: function () { state.cat = ''; } });
    if (state.sector) tags.push({ label: (I18N.sectors[state.sector] || state.sector) + ' ×', clear: function () { state.sector = ''; } });
    if (state.prov) tags.push({ label: state.prov + ' ×', clear: function () { state.prov = ''; } });
    if (state.single) tags.push({ label: I18N.chkSingle + ' ×', clear: function () { state.single = false; document.getElementById('bzp-chk-single').checked = false; } });
    if (state.sole) tags.push({ label: I18N.tagSole + ' ×', clear: function () { state.sole = false; } });
    if (state.eu) tags.push({ label: I18N.chkEu + ' ×', clear: function () { state.eu = false; document.getElementById('bzp-chk-eu').checked = false; } });
    if (state.pure) tags.push({ label: I18N.chkPure + ' ×', clear: function () { state.pure = false; document.getElementById('bzp-chk-pure').checked = false; } });

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
    var showingTpl = filtered.length === 1 ? I18N.showingOne : I18N.showingMany;
    document.getElementById('bzp-summary-line').innerHTML = showingTpl
      .replace('{shown}', visible.length)
      .replace('{total}', filtered.length);

    var rowsEl = document.getElementById('bzp-rows');
    if (!visible.length) {
      rowsEl.innerHTML = '<div style="padding:28px 16px;color:var(--muted);font-size:14px">' + esc(I18N.noResults) + '</div>';
    } else {
      rowsEl.innerHTML = visible.map(function (r) {
        var badges = [];
        var subSt = getSubStatus(r);
        if (r.status === 'open_or_pending') {
          if (subSt === 'open_for_bids') {
            var openTxt = r.deadline ? I18N.statusOpenBidsDue.replace('{d}', r.deadline) : I18N.statusOpenBidsBadge;
            badges.push('<span class="bzp-badge is-open">' + esc(openTxt) + '</span>');
          } else {
            var pendTxt = r.deadline ? I18N.statusPendingDue.replace('{d}', r.deadline) : I18N.statusPendingBadge;
            badges.push('<span class="bzp-badge is-pending">' + esc(pendTxt) + '</span>');
          }
        } else if (r.status === 'cancelled') {
          badges.push('<span class="bzp-badge is-cancel">' + esc(I18N.statusCancelBadge) + '</span>');
        }
        if (r.eu) {
          badges.push('<span class="bzp-badge is-eu">' + esc(I18N.euBadge) + '</span>');
        }
        var scope = getAiScope(r);
        var scopeNote = getScopeNote(r);
        if (scope === 'mixed') {
          badges.push('<span class="bzp-badge is-mixed"' + (scopeNote ? ' title="' + esc(scopeNote) + '"' : '') + '>' + esc(I18N.mixedBadge) + '</span>');
        }
        if (r.category === 'incidental' || scope === 'incidental') {
          badges.push('<span class="bzp-badge is-rust">' + esc(I18N.incidentalBadge) + '</span>');
        }
        if (r.typoFixed && r.amountPln != null) {
          var typoTxt = I18N.typoBadgeTpl
            .replace('{raw}', fmtPlnCompact(r.amountPln * 10))
            .replace('{fixed}', fmtPlnCompact(r.amountPln));
          badges.push('<span class="bzp-badge is-rust">' + esc(typoTxt) + '</span>');
        }

        var scopeNoteHtml = scopeNote
          ? '<div class="bzp-scope-note">' + esc(scopeNote) + '</div>'
          : '';

        var contractorHtml = '';
        if (r.contractors && r.contractors.length) {
          contractorHtml = '<div class="bzp-contractor"><b>' + esc(I18N.contractorLabel) + '</b>' + esc(r.contractors.join('; ')) + '</div>';
        }

        var lotsNote = getLotsBidsNote(r);
        var lotsMoneyHtml = lotsNote ? '<small class="bzp-lots-note">' + esc(lotsNote) + '</small>' : '';

        var moneyHtml = '';
        if (r.status === 'resolved' && r.amountPln != null) {
          var bidCls = r.bids === 1 ? ' class="is-single-bid"' : (r.bids == null ? ' class="is-sole-source"' : '');
          var bidText = r.bids == null ? I18N.bidsSoleSource : fmtBids(r.bids);
          moneyHtml = esc(fmtPlnExact(r.amountPln)) + '<small' + bidCls + '>' + esc(bidText) + '</small>' + lotsMoneyHtml;
        } else if (r.status === 'cancelled') {
          moneyHtml = '<span style="color:var(--muted);font-weight:400">' + esc(I18N.noAmountCancel) + '</span>' +
            (r.bids != null ? '<small>' + esc(fmtBids(r.bids)) + '</small>' : '') + lotsMoneyHtml;
        } else if (subSt === 'open_for_bids') {
          moneyHtml = '<span style="color:#26455b;font-weight:400">' + esc(I18N.noAmountOpenBids) + '</span>';
        } else {
          moneyHtml = '<span style="color:#6d5832;font-weight:400">' + esc(I18N.noAmountPending) + '</span>';
        }

        var dateMeta = '<span>' + esc(r.bzp) + '</span>';
        if (r.resultBzp && r.resultBzp !== r.bzp) {
          dateMeta += '<span>' + esc(I18N.resultNoticePrefix + r.resultBzp) + '</span>';
        }
        if (r.contractDate) {
          dateMeta += '<span class="bzp-cdate">' + esc(I18N.contractDatePrefix + r.contractDate) + '</span>';
        }

        var locLine = [r.city, r.province, I18N.sectors[r.sector] || r.sector].filter(Boolean).join(' · ');

        return (
          '<div class="bzp-row' + ((r.category === 'incidental' || scope === 'incidental') ? ' is-incidental' : '') + '">' +
            '<div class="bzp-date">' + esc(r.date) + dateMeta + '</div>' +
            '<div class="bzp-org"><strong>' + esc(r.org) + '</strong><span>' + esc(locLine) + '</span></div>' +
            '<div class="bzp-title-cell">' +
              '<div class="bzp-title">' + esc(r.title) + '</div>' +
              (badges.length ? '<div class="bzp-badges">' + badges.join('') + '</div>' : '') +
              scopeNoteHtml +
              contractorHtml +
            '</div>' +
            '<div class="bzp-cat-cell">' + esc(I18N.cats[r.category] || r.category) + '</div>' +
            '<div class="bzp-money">' + moneyHtml + '</div>' +
            '<div class="bzp-src"><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(I18N.srcBtn) + '</a></div>' +
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
    state.sub = p.get('sub') || '';
    state.cat = p.get('cat') || '';
    state.sector = p.get('sector') || '';
    state.prov = p.get('prov') || '';
    state.yearMode = (p.get('ymode') === 'contract' || p.get('cyear')) ? 'contract' : 'notice';
    state.year = p.get('year') || '';
    state.cyear = p.get('cyear') || '';
    state.single = p.get('single') === '1';
    state.sole = p.get('sole') === '1';
    state.eu = p.get('eu') === '1';
    state.pure = p.get('pure') === '1';
    state.incidental = p.get('incidental') === '1' || state.cat === 'incidental';
    state.sort = p.get('sort') || 'amount_desc';
    state.groupMode = state.prov ? 'prov' : 'sector';
    state.limit = 25;
    var qEl = document.getElementById('bzp-q');
    var sEl = document.getElementById('bzp-sort');
    var cSingle = document.getElementById('bzp-chk-single');
    var cEu = document.getElementById('bzp-chk-eu');
    var cPure = document.getElementById('bzp-chk-pure');
    var cInc = document.getElementById('bzp-chk-inc');
    if (qEl) qEl.value = state.q;
    if (sEl) sEl.value = state.sort;
    if (cSingle) cSingle.checked = state.single;
    if (cEu) cEu.checked = state.eu;
    if (cPure) cPure.checked = state.pure;
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

  var lastCompactComp = window.innerWidth <= 639;
  window.addEventListener('resize', function () {
    var nowCompact = window.innerWidth <= 639;
    if (nowCompact !== lastCompactComp && DATA.length && figComp) {
      lastCompactComp = nowCompact;
      renderCompetitionFigure();
    }
  });

  window.addEventListener('beforeprint', function () {
    Array.prototype.forEach.call(document.querySelectorAll('details.lab-meta-more'), function (d) {
      if (!d.open) {
        d.setAttribute('data-print-opened', '1');
        d.open = true;
      }
    });
  });

  window.addEventListener('afterprint', function () {
    Array.prototype.forEach.call(document.querySelectorAll('details.lab-meta-more[data-print-opened="1"]'), function (d) {
      d.removeAttribute('data-print-opened');
      d.open = false;
    });
  });

  function initWithData(arr) {
    DATA = Array.isArray(arr) ? arr : [];
    DATA.forEach(function (r) {
      r._searchHay = buildSearchHay(r);
    });
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
