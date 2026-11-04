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
    training: '#7d601d',
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
      tagBids23: '2–3 oferty',
      tagBids4p: '4+ ofert',
      tagStResolved: 'Rozstrzygnięte / umowa',
      tagStOpen: 'Bez wyniku w BZP',
      tagStCancel: 'Unieważnione',
      illProcBar: 'Udział w ogłoszeniach',
      illPlnBar: 'Udział w kwocie umów',
      illScaleHint: 'skala 0–100% (linia 50%)',
      illDeltaPosTpl: '+{d} pkt proc. w kwocie',
      illDeltaNegTpl: '−{d} pkt proc. w kwocie',
      illMedian: 'mediana: {m}',
      illFilterBtn: 'Pokaż w bazie ↓',
      illYearBasis: 'wg roku ogłoszenia',
      illContractVal: 'wartość umów',
      compTabAria: 'Widok wykresu konkurencji',
      compTab1: 'Przekrój rynku i ściana 170 tys. zł',
      compTab2Tpl: 'Mapa wszystkich {n} umów (kropki)',
      compTab3: 'Koszt monopolu, blokada i 31 porażek',
      compForensicNoteHtml: '<strong>Głębsza weryfikacja treści ogłoszeń (sekcje 3.1 i 6.1.6 BZP):</strong> 4 umowy z wpisaną „1” to w istocie wolna ręka z art. 305 Pzp (łącznie 10 umów na 3,46 mln zł), a w 8 przetargach wieloofertowych (1,50 mln zł) odrzucono wszystkich rywali — przy ocenie końcowej bez konkurenta zostało <strong>59 ze 110 umów (53,6%) na 19,54 mln zł (60,7% kwoty)</strong>.',
      fPriceTitle: 'Cena wygranej wobec kosztorysu netto (n = 31)',
      fPriceSub: 'Jednorodne umowy IT i sprzętu z 23% VAT (sekcja 4.3 vs 8.2 BZP · 100% = wycena netto zamawiającego)',
      fPriceScale0: '0%',
      fPriceScaleRef: '100% kosztorysu netto ▼',
      fPriceR1Label: '1 ważna oferta (n = 18)',
      fPriceR1Val: '100,0% kosztorysu netto',
      fPriceR1Foot: 'mediana 1,230× brutto/netto',
      fPriceR1Pill: '0% rabatu (+23% VAT)',
      fPriceR2Label: '2–3 ważne oferty (n = 9)',
      fPriceR2Val: '93,8% kosztorysu netto',
      fPriceR2Foot: 'mediana 1,153× brutto/netto',
      fPriceR2Pill: '−6,2% wobec kosztorysu',
      fPriceR3Label: '4+ ważnych ofert (n = 4)',
      fPriceR3Val: '54,0% kosztorysu netto',
      fPriceR3Foot: 'mediana 0,664× brutto/netto',
      fPriceR3Pill: '−46,0% rabatu netto!',
      fPricePill1Html: '<strong>72,2% wdrożeń IT bez kryteriów jakości</strong> (39 z 54 · w całej bazie 63,5% to 100% cena lub cena + formalna gwarancja/SLA)',
      fPricePill2Html: '<strong>Rozstrzał ważnych ofert:</strong> med. 2,71× (maks. 13,25×) w oprogramowaniu AI vs 1,12× w sprzęcie GPU',
      fLockTitle: 'Blokada systemów bazowych (HIS/PACS/PUI) i wiosenny klif KPO',
      fLockSub: 'Wdrożenia oprogramowania AI (n = 45 podpisanych umów) — wpływ wymogu integracji z zastanym systemem',
      fLockLegZero: 'Bez konkurenta',
      fLockLegMulti: '≥ 2 oferty',
      fLockR1Label: 'Wskazany system (AMMS, CliniNET, AGFA, Pixel, PUI)',
      fLockR1Val: '94,1% bez rywala',
      fLockR1Foot: '16 z 17 umów IT bez konkurenta',
      fLockR1Pill: 'w szpitalach: 12 z 12 (100%)',
      fLockR2Label: 'Wdrożenie niezależne (bez lock-inu w ogłoszeniu)',
      fLockR2Val: '53,6% bez rywala',
      fLockR2Foot: '15 z 28 umów IT bez konkurenta',
      fLockR2Pill: 'w szpitalach: 12 z 19 (63,2%)',
      fLockPillHtml: '<strong>Czas na ofertę: mediana 9,0 dni</strong> (41,2% ≤ 8 dni) wobec 28,0 dni oceny — w szpitalach nawet 5× wydłużany termin (12→27 dni) kończył się 1 ofertą',
      fKpoKicker: 'Szczyt i klif KPO D1.1.2 (2026)',
      fKpoBodyHtml: '<strong>Szczyt KPO D1.1.2 (I–VI 2026):</strong> 26 z 38 szpitalnych przetargów AI (<strong>84,2% umów bez rywala</strong> — 16 z 19, <strong>8,45 mln zł</strong>) → po zamknięciu okna w <strong>III kw. 2026:</strong> 1 przetarg szpitalny (0 z KPO) i <strong>0,0% (0 z 11)</strong> umów z 1 ofertą w całym kraju (wobec 64,7% w I kw. i 55,0% w II kw.).',
      fCancelTitle: 'Sekcja zwłok 31 unieważnionych przetargów (22,0% ze 141 zakończonych · sekcja 5.2 BZP)',
      fCancelSub: 'Aż 24 z 31 unieważnień (77,4%) nastąpiło mimo złożenia przez wykonawców 53+ ofert · 10 z 26 nieudanych inicjatyw (38,5%) porzucono bez umowy',
      fCancel1Pct: '45,2%',
      fCancel1Cnt: '14 z 31 postępowań',
      fCancel1Desc: 'Oferty powyżej budżetu (art. 255 pkt 3 Pzp · szok cenowy do 3,2× budżetu w NAWA)',
      fCancel2Pct: '25,8%',
      fCancel2Cnt: '8 z 31 postępowań',
      fCancel2Desc: 'Odrzucono 100% złożonych ofert (art. 255 pkt 2 Pzp · dyskwalifikacje formalne i podmiotowe)',
      fCancel3Pct: '19,4%',
      fCancel3Cnt: '6 z 31 postępowań',
      fCancel3Desc: 'Zero złożonych ofert (art. 255 pkt 1 Pzp · cisza rynkowa tylko w 1 na 5 unieważnień)',
      fCancel4Pct: '9,7%',
      fCancel4Cnt: '3 z 31 postępowań',
      fCancel4Desc: 'Wada procedury lub fiasko negocjacji z wolnej ręki (art. 255 pkt 6 i 8 Pzp)',
      fCancelFootNote: 'Unieważniono 31 ze 159 postępowań podstawowych (19,5% bazy · 22,0% spośród 141 zakończonych).',
      fCancelBtn: 'Pokaż wszystkie 31 unieważnionych przetargów w bazie ↓',
      compSecATitleTpl: 'Podział całej kwoty {sum} wg konkurencji · n = {n} umów',
      compSecAHint: 'kliknij segment lub kafel, aby filtrować bazę ↓',
      compZeroBadgeTpl: 'Bez konkurenta: {pct} kwoty',
      compCalloutHtmlTpl: '<strong>{zrPct} wszystkich pieniędzy ({zrSum} w {zrCnt} {zrGen}) trafiło do wykonawców bez żadnego konkurenta</strong> — podczas gdy <strong>{crCnt} zatłoczonych przetargów (4–{maxBids} {maxBidsNoun}) dzieli raptem {crSum} ({crPct} kwoty)</strong>.',
      compTier1Title: '1 oferta w przetargu',
      compTier2Title: 'Z wolnej ręki (art. 305 Pzp)',
      compTier3Title: '2–3 oferty',
      compTier4TitleTpl: '4–{max} {noun}',
      compTierSubTpl: '{cnt} ({cntPct})',
      compOfSpendTpl: '{pct} kwoty',
      compFilterCue: 'Filtruj ↓',
      compCliffTitleTpl: 'Ściana 170 tys. zł · skok przy wyższych kwotach (n = {n})',
      compCliffSub: 'Rozkład umów konkurencyjnych w 4 przedziałach wartości brutto',
      compLeg1: '1 oferta',
      compLegSole: 'wolna ręka',
      compLeg23: '2–3 oferty',
      compLeg4p: '4+ ofert',
      compBr1: '< 50 tys. zł',
      compBr2: '50–170 tys. zł',
      compBr3: '170–500 tys. zł',
      compBr4: '≥ 500 tys. zł',
      compSingleShareTpl: '{pct} z 1 ofertą',
      compMedPillTpl: 'mediana: {m}',
      compCliffAboveTpl: '▲ < 170 tys. zł: {cnt} ({plnPct} kwoty) · med. {med} ({sPct} z 1 ofertą)',
      compCliffBelowTpl: '▼ ≥ 170 tys. zł: {cnt} ({plnPct} kwoty) · med. {med} ({sPct} z 1 ofertą)',
      compCatTitleTpl: 'Konkurencja w 4 kategoriach (n = {n} · kliknij, aby filtrować)',
      compCatSub: 'Rozkład podpisanych umów (w tym z wolnej ręki) i odsetek kwoty bez konkurenta',
      compCatZeroTpl: 'Bez konkurenta: {zr}/{tot} ({cntPct} umów · {plnPct} kwoty)',
      compCatTrainTpl: 'Bez rywala: {cntPct} ({plnPct} kwoty) · 4+ ofert: {c4}/{tot} ({c4Pct})',
      svgCatKickerTpl: 'KATEGORIE (n = {n}):',
      svgCatSoft: 'Wdrożenia IT',
      svgCatHard: 'Sprzęt i lab.',
      svgCatTrain: 'Szkolenia',
      svgCatCons: 'Badania',
      svgZoneLeft1Tpl: 'PONIŻEJ 170 TYS. ZŁ ({cnt})',
      svgZoneLeft2Tpl: 'mediana: {med} · tylko {pct} z 1 ofertą',
      svgZoneRight1Tpl: 'OD 170 TYS. ZŁ WZWYŻ · {plnPct} KWOTY ({cnt})',
      svgZoneRight2Tpl: 'mediana: {med} · aż {pct} z 1 ofertą',
      svgZoneLeftMobTpl: '< 170 tys.: med. {medNum} ({pct} z 1 of.)',
      svgZoneRightMobTpl: '≥ 170 tys.: {plnPct} kwoty · med. {medNum} ({pct})',
      compAll: 'Wszystkie umowy ({n})',
      compSoftTpl: 'Wdrożenia oprogramowania ({pct} z 1 ofertą)',
      compHealth: 'Szpitale i kliniki',
      compTrain: 'Szkolenia (tłok ofertowy)',
      compZoneTpl: 'STREFA 1 OFERTY — {single} z {total} {contractsGen} ({pct}) bez konkurencji cenowej',
      compZoneShortTpl: 'STREFA 1 OFERTY — {single}/{total} ({pct})',
      compAxisX: 'Wartość podpisanej umowy brutto (skala logarytmiczna)',
      compAxisY: 'Liczba ofert',
      compCardKicker: 'Podgląd kontraktu (najedź lub kliknij kropkę na wykresie)',
      compCardAmount: 'Wartość umowy brutto',
      compCardBids: 'Złożone oferty',
      compCardOpenBzp: 'Karta w BZP ↗',
      compCardInTable: 'Pokaż w tabeli ↓',
      compPinsHeading: 'Wyróżnione kontrakty (kliknij, aby zbadać):',
      compPin1Tpl: '{bids} · kurs {amt}',
      compPinAspTpl: '{bids} · chatbot ASP ({amt})',
      compPin2Tpl: '{bids} · awatary CZD ({amt})',
      compPin3Tpl: '{bids} · lab. UJD ({amt})',
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
      tagBids23: '2–3 bids',
      tagBids4p: '4+ bids',
      tagStResolved: 'Awarded / contract',
      tagStOpen: 'No outcome in BZP',
      tagStCancel: 'Cancelled',
      illProcBar: 'Share of notices',
      illPlnBar: 'Share of contract value',
      illScaleHint: '0–100% scale (50% mark)',
      illDeltaPosTpl: '+{d} pp in contract value',
      illDeltaNegTpl: '−{d} pp in contract value',
      illMedian: 'median: {m}',
      illFilterBtn: 'Filter below ↓',
      illYearBasis: 'by notice year',
      illContractVal: 'contract value',
      compTabAria: 'Competition chart view',
      compTab1: 'Market split & 170k PLN cliff',
      compTab2Tpl: 'All {n} contracts map (dots)',
      compTab3: 'Pricing, lock-in & 31 failures',
      compForensicNoteHtml: '<strong>Deeper HTML notice audit (BZP Sections 3.1 &amp; 6.1.6):</strong> 4 awards coded “1 bid” are statutory Art. 305 sole-source contracts (10 total, 3.46M PLN), and 8 multi-bid tenders (1.50M PLN) disqualified every rival — leaving <strong>59 of 110 awards (53.6%) worth 19.54M PLN (60.7% of spend)</strong> with zero surviving competitors.',
      fPriceTitle: 'Winning price vs. buyer net estimate (n = 31)',
      fPriceSub: 'Homogeneous 23%-VAT AI software & hardware awards (BZP Sec. 4.3 vs. 8.2 · 100% = buyer net estimate)',
      fPriceScale0: '0%',
      fPriceScaleRef: '100% buyer net estimate ▼',
      fPriceR1Label: '1 surviving valid bid (n = 18)',
      fPriceR1Val: '100.0% of net estimate',
      fPriceR1Foot: 'median 1.230× gross/net',
      fPriceR1Pill: '0% discount (+23% VAT)',
      fPriceR2Label: '2–3 surviving valid bids (n = 9)',
      fPriceR2Val: '93.8% of net estimate',
      fPriceR2Foot: 'median 1.153× gross/net',
      fPriceR2Pill: '−6.2% vs. estimate',
      fPriceR3Label: '4+ surviving valid bids (n = 4)',
      fPriceR3Val: '54.0% of net estimate',
      fPriceR3Foot: 'median 0.664× gross/net',
      fPriceR3Pill: '−46.0% net discount!',
      fPricePill1Html: '<strong>72.2% of AI software lacks quality criteria</strong> (39 of 54 · 63.5% overall use 100% price or price + formal warranty/SLA)',
      fPricePill2Html: '<strong>Valid bid spread:</strong> med. 2.71× (up to 13.25×) in AI software vs. 1.12× in GPU hardware',
      fLockTitle: 'Incumbent system lock-in (HIS/PACS/PUI) & Spring 2026 KPO cliff',
      fLockSub: 'Signed AI software deployments (n = 45) — impact of naming proprietary host systems in the tender notice',
      fLockLegZero: 'No rival',
      fLockLegMulti: '2+ bids',
      fLockR1Label: 'Named host system (AMMS, CliniNET, AGFA, Pixel, PUI)',
      fLockR1Val: '94.1% zero-rival',
      fLockR1Foot: '16 of 17 software awards had zero rivals',
      fLockR1Pill: 'hospitals: 12/12 (100%)',
      fLockR2Label: 'Standalone deployment (no lock-in in notice)',
      fLockR2Val: '53.6% zero-rival',
      fLockR2Foot: '15 of 28 software awards had zero rivals',
      fLockR2Pill: 'hospitals: 12/19 (63.2%)',
      fLockPillHtml: '<strong>Bid window: median 9.0 days</strong> (41.2% ≤ 8 days) vs. 28.0 days to evaluate — in hospitals even 5× deadline extensions (12→27d) drew 1 bid',
      fKpoKicker: 'Spring 2026 KPO D1.1.2 Sprint & Cliff',
      fKpoBodyHtml: '<strong>KPO D1.1.2 peak (Jan–Jun 2026):</strong> 26 of 38 hospital AI tenders (<strong>84.2% zero-rival awards</strong> — 16 of 19, <strong>8.45M PLN</strong>) → after the grant window closed in <strong>Q3 2026:</strong> 1 hospital tender (0 KPO) and <strong>0.0% (0 of 11)</strong> single-bid awards economy-wide (down from 64.7% in Q1 and 55.0% in Q2).',
      fCancelTitle: 'Autopsy of all 31 cancelled core tenders (22.0% of 141 concluded · BZP Section 5.2)',
      fCancelSub: '24 of 31 cancellations (77.4%) failed despite vendors submitting 53+ bids · 10 of 26 failed initiatives (38.5%) were abandoned without a contract',
      fCancel1Pct: '45.2%',
      fCancel1Cnt: '14 of 31 cancellations',
      fCancel1Desc: 'Bids exceeded buyer budget (Art. 255(3) PZP · price shock up to 3.2× budget at NAWA)',
      fCancel2Pct: '25.8%',
      fCancel2Cnt: '8 of 31 cancellations',
      fCancel2Desc: '100% of submitted bids rejected (Art. 255(2) PZP · formal & qualification disqualifications)',
      fCancel3Pct: '19.4%',
      fCancel3Cnt: '6 of 31 cancellations',
      fCancel3Desc: 'Zero bids submitted (Art. 255(1) PZP · market silence in only 1 of 5 cancellations)',
      fCancel4Pct: '9.7%',
      fCancel4Cnt: '3 of 31 cancellations',
      fCancel4Desc: 'Procedural defect or failed sole-source negotiation (Art. 255(6) & (8) PZP)',
      fCancelFootNote: '31 of 159 core proceedings were cancelled (19.5% of dataset · 22.0% of 141 concluded).',
      fCancelBtn: 'Inspect all 31 cancelled tenders in the database ↓',
      compSecATitleTpl: 'Breakdown of all {sum} by competition tier · n = {n} awards',
      compSecAHint: 'click any segment or card to filter database ↓',
      compZeroBadgeTpl: 'Zero rivals: {pct} of value',
      compCalloutHtmlTpl: '<strong>{zrPct} of all contracted money ({zrSum} across {zrCnt} {zrGen}) went to vendors facing zero rival bids</strong> — while <strong>{crCnt} crowded tenders (4–{maxBids} {maxBidsNoun}) split just {crSum} ({crPct} of value)</strong>.',
      compTier1Title: '1 bid in open tender',
      compTier2Title: 'Sole-source (Art. 305 PZP)',
      compTier3Title: '2–3 bids',
      compTier4TitleTpl: '4–{max} {noun}',
      compTierSubTpl: '{cnt} ({cntPct})',
      compOfSpendTpl: '{pct} of value',
      compFilterCue: 'Filter ↓',
      compCliffTitleTpl: 'The 170k PLN cliff · competition drops as value rises (n = {n})',
      compCliffSub: 'Share of competitive contracts across 4 gross value brackets',
      compLeg1: '1 bid',
      compLegSole: 'sole-source',
      compLeg23: '2–3 bids',
      compLeg4p: '4+ bids',
      compBr1: '< 50k PLN',
      compBr2: '50–170k PLN',
      compBr3: '170–500k PLN',
      compBr4: '≥ 500k PLN',
      compSingleShareTpl: '{pct} single-bid',
      compMedPillTpl: 'med: {m}',
      compCliffAboveTpl: '▲ < 170k PLN: {cnt} ({plnPct} PLN) · med. {med} ({sPct} single-bid)',
      compCliffBelowTpl: '▼ ≥ 170k PLN: {cnt} ({plnPct} PLN) · med. {med} ({sPct} single-bid)',
      compCatTitleTpl: 'Competition by category (n = {n} · click to filter)',
      compCatSub: 'Signed award breakdown (incl. sole-source) & zero-rival share of contract value',
      compCatZeroTpl: 'Zero rivals: {zr}/{tot} ({cntPct} of awards · {plnPct} of PLN)',
      compCatTrainTpl: 'Zero rivals: {cntPct} ({plnPct} PLN) · 4+ bids: {c4}/{tot} ({c4Pct})',
      svgCatKickerTpl: 'CATEGORIES (n = {n}):',
      svgCatSoft: 'AI software',
      svgCatHard: 'Hardware & labs',
      svgCatTrain: 'Trainings',
      svgCatCons: 'Research',
      svgZoneLeft1Tpl: 'BELOW 170K PLN ({cnt})',
      svgZoneLeft2Tpl: 'median: {med} · only {pct} single-bid',
      svgZoneRight1Tpl: '170K PLN & UP · {plnPct} OF VALUE ({cnt})',
      svgZoneRight2Tpl: 'median: {med} · {pct} single-bid',
      svgZoneLeftMobTpl: '< 170k: med {medNum} ({pct} 1-bid)',
      svgZoneRightMobTpl: '≥ 170k: {plnPct} PLN · med {medNum} ({pct})',
      compAll: 'All contracts ({n})',
      compSoftTpl: 'AI software ({pct} single-bid)',
      compHealth: 'Hospitals & clinics',
      compTrain: 'Trainings (crowded bidding)',
      compZoneTpl: 'SINGLE-BID ZONE — {single} of {total} awards ({pct}) with zero rival bids',
      compZoneShortTpl: 'SINGLE-BID ZONE — {single}/{total} ({pct})',
      compAxisX: 'Signed gross contract value in PLN (logarithmic scale)',
      compAxisY: 'Bids submitted',
      compCardKicker: 'Contract inspector (hover or click any dot)',
      compCardAmount: 'Gross contract value',
      compCardBids: 'Submitted bids',
      compCardOpenBzp: 'Official BZP record ↗',
      compCardInTable: 'Show in database ↓',
      compPinsHeading: 'Highlighted landmark contracts (tap to inspect):',
      compPin1Tpl: '{bids} · {amt} workshop',
      compPinAspTpl: '{bids} · ASP chatbot ({amt})',
      compPin2Tpl: '{bids} · CZD avatars ({amt})',
      compPin3Tpl: '{bids} · UJD lab ({amt})',
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
    btier: params.get('btier') || '',
    eu: params.get('eu') === '1',
    pure: params.get('pure') === '1',
    incidental: params.get('incidental') === '1' || params.get('cat') === 'incidental',
    sort: params.get('sort') || 'amount_desc',
    groupMode: params.get('prov') ? 'prov' : 'sector',
    embedChartsOpen: false,
    limit: 25
  };

  var compView = 'split';
  var compFilter = 'all';
  var compSelectedBzp = '00137744';

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

  function fmtMedianBidsNum(m) {
    if (m == null) return '0';
    var isInt = Math.abs(m - Math.round(m)) < 0.001;
    var s = isInt ? String(Math.round(m)) : m.toFixed(1);
    return lang === 'pl' ? s.replace('.', ',') : s;
  }

  function fmtMedianBids(m) {
    if (m == null) return I18N.bidsUnknown;
    var isInt = Math.abs(m - Math.round(m)) < 0.001;
    if (isInt) return fmtBids(Math.round(m));
    var numStr = fmtMedianBidsNum(m);
    return lang === 'pl' ? (numStr + ' oferty') : (numStr + ' bids');
  }

  function sumAmounts(arr) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].amountPln != null) s += arr[i].amountPln;
    }
    return s;
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
      isSoleSource(r) ? 'zamowienie z wolnej reki bez przetargu sole source single source art 305 art 214' : ''
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
    var totalPln = sumAmounts(signedAll);

    var cats = ['software_deploy', 'hardware_lab', 'training', 'consulting'];
    var rowsHtml = cats.map(function (ck) {
      var cp = core.filter(function (r) { return r.category === ck; });
      var cs = signedAll.filter(function (r) { return r.category === ck; });
      var sum = 0;
      var vals = [];
      cs.forEach(function (r) { sum += r.amountPln; vals.push(r.amountPln); });
      var procPct = (cp.length / totalProc) * 100;
      var plnPct = totalPln > 0 ? (sum / totalPln) * 100 : 0;
      var delta = Number(plnPct.toFixed(1)) - Number(procPct.toFixed(1));
      var deltaAbsStr = Math.abs(delta).toFixed(1);
      if (lang === 'pl') deltaAbsStr = deltaAbsStr.replace('.', ',');
      var deltaText = (delta >= 0 ? I18N.illDeltaPosTpl : I18N.illDeltaNegTpl).replace('{d}', deltaAbsStr);
      var deltaCls = delta >= 0 ? 'is-pos' : 'is-neg';
      var med = calcMedian(vals);
      return (
        '<div class="ill-row">' +
          '<div class="ill-cat">' +
            '<strong>' + esc(I18N.cats[ck]) + '</strong>' +
            '<span>' + esc(fmtProceedingsCount(cp.length) + ' · ' + fmtContractsCount(cs.length)) + '</span>' +
            '<span class="ill-delta ' + deltaCls + '">' + esc(deltaText) + '</span>' +
          '</div>' +
          '<div class="ill-bars">' +
            '<div class="ill-bar-line">' +
              '<span>' + esc(I18N.illProcBar) + '</span>' +
              '<div class="ill-track"><div class="ill-fill-proc" style="width:' + Math.max(2, procPct).toFixed(1) + '%"></div></div>' +
              '<span class="ill-pct">' + esc(fmtPct(procPct)) + '</span>' +
            '</div>' +
            '<div class="ill-bar-line">' +
              '<span>' + esc(I18N.illPlnBar) + '</span>' +
              '<div class="ill-track"><div class="ill-fill-pln" style="width:' + Math.max(2, plnPct).toFixed(1) + '%"></div></div>' +
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
      var sum = sumAmounts(ys);
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

    var illFigParent = figIllusion.closest ? figIllusion.closest('.lab-figure') : null;
    var illLeg = illFigParent ? illFigParent.querySelector('.lab-fig-legend') : null;
    if (illLeg && !illLeg.querySelector('.ill-legend-scale')) {
      var scaleSpan = document.createElement('span');
      scaleSpan.className = 'ill-legend-scale';
      scaleSpan.innerHTML = '<i class="ill-legend-mid" aria-hidden="true"></i> ' + esc(I18N.illScaleHint);
      illLeg.appendChild(scaleSpan);
    }

    figIllusion.innerHTML =
      '<div class="ill-rows">' + rowsHtml + '</div>' +
      '<div class="ill-years">' + yearsHtml + '</div>';
    bindPresetLinks(figIllusion);
  }

  /* ---------- Inline Editorial Figure 2: Dual-View Competition Graphic ---------- */
  function renderCompetitionFigure() {
    if (!figComp || !DATA.length) return;
    var core = DATA.filter(function (r) { return r.category !== 'incidental'; });
    var signedCore = core.filter(function (r) { return r.status === 'resolved' && r.amountPln != null; });
    var pts = signedCore.filter(function (r) { return r.bids != null && r.bids >= 1; }).slice();
    if (!pts.length || !signedCore.length) return;

    var figParent = figComp.closest ? figComp.closest('.lab-figure') : null;
    if (figParent) figParent.classList.add('has-comp-mounted');

    pts.sort(function (a, b) { return a.amountPln - b.amountPln; });

    /* --- 1. View 1 Metrics: All 110 Signed Core Contracts & 170k PLN Cliff --- */
    var totalCorePln = sumAmounts(signedCore) || 1;
    var tier1List = signedCore.filter(function (r) { return r.bids === 1; });
    var tierSoleList = signedCore.filter(function (r) { return r.bids == null; });
    var tier23List = signedCore.filter(function (r) { return r.bids != null && r.bids >= 2 && r.bids <= 3; });
    var tier4pList = signedCore.filter(function (r) { return r.bids != null && r.bids >= 4; });

    var maxBidsVal = 4;
    pts.forEach(function (r) { if (r.bids > maxBidsVal) maxBidsVal = r.bids; });

    var tier1Sum = sumAmounts(tier1List);
    var tierSoleSum = sumAmounts(tierSoleList);
    var tier23Sum = sumAmounts(tier23List);
    var tier4pSum = sumAmounts(tier4pList);

    var zrCount = tier1List.length + tierSoleList.length;
    var zrSum = tier1Sum + tierSoleSum;
    var zrPlnPct = (zrSum / totalCorePln) * 100;
    var crPlnPct = (tier4pSum / totalCorePln) * 100;

    var maxBidsNoun = lang === 'pl' ? fmtPlNoun(maxBidsVal, 'oferta', 'oferty', 'ofert') : 'bids';
    var zrLocativeNoun = lang === 'pl' ? (zrCount === 1 ? 'umowie' : 'umowach') : (zrCount === 1 ? 'award' : 'awards');

    var calloutHeadlineHtml = I18N.compCalloutHtmlTpl
      .replace('{zrPct}', esc(fmtPct(zrPlnPct)))
      .replace('{zrSum}', esc(fmtPlnCompact(zrSum)))
      .replace('{zrCnt}', esc(zrCount))
      .replace('{zrGen}', esc(zrLocativeNoun))
      .replace('{crCnt}', esc(tier4pList.length))
      .replace('{maxBids}', esc(maxBidsVal))
      .replace('{maxBidsNoun}', esc(maxBidsNoun))
      .replace('{crSum}', esc(fmtPlnCompact(tier4pSum)))
      .replace('{crPct}', esc(fmtPct(crPlnPct)));

    var tiers = [
      {
        key: 'b1',
        color: '#98513c',
        title: I18N.compTier1Title,
        count: tier1List.length,
        sum: tier1Sum,
        plnPct: (tier1Sum / totalCorePln) * 100,
        cntPct: (tier1List.length / signedCore.length) * 100,
        preset: 'status=resolved&single=1'
      },
      {
        key: 'sole',
        color: '#7d601d',
        title: I18N.compTier2Title,
        count: tierSoleList.length,
        sum: tierSoleSum,
        plnPct: (tierSoleSum / totalCorePln) * 100,
        cntPct: (tierSoleList.length / signedCore.length) * 100,
        preset: 'status=resolved&sole=1'
      },
      {
        key: 'b23',
        color: '#2d546b',
        title: I18N.compTier3Title,
        count: tier23List.length,
        sum: tier23Sum,
        plnPct: (tier23Sum / totalCorePln) * 100,
        cntPct: (tier23List.length / signedCore.length) * 100,
        preset: 'status=resolved&btier=2-3'
      },
      {
        key: 'b4p',
        color: '#4a6b53',
        title: I18N.compTier4TitleTpl.replace('{max}', maxBidsVal).replace('{noun}', maxBidsNoun),
        count: tier4pList.length,
        sum: tier4pSum,
        plnPct: (tier4pSum / totalCorePln) * 100,
        cntPct: (tier4pList.length / signedCore.length) * 100,
        preset: 'status=resolved&btier=4p&sort=bids_desc'
      }
    ];

    var moneyBarHtml = tiers.map(function (t) {
      var wPct = Math.max(0.5, t.plnPct).toFixed(2);
      var showInline = t.plnPct >= 10;
      return (
        '<button type="button" class="comp-money-seg" data-bzp-preset="' + esc(t.preset) + '" style="width:' + wPct + '%;background:' + t.color + '" title="' + esc(t.title + ': ' + fmtPlnCompact(t.sum) + ' (' + fmtPct(t.plnPct) + ') · ' + fmtContractsCount(t.count)) + '">' +
          (showInline ? '<span>' + esc(fmtPct(t.plnPct)) + '</span>' : '') +
        '</button>'
      );
    }).join('');

    var tierCardsHtml = tiers.map(function (t) {
      var cntLabel = I18N.compTierSubTpl
        .replace('{cnt}', fmtContractsCount(t.count))
        .replace('{cntPct}', fmtPct(t.cntPct));
      return (
        '<button type="button" class="comp-tier-card" data-bzp-preset="' + esc(t.preset) + '">' +
          '<div class="comp-tier-head">' +
            '<span class="comp-tier-swatch" style="background:' + t.color + '"></span>' +
            '<span class="comp-tier-name">' + esc(t.title) + '</span>' +
          '</div>' +
          '<div class="comp-tier-main">' +
            '<strong>' + esc(fmtPlnCompact(t.sum)) + '</strong>' +
            '<span class="comp-tier-pct" style="color:' + t.color + '">' + esc(I18N.compOfSpendTpl.replace('{pct}', fmtPct(t.plnPct))) + '</span>' +
          '</div>' +
          '<div class="comp-tier-foot">' +
            '<span>' + esc(cntLabel) + '</span>' +
            '<span class="comp-click-hint">' + esc(I18N.compFilterCue) + '</span>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    /* Left Panel: 170k PLN Cliff across 4 brackets (n = 104 competitive) */
    var compTotalPln = sumAmounts(pts) || 1;
    var lt170 = pts.filter(function (r) { return r.amountPln < 170000; });
    var ge170 = pts.filter(function (r) { return r.amountPln >= 170000; });
    var lt170Single = lt170.filter(function (r) { return r.bids === 1; }).length;
    var ge170Single = ge170.filter(function (r) { return r.bids === 1; }).length;
    var lt170Med = calcMedian(lt170.map(function (r) { return r.bids; }));
    var ge170Med = calcMedian(ge170.map(function (r) { return r.bids; }));
    var lt170PlnPct = (sumAmounts(lt170) / compTotalPln) * 100;
    var ge170PlnPct = (sumAmounts(ge170) / compTotalPln) * 100;
    var lt170SinglePct = lt170.length ? (lt170Single / lt170.length) * 100 : 0;
    var ge170SinglePct = ge170.length ? (ge170Single / ge170.length) * 100 : 0;

    var cliffBannerHtml =
      '<div class="comp-cliff-banner">' +
        '<div class="comp-cliff-line is-above">' +
          esc(I18N.compCliffAboveTpl
            .replace('{cnt}', fmtContractsCount(lt170.length))
            .replace('{plnPct}', fmtPct(lt170PlnPct))
            .replace('{med}', fmtMedianBids(lt170Med))
            .replace('{sPct}', fmtPct(lt170SinglePct))) +
        '</div>' +
        '<div class="comp-cliff-line is-below">' +
          esc(I18N.compCliffBelowTpl
            .replace('{cnt}', fmtContractsCount(ge170.length))
            .replace('{plnPct}', fmtPct(ge170PlnPct))
            .replace('{med}', fmtMedianBids(ge170Med))
            .replace('{sPct}', fmtPct(ge170SinglePct))) +
        '</div>' +
      '</div>';

    var bracketDefs = [
      { label: I18N.compBr1, rows: pts.filter(function (r) { return r.amountPln < 50000; }) },
      { label: I18N.compBr2, rows: pts.filter(function (r) { return r.amountPln >= 50000 && r.amountPln < 170000; }), afterHtml: cliffBannerHtml },
      { label: I18N.compBr3, rows: pts.filter(function (r) { return r.amountPln >= 170000 && r.amountPln < 500000; }) },
      { label: I18N.compBr4, rows: pts.filter(function (r) { return r.amountPln >= 500000; }) }
    ];

    var bracketsHtml = bracketDefs.map(function (br) {
      var n = br.rows.length || 1;
      var c1 = br.rows.filter(function (r) { return r.bids === 1; }).length;
      var c23 = br.rows.filter(function (r) { return r.bids >= 2 && r.bids <= 3; }).length;
      var c4 = br.rows.filter(function (r) { return r.bids >= 4; }).length;
      var bSum = sumAmounts(br.rows);
      var bMed = calcMedian(br.rows.map(function (r) { return r.bids; }));
      var p1 = (c1 / n) * 100;
      var p23 = (c23 / n) * 100;
      var p4 = (c4 / n) * 100;
      var isHighSingle = p1 >= 50;
      return (
        '<div class="comp-bracket-row">' +
          '<div class="comp-row-top">' +
            '<strong>' + esc(br.label) + '</strong>' +
            '<span class="comp-row-sum">' + esc(fmtContractsCount(br.rows.length) + ' · ' + fmtPlnCompact(bSum)) + '</span>' +
          '</div>' +
          '<div class="comp-stack-track" title="' + esc('1: ' + c1 + ' · 2–3: ' + c23 + ' · 4+: ' + c4) + '">' +
            (c1 > 0 ? '<i style="width:' + p1.toFixed(1) + '%;background:#98513c"></i>' : '') +
            (c23 > 0 ? '<i style="width:' + p23.toFixed(1) + '%;background:#2d546b"></i>' : '') +
            (c4 > 0 ? '<i style="width:' + p4.toFixed(1) + '%;background:#4a6b53"></i>' : '') +
          '</div>' +
          '<div class="comp-row-foot">' +
            '<span class="comp-row-stat' + (isHighSingle ? ' is-rust' : '') + '">' + esc(I18N.compSingleShareTpl.replace('{pct}', fmtPct(p1)) + ' (' + c1 + '/' + br.rows.length + ')') + '</span>' +
            '<span class="comp-med-pill' + (bMed <= 1 ? ' is-alert' : '') + '">' + esc(I18N.compMedPillTpl.replace('{m}', fmtMedianBidsNum(bMed))) + '</span>' +
          '</div>' +
        '</div>' +
        (br.afterHtml || '')
      );
    }).join('');

    /* Right Panel: Competition by Category across all 110 signed core contracts */
    var catOrder = ['software_deploy', 'hardware_lab', 'consulting', 'training'];
    var catRowsHtml = catOrder.map(function (ck) {
      var cs = signedCore.filter(function (r) { return r.category === ck; });
      var n = cs.length || 1;
      var cSum = sumAmounts(cs) || 1;
      var cSole = cs.filter(function (r) { return r.bids == null; });
      var c1 = cs.filter(function (r) { return r.bids === 1; });
      var c23 = cs.filter(function (r) { return r.bids != null && r.bids >= 2 && r.bids <= 3; });
      var c4 = cs.filter(function (r) { return r.bids != null && r.bids >= 4; });
      var cComp = cs.filter(function (r) { return r.bids != null && r.bids >= 1; });
      var cMed = calcMedian(cComp.map(function (r) { return r.bids; }));
      var zrCnt = cSole.length + c1.length;
      var zrPln = sumAmounts(cSole) + sumAmounts(c1);
      var zrCntPct = (zrCnt / n) * 100;
      var zrValPct = (zrPln / cSum) * 100;

      var footLeft = ck === 'training'
        ? I18N.compCatTrainTpl
            .replace('{cntPct}', fmtPct(zrCntPct))
            .replace('{plnPct}', fmtPct(zrValPct))
            .replace('{c4}', c4.length)
            .replace('{tot}', cs.length)
            .replace('{c4Pct}', fmtPct((c4.length / n) * 100))
        : I18N.compCatZeroTpl
            .replace('{zr}', zrCnt)
            .replace('{tot}', cs.length)
            .replace('{cntPct}', fmtPct(zrCntPct))
            .replace('{plnPct}', fmtPct(zrValPct));

      return (
        '<button type="button" class="comp-cat-btn" data-bzp-preset="cat=' + esc(ck) + '">' +
          '<div class="comp-row-top">' +
            '<span class="comp-cat-label"><i style="background:' + (CAT_COLORS[ck] || '#68655f') + '"></i><strong>' + esc(I18N.cats[ck]) + '</strong></span>' +
            '<span class="comp-row-sum">' + esc(fmtPlnCompact(cSum) + ' · ' + fmtContractsCount(cs.length)) + '</span>' +
          '</div>' +
          '<div class="comp-stack-track">' +
            (c1.length > 0 ? '<i style="width:' + ((c1.length / n) * 100).toFixed(1) + '%;background:#98513c"></i>' : '') +
            (cSole.length > 0 ? '<i style="width:' + ((cSole.length / n) * 100).toFixed(1) + '%;background:#7d601d"></i>' : '') +
            (c23.length > 0 ? '<i style="width:' + ((c23.length / n) * 100).toFixed(1) + '%;background:#2d546b"></i>' : '') +
            (c4.length > 0 ? '<i style="width:' + ((c4.length / n) * 100).toFixed(1) + '%;background:#4a6b53"></i>' : '') +
          '</div>' +
          '<div class="comp-row-foot">' +
            '<span class="comp-row-stat' + (zrValPct >= 50 ? ' is-rust' : '') + '">' + esc(footLeft) + '</span>' +
            '<span class="comp-med-pill' + (cMed <= 1 ? ' is-alert' : '') + '">' + esc(I18N.compMedPillTpl.replace('{m}', fmtMedianBids(cMed))) + '</span>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    var view1Html =
      '<div class="comp-split-sec-a">' +
        '<div class="comp-sec-head">' +
          '<span class="comp-sec-title">' + esc(I18N.compSecATitleTpl.replace('{sum}', fmtPlnCompact(totalCorePln)).replace('{n}', signedCore.length)) + '</span>' +
          '<span class="comp-click-hint">' + esc(I18N.compSecAHint) + '</span>' +
        '</div>' +
        '<div class="comp-split-callout">' +
          '<span class="comp-zero-badge">' + esc(I18N.compZeroBadgeTpl.replace('{pct}', fmtPct(zrPlnPct))) + '</span>' +
          '<p class="comp-callout-copy">' + calloutHeadlineHtml + '</p>' +
        '</div>' +
        '<div class="comp-money-bar" role="group" aria-label="' + esc(I18N.compSecATitleTpl.replace('{sum}', fmtPlnCompact(totalCorePln)).replace('{n}', signedCore.length)) + '">' +
          moneyBarHtml +
        '</div>' +
        '<div class="comp-tier-grid">' + tierCardsHtml + '</div>' +
        '<div class="comp-forensic-note">' + I18N.compForensicNoteHtml + '</div>' +
      '</div>' +
      '<div class="comp-diag-grid">' +
        '<div class="comp-diag-panel">' +
          '<div class="comp-diag-head">' +
            '<h4>' + esc(I18N.compCliffTitleTpl.replace('{n}', pts.length)) + '</h4>' +
            '<p>' + esc(I18N.compCliffSub) + '</p>' +
            '<div class="comp-mini-legend">' +
              '<span><i style="background:#98513c"></i>' + esc(I18N.compLeg1) + '</span>' +
              '<span><i style="background:#2d546b"></i>' + esc(I18N.compLeg23) + '</span>' +
              '<span><i style="background:#4a6b53"></i>' + esc(I18N.compLeg4p) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="comp-bracket-list">' + bracketsHtml + '</div>' +
        '</div>' +
        '<div class="comp-diag-panel">' +
          '<div class="comp-diag-head">' +
            '<h4>' + esc(I18N.compCatTitleTpl.replace('{n}', signedCore.length)) + '</h4>' +
            '<p>' + esc(I18N.compCatSub) + '</p>' +
            '<div class="comp-mini-legend">' +
              '<span><i style="background:#98513c"></i>' + esc(I18N.compLeg1) + '</span>' +
              '<span><i style="background:#7d601d"></i>' + esc(I18N.compLegSole) + '</span>' +
              '<span><i style="background:#2d546b"></i>' + esc(I18N.compLeg23) + '</span>' +
              '<span><i style="background:#4a6b53"></i>' + esc(I18N.compLeg4p) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="comp-cat-list">' + catRowsHtml + '</div>' +
        '</div>' +
      '</div>';

    /* --- 2. View 2 Metrics & Self-Contained Crystal-Clear SVG Scatter --- */
    var isCompactSvg = window.innerWidth <= 639;
    var W = isCompactSvg ? 500 : 700;
    var H = isCompactSvg ? 384 : 436;
    var padL = isCompactSvg ? 40 : 46;
    var padR = 16;
    var padT = isCompactSvg ? 44 : 46;
    var padB = isCompactSvg ? 44 : 46;
    var plotW = W - padL - padR;
    var plotBottom = H - padB + 6;

    var minLog = Math.log10(1400);
    var maxLog = Math.log10(6000000);
    function xOf(amt) {
      var cl = Math.max(1400, Math.min(6000000, amt));
      return padL + ((Math.log10(cl) - minLog) / (maxLog - minLog)) * plotW;
    }

    var yTop = isCompactSvg ? 74 : 94;
    var yTwo = isCompactSvg ? 248 : 302;
    var singleBandTop = isCompactSvg ? 268 : 336;
    var yOne = isCompactSvg ? 330 : 374;

    function yBase(bids) {
      if (bids <= 1) return yOne;
      var t = (Math.sqrt(Math.min(24, bids)) - Math.sqrt(2)) / (Math.sqrt(24) - Math.sqrt(2));
      return yTwo - t * (yTwo - yTop);
    }

    /* Deterministic upward-only stacking for bids === 1 in narrow log10 buckets (~0.085) */
    var cliffLog = Math.log10(170000);
    var b1Buckets = {};
    pts.forEach(function (r, idx) {
      if (r.bids === 1) {
        var bk = Math.floor((Math.log10(Math.max(1400, r.amountPln)) - cliffLog) / 0.085);
        if (!b1Buckets[bk]) b1Buckets[bk] = [];
        b1Buckets[bk].push(idx);
      }
    });
    Object.keys(b1Buckets).forEach(function (bk) {
      b1Buckets[bk].sort(function (ia, ib) {
        var aCzd = (pts[ia].bzp && pts[ia].bzp.indexOf('00137744') !== -1) ? 1 : 0;
        var bCzd = (pts[ib].bzp && pts[ib].bzp.indexOf('00137744') !== -1) ? 1 : 0;
        if (aCzd !== bCzd) return aCzd - bCzd;
        return pts[ia].amountPln - pts[ib].amountPln;
      });
    });
    var b1Offsets = {};
    var rowStep = isCompactSvg ? 7.6 : 7.2;
    Object.keys(b1Buckets).forEach(function (bk) {
      var arr = b1Buckets[bk];
      arr.forEach(function (ptIdx, k) {
        var row = k % 3;
        var subCol = Math.floor(k / 3);
        var dy = -row * rowStep; // Strictly <= 0: never below yPos(1)!
        var dx = arr.length > 3 ? (subCol === 0 ? -2.0 : 2.6) : 0;
        b1Offsets[ptIdx] = { dx: dx, dy: dy };
      });
    });

    var ge2Buckets = {};
    var plotted = pts.map(function (r, idx) {
      var cx = xOf(r.amountPln);
      var cy = yBase(r.bids);
      if (r.bids === 1) {
        var off = b1Offsets[idx] || { dx: 0, dy: 0 };
        cx += off.dx;
        cy += off.dy;
      } else {
        var gk = r.bids + ':' + Math.floor((Math.log10(Math.max(1400, r.amountPln)) - minLog) / 0.06);
        var seen = ge2Buckets[gk] || 0;
        ge2Buckets[gk] = seen + 1;
        if (seen > 0) {
          cy += (seen % 2 === 1 ? -1.8 : 1.8);
        }
      }
      return { r: r, cx: cx, cy: cy, idx: idx };
    });

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

    /* Self-contained SVG Top Header & Category Legend Strip */
    var svgLegendDefs = isCompactSvg
      ? [
          { x: 16, col: CAT_COLORS.software_deploy, lbl: I18N.svgCatSoft },
          { x: 146, col: CAT_COLORS.hardware_lab, lbl: I18N.svgCatHard },
          { x: 288, col: CAT_COLORS.training, lbl: I18N.svgCatTrain },
          { x: 398, col: CAT_COLORS.consulting, lbl: I18N.svgCatCons }
        ]
      : [
          { x: 158, col: CAT_COLORS.software_deploy, lbl: I18N.svgCatSoft },
          { x: 286, col: CAT_COLORS.hardware_lab, lbl: I18N.svgCatHard },
          { x: 422, col: CAT_COLORS.training, lbl: I18N.svgCatTrain },
          { x: 530, col: CAT_COLORS.consulting, lbl: I18N.svgCatCons }
        ];

    var svgHeaderHtml =
      '<rect x="0" y="0" width="' + W + '" height="34" fill="#f3f1ea"/>' +
      '<line x1="0" y1="34" x2="' + W + '" y2="34" stroke="#dcd7cc"/>' +
      (!isCompactSvg
        ? '<text x="12" y="21" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.5" font-weight="700" letter-spacing="0.04em" fill="#68655f">' + esc(I18N.svgCatKickerTpl.replace('{n}', plotted.length)) + '</text>'
        : '') +
      svgLegendDefs.map(function (it) {
        return (
          '<circle cx="' + it.x + '" cy="17.5" r="' + (isCompactSvg ? '5.1' : '4.8') + '" fill="' + it.col + '" stroke="#fbfaf6" stroke-width="1"/>' +
          '<text x="' + (it.x + 9) + '" y="21" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="' + (isCompactSvg ? '11.5' : '10.5') + '" font-weight="600" fill="#2b2926">' + esc(it.lbl) + '</text>'
        );
      }).join('');

    /* 170k PLN Cliff Line & Two Named Background Zones */
    var xCliff = xOf(170000);
    var leftZoneW = Math.max(0, xCliff - padL);
    var rightZoneW = Math.max(0, (W - padR) - xCliff);
    var upperZoneH = singleBandTop - padT;
    var singleZoneHeight = plotBottom - singleBandTop;

    var ltSingleRound = Math.round(lt170SinglePct) + '%';
    var geSingleRound = Math.round(ge170SinglePct) + '%';
    var gePlnRound = Math.round(ge170PlnPct) + '%';

    var zonesSvg =
      '<rect x="' + padL + '" y="' + padT + '" width="' + leftZoneW.toFixed(1) + '" height="' + upperZoneH.toFixed(1) + '" fill="rgba(74,107,83,0.045)"/>' +
      '<rect x="' + xCliff.toFixed(1) + '" y="' + padT + '" width="' + rightZoneW.toFixed(1) + '" height="' + upperZoneH.toFixed(1) + '" fill="rgba(152,81,60,0.055)"/>' +
      '<rect x="' + padL + '" y="' + singleBandTop.toFixed(1) + '" width="' + leftZoneW.toFixed(1) + '" height="' + singleZoneHeight.toFixed(1) + '" fill="rgba(152,81,60,0.075)"/>' +
      '<rect x="' + xCliff.toFixed(1) + '" y="' + singleBandTop.toFixed(1) + '" width="' + rightZoneW.toFixed(1) + '" height="' + singleZoneHeight.toFixed(1) + '" fill="rgba(152,81,60,0.125)"/>' +
      '<line x1="' + padL + '" y1="' + singleBandTop.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + singleBandTop.toFixed(1) + '" stroke="#d4b5ab" stroke-dasharray="3,3"/>';

    var zoneHeadersSvg = isCompactSvg
      ? (
          '<text x="' + (padL + 6) + '" y="' + (padT + 15) + '" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="10.9" font-weight="700" fill="#3b5943">' +
            esc(I18N.svgZoneLeftMobTpl.replace('{medNum}', fmtMedianBidsNum(lt170Med)).replace('{pct}', ltSingleRound)) +
          '</text>' +
          '<text x="' + (xCliff + 5).toFixed(1) + '" y="' + (padT + 15) + '" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="10.9" font-weight="700" fill="#98513c">' +
            esc(I18N.svgZoneRightMobTpl.replace('{plnPct}', gePlnRound).replace('{medNum}', fmtMedianBidsNum(ge170Med)).replace('{pct}', geSingleRound)) +
          '</text>'
        )
      : (
          '<text x="' + (padL + 8) + '" y="' + (padT + 14) + '" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.02em" fill="#3b5943">' +
            esc(I18N.svgZoneLeft1Tpl.replace('{cnt}', fmtContractsCount(lt170.length))) +
          '</text>' +
          '<text x="' + (padL + 8) + '" y="' + (padT + 27) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="8.9" fill="#514e49">' +
            esc(I18N.svgZoneLeft2Tpl.replace('{med}', fmtMedianBids(lt170Med)).replace('{pct}', ltSingleRound)) +
          '</text>' +
          '<text x="' + (xCliff + 8).toFixed(1) + '" y="' + (padT + 14) + '" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.02em" fill="#98513c">' +
            esc(I18N.svgZoneRight1Tpl.replace('{plnPct}', fmtPct(ge170PlnPct)).replace('{cnt}', fmtContractsCount(ge170.length))) +
          '</text>' +
          '<text x="' + (xCliff + 8).toFixed(1) + '" y="' + (padT + 27) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="8.9" fill="#6e3a2a">' +
            esc(I18N.svgZoneRight2Tpl.replace('{med}', fmtMedianBids(ge170Med)).replace('{pct}', geSingleRound)) +
          '</text>'
        );

    var xTicks = [
      { v: 2000, pl: '2 tys.', en: '2k' },
      { v: 10000, pl: '10 tys.', en: '10k' },
      { v: 50000, pl: '50 tys.', en: '50k' },
      { v: 170000, pl: '170 tys.', en: '170k', isCliff: true },
      { v: 1000000, pl: '1 mln', en: '1M' },
      { v: 5000000, pl: isCompactSvg ? '5 mln' : '5 mln zł', en: isCompactSvg ? '5M' : '5M PLN' }
    ];
    var yTicks = [1, 2, 3, 5, 10, 15, 23];

    var gridSvg = '';
    xTicks.forEach(function (tk) {
      var x = xOf(tk.v).toFixed(1);
      if (tk.isCliff) {
        gridSvg +=
          '<line x1="' + x + '" y1="' + padT + '" x2="' + x + '" y2="' + plotBottom + '" stroke="#98513c" stroke-width="1.35" stroke-dasharray="4,3"/>' +
          '<text class="comp-tick" x="' + x + '" y="' + (plotBottom + 15) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" font-weight="700" fill="#98513c">' + esc(tk[lang]) + '</text>';
      } else {
        gridSvg +=
          '<line x1="' + x + '" y1="' + (isCompactSvg ? padT + 22 : padT + 34) + '" x2="' + x + '" y2="' + plotBottom + '" stroke="#e3dfd6" stroke-dasharray="2,3"/>' +
          '<text class="comp-tick" x="' + x + '" y="' + (plotBottom + 15) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" fill="#68655f">' + esc(tk[lang]) + '</text>';
      }
    });
    yTicks.forEach(function (yv) {
      var y = yBase(yv).toFixed(1);
      gridSvg +=
        '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + (yv === 1 ? '#cfa89c' : '#e6e2d9') + '"/>' +
        '<text class="comp-tick" x="' + (padL - 8) + '" y="' + (Number(y) + 3.5) + '" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="10" font-weight="' + (yv === 1 ? '700' : '400') + '" fill="' + (yv === 1 ? '#98513c' : '#68655f') + '">' + yv + '</text>';
    });
    var bx = padL - 6;
    var by = isCompactSvg ? 288 : 332;
    gridSvg +=
      '<g class="comp-axis-break" aria-hidden="true" stroke="#8a847a" stroke-width="1.25" stroke-linecap="round">' +
        '<line x1="' + (bx - 3.5).toFixed(1) + '" y1="' + (by + 1.5).toFixed(1) + '" x2="' + (bx + 2.5).toFixed(1) + '" y2="' + (by - 4.5).toFixed(1) + '"/>' +
        '<line x1="' + (bx - 3.5).toFixed(1) + '" y1="' + (by + 5.5).toFixed(1) + '" x2="' + (bx + 2.5).toFixed(1) + '" y2="' + (by - 0.5).toFixed(1) + '"/>' +
      '</g>';

    function findPoint(bzpSub) {
      for (var i = 0; i < plotted.length; i++) {
        if (plotted[i].r.bzp && plotted[i].r.bzp.indexOf(bzpSub) !== -1) return plotted[i];
      }
      return null;
    }

    /* Dynamic selection of 4 landmark contracts */
    var pTopBids = findPoint('00465518');
    if (!pTopBids) {
      plotted.forEach(function (pt) {
        if (pt.r.category === 'training') {
          if (!pTopBids || pt.r.bids > pTopBids.r.bids || (pt.r.bids === pTopBids.r.bids && pt.r.amountPln < pTopBids.r.amountPln)) {
            pTopBids = pt;
          }
        }
      });
    }
    var pAsp = findPoint('00450838');
    var pAspIsSpecific = Boolean(pAsp);
    if (!pAsp) {
      var softMulti = plotted.filter(function (pt) { return pt.r.category === 'software_deploy' && pt.r.bids >= 5; });
      if (softMulti.length) {
        softMulti.sort(function (a, b) { return b.r.bids - a.r.bids; });
        pAsp = softMulti[0];
      }
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
      ? I18N.compPin1Tpl.replace('{bids}', fmtBids(pTopBids.r.bids)).replace('{amt}', fmtPlnMedian(pTopBids.r.amountPln))
      : '';
    var pinAspLabel = pAsp
      ? (pAspIsSpecific ? I18N.compPinAspTpl : I18N.compPinGenericTpl.replace('{org}', pAsp.r.city || pAsp.r.org))
          .replace('{bids}', fmtBids(pAsp.r.bids))
          .replace('{amt}', fmtPlnCompact(pAsp.r.amountPln))
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
      return '<circle class="comp-dot" data-idx="' + idx + '" cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="5.3" fill="' + col + '" fill-opacity="0.88" stroke="#fbfaf6" stroke-width="1.15"><title>' + esc(pt.r.org + ' — ' + fmtPlnExact(pt.r.amountPln) + ' (' + fmtBids(pt.r.bids) + ')') + '</title></circle>';
    }).join('');

    /* Compact pill callout boxes (<rect rx="3">) placed close to dots (max 10–23px connector) */
    function renderCalloutPill(pt, label, strokeCol, textCol, opts) {
      if (!pt || !label) return '';
      var pillH = 18;
      var pillW = Math.round(label.length * 4.55 + 14);
      var boxX = opts.alignRight ? (opts.maxX - pillW) : Math.round(pt.cx - pillW / 2);
      if (opts.minX != null && boxX < opts.minX) boxX = opts.minX;
      if (opts.maxX != null && boxX + pillW > opts.maxX) boxX = opts.maxX - pillW;
      var boxY = opts.boxY;
      var anchorX = Math.max(boxX + 8, Math.min(boxX + pillW - 8, pt.cx));
      var lineY1 = boxY > pt.cy ? (pt.cy + 6) : (pt.cy - 6);
      var lineY2 = boxY > pt.cy ? boxY : (boxY + pillH);
      return (
        '<g class="comp-ann" data-pin-idx="' + pt.idx + '">' +
          '<circle cx="' + pt.cx.toFixed(1) + '" cy="' + pt.cy.toFixed(1) + '" r="7.4" fill="none" stroke="' + strokeCol + '" stroke-width="1.1" stroke-opacity="0.55"/>' +
          '<line x1="' + pt.cx.toFixed(1) + '" y1="' + lineY1.toFixed(1) + '" x2="' + anchorX.toFixed(1) + '" y2="' + lineY2.toFixed(1) + '" stroke="' + strokeCol + '" stroke-width="1.2"/>' +
          '<rect x="' + boxX.toFixed(1) + '" y="' + boxY.toFixed(1) + '" width="' + pillW + '" height="' + pillH + '" rx="3" fill="#fffdf8" fill-opacity="0.95" stroke="' + strokeCol + '" stroke-width="1"/>' +
          '<text x="' + (boxX + pillW / 2).toFixed(1) + '" y="' + (boxY + 12.4).toFixed(1) + '" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif" font-size="9.5" font-weight="600" fill="' + textCol + '">' + esc(label) + '</text>' +
        '</g>'
      );
    }

    var annSvg = '';
    if (!isCompactSvg) {
      if (pTopBids) {
        annSvg += renderCalloutPill(pTopBids, pin1Label, '#7d601d', '#5e4915', {
          boxY: Math.round(pTopBids.cy + 15),
          minX: padL + 8,
          maxX: Math.round(xCliff - 8)
        });
      }
      if (pAsp && pAsp !== pTopBids) {
        annSvg += renderCalloutPill(pAsp, pinAspLabel, '#98513c', '#7a3b29', {
          boxY: Math.round(pAsp.cy + 15),
          minX: 238,
          maxX: Math.round(xCliff - 5)
        });
      }
      if (pCzd && pCzd !== pTopBids && pCzd !== pAsp) {
        annSvg += renderCalloutPill(pCzd, pin2Label, '#98513c', '#7a3b29', {
          boxY: singleBandTop - 19,
          minX: Math.round(xCliff + 10),
          maxX: W - padR - 6
        });
      }
      if (pUjd && pUjd !== pCzd && pUjd !== pTopBids && pUjd !== pAsp) {
        annSvg += renderCalloutPill(pUjd, pin3Label, '#2d546b', '#224255', {
          boxY: Math.round(pUjd.cy - 36),
          minX: 528,
          maxX: W - 6,
          alignRight: true
        });
      }
    }

    var mobilePins = [];
    if (pTopBids) mobilePins.push({ idx: pTopBids.idx, label: pin1Label, color: CAT_COLORS[pTopBids.r.category] || '#7d601d' });
    if (pAsp && pAsp !== pTopBids) mobilePins.push({ idx: pAsp.idx, label: pinAspLabel, color: CAT_COLORS[pAsp.r.category] || '#98513c' });
    if (pCzd && pCzd !== pTopBids && pCzd !== pAsp) mobilePins.push({ idx: pCzd.idx, label: pin2Label, color: CAT_COLORS[pCzd.r.category] || '#98513c' });
    if (pUjd && pUjd !== pCzd && pUjd !== pTopBids && pUjd !== pAsp) mobilePins.push({ idx: pUjd.idx, label: pin3Label, color: CAT_COLORS[pUjd.r.category] || '#2d546b' });

    var mobilePinsHtml = mobilePins.length
      ? '<div class="comp-pins-mobile comp-mobile-pins">' +
          '<span class="comp-pins-title">' + esc(I18N.compPinsHeading) + '</span>' +
          mobilePins.map(function (mp) {
            return '<button type="button" class="comp-pin-btn" data-pin-select="' + mp.idx + '"><i style="background:' + mp.color + '"></i><span>' + esc(mp.label) + '</span></button>';
          }).join('') +
        '</div>'
      : '';

    var plotMidY = ((padT + plotBottom) / 2).toFixed(1);

    var view2Html =
      '<div class="comp-toolbar">' +
        '<button type="button" class="bzp-pill' + (compFilter === 'all' ? ' is-active' : '') + '" data-cfilter="all">' + esc(I18N.compAll.replace('{n}', plotted.length)) + '</button>' +
        '<button type="button" class="bzp-pill' + (compFilter === 'software' ? ' is-active' : '') + '" data-cfilter="software">' + esc(compSoftLabel) + '</button>' +
        '<button type="button" class="bzp-pill' + (compFilter === 'health' ? ' is-active' : '') + '" data-cfilter="health">' + esc(I18N.compHealth) + '</button>' +
        '<button type="button" class="bzp-pill' + (compFilter === 'training' ? ' is-active' : '') + '" data-cfilter="training">' + esc(I18N.compTrain) + '</button>' +
      '</div>' +
      '<div class="comp-layout">' +
        '<div class="comp-stage-col">' +
          '<div class="comp-stage">' +
            '<svg class="comp-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(I18N.compAxisX) + '">' +
              svgHeaderHtml +
              zonesSvg +
              gridSvg +
              zoneHeadersSvg +
              '<text class="comp-zone-label comp-zone-full" x="' + (padL + 8) + '" y="' + (singleBandTop + 12.5).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="9.1" font-weight="700" fill="#98513c" paint-order="stroke" stroke="#f7f2ee" stroke-width="2.5">' + esc(compZoneFull) + '</text>' +
              '<text class="comp-zone-label comp-zone-short" x="' + (padL + 6) + '" y="' + (singleBandTop + 14).toFixed(1) + '" font-family="ui-monospace,SFMono-Regular,Consolas,monospace" font-size="11.5" font-weight="700" fill="#98513c">' + esc(compZoneShort) + '</text>' +
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

    /* --- 3. View 3: Primary-Source HTML Forensics (Pricing, Lock-In & 31 Failures) --- */
    var refLinePct = ((100 / 112) * 100).toFixed(2);
    var refRightPct = (100 - (100 / 112) * 100).toFixed(2);
    var priceRows = [
      {
        label: I18N.fPriceR1Label,
        val: I18N.fPriceR1Val,
        valCls: 'is-rust',
        pctWidth: ((100 / 112) * 100).toFixed(2),
        saveLeft: null,
        saveWidth: null,
        color: '#98513c',
        foot: I18N.fPriceR1Foot,
        pill: I18N.fPriceR1Pill,
        pillCls: 'is-alert'
      },
      {
        label: I18N.fPriceR2Label,
        val: I18N.fPriceR2Val,
        valCls: '',
        pctWidth: ((93.8 / 112) * 100).toFixed(2),
        saveLeft: ((93.8 / 112) * 100).toFixed(2),
        saveWidth: (((100 - 93.8) / 112) * 100).toFixed(2),
        color: '#2d546b',
        foot: I18N.fPriceR2Foot,
        pill: I18N.fPriceR2Pill,
        pillCls: ''
      },
      {
        label: I18N.fPriceR3Label,
        val: I18N.fPriceR3Val,
        valCls: 'is-sage',
        pctWidth: ((54.0 / 112) * 100).toFixed(2),
        saveLeft: ((54.0 / 112) * 100).toFixed(2),
        saveWidth: (((100 - 54.0) / 112) * 100).toFixed(2),
        color: '#4a6b53',
        foot: I18N.fPriceR3Foot,
        pill: I18N.fPriceR3Pill,
        pillCls: 'is-good'
      }
    ];

    var priceRowsHtml = priceRows.map(function (pr) {
      return (
        '<div class="comp-bracket-row comp-fprice-row">' +
          '<div class="comp-row-top">' +
            '<strong>' + esc(pr.label) + '</strong>' +
            '<span class="comp-row-sum ' + pr.valCls + '">' + esc(pr.val) + '</span>' +
          '</div>' +
          '<div class="comp-price-track">' +
            '<i class="comp-price-fill" style="width:' + pr.pctWidth + '%;background:' + pr.color + '"></i>' +
            (pr.saveWidth ? '<i class="comp-price-save" style="left:' + pr.saveLeft + '%;width:' + pr.saveWidth + '%"></i>' : '') +
            '<span class="comp-ref-line" style="left:' + refLinePct + '%"></span>' +
          '</div>' +
          '<div class="comp-row-foot">' +
            '<span class="comp-row-stat">' + esc(pr.foot) + '</span>' +
            '<span class="comp-med-pill' + (pr.pillCls ? ' ' + pr.pillCls : '') + '">' + esc(pr.pill) + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var cancelTiers = [
      { w: '45.16', pct: I18N.fCancel1Pct, cnt: I18N.fCancel1Cnt, desc: I18N.fCancel1Desc, color: '#98513c', narrow: false },
      { w: '25.81', pct: I18N.fCancel2Pct, cnt: I18N.fCancel2Cnt, desc: I18N.fCancel2Desc, color: '#7d601d', narrow: false },
      { w: '19.35', pct: I18N.fCancel3Pct, cnt: I18N.fCancel3Cnt, desc: I18N.fCancel3Desc, color: '#2d546b', narrow: false },
      { w: '9.68', pct: I18N.fCancel4Pct, cnt: I18N.fCancel4Cnt, desc: I18N.fCancel4Desc, color: '#6e685f', narrow: true }
    ];

    var view3Html =
      '<div class="comp-diag-grid comp-forensics-top">' +
        '<div class="comp-diag-panel">' +
          '<div>' +
            '<div class="comp-diag-head">' +
              '<h4>' + esc(I18N.fPriceTitle) + '</h4>' +
              '<p>' + esc(I18N.fPriceSub) + '</p>' +
            '</div>' +
            '<div class="comp-price-scale">' +
              '<span class="comp-price-s0">' + esc(I18N.fPriceScale0) + '</span>' +
              '<span class="comp-price-sref" style="right:' + refRightPct + '%">' + esc(I18N.fPriceScaleRef) + '</span>' +
            '</div>' +
            '<div class="comp-bracket-list">' + priceRowsHtml + '</div>' +
          '</div>' +
          '<div class="comp-forensic-pills">' +
            '<div class="comp-forensic-pill">' + I18N.fPricePill1Html + '</div>' +
            '<div class="comp-forensic-pill">' + I18N.fPricePill2Html + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="comp-diag-panel">' +
          '<div>' +
            '<div class="comp-diag-head">' +
              '<h4>' + esc(I18N.fLockTitle) + '</h4>' +
              '<p>' + esc(I18N.fLockSub) + '</p>' +
              '<div class="comp-mini-legend">' +
                '<span><i style="background:#98513c"></i>' + esc(I18N.fLockLegZero) + '</span>' +
                '<span><i style="background:#c9c3b8"></i>' + esc(I18N.fLockLegMulti) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="comp-bracket-list">' +
              '<div class="comp-bracket-row">' +
                '<div class="comp-row-top">' +
                  '<strong>' + esc(I18N.fLockR1Label) + '</strong>' +
                  '<span class="comp-row-sum is-rust">' + esc(I18N.fLockR1Val) + '</span>' +
                '</div>' +
                '<div class="comp-stack-track">' +
                  '<i style="width:94.1%;background:#98513c"></i>' +
                  '<i style="width:5.9%;background:#c9c3b8"></i>' +
                '</div>' +
                '<div class="comp-row-foot">' +
                  '<span class="comp-row-stat is-rust">' + esc(I18N.fLockR1Foot) + '</span>' +
                  '<span class="comp-med-pill is-alert">' + esc(I18N.fLockR1Pill) + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="comp-bracket-row">' +
                '<div class="comp-row-top">' +
                  '<strong>' + esc(I18N.fLockR2Label) + '</strong>' +
                  '<span class="comp-row-sum">' + esc(I18N.fLockR2Val) + '</span>' +
                '</div>' +
                '<div class="comp-stack-track">' +
                  '<i style="width:53.6%;background:#98513c"></i>' +
                  '<i style="width:46.4%;background:#c9c3b8"></i>' +
                '</div>' +
                '<div class="comp-row-foot">' +
                  '<span class="comp-row-stat">' + esc(I18N.fLockR2Foot) + '</span>' +
                  '<span class="comp-med-pill">' + esc(I18N.fLockR2Pill) + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="comp-forensic-pills">' +
            '<div class="comp-forensic-pill">' + I18N.fLockPillHtml + '</div>' +
            '<div class="comp-kpo-box">' +
              '<span class="comp-kpo-kicker">' + esc(I18N.fKpoKicker) + '</span>' +
              '<p class="comp-kpo-copy">' + I18N.fKpoBodyHtml + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="comp-autopsy-panel">' +
        '<div class="comp-diag-head">' +
          '<h4>' + esc(I18N.fCancelTitle) + '</h4>' +
          '<p>' + esc(I18N.fCancelSub) + '</p>' +
        '</div>' +
        '<div class="comp-autopsy-bar" role="img" aria-label="' + esc(I18N.fCancelTitle) + '">' +
          cancelTiers.map(function (ct) {
            return (
              '<div class="comp-autopsy-seg' + (ct.narrow ? ' is-narrow-seg' : '') + '" style="width:' + ct.w + '%;background:' + ct.color + '" title="' + esc(ct.pct + ' · ' + ct.cnt + ' — ' + ct.desc) + '">' +
                '<span>' + esc(ct.pct) + '</span>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="comp-autopsy-grid">' +
          cancelTiers.map(function (ct) {
            return (
              '<div class="comp-autopsy-item">' +
                '<div class="comp-autopsy-item-head">' +
                  '<span class="comp-tier-swatch" style="background:' + ct.color + '"></span>' +
                  '<strong style="color:' + (ct.color === '#98513c' ? 'var(--rust)' : 'var(--ink)') + '">' + esc(ct.pct) + '</strong>' +
                  '<span class="comp-autopsy-cnt">' + esc('(' + ct.cnt + ')') + '</span>' +
                '</div>' +
                '<p class="comp-autopsy-desc">' + esc(ct.desc) + '</p>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="comp-autopsy-foot">' +
          '<span class="comp-autopsy-note">' + esc(I18N.fCancelFootNote) + '</span>' +
          '<button type="button" class="comp-cancelled-btn" data-bzp-preset="status=cancelled">' + esc(I18N.fCancelBtn) + '</button>' +
        '</div>' +
      '</div>';

    figComp.innerHTML =
      '<div class="comp-view-bar" role="tablist" aria-label="' + esc(I18N.compTabAria) + '">' +
        '<button type="button" role="tab" id="comp-tab-split" aria-controls="comp-panel-split" aria-selected="' + (compView === 'split' ? 'true' : 'false') + '" tabindex="' + (compView === 'split' ? '0' : '-1') + '" class="comp-view-tab' + (compView === 'split' ? ' is-active' : '') + '" data-comp-view="split">' +
          '<span class="comp-view-idx">01</span>' +
          '<span>' + esc(I18N.compTab1) + '</span>' +
        '</button>' +
        '<button type="button" role="tab" id="comp-tab-map" aria-controls="comp-panel-map" aria-selected="' + (compView === 'map' ? 'true' : 'false') + '" tabindex="' + (compView === 'map' ? '0' : '-1') + '" class="comp-view-tab' + (compView === 'map' ? ' is-active' : '') + '" data-comp-view="map">' +
          '<span class="comp-view-idx">02</span>' +
          '<span>' + esc(I18N.compTab2Tpl.replace('{n}', plotted.length)) + '</span>' +
        '</button>' +
        '<button type="button" role="tab" id="comp-tab-forensics" aria-controls="comp-panel-forensics" aria-selected="' + (compView === 'forensics' ? 'true' : 'false') + '" tabindex="' + (compView === 'forensics' ? '0' : '-1') + '" class="comp-view-tab' + (compView === 'forensics' ? ' is-active' : '') + '" data-comp-view="forensics">' +
          '<span class="comp-view-idx">03</span>' +
          '<span>' + esc(I18N.compTab3) + '</span>' +
        '</button>' +
      '</div>' +
      '<div id="comp-panel-split" role="tabpanel" aria-labelledby="comp-tab-split" class="comp-panel comp-panel-split' + (compView === 'split' ? ' is-active' : '') + '">' +
        view1Html +
      '</div>' +
      '<div id="comp-panel-map" role="tabpanel" aria-labelledby="comp-tab-map" class="comp-panel comp-panel-map' + (compView === 'map' ? ' is-active' : '') + '">' +
        view2Html +
      '</div>' +
      '<div id="comp-panel-forensics" role="tabpanel" aria-labelledby="comp-tab-forensics" class="comp-panel comp-panel-forensics' + (compView === 'forensics' ? ' is-active' : '') + '">' +
        view3Html +
      '</div>';

    bindPresetLinks(figComp);

    var viewTabs = figComp.querySelectorAll('[data-comp-view]');
    var splitPanel = document.getElementById('comp-panel-split');
    var mapPanel = document.getElementById('comp-panel-map');
    var forensicsPanel = document.getElementById('comp-panel-forensics');
    var viewOrder = ['split', 'map', 'forensics'];

    function setCompView(nextView, focusTab) {
      compView = viewOrder.indexOf(nextView) !== -1 ? nextView : 'split';
      Array.prototype.forEach.call(viewTabs, function (tb) {
        var act = tb.getAttribute('data-comp-view') === compView;
        tb.classList.toggle('is-active', act);
        tb.setAttribute('aria-selected', act ? 'true' : 'false');
        tb.setAttribute('tabindex', act ? '0' : '-1');
        if (act && focusTab) tb.focus();
      });
      if (splitPanel) splitPanel.classList.toggle('is-active', compView === 'split');
      if (mapPanel) mapPanel.classList.toggle('is-active', compView === 'map');
      if (forensicsPanel) forensicsPanel.classList.toggle('is-active', compView === 'forensics');
    }

    Array.prototype.forEach.call(viewTabs, function (tb) {
      tb.addEventListener('click', function () {
        setCompView(tb.getAttribute('data-comp-view'), false);
      });
      tb.addEventListener('keydown', function (e) {
        var curIdx = viewOrder.indexOf(compView);
        if (curIdx === -1) curIdx = 0;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setCompView(viewOrder[(curIdx + 1) % viewOrder.length], true);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setCompView(viewOrder[(curIdx + viewOrder.length - 1) % viewOrder.length], true);
        } else if (e.key === 'Home') {
          e.preventDefault();
          setCompView(viewOrder[0], true);
        } else if (e.key === 'End') {
          e.preventDefault();
          setCompView(viewOrder[viewOrder.length - 1], true);
        }
      });
    });

    var dots = figComp.querySelectorAll('.comp-dot');
    var anns = figComp.querySelectorAll('.comp-ann');
    var pinBtns = figComp.querySelectorAll('[data-pin-select]');
    var inspector = document.getElementById('comp-inspector');

    function showCard(idx) {
      var item = plotted[idx];
      if (!item || !inspector) return;
      var r = item.r;
      if (r.bzp) compSelectedBzp = r.bzp;
      Array.prototype.forEach.call(dots, function (d) {
        d.classList.toggle('is-selected', Number(d.getAttribute('data-idx')) === idx);
      });
      Array.prototype.forEach.call(anns, function (a) {
        a.classList.toggle('is-selected', Number(a.getAttribute('data-pin-idx')) === idx);
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

    Array.prototype.forEach.call(anns, function (ann) {
      var i = Number(ann.getAttribute('data-pin-idx'));
      ann.addEventListener('mouseenter', function () { showCard(i); });
      ann.addEventListener('click', function () { showCard(i); });
    });

    Array.prototype.forEach.call(pinBtns, function (btn) {
      var i = Number(btn.getAttribute('data-pin-select'));
      btn.addEventListener('click', function () {
        showCard(i);
      });
    });

    function applyCompFilter(mode, autoSelect) {
      compFilter = mode || 'all';
      var firstMatch = -1;
      function matchesMode(r) {
        if (compFilter === 'software') return r.category === 'software_deploy';
        if (compFilter === 'health') return r.sector === 'Ochrona zdrowia';
        if (compFilter === 'training') return r.category === 'training';
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
      if (autoSelect) {
        if (compFilter === 'training' && pTopBids) {
          showCard(pTopBids.idx);
        } else if (firstMatch !== -1 && compFilter !== 'all') {
          showCard(firstMatch);
        }
      }
    }

    var restoredPt = compSelectedBzp ? findPoint(compSelectedBzp) : null;
    var defaultIdx = restoredPt ? restoredPt.idx : (pCzd ? pCzd.idx : (plotted.length - 1));
    showCard(defaultIdx);
    if (compFilter !== 'all') applyCompFilter(compFilter, false);

    Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-cfilter');
        Array.prototype.forEach.call(figComp.querySelectorAll('[data-cfilter]'), function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        applyCompFilter(mode, true);
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
    if (state.btier) p.set('btier', state.btier);
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
    if (state.btier === '2-3' && !(r.bids != null && r.bids >= 2 && r.bids <= 3)) return false;
    if (state.btier === '4p' && !(r.bids != null && r.bids >= 4)) return false;
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
      state.btier = '';
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
      if (state.single) {
        state.sole = false;
        state.btier = '';
      }
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
    if (state.btier === '2-3') parts.push(I18N.tagBids23.toLowerCase());
    if (state.btier === '4p') parts.push(I18N.tagBids4p.toLowerCase());
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
            !state.year && !state.cyear && !state.single && !state.sole && !state.btier && !state.eu && !state.pure && !state.incidental;
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
        isActive: function () { return state.pure && state.status === 'resolved' && !state.cat && !state.sector && !state.single && !state.btier; }
      },
      {
        id: 'train',
        qs: 'status=resolved&cat=training&sort=bids_desc',
        label: I18N.lensTrainCrowd,
        badge: String(trainSigned),
        isActive: function () { return state.cat === 'training' && state.sort === 'bids_desc' && !state.single && !state.btier; }
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
    if (state.status !== 'all') {
      var stTagLbl = state.status === 'resolved'
        ? I18N.tagStResolved
        : (state.status === 'open_or_pending' ? I18N.tagStOpen : I18N.tagStCancel);
      tags.push({
        label: stTagLbl + ' ×',
        clear: function () {
          state.status = 'all';
          state.sub = '';
        }
      });
    }
    if (state.year) tags.push({ label: I18N.tagNoticeYear.replace('{y}', state.year) + ' ×', clear: function () { state.year = ''; } });
    if (state.cyear) tags.push({ label: I18N.tagContractYear.replace('{y}', state.cyear === '2023' ? '2023 (XII)' : state.cyear) + ' ×', clear: function () { state.cyear = ''; } });
    if (state.sub) tags.push({ label: (state.sub === 'open_for_bids' ? I18N.tagOpenNow : I18N.tagPending) + ' ×', clear: function () { state.sub = ''; } });
    if (state.cat) tags.push({ label: (I18N.cats[state.cat] || state.cat) + ' ×', clear: function () { state.cat = ''; } });
    if (state.sector) tags.push({ label: (I18N.sectors[state.sector] || state.sector) + ' ×', clear: function () { state.sector = ''; } });
    if (state.prov) tags.push({ label: state.prov + ' ×', clear: function () { state.prov = ''; } });
    if (state.single) tags.push({ label: I18N.chkSingle + ' ×', clear: function () { state.single = false; document.getElementById('bzp-chk-single').checked = false; } });
    if (state.sole) tags.push({ label: I18N.tagSole + ' ×', clear: function () { state.sole = false; } });
    if (state.btier === '2-3') tags.push({ label: I18N.tagBids23 + ' ×', clear: function () { state.btier = ''; } });
    if (state.btier === '4p') tags.push({ label: I18N.tagBids4p + ' ×', clear: function () { state.btier = ''; } });
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
    state.btier = (state.single || state.sole) ? '' : (p.get('btier') || '');
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
