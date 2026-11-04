/* Interactive charts & 2,809-JST nationwide cybersecurity explorer — RolePlayingTech Issue 03
   Zero external dependencies. Supports PL & EN, diacritic-insensitive search, and ?embed=1 mode. */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pl').toLowerCase().indexOf('en') === 0 ? 'en' : 'pl';

  function foldPl(s) {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/[źż]/g, 'z');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtNum(v, d) {
    var s = Number(v || 0).toFixed(d);
    return LANG === 'pl' ? s.replace('.', ',') : s;
  }

  function fmtInt(n) {
    var sep = LANG === 'pl' ? ' ' : ',';
    return String(Math.round(Number(n || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }

  function fmtPln(v) {
    if (!v || v <= 0) return LANG === 'pl' ? 'Brak grantu' : 'No grant';
    if (v >= 1000000) {
      return fmtNum(v / 1000000, 2) + (LANG === 'pl' ? ' mln zł' : 'M PLN');
    }
    return fmtInt(Math.round(v)) + (LANG === 'pl' ? ' zł' : ' PLN');
  }

  var T = {
    pl: {
      f1TabTiers: '01 · Progi grantowe i test istotności',
      f1TabTypes: '02 · Kategorie JST (województwa, miasta, gminy)',
      f1TabGov: '03 · Benchmark: 1 124 domeny .gov.pl wg resortów',
      f1LeftTierH: 'Odsetek domen podatnych na podszycie wg wysokości grantu „Cyberbezpieczny Samorząd” (N = 2 779)',
      f1LeftTierP: '34 dni po twardym terminie rozliczenia programu (30.09.2026) · 30 gmin na komercyjnym freemailu wyłączono do osobnej kohorty',
      f1LeftTypeH: 'Higiena poczty urzędowej wg szczebla samorządu (wszystkie 2 809 JST w Polsce)',
      f1LeftTypeP: 'Nawet 4 z 16 urzędów marszałkowskich (p=none) i 8 z 66 miast na prawach powiatu nie blokuje sfałszowanych listów',
      f1LeftGovH: 'Porównanie z administracją rządową i sądami: 1 124 aktywne domeny pocztowe w strefie .gov.pl',
      f1LeftGovP: 'Centralny serwer pocztowy Sądów i Prokuratury (2,5% podatnych) kontra rozproszone domeny resortów i sanepidów',
      f1RightH: 'Test efektu programu i odporność wyniku na zmianę mianownika',
      f1RightP: 'Niezależnie od wariantu populacji brak rekordu DMARC nie różni się istotnie między grantobiorcami a grupą kontrolną',
      legMissing: 'Brak rekordu DMARC / błąd składni (ustawowy nakaz od 25.12.2023)',
      legPNone: 'Polityka p=none (monitoring — fałszywy e-mail wpada do skrzynki)',
      legStrict: 'Aktywna ochrona p=quarantine lub p=reject',
      statNullKicker: 'Brak rekordu DMARC · test χ² Yatesa',
      statNullSub: '12,77% z grantem (317/2 483) vs 15,20% bez grantu (45/296) · brak statystycznie istotnego efektu (Fisher p = 0,24)',
      statSpoofKicker: 'Łączna podatność (brak + p=none)',
      statSpoofSub: '25,45% z grantem (632 urzędy z 356,07 mln zł dotacji) vs 34,46% bez grantu (χ² p = 0,0011)',
      sensColVar: 'Wariant mianownika audytu',
      sensColN: 'N',
      sensColNoDm: 'Brak DMARC',
      sensColP: 'p (Yates)',
      sensColSpoof: 'Podatne',
      f2TabVoiv: '01 · Mapa 16 województw (kliknij, aby filtrować urzędy)',
      f2TabCloud: '02 · Suwerenność poczty i 30 skrzynek komercyjnych live',
      voivSpoofLbl: 'Poczta podatna:',
      voivNoDmLbl: 'Brak DMARC:',
      voivTlsLbl: 'Błąd HTTPS/TLS:',
      voivMetaLbl: 'Ślad Mety (WWW):',
      cloudLeftH: 'Gdzie fizycznie leży poczta polskich samorządów (N = 2 779 domen instytucjonalnych)',
      cloudLeftP: 'Prawie 2× więcej urzędów powierza pocztę amerykańskim chmurom Big Tech (92) niż państwowej sieci NASK/COI (55)',
      cloudRightH: '30 gmin obsługujących mieszkańców ze skrzynek komercyjnych i współdzielonych ISP',
      cloudRightP: '28 z 30 to beneficjenci „Cyberbezpiecznego Samorządu” (łącznie 12,61 mln zł grantów, w tym 2 maks. granty po 850 tys. zł)',
      pCard1Kicker: 'Wtyczki społecznościowe Mety (Zero-Click)',
      pCard1Desc: 'Stron ładuje skrypt connect.facebook.net/sdk.js w 0. sekundzie przed jakąkolwiek zgodą mieszkańca, wysyłając IP i URL czytanej podstrony (współadministrowanie z wyroku TSUE C-40/17 Fashion ID).',
      pCard1Meta: '331 z 346 osiągalnych stron z kodem Mety · w tym gminy, powiaty i miasta wojewódzkie',
      pCard2Kicker: 'Pełny komercyjny Meta Pixel (fbevents.js + /tr)',
      pCard2Desc: 'Wszystkie 5 jednostek to laureaci grantów (łącznie 4,11 mln zł): Woj. lubuskie (850 tys. zł + Hotjar), Gdynia (850 tys. zł), Tarnów (848 tys. zł + skrypt Advanced Matching udwv[em]), Polkowice i Powiat Świdnicki.',
      pCard2Meta: 'Dodatkowo 54 z 99 (54,6%) zbadanych portali z samym GTM odpala bez zgody Google Analytics 4 (g/collect)',
      pCard3Kicker: 'Dowód, że da się zgodnie z prawem + paradoks gov.pl',
      pCard3Desc: '9 samorządów z kodem Mety (m.in. Pruszcz Gdański, Trzebownisko, Mrągowo, Kożuchów) prawidłowo zablokowało skrypty przed kliknięciem „Akceptuję”. Z kolei 86 gmin na samorzad.gov.pl ma 0 trackerów Mety, ale aż 30,2% z nich ma dziurawą pocztę.',
      pCard3Meta: 'Wzorzec techniczny: blokada skryptów zewnętrznych do czasu wyrażenia dobrowolnej zgody (art. 399 PKE)',
      presetsLbl: 'Szybkie filtry:',
      pAll: 'Wszystkie JST (2 809)',
      pMaxNoDm: 'Maks. grant ~850 tys. bez DMARC (62)',
      pBigSpoof: 'Duże miasta MNP i woj. podatne (12)',
      pPixelTr: 'Aktywny Meta Pixel /tr (5)',
      pZeroMeta: 'Wyciek Zero-Click do Mety (336)',
      pFreemail: 'Poczta komercyjna / ISP live (30)',
      pSamParadox: 'Portal samorzad.gov.pl + podatny mail (26)',
      pConsentOk: 'Wzorcowa blokada zgody (13)',
      searchPh: 'Szukaj gminy, miasta, powiatu, kodu TERYT lub domeny (np. Wrocław, Słupsk, Włoszczowa, 2613063)…',
      allVoivs: 'Wszystkie województwa (16)',
      allTypes: 'Wszystkie typy JST (6)',
      allDmarc: 'Wszystkie statusy poczty',
      dmSpoofAny: 'Podatne łącznie (brak + p=none + freemail)',
      dmMissing: 'Brak rekordu DMARC / błąd (362)',
      dmNone: 'Tylko monitoring p=none (372)',
      dmQuar: 'Kwarantanna p=quarantine (1 258)',
      dmRej: 'Odrzucanie p=reject (787)',
      dmFree: 'Skrzynka komercyjna / ISP (30)',
      resetBtn: 'Wyczyść',
      csvBtn: 'Pobierz CSV',
      jsonBtn: 'Pełny JSON',
      embedBtn: 'Osadź (iframe)',
      showing: 'Widoczne:',
      ofWord: 'z',
      unitsWord: 'jednostek',
      colUnit: 'Jednostka JST / TERYT',
      colGrant: 'Grant Cyberbezpieczny',
      colMail: 'Domena poczty / dostawca',
      colDmarc: 'Ochrona DMARC / SPF',
      colWeb: 'Strona WWW / TLS / śledzenie',
      loadMore: 'Pokaż kolejne 60 jednostek',
      tpMap: {
        W: 'Województwo',
        MNP: 'Miasto na pr. powiatu',
        P: 'Powiat ziemski',
        GM: 'Gmina miejska',
        GMW: 'Gmina miejsko-wiejska',
        GW: 'Gmina wiejska'
      },
      mpMap: {
        m365: 'Microsoft 365 (US)',
        gws: 'Google Workspace (US)',
        nask: 'Sieć państwowa NASK/COI',
        home: 'home.pl / IONOS',
        nazwa: 'nazwa.pl (NetArt)',
        ovh: 'OVHcloud',
        cfolks: 'cyberFolks',
        hetzner: 'Hetzner (DE)',
        local: 'Własny serwer / lokalny ISP'
      }
    },
    en: {
      f1TabTiers: '01 · Grant tiers & statistical null test',
      f1TabTypes: '02 · By local-gov tier (regions, cities, communes)',
      f1TabGov: '03 · Benchmark: 1,124 .gov.pl mail domains by sector',
      f1LeftTierH: 'Spoofable official email share by "Cybersecure Local Gov" grant tier (N = 2,779)',
      f1LeftTierP: '34 days after the hard 30.09.2026 program deadline · 30 commercial freemail municipalities tracked separately',
      f1LeftTypeH: 'Official email hygiene across all 6 tiers of Polish local government (all 2,809 units)',
      f1LeftTypeP: 'Even 4 of 16 regional Marshal offices (p=none) and 8 of 66 county-right cities fail to block forged emails',
      f1LeftGovH: 'State benchmark: 1,124 active .gov.pl mail-sending domains across central & judicial sectors',
      f1LeftGovP: 'Centralized Courts & Prosecution mail (2.5% spoofable) vs fragmented ministries and sanitary inspectorates',
      f1RightH: 'Grant-effect test & denominator sensitivity check',
      f1RightP: 'Across every population definition, missing DMARC is statistically indistinguishable between winners and non-recipients',
      legMissing: 'Missing / malformed DMARC (mandatory by statute since 25.12.2023)',
      legPNone: 'Monitoring-only p=none (forged mail still reaches citizen inbox)',
      legStrict: 'Enforcing policy p=quarantine or p=reject',
      statNullKicker: 'Missing DMARC · Yates χ² test',
      statNullSub: '12.77% with grant (317/2,483) vs 15.20% no grant (45/296) · statistically null difference (Fisher p = 0.24)',
      statSpoofKicker: 'Total spoofable (missing + p=none)',
      statSpoofSub: '25.45% with grant (632 offices holding PLN 356.07M) vs 34.46% no grant (χ² p = 0.0011)',
      sensColVar: 'Denominator variant',
      sensColN: 'N',
      sensColNoDm: 'No DMARC',
      sensColP: 'p (Yates)',
      sensColSpoof: 'Spoofable',
      f2TabVoiv: '01 · 16 Voivodeships matrix (click region to filter explorer)',
      f2TabCloud: '02 · Cloud mail sovereignty & 30 live freemail offices',
      voivSpoofLbl: 'Spoofable mail:',
      voivNoDmLbl: 'Missing DMARC:',
      voivTlsLbl: 'Broken HTTPS/TLS:',
      voivMetaLbl: 'Meta code (WWW):',
      cloudLeftH: 'Where Polish municipal mail is hosted (N = 2,779 institutional domains)',
      cloudLeftP: 'Nearly 2× more local governments use US Big Tech cloud mail (92) than state NASK/COI mail (55)',
      cloudRightH: '30 municipalities serving citizens from commercial freemail & shared ISP boxes',
      cloudRightP: '28 of 30 won Cybersecure grants (PLN 12.61M total, including two max PLN 850k grants on @home.pl)',
      pCard1Kicker: 'Unblocked Meta Social Plugins (Zero-Click)',
      pCard1Desc: 'Portals load connect.facebook.net/sdk.js at 0 seconds before any user action, transmitting visitor IP and page URL to Meta (unlawful joint controllership under CJEU C-40/17 Fashion ID).',
      pCard1Meta: '331 of 346 reachable Meta-footprint sites · communes, counties & major cities',
      pCard2Kicker: 'Full commercial Meta Pixel (fbevents.js + /tr)',
      pCard2Desc: 'All 5 units are grant winners (PLN 4.11M total): Lubuskie Region (850k + Hotjar), Gdynia (850k), Tarnów (848k + Automatic Advanced Matching udwv[em]), Polkowice & Świdnik County.',
      pCard2Meta: 'Plus 54 of 99 (54.6%) audited GTM-only portals fire Google Analytics 4 (g/collect) pre-consent',
      pCard3Kicker: '9 compliant controls + the samorzad.gov.pl paradox',
      pCard3Desc: '9 municipalities (incl. Pruszcz Gdański, Trzebownisko, Mrągowo, Kożuchów) properly blocked Meta scripts until consent. Meanwhile, 86 communes on samorzad.gov.pl have 0 Meta trackers on WWW, yet 30.2% run spoofable mail.',
      pCard3Meta: 'Proof of feasibility: prior script blocking under Art. 399 Electronic Communications Law',
      presetsLbl: 'Quick filters:',
      pAll: 'All Polish units (2,809)',
      pMaxNoDm: 'Max ~850k grant, no DMARC (62)',
      pBigSpoof: 'Spoofable big cities & regions (12)',
      pPixelTr: 'Active commercial Meta Pixel (5)',
      pZeroMeta: 'Zero-Click Meta leak (336)',
      pFreemail: 'Live freemail / ISP box (30)',
      pSamParadox: 'samorzad.gov.pl + spoofable mail (26)',
      pConsentOk: 'Compliant consent-gated (13)',
      searchPh: 'Search municipality, city, county, TERYT code or domain (e.g. Wrocław, Słupsk, Włoszczowa, 2613063)…',
      allVoivs: 'All voivodeships (16)',
      allTypes: 'All JST tiers (6)',
      allDmarc: 'All email protection states',
      dmSpoofAny: 'All vulnerable (missing + p=none + freemail)',
      dmMissing: 'Missing / broken DMARC (362)',
      dmNone: 'Monitoring-only p=none (372)',
      dmQuar: 'Enforcing p=quarantine (1,258)',
      dmRej: 'Enforcing p=reject (787)',
      dmFree: 'Commercial freemail / ISP (30)',
      resetBtn: 'Reset',
      csvBtn: 'Export CSV',
      jsonBtn: 'Full JSON',
      embedBtn: 'Embed (iframe)',
      showing: 'Showing:',
      ofWord: 'of',
      unitsWord: 'units',
      colUnit: 'Local government / TERYT',
      colGrant: 'Cybersecure grant',
      colMail: 'Email domain / host',
      colDmarc: 'DMARC / SPF / DNSSEC',
      colWeb: 'Website / TLS / tracking',
      loadMore: 'Load 60 more units',
      tpMap: {
        W: 'Voivodeship (Marshal)',
        MNP: 'City w/ county rights',
        P: 'Land county',
        GM: 'Urban municipality',
        GMW: 'Urban-rural commune',
        GW: 'Rural municipality'
      },
      mpMap: {
        m365: 'Microsoft 365 (US)',
        gws: 'Google Workspace (US)',
        nask: 'State NASK/COI network',
        home: 'home.pl / IONOS',
        nazwa: 'nazwa.pl (NetArt)',
        ovh: 'OVHcloud',
        cfolks: 'cyberFolks',
        hetzner: 'Hetzner (DE)',
        local: 'Self-hosted / regional ISP'
      }
    }
  }[LANG];

  function renderFig1Grants(el, data) {
    if (!el) return;
    var tab = 'tiers';
    var dm = data.summary.dmarcInstitutional;
    var sens = data.summary.sensitivityVariants;

    function paint() {
      var rowsHtml = '';
      var leftH = '';
      var leftP = '';

      if (tab === 'tiers') {
        leftH = T.f1LeftTierH;
        leftP = T.f1LeftTierP;
        rowsHtml = data.summary.byGrantTier.map(function (r) {
          var lbl = LANG === 'pl' ? r.labelPl : r.labelEn;
          var subL = 'N = ' + fmtInt(r.n) + (r.grantSumMln > 0 ? ' · ' + fmtNum(r.grantSumMln, 1) + (LANG === 'pl' ? ' mln zł' : 'M PLN') : '');
          var subR = (LANG === 'pl' ? 'Brak DMARC: ' : 'No DMARC: ') + fmtNum(r.noDmarcPct, 1) + '% (' + r.noDmarcN + ') · p=none: ' + fmtNum(r.pNonePct, 1) + '% (' + r.pNoneN + ')';
          return (
            '<div class="jst-bar-item">' +
            '<div class="jst-bar-top"><strong>' + esc(lbl) + '</strong><span class="jst-bar-val">' + fmtNum(r.spoofablePct, 1) + '% (' + r.spoofableN + ')</span></div>' +
            '<div class="jst-track">' +
            '<span class="jst-seg-rust" style="width:' + r.noDmarcPct + '%"></span>' +
            '<span class="jst-seg-amber" style="width:' + r.pNonePct + '%"></span>' +
            '<span class="jst-seg-ok" style="width:' + r.strictPct + '%"></span>' +
            '</div>' +
            '<div class="jst-bar-sub"><span>' + esc(subL) + '</span><span>' + esc(subR) + '</span></div>' +
            '</div>'
          );
        }).join('');
      } else if (tab === 'types') {
        leftH = T.f1LeftTypeH;
        leftP = T.f1LeftTypeP;
        rowsHtml = data.summary.byJstType.map(function (r) {
          var lbl = (LANG === 'pl' ? r.labelPl : r.labelEn) + ' (' + r.code + ')';
          var subL = 'N = ' + fmtInt(r.totalN) + (r.freemailN > 0 ? ' (' + r.freemailN + ' freemail)' : '') + ' · DNSSEC: ' + fmtNum(r.dnssecPct, 1) + '%';
          var subR = (LANG === 'pl' ? 'Brak DMARC: ' : 'No DMARC: ') + fmtNum(r.noDmarcPct, 1) + '% (' + r.noDmarcN + ') · p=none: ' + fmtNum(r.pNonePct, 1) + '% (' + r.pNoneN + ')';
          return (
            '<div class="jst-bar-item">' +
            '<div class="jst-bar-top"><strong>' + esc(lbl) + '</strong><span class="jst-bar-val">' + fmtNum(r.spoofablePct, 1) + '% (' + r.spoofableN + '/' + r.instN + ')</span></div>' +
            '<div class="jst-track">' +
            '<span class="jst-seg-rust" style="width:' + r.noDmarcPct + '%"></span>' +
            '<span class="jst-seg-amber" style="width:' + r.pNonePct + '%"></span>' +
            '<span class="jst-seg-ok" style="width:' + r.strictPct + '%"></span>' +
            '</div>' +
            '<div class="jst-bar-sub"><span>' + esc(subL) + '</span><span>' + esc(subR) + '</span></div>' +
            '</div>'
          );
        }).join('');
      } else {
        leftH = T.f1LeftGovH;
        leftP = T.f1LeftGovP;
        rowsHtml = data.summary.govPlComparison.bySector.map(function (r) {
          var lbl = LANG === 'pl' ? r.sectorPl : r.sectorEn;
          var pNonePct = r.activeMxN > 0 ? (r.pNoneN / r.activeMxN * 100) : 0;
          var strictPct = Math.max(0, 100 - r.spoofablePct);
          var subL = 'MX .gov.pl: ' + fmtInt(r.activeMxN) + ' · p=reject: ' + fmtNum(r.rejectPct, 1) + '%';
          var subR = (LANG === 'pl' ? 'Brak DMARC: ' : 'No DMARC: ') + fmtNum(r.noDmarcPct, 1) + '% (' + r.noDmarcN + ')';
          return (
            '<div class="jst-bar-item">' +
            '<div class="jst-bar-top"><strong>' + esc(lbl) + '</strong><span class="jst-bar-val">' + fmtNum(r.spoofablePct, 1) + '% (' + r.spoofableN + '/' + r.activeMxN + ')</span></div>' +
            '<div class="jst-track">' +
            '<span class="jst-seg-rust" style="width:' + r.noDmarcPct + '%"></span>' +
            '<span class="jst-seg-amber" style="width:' + pNonePct.toFixed(2) + '%"></span>' +
            '<span class="jst-seg-ok" style="width:' + strictPct.toFixed(2) + '%"></span>' +
            '</div>' +
            '<div class="jst-bar-sub"><span>' + esc(subL) + '</span><span>' + esc(subR) + '</span></div>' +
            '</div>'
          );
        }).join('');
      }

      var sensRows = sens.map(function (s) {
        var nm = LANG === 'pl' ? s.labelPl : s.labelEn;
        return (
          '<tr>' +
          '<td>' + esc(nm) + '</td>' +
          '<td class="num">' + fmtInt(s.n) + '</td>' +
          '<td class="num">' + fmtNum(s.noDmarcPct, 2) + '%</td>' +
          '<td class="num"><strong>' + fmtNum(s.noDmarcPYates, 2) + '</strong></td>' +
          '<td class="num">' + fmtNum(s.spoofablePct, 2) + '%</td>' +
          '</tr>'
        );
      }).join('');

      el.innerHTML =
        '<div class="jst-tab-bar" role="tablist">' +
        '<button type="button" class="jst-tab-btn' + (tab === 'tiers' ? ' is-active' : '') + '" data-tab="tiers">' + esc(T.f1TabTiers) + '</button>' +
        '<button type="button" class="jst-tab-btn' + (tab === 'types' ? ' is-active' : '') + '" data-tab="types">' + esc(T.f1TabTypes) + '</button>' +
        '<button type="button" class="jst-tab-btn' + (tab === 'gov' ? ' is-active' : '') + '" data-tab="gov">' + esc(T.f1TabGov) + '</button>' +
        '</div>' +
        '<div class="jst-two-col">' +
        '<div class="jst-panel">' +
        '<div class="jst-panel-head"><h4>' + esc(leftH) + '</h4><p>' + esc(leftP) + '</p></div>' +
        '<div class="jst-bar-list">' + rowsHtml + '</div>' +
        '<div class="jst-legend-row">' +
        '<span><i class="jst-leg-dot" style="background:var(--rust)"></i>' + esc(T.legMissing) + '</span>' +
        '<span><i class="jst-leg-dot" style="background:#b87832"></i>' + esc(T.legPNone) + '</span>' +
        '<span><i class="jst-leg-dot" style="background:#5c6f5e"></i>' + esc(T.legStrict) + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="jst-panel">' +
        '<div class="jst-panel-head"><h4>' + esc(T.f1RightH) + '</h4><p>' + esc(T.f1RightP) + '</p></div>' +
        '<div class="jst-stat-cards">' +
        '<div class="jst-stat-card is-null"><small>' + esc(T.statNullKicker) + '</small><strong>p = ' + fmtNum(dm.testNoDmarc.pYates, 2) + '</strong><span>' + esc(T.statNullSub) + '</span></div>' +
        '<div class="jst-stat-card is-slate"><small>' + esc(T.statSpoofKicker) + '</small><strong>' + fmtNum(dm.spoofablePct, 1) + '% (' + dm.spoofableN + ')</strong><span>' + esc(T.statSpoofSub) + '</span></div>' +
        '</div>' +
        '<table class="jst-sens-table">' +
        '<thead><tr><th>' + esc(T.sensColVar) + '</th><th class="num">' + esc(T.sensColN) + '</th><th class="num">' + esc(T.sensColNoDm) + '</th><th class="num">' + esc(T.sensColP) + '</th><th class="num">' + esc(T.sensColSpoof) + '</th></tr></thead>' +
        '<tbody>' + sensRows + '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>';

      Array.prototype.forEach.call(el.querySelectorAll('[data-tab]'), function (btn) {
        btn.addEventListener('click', function () {
          tab = btn.getAttribute('data-tab');
          paint();
        });
      });
    }

    paint();
  }

  function renderFig2Map(el, data, jumpToVoiv) {
    if (!el) return;
    var tab = 'voiv';
    var ms = data.summary.mailSovereignty;

    function paint() {
      var bodyHtml = '';
      if (tab === 'voiv') {
        var cards = data.summary.byVoivodeship.map(function (v) {
          return (
            '<button type="button" class="jst-voiv-card" data-voiv-pick="' + esc(v.voiv) + '">' +
            '<div class="jst-voiv-head"><strong>' + esc(v.voiv) + '</strong><span>' + fmtNum(v.spoofablePct, 1) + '%</span></div>' +
            '<div class="jst-track"><span class="jst-seg-rust" style="width:' + v.noDmarcPct + '%"></span><span class="jst-seg-amber" style="width:' + ((v.pNoneN / v.instN) * 100).toFixed(1) + '%"></span><span class="jst-seg-ok" style="width:' + v.strictPct + '%"></span></div>' +
            '<div class="jst-voiv-rows">' +
            '<div><span>' + esc(T.voivSpoofLbl) + '</span><strong>' + v.spoofableN + '/' + v.instN + '</strong></div>' +
            '<div><span>' + esc(T.voivNoDmLbl) + '</span><span>' + fmtNum(v.noDmarcPct, 1) + '% (' + v.noDmarcN + ')</span></div>' +
            '<div><span>' + esc(T.voivTlsLbl) + '</span><span>' + fmtNum(v.brokenTlsPct, 1) + '% (' + v.brokenTlsN + ')</span></div>' +
            '<div><span>' + esc(T.voivMetaLbl) + '</span><span>' + fmtNum(v.metaFootprintPct, 1) + '% (' + v.metaFootprintN + ')</span></div>' +
            '</div>' +
            '</button>'
          );
        }).join('');
        bodyHtml = '<div class="jst-voiv-grid">' + cards + '</div>';
      } else {
        var tot = data.summary.dmarcInstitutional.n;
        var providers = [
          { lbl: LANG === 'pl' ? 'home.pl / IONOS' : 'home.pl / IONOS', n: ms.homePlIonosN, cls: 'jst-seg-slate' },
          { lbl: LANG === 'pl' ? 'nazwa.pl (NetArt)' : 'nazwa.pl (NetArt)', n: ms.nazwaPlNetArtN, cls: 'jst-seg-slate' },
          { lbl: LANG === 'pl' ? 'OVHcloud (FR/PL)' : 'OVHcloud (FR/PL)', n: ms.ovhCloudN, cls: 'jst-seg-slate' },
          { lbl: LANG === 'pl' ? 'Chmura USA: Microsoft 365 (74) + Google Workspace (18)' : 'US Big Tech Cloud: Microsoft 365 (74) + Google Workspace (18)', n: ms.usBigTechTotalN, cls: 'jst-seg-rust' },
          { lbl: LANG === 'pl' ? 'Infrastruktura państwowa i akademicka (NASK / COI / PIONIER)' : 'Polish State & Academic Network (NASK / COI / PIONIER)', n: ms.govNaskMailN, cls: 'jst-seg-ok' }
        ];
        var provHtml = providers.map(function (p) {
          var pct = (p.n / tot * 100);
          return (
            '<div class="jst-bar-item">' +
            '<div class="jst-bar-top"><strong>' + esc(p.lbl) + '</strong><span class="jst-bar-val">' + fmtNum(pct, 2) + '% (' + fmtInt(p.n) + ')</span></div>' +
            '<div class="jst-track"><span class="' + p.cls + '" style="width:' + Math.min(100, pct * 3.2).toFixed(1) + '%"></span></div>' +
            '</div>'
          );
        }).join('');

        var fmExamples = data.records.filter(function (r) { return r.dm === 'freemail'; }).slice(0, 7).map(function (r) {
          return (
            '<div class="jst-bar-item">' +
            '<div class="jst-bar-top"><strong>' + esc(r.n) + ' (' + esc(r.tp) + ', ' + esc(r.v) + ')</strong><span class="jst-bar-val">' + esc(fmtPln(r.g)) + '</span></div>' +
            '<div class="jst-bar-sub"><span>' + esc(r.em) + '</span><span>' + (r.od ? (LANG === 'pl' ? 'Domena własna: ' : 'Own domain: ') + esc(r.od) + ' (' + esc(r.odm) + ')' : (LANG === 'pl' ? 'Tylko skrzynka zewnętrzna' : 'External box only')) + '</span></div>' +
            '</div>'
          );
        }).join('');

        bodyHtml =
          '<div class="jst-two-col">' +
          '<div class="jst-panel"><div class="jst-panel-head"><h4>' + esc(T.cloudLeftH) + '</h4><p>' + esc(T.cloudLeftP) + '</p></div><div class="jst-bar-list">' + provHtml + '</div></div>' +
          '<div class="jst-panel"><div class="jst-panel-head"><h4>' + esc(T.cloudRightH) + '</h4><p>' + esc(T.cloudRightP) + '</p></div><div class="jst-bar-list">' + fmExamples + '</div></div>' +
          '</div>';
      }

      el.innerHTML =
        '<div class="jst-tab-bar" role="tablist">' +
        '<button type="button" class="jst-tab-btn' + (tab === 'voiv' ? ' is-active' : '') + '" data-m-tab="voiv">' + esc(T.f2TabVoiv) + '</button>' +
        '<button type="button" class="jst-tab-btn' + (tab === 'cloud' ? ' is-active' : '') + '" data-m-tab="cloud">' + esc(T.f2TabCloud) + '</button>' +
        '</div>' + bodyHtml;

      Array.prototype.forEach.call(el.querySelectorAll('[data-m-tab]'), function (btn) {
        btn.addEventListener('click', function () {
          tab = btn.getAttribute('data-m-tab');
          paint();
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll('[data-voiv-pick]'), function (card) {
        card.addEventListener('click', function () {
          if (jumpToVoiv) jumpToVoiv(card.getAttribute('data-voiv-pick'));
        });
      });
    }

    paint();
  }

  function renderFig3Privacy(el, data) {
    if (!el) return;
    var wt = data.summary.webAndTrackers;
    el.innerHTML =
      '<div class="jst-priv-grid">' +
      '<div class="jst-priv-card is-amber">' +
      '<span class="jst-priv-kicker">' + esc(T.pCard1Kicker) + '</span>' +
      '<div class="jst-priv-big">' + wt.zeroClickMetaSocialSdkN + ' / ' + wt.playwrightMetaReachableN + '</div>' +
      '<p class="jst-priv-desc">' + esc(T.pCard1Desc) + '</p>' +
      '<div class="jst-priv-meta">' + esc(T.pCard1Meta) + '</div>' +
      '</div>' +
      '<div class="jst-priv-card is-danger">' +
      '<span class="jst-priv-kicker">' + esc(T.pCard2Kicker) + '</span>' +
      '<div class="jst-priv-big">' + wt.zeroClickActiveMetaPixelN + ' (' + fmtNum(wt.activeMetaPixelGrantMln, 2) + (LANG === 'pl' ? ' mln zł' : 'M PLN') + ')</div>' +
      '<p class="jst-priv-desc">' + esc(T.pCard2Desc) + '</p>' +
      '<div class="jst-priv-meta">' + esc(T.pCard2Meta) + '</div>' +
      '</div>' +
      '<div class="jst-priv-card is-ok">' +
      '<span class="jst-priv-kicker">' + esc(T.pCard3Kicker) + '</span>' +
      '<div class="jst-priv-big">' + wt.consentGatedProperlyN + ' OK · ' + fmtNum(wt.samorzadPortalMailSpoofablePct, 1) + '%</div>' +
      '<p class="jst-priv-desc">' + esc(T.pCard3Desc) + '</p>' +
      '<div class="jst-priv-meta">' + esc(T.pCard3Meta) + '</div>' +
      '</div>' +
      '</div>';
  }

  function renderExplorer(el, data) {
    if (!el) return { applyExternal: function () {} };

    var records = data.records.map(function (r) {
      r._q = foldPl(r.n + ' ' + r.t + ' ' + r.p + ' ' + r.ed + ' ' + r.em + ' ' + r.w + ' ' + r.v);
      return r;
    });

    var state = {
      q: '',
      voiv: '',
      tp: '',
      dm: '',
      preset: 'all',
      limit: 40
    };

    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) state.q = params.get('q');
    if (params.get('voiv')) state.voiv = params.get('voiv');
    if (params.get('tp')) state.tp = params.get('tp');
    if (params.get('dm')) state.dm = params.get('dm');
    if (params.get('preset')) state.preset = params.get('preset');

    function matchesPreset(r, p) {
      if (!p || p === 'all') return true;
      if (p === 'max_nodmarc') return r.g >= 849000 && (r.dm === 'missing' || r.dm === 'malformed_multiple');
      if (p === 'big_spoof') return (r.tp === 'W' || r.tp === 'MNP') && (r.dm === 'missing' || r.dm === 'malformed_multiple' || r.dm === 'none');
      if (p === 'pixel_tr') return r.trk === 'pixel_tr';
      if (p === 'zero_meta') return r.trk === 'pixel_tr' || r.trk === 'meta_sdk';
      if (p === 'freemail') return r.dm === 'freemail';
      if (p === 'sam_paradox') return r.sam === 1 && (r.dm === 'missing' || r.dm === 'malformed_multiple' || r.dm === 'none');
      if (p === 'consent_ok') return r.trk === 'consent_ok';
      return true;
    }

    function filterRows() {
      var qf = foldPl(state.q.trim());
      return records.filter(function (r) {
        if (!matchesPreset(r, state.preset)) return false;
        if (state.voiv && r.v !== state.voiv) return false;
        if (state.tp && r.tp !== state.tp) return false;
        if (state.dm) {
          if (state.dm === 'spoof_any') {
            if (r.dm !== 'missing' && r.dm !== 'malformed_multiple' && r.dm !== 'none' && r.dm !== 'freemail') return false;
          } else if (state.dm === 'missing') {
            if (r.dm !== 'missing' && r.dm !== 'malformed_multiple') return false;
          } else if (r.dm !== state.dm) {
            return false;
          }
        }
        if (qf && r._q.indexOf(qf) === -1) return false;
        return true;
      });
    }

    function dmarcBadge(r) {
      if (r.dm === 'reject') return '<span class="jst-badge is-ok">DMARC: p=reject</span>';
      if (r.dm === 'quarantine') return '<span class="jst-badge is-ok">DMARC: p=quarantine</span>';
      if (r.dm === 'none') return '<span class="jst-badge is-amber">' + (LANG === 'pl' ? 'p=none (brak blokady)' : 'p=none (no block)') + '</span>';
      if (r.dm === 'malformed_multiple') return '<span class="jst-badge is-rust">' + (LANG === 'pl' ? 'Błąd: duplikat DMARC' : 'Broken duplicate DMARC') + '</span>';
      if (r.dm === 'freemail') return '<span class="jst-badge is-rust">' + (LANG === 'pl' ? 'Skrzynka komercyjna' : 'Commercial freemail') + '</span>';
      return '<span class="jst-badge is-rust">' + (LANG === 'pl' ? 'BRAK DMARC' : 'MISSING DMARC') + '</span>';
    }

    function webBadge(r) {
      var parts = [];
      if (r.sam === 1) parts.push('<span class="jst-badge is-slate">samorzad.gov.pl</span>');
      if (r.wr === 0) {
        parts.push('<span class="jst-badge">' + (LANG === 'pl' ? 'WWW nieosiągalne' : 'Web timeout') + '</span>');
      } else if (r.tls === 0) {
        parts.push('<span class="jst-badge is-rust">' + (LANG === 'pl' ? 'Błąd HTTPS/TLS' : 'Broken HTTPS/TLS') + '</span>');
      } else {
        parts.push('<span class="jst-badge is-ok">HTTPS' + (r.hs ? '+HSTS' : '') + '</span>');
      }
      if (r.trk === 'pixel_tr') {
        parts.push('<span class="jst-badge is-rust">Meta Pixel /tr' + (r.pii ? ' + PII' : '') + (r.hj ? ' + Hotjar' : '') + '</span>');
      } else if (r.trk === 'meta_sdk') {
        parts.push('<span class="jst-badge is-amber">' + (LANG === 'pl' ? 'Meta SDK Zero-Click' : 'Meta SDK 0s') + '</span>');
      } else if (r.trk === 'consent_ok') {
        parts.push('<span class="jst-badge is-ok">' + (LANG === 'pl' ? 'Zgoda OK' : 'Consent gated') + '</span>');
      } else if (r.trk === 'ga_zero') {
        parts.push('<span class="jst-badge is-amber">GA4 Zero-Click</span>');
      }
      return parts.join(' ');
    }

    var voivOpts = data.summary.byVoivodeship.map(function (v) {
      return '<option value="' + esc(v.voiv) + '">' + esc(v.voiv) + ' (' + v.totalN + ')</option>';
    }).join('');

    var typeOpts = ['W', 'MNP', 'P', 'GM', 'GMW', 'GW'].map(function (c) {
      return '<option value="' + c + '">' + esc(T.tpMap[c]) + ' (' + c + ')</option>';
    }).join('');

    var presets = [
      ['all', T.pAll],
      ['max_nodmarc', T.pMaxNoDm],
      ['big_spoof', T.pBigSpoof],
      ['pixel_tr', T.pPixelTr],
      ['zero_meta', T.pZeroMeta],
      ['freemail', T.pFreemail],
      ['sam_paradox', T.pSamParadox],
      ['consent_ok', T.pConsentOk]
    ];

    var embedUrl = window.location.origin + window.location.pathname + '?embed=1#explorer';
    var iframeSnippet = '<iframe src="' + embedUrl + '" width="100%" height="760" style="border:1px solid #dbd7cd" loading="lazy" title="RolePlayingTech — Cyberbezpieczny Samorząd (2809 JST)"></iframe>';

    el.innerHTML =
      '<div class="jst-preset-bar"><span class="jst-preset-lbl">' + esc(T.presetsLbl) + '</span>' +
      presets.map(function (pr) {
        return '<button type="button" class="jst-pill" data-p="' + pr[0] + '">' + esc(pr[1]) + '</button>';
      }).join('') +
      '</div>' +
      '<div class="jst-filters-grid">' +
      '<input type="search" class="jst-input" id="jst-q" placeholder="' + esc(T.searchPh) + '" aria-label="' + esc(T.searchPh) + '">' +
      '<select class="jst-select" id="jst-voiv" aria-label="Województwo"><option value="">' + esc(T.allVoivs) + '</option>' + voivOpts + '</select>' +
      '<select class="jst-select" id="jst-tp" aria-label="Typ JST"><option value="">' + esc(T.allTypes) + '</option>' + typeOpts + '</select>' +
      '<select class="jst-select" id="jst-dm" aria-label="Status DMARC">' +
      '<option value="">' + esc(T.allDmarc) + '</option>' +
      '<option value="spoof_any">' + esc(T.dmSpoofAny) + '</option>' +
      '<option value="missing">' + esc(T.dmMissing) + '</option>' +
      '<option value="none">' + esc(T.dmNone) + '</option>' +
      '<option value="quarantine">' + esc(T.dmQuar) + '</option>' +
      '<option value="reject">' + esc(T.dmRej) + '</option>' +
      '<option value="freemail">' + esc(T.dmFree) + '</option>' +
      '</select>' +
      '<button type="button" class="jst-act-btn" id="jst-reset">' + esc(T.resetBtn) + '</button>' +
      '</div>' +
      '<div class="jst-toolbar">' +
      '<div id="jst-count"></div>' +
      '<div class="jst-actions">' +
      '<button type="button" class="jst-act-btn" id="jst-csv">' + esc(T.csvBtn) + '</button>' +
      '<a class="jst-act-btn" href="/assets/lab/jst-cyber-2026.json" download>' + esc(T.jsonBtn) + '</a>' +
      '<button type="button" class="jst-act-btn" id="jst-embed-btn">' + esc(T.embedBtn) + '</button>' +
      '</div>' +
      '</div>' +
      '<div class="jst-embed-box" id="jst-embed-box">' +
      '<strong>' + (LANG === 'pl' ? 'Kod iframe dla redakcji (bezpłatnie z podaniem źródła RolePlayingTech):' : 'Newsroom iframe embed code (free with attribution to RolePlayingTech):') + '</strong>' +
      '<textarea readonly>' + esc(iframeSnippet) + '</textarea>' +
      '</div>' +
      '<div class="jst-table-wrap">' +
      '<div class="jst-row is-head"><div>' + esc(T.colUnit) + '</div><div>' + esc(T.colGrant) + '</div><div>' + esc(T.colMail) + '</div><div>' + esc(T.colDmarc) + '</div><div>' + esc(T.colWeb) + '</div></div>' +
      '<div id="jst-tbody"></div>' +
      '</div>' +
      '<div class="jst-more-wrap" id="jst-more-wrap"><button type="button" class="jst-act-btn" id="jst-more">' + esc(T.loadMore) + '</button></div>';

    var qEl = el.querySelector('#jst-q');
    var vEl = el.querySelector('#jst-voiv');
    var tEl = el.querySelector('#jst-tp');
    var dEl = el.querySelector('#jst-dm');
    var tbody = el.querySelector('#jst-tbody');
    var countEl = el.querySelector('#jst-count');
    var moreWrap = el.querySelector('#jst-more-wrap');

    function syncControls() {
      qEl.value = state.q;
      vEl.value = state.voiv;
      tEl.value = state.tp;
      dEl.value = state.dm;
      Array.prototype.forEach.call(el.querySelectorAll('[data-p]'), function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-p') === state.preset);
      });
    }

    function paintRows() {
      syncControls();
      var matched = filterRows();
      var shown = matched.slice(0, state.limit);
      var grantSum = matched.reduce(function (acc, r) { return acc + (r.g || 0); }, 0);
      countEl.textContent =
        T.showing + ' ' + fmtInt(shown.length) + ' ' + T.ofWord + ' ' + fmtInt(matched.length) + ' ' + T.unitsWord +
        ' · Σ ' + fmtNum(grantSum / 1000000, 2) + (LANG === 'pl' ? ' mln zł' : 'M PLN');

      tbody.innerHTML = shown.map(function (r) {
        var subLoc = T.tpMap[r.tp] + ' · ' + r.v + ' · TERYT ' + r.t;
        var mailSub = T.mpMap[r.mp] || r.mp;
        if (r.dm === 'freemail') mailSub = r.em + (r.od ? ' (+ ' + r.od + ')' : '');
        var spfSub = 'SPF: ' + r.spf + (r.ds ? ' · DNSSEC ✓' : '');
        return (
          '<div class="jst-row">' +
          '<div class="jst-cell-main"><strong>' + esc(r.n) + '</strong><span>' + esc(subLoc) + '</span></div>' +
          '<div class="jst-mono">' + esc(fmtPln(r.g)) + '<small>' + (r.cs ? 'CPPC FERC.02.02' : '—') + '</small></div>' +
          '<div class="jst-mono">' + esc(r.ed || '—') + '<small>' + esc(mailSub) + '</small></div>' +
          '<div class="jst-mono">' + dmarcBadge(r) + '<small>' + esc(spfSub) + '</small></div>' +
          '<div>' + webBadge(r) + '<div class="jst-mono"><small>' + esc(r.w || '—') + '</small></div></div>' +
          '</div>'
        );
      }).join('');

      moreWrap.style.display = shown.length < matched.length ? 'block' : 'none';
    }

    qEl.addEventListener('input', function () {
      state.q = qEl.value;
      state.limit = 40;
      paintRows();
    });
    vEl.addEventListener('change', function () {
      state.voiv = vEl.value;
      state.limit = 40;
      paintRows();
    });
    tEl.addEventListener('change', function () {
      state.tp = tEl.value;
      state.limit = 40;
      paintRows();
    });
    dEl.addEventListener('change', function () {
      state.dm = dEl.value;
      state.limit = 40;
      paintRows();
    });

    Array.prototype.forEach.call(el.querySelectorAll('[data-p]'), function (btn) {
      btn.addEventListener('click', function () {
        state.preset = btn.getAttribute('data-p');
        state.limit = 40;
        paintRows();
      });
    });

    el.querySelector('#jst-reset').addEventListener('click', function () {
      state.q = '';
      state.voiv = '';
      state.tp = '';
      state.dm = '';
      state.preset = 'all';
      state.limit = 40;
      paintRows();
    });

    el.querySelector('#jst-more').addEventListener('click', function () {
      state.limit += 60;
      paintRows();
    });

    el.querySelector('#jst-embed-btn').addEventListener('click', function () {
      el.querySelector('#jst-embed-box').classList.toggle('is-open');
    });

    el.querySelector('#jst-csv').addEventListener('click', function () {
      var rows = filterRows();
      var header = ['teryt7', 'nazwa_jst', 'typ_jst', 'wojewodztwo', 'powiat', 'grant_pln', 'email_domain', 'dmarc_policy', 'spf', 'dnssec', 'www', 'https_valid_tls', 'tracker_class'];
      var lines = [header.join(',')];
      rows.forEach(function (r) {
        lines.push([
          r.t,
          '"' + String(r.n).replace(/"/g, '""') + '"',
          r.tp,
          r.v,
          '"' + String(r.p).replace(/"/g, '""') + '"',
          r.g,
          r.ed,
          r.dm,
          r.spf,
          r.ds,
          r.w,
          r.tls,
          r.trk
        ].join(','));
      });
      var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cyberbezpieczny-samorzad-2809-jst.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    function applyPresetQuery(qs) {
      var sp = new URLSearchParams(qs);
      state.q = sp.get('q') || '';
      state.voiv = sp.get('voiv') || '';
      state.tp = sp.get('tp') || '';
      state.dm = sp.get('dm') || '';
      state.preset = sp.get('preset') || 'all';
      state.limit = 40;
      paintRows();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-jst-preset]'), function (link) {
      link.addEventListener('click', function (ev) {
        ev.preventDefault();
        applyPresetQuery(link.getAttribute('data-jst-preset'));
      });
    });

    paintRows();
    return {
      applyExternal: function (voivName) {
        state.voiv = voivName;
        state.preset = 'all';
        state.limit = 40;
        paintRows();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }

  function init() {
    var f1 = document.getElementById('fig-jst-grants');
    var f2 = document.getElementById('fig-jst-map');
    var f3 = document.getElementById('fig-jst-privacy');
    var exp = document.getElementById('jst-explorer');
    if (!f1 && !f2 && !f3 && !exp) return;

    fetch('/assets/lab/jst-cyber-2026.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var ctrl = renderExplorer(exp, data);
        renderFig1Grants(f1, data);
        renderFig2Map(f2, data, ctrl.applyExternal);
        renderFig3Privacy(f3, data);
      })
      .catch(function (err) {
        if (window.console) console.error('Failed to load jst-cyber-2026.json:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
