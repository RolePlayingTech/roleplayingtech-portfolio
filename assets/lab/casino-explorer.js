/* Interactive charts & 4-lens defanged registry explorer — RolePlayingTech Issue 02
   Zero external dependencies. Strict harm minimization: never renders clickable
   links to casino, drop-caught, hub, or compromised domains. */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pl').toLowerCase().indexOf('en') === 0 ? 'en' : 'pl';
  var IS_EMBED = document.documentElement.classList.contains('is-embed');

  var T = {
    pl: {
      safetyBadge: 'Ochrona prawna i bezpieczeństwo (art. 29 u.g.h.)',
      safetyCopy: 'Wszystkie domeny przejęte, afiliacyjne i zainfekowane podajemy wyłącznie w <strong>zneutralizowanym zapisie nawiasowym</strong> (<code>przyklad[.]pl</code>), bez żadnych aktywnych linków do stron hazardowych. Klikalne przyciski weryfikacji prowadzą <strong>wyłącznie do oficjalnych rejestrów państwowych</strong> (<code>rspo.gov.pl</code>, <code>dane.gov.pl</code>, <code>gov.pl</code>, <code>BIP</code>) oraz kart Wikipedii. Dla 22 żywych serwerów z Wektora B1 ukryliśmy wersje wtyczek CMS i ścieżki wstrzykniętych podstron.',
      tabUnblockedKicker: 'Soczewka 01 · Poza Rejestrem MF',
      tabUnblockedTitle: 'Nieblokowane domeny instytucji',
      tabVictimsKicker: 'Soczewka 02 · Wektor B1 (CERT)',
      tabVictimsTitle: 'Żywe zainfekowane serwery-ofiary',
      tabBannedKicker: 'Soczewka 03 · Po blokadzie MF',
      tabBannedTitle: 'Zablokowane w MF nadal w bazach',
      tabGovKicker: 'Soczewka 04 · Bezpośredni HTML',
      tabGovTitle: 'Oficjalne strony .gov.pl i BIP',
      presetsLabel: 'Szybkie filtry śledcze:',
      pAllUnb: 'Wszystkie 291',
      pLiveReg: 'Wciąż w rejestrze (158)',
      pPublic: 'Sektor publiczny (166)',
      pGrantUma: 'Klaster grant+uma (31)',
      pWayback: 'Klony Wayback PBN (15)',
      pVictimsPub: 'Publiczne szpitale i szkoły B1 (9)',
      pBannedRspo: 'Zablokowane na żywym RSPO (9)',
      pBannedMc: 'Zablokowane w Wykazie MC (22)',
      kpi1Lbl: 'Widoczne rekordy',
      kpi1SubUnb: 'z 291 nieblokowanych domen',
      kpi1SubVic: 'z 22 serwerów Wektora B1',
      kpi1SubBan: 'z 68 domen zablokowanych w MF',
      kpi1SubGov: 'z 9 oficjalnych podstron (10 linków)',
      kpi2Lbl: 'Sektor publiczny',
      kpi2Sub: 'jednostki samorządowe i publiczne',
      kpi3Lbl: 'Aktywne w rejestrze',
      kpi3Sub: 'wciąż wskazują domenę (11.2026)',
      kpi4Lbl: 'W Wykazie MC (poz. 1875)',
      kpi4Sub: 'ustawowa lista stron publicznych',
      kpi5Lbl: 'Infrastruktura Cloudflare',
      kpi5Sub: 'ukrycie IP za proxy AS13335',
      searchPh: 'Szukaj domeny, szkoły, szpitala, miasta, klastra NS, rejestratora…',
      allCohorts: 'Wszystkie rejestry / kategorie',
      allVectors: 'Wszystkie wektory techniczne',
      allVoivs: 'Wszystkie województwa (16)',
      resetBtn: 'Wyczyść filtry',
      chkPublic: 'Tylko sektor publiczny',
      chkLive: 'Wciąż aktywne w rejestrze',
      csvBtn: 'Pobierz CSV (defanged)',
      jsonBtn: 'Źródło JSON',
      embedBtn: 'Osadź (iframe)',
      embedInfo: 'Skopiuj poniższy kod, aby bezpłatnie osadzić interaktywną bazę w artykule redakcyjnym (z zachowaniem źródła i neutralizacji linków):',
      embedHeadTitle: 'Państwo linkuje do kasyna — baza 359 domen z rejestrów publicznych',
      embedFullLink: 'Pełny raport i metodologia (RolePlayingTech) ↗',
      embedCreditLeft: 'Źródło danych i audyt: Grzegorz Stuczyński · RolePlayingTech (stan: 03–04.11.2026)',
      showing: 'Wyświetlono',
      of: 'z',
      matching: 'pasujących rekordów',
      loadMore: 'Pokaż kolejne rekordy',
      colDom: 'Domena (zneutralizowana)',
      colInst: 'Instytucja / jednostka źródłowa',
      colVec: 'Wektor i mechanizm',
      colSilo: 'Ślad w rejestrach państwa',
      colInfra: 'Infrastruktura DNS / RDAP',
      colVerify: 'Weryfikacja',
      colGovPage: 'Oficjalna strona urzędowa (.gov.pl / BIP)',
      colGovTarget: 'Cel linku (zneutralizowany)',
      colGovStatus: 'Status domeny docelowej',
      colGovNote: 'Ustalenia audytu HTML (04.11.2026)',
      detailsOpen: 'Szczegóły ↓',
      detailsClose: 'Zwiń ↑',
      vecA: 'Wektor A · Przejęta (kasyno / 301)',
      vecB2: 'Wektor B2 · Przejęta atrapa SEO',
      vecB1: 'Wektor B1 · Włamanie do CMS (ofiara)',
      subWayback: 'Klon szkoły z Wayback + linki',
      subCrash: 'Atrapa bloga / gry crash',
      cohRspoAct: 'Aktywne RSPO 2025/26',
      cohRspoHist: 'Historyczne RSPO 2018–23',
      cohRpwdl: 'Podmioty lecznicze RPWDL',
      cohZlobki: 'Rejestr Żłobków MRPiPS',
      catPubReg: 'Instytucja / rejestr publiczny (31)',
      catWiki: 'Domena .pl z przypisów Wikipedii (37)',
      badgeLiveReg: 'Wciąż w rejestrze głównym',
      badgeMc: 'Wykaz MC (poz. 1875)',
      badgeGovLink: 'Aktywny link .gov.pl / BIP',
      badgePublic: 'Publiczna',
      badgeNonPublic: 'Niepubliczna / prywatna',
      badgeCert: 'Kwalifikacja: CERT Polska (bez blokady DNS)',
      badgeMfHub: '301 → hub już w MF',
      badgeRspoLive: 'Żywa karta rspo.gov.pl',
      badgeRspoActive: 'Aktywna szkoła/placówka!',
      badgeRpwdlLive: 'Nocny zrzut RPWDL2 (70 wierszy)',
      badgeWiki: 'Przypisy Wikipedii',
      drawerRegStatus: 'Status w rejestrach (11.2026)',
      drawerTech: 'Ślad techniczny i DNS',
      drawerRemedy: 'Właściwa ścieżka reakcji',
      remedyMf: 'Blokada DNS w Rejestrze MF (art. 15f ust. 4 pkt 1 u.g.h.) + odpięcie domeny z rejestru publicznego.',
      remedyCert: 'Oczyszczenie serwera przy wsparciu CERT Polska + aktualizacja CMS. Wpis do Rejestru MF uruchomiłby z mocy art. 15f ust. 5 u.g.h. blokadę całej domeny szpitala lub szkoły w 48 h.',
      remedyPostBan: 'Domena jest już w Rejestrze MF, ale wymaga automatycznej walidacji krzyżowej i odpięcia z kart RSPO, RPWDL2, Wykazu MC oraz stron BIP/.gov.pl.',
      daysUnblocked: 'dni poza Rejestrem MF (od przejęcia)',
      mfLagLabel: 'dni od rejestracji do blokady MF',
      openSourcePage: 'Otwórz stronę urzędową ↗',
      kpiGovDofollow: 'Linki HTML dofollow',
      kpiGovDomains: 'Domeny .gov.pl',
      kpiGovBip: 'Strony BIP',
      kpiGovCounty: 'Starostwa powiatowe',
      kpiBanRspo: 'Żywe na rspo.gov.pl',
      colMfXml: 'MF Hazard XML',
      noNs: 'NXDOMAIN / brak NS'
    },
    en: {
      safetyBadge: 'Statutory compliance & harm minimization',
      safetyCopy: 'All hijacked, affiliate, and compromised domains are displayed strictly in <strong>defanged bracket notation</strong> (<code>example[.]pl</code>) with zero clickable gambling links (Art. 29 Polish Gambling Act). Verification buttons open <strong>official state registries only</strong> (<code>rspo.gov.pl</code>, <code>dane.gov.pl</code>, <code>gov.pl</code>, <code>BIP</code>) or Wikipedia citations. Per-host CMS plugin versions and injected paths on the 22 live Vector B1 servers are redacted.',
      tabUnblockedKicker: 'Lens 01 · Missing from MF blocklist',
      tabUnblockedTitle: 'Unblocked institutional domains',
      tabVictimsKicker: 'Lens 02 · Vector B1 (CERT)',
      tabVictimsTitle: 'Live compromised victim servers',
      tabBannedKicker: 'Lens 03 · Post-MF-ban silos',
      tabBannedTitle: 'MF-banned domains in public silos',
      tabGovKicker: 'Lens 04 · Direct HTML links',
      tabGovTitle: 'Official .gov.pl & BIP pages',
      presetsLabel: 'Investigative presets:',
      pAllUnb: 'All 291 unblocked',
      pLiveReg: 'Still live in registry (158)',
      pPublic: 'Public sector (166)',
      pGrantUma: 'grant+uma cluster (31)',
      pWayback: 'Wayback PBN clones (15)',
      pVictimsPub: 'Public B1 hospitals & schools (9)',
      pBannedRspo: 'MF-banned on live RSPO (9)',
      pBannedMc: 'MF-banned in MC list (22)',
      kpi1Lbl: 'Matching records',
      kpi1SubUnb: 'of 291 unblocked domains',
      kpi1SubVic: 'of 22 Vector B1 servers',
      kpi1SubBan: 'of 68 MF-banned domains',
      kpi1SubGov: 'of 9 official pages (10 links)',
      kpi2Lbl: 'Public sector',
      kpi2Sub: 'municipal & state institutions',
      kpi3Lbl: 'Live in primary registry',
      kpi3Sub: 'still pointing to domain (11.2026)',
      kpi4Lbl: 'In MC statutory list',
      kpi4Sub: 'Digital Accessibility Act list',
      kpi5Lbl: 'Cloudflare proxy',
      kpi5Sub: 'origin IP masked behind AS13335',
      searchPh: 'Search domain, school, hospital, city, NS cluster, registrar…',
      allCohorts: 'All registries / categories',
      allVectors: 'All technical vectors',
      allVoivs: 'All 16 voivodeships',
      resetBtn: 'Reset filters',
      chkPublic: 'Public sector only',
      chkLive: 'Still live in primary registry',
      csvBtn: 'Download CSV (defanged)',
      jsonBtn: 'Raw JSON',
      embedBtn: 'Embed (iframe)',
      embedInfo: 'Copy the snippet below to embed this interactive defanged database in newsroom articles (free with source attribution):',
      embedHeadTitle: 'When the State Links to the Casino — 359 Public-Registry Domains',
      embedFullLink: 'Full investigation & methodology (RolePlayingTech) ↗',
      embedCreditLeft: 'Data & forensic audit: Grzegorz Stuczyński · RolePlayingTech (snapshot: Nov 3–4, 2026)',
      showing: 'Showing',
      of: 'of',
      matching: 'matching records',
      loadMore: 'Load more records',
      colDom: 'Domain (defanged)',
      colInst: 'Institution / source entity',
      colVec: 'Vector & mechanism',
      colSilo: 'State registry trail',
      colInfra: 'DNS / RDAP infrastructure',
      colVerify: 'Verify source',
      colGovPage: 'Official government / BIP page',
      colGovTarget: 'Target domain (defanged)',
      colGovStatus: 'Target status',
      colGovNote: 'HTML audit finding (2026-11-04)',
      detailsOpen: 'Details ↓',
      detailsClose: 'Hide ↑',
      vecA: 'Vector A · Drop-caught (casino / 301)',
      vecB2: 'Vector B2 · Drop-caught SEO facade',
      vecB1: 'Vector B1 · Live CMS compromise (victim)',
      subWayback: 'Wayback school clone PBN',
      subCrash: 'Casino blog / crash-game facade',
      cohRspoAct: 'Active RSPO 2025/26',
      cohRspoHist: 'Historical RSPO 2018–23',
      cohRpwdl: 'RPWDL Healthcare Registry',
      cohZlobki: 'Ministry Nursery Registry',
      catPubReg: 'Public / registry institution (31)',
      catWiki: 'Wikipedia-cited .pl domain (37)',
      badgeLiveReg: 'Still live in primary registry',
      badgeMc: 'MC Statutory List (#1875)',
      badgeGovLink: 'Live .gov.pl / BIP link',
      badgePublic: 'Public',
      badgeNonPublic: 'Non-public / private',
      badgeCert: 'Remedy: CERT Polska (no DNS block)',
      badgeMfHub: '301 → hub in MF XML',
      badgeRspoLive: 'Live rspo.gov.pl card',
      badgeRspoActive: 'Active institution card!',
      badgeRpwdlLive: 'Nightly RPWDL2 feed (70 rows)',
      badgeWiki: 'Wikipedia citations',
      drawerRegStatus: 'Registry trail (Nov 2026)',
      drawerTech: 'DNS & RDAP forensics',
      drawerRemedy: 'Appropriate remediation path',
      remedyMf: 'MF DNS blocklist addition (Art. 15f(4)(1) Gambling Act) + automated removal from public registries.',
      remedyCert: 'CERT Polska incident response + CMS remediation. Adding the domain to the MF blocklist would trigger Art. 15f(5) domain-wide ISP blocking within 48h, cutting off patients and parents.',
      remedyPostBan: 'Already listed in MF blocklist, but requires automated cross-registry sync to purge from RSPO, RPWDL2, MC statutory list, and BIP/.gov.pl HTML.',
      daysUnblocked: 'days unblocked since takeover',
      mfLagLabel: 'days from RDAP registration to MF ban',
      openSourcePage: 'Open official page ↗',
      kpiGovDofollow: 'Live dofollow anchors',
      kpiGovDomains: '.gov.pl domains',
      kpiGovBip: 'BIP portals',
      kpiGovCounty: 'County portals',
      kpiBanRspo: 'Live on rspo.gov.pl',
      colMfXml: 'MF Blocklist XML',
      noNs: 'NXDOMAIN / no NS'
    }
  }[LANG];

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtNum(n, dec) {
    if (n == null || isNaN(n)) return '—';
    var s = Number(n).toFixed(dec || 0);
    if (LANG === 'pl') {
      var parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join(',');
    }
    var pEn = s.split('.');
    pEn[0] = pEn[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return pEn.join('.');
  }

  function cohortLabel(c) {
    if (c === 'ACTIVE_RSPO_2025_2026') return T.cohRspoAct;
    if (c === 'ABANDONED_RSPO_2018_2023') return T.cohRspoHist;
    if (c === 'ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026') return T.cohRpwdl;
    if (c === 'ACTIVE_REJESTR_ZLOBKOW_2026') return T.cohZlobki;
    if (c === 'PUBLIC_OR_REGISTRY_INSTITUTION') return T.catPubReg;
    if (c === 'WIKIPEDIA_CITED_PL_DOMAIN') return T.catWiki;
    return c || '—';
  }

  function vectorLabel(v) {
    if (v === 'VECTOR_A_FULL_CASINO_TAKEOVER') return T.vecA;
    if (v === 'VECTOR_B2_DROPCAUGHT_SEO_FACADE') return T.vecB2;
    if (v === 'VECTOR_B1_LIVE_CMS_COMPROMISE') return T.vecB1;
    return v || '—';
  }

  function voivTitleCase(v) {
    if (!v) return '—';
    var low = v.toLowerCase();
    return low.charAt(0).toUpperCase() + low.slice(1);
  }

  // Mount Figure 03 interactive tabs & KM SVG + dot strip + Voivodeship bars
  function mountInfraTabs(data) {
    var root = document.getElementById('fig-infra-interactive');
    if (!root) return;
    var infra = data.summary.infrastructure;
    var surv = data.summary.survival;
    var voivs = data.summary.voivodeships;

    var tab1Lbl = LANG === 'pl' ? 'Klastry Cloudflare i rejestratorzy' : 'Cloudflare clusters & registrars';
    var tab2Lbl = LANG === 'pl' ? 'Czas reakcji MF i krzywa przetrwania (KM)' : 'MF lag & Kaplan–Meier survival';
    var tab3Lbl = LANG === 'pl' ? 'Mapa 16 województw (291 domen)' : 'All 16 voivodeships (291 domains)';

    // Build SVG for Kaplan-Meier curve (0..380 days) + 2 dot strips below
    var W = 620, H = 268;
    var padL = 48, padR = 20, padT = 18, padB = 86;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;
    var maxX = 380;
    function xPos(d) { return padL + Math.min(maxX, Math.max(0, d)) / maxX * plotW; }
    function yPos(pct) { return padT + (100 - pct) / 100 * plotH; }

    var pts = surv.kaplanMeierCurve;
    var pathParts = [];
    for (var i = 0; i < pts.length; i++) {
      var cur = pts[i];
      if (i === 0) {
        pathParts.push('M' + xPos(cur.day).toFixed(1) + ',' + yPos(cur.survivalPct).toFixed(1));
      } else {
        var prev = pts[i - 1];
        pathParts.push('H' + xPos(cur.day).toFixed(1));
        pathParts.push('V' + yPos(cur.survivalPct).toFixed(1));
      }
    }
    pathParts.push('H' + xPos(365).toFixed(1));
    var kmPath = pathParts.join(' ');
    var areaPath = kmPath + ' V' + yPos(0).toFixed(1) + ' H' + xPos(0).toFixed(1) + ' Z';

    // Grid lines
    var gridSvg = '';
    [100, 75, 50, 25, 0].forEach(function (yv) {
      var yy = yPos(yv).toFixed(1);
      gridSvg += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy + '" stroke="#e2ded4" stroke-width="1"/>';
      gridSvg += '<text x="' + (padL - 7) + '" y="' + (Number(yy) + 3.5) + '" text-anchor="end" font-family="ui-monospace,Consolas,monospace" font-size="10" fill="#68655f">' + yv + '%</text>';
    });
    [0, 90, 150, 180, 300, 365].forEach(function (xv) {
      var xx = xPos(xv).toFixed(1);
      gridSvg += '<line x1="' + xx + '" y1="' + padT + '" x2="' + xx + '" y2="' + (padT + plotH) + '" stroke="#ebe7de" stroke-dasharray="3,3"/>';
      gridSvg += '<text x="' + xx + '" y="' + (padT + plotH + 14) + '" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="10" fill="#68655f">' + xv + 'd</text>';
    });

    // Strip dots for N=82 unblocked (clamped at 380d w/ arrow note for >380d) & N=19 banned
    var stripY1 = padT + plotH + 38;
    var stripY2 = padT + plotH + 64;
    var dotsUnb = '';
    surv.unblockedVecAAgesDays.forEach(function (d, idx) {
      var cx = xPos(Math.min(maxX, d)).toFixed(1);
      var jitter = ((idx % 5) - 2) * 1.6;
      dotsUnb += '<circle cx="' + cx + '" cy="' + (stripY1 + jitter).toFixed(1) + '" r="3.1" fill="#98513c" fill-opacity="0.58"><title>' + d + 'd</title></circle>';
    });
    var dotsBan = '';
    surv.mfCaughtLags.forEach(function (row, idx) {
      var cx = xPos(Math.min(maxX, row.lagDays)).toFixed(1);
      var jitter = ((idx % 3) - 1) * 1.8;
      dotsBan += '<circle cx="' + cx + '" cy="' + (stripY2 + jitter).toFixed(1) + '" r="3.6" fill="#26455b" fill-opacity="0.82"><title>' + esc(row.defangedDomain) + ': ' + row.lagDays + 'd</title></circle>';
    });

    var x150 = xPos(150).toFixed(1);
    var y150 = yPos(surv.kaplanMeierCheckpoints.d150).toFixed(1);
    var x365 = xPos(365).toFixed(1);
    var y365 = yPos(surv.kaplanMeierCheckpoints.d365).toFixed(1);

    var lblStrip1 = LANG === 'pl' ? 'N=82 nieblokowane (med. 151d)' : 'N=82 unblocked (med. 151d)';
    var lblClamped = LANG === 'pl' ? '>380d (n=8, maks. 816d) →' : '>380d (n=8, max 816d) →';
    var lblStrip2 = LANG === 'pl' ? 'N=19 zablokowane MF (med. 131d)' : 'N=19 MF-banned (med. 131d)';
    var lbl150 = LANG === 'pl' ? '150 dni: 83,0% nadal bez blokady' : 'Day 150: 83.0% still unblocked';
    var lbl365 = LANG === 'pl' ? '365d: 63,0%' : '365d: 63.0%';

    var kmSvg = '<svg class="km-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Kaplan-Meier survival curve">' +
      gridSvg +
      '<path d="' + areaPath + '" fill="#98513c" fill-opacity="0.09"/>' +
      '<path d="' + kmPath + '" fill="none" stroke="#98513c" stroke-width="2.4"/>' +
      '<circle cx="' + x150 + '" cy="' + y150 + '" r="4.5" fill="#98513c" stroke="#fbfaf6" stroke-width="1.5"/>' +
      '<text x="' + (Number(x150) + 8) + '" y="' + (Number(y150) - 6) + '" font-family="ui-monospace,Consolas,monospace" font-size="10.5" font-weight="700" fill="#98513c">' + lbl150 + '</text>' +
      '<circle cx="' + x365 + '" cy="' + y365 + '" r="4.5" fill="#22211f" stroke="#fbfaf6" stroke-width="1.5"/>' +
      '<text x="' + (Number(x365) - 6) + '" y="' + (Number(y365) - 8) + '" text-anchor="end" font-family="ui-monospace,Consolas,monospace" font-size="10.5" font-weight="700" fill="#22211f">' + lbl365 + '</text>' +
      '<line x1="' + padL + '" y1="' + stripY1 + '" x2="' + (W - padR) + '" y2="' + stripY1 + '" stroke="#dedad0" stroke-width="1"/>' +
      '<text x="' + padL + '" y="' + (stripY1 - 7) + '" font-family="ui-monospace,Consolas,monospace" font-size="9.5" fill="#98513c" font-weight="700">' + lblStrip1 + '</text>' +
      '<text x="' + (W - padR) + '" y="' + (stripY1 - 7) + '" text-anchor="end" font-family="ui-monospace,Consolas,monospace" font-size="9.2" fill="#68655f">' + lblClamped + '</text>' +
      dotsUnb +
      '<line x1="' + padL + '" y1="' + stripY2 + '" x2="' + (W - padR) + '" y2="' + stripY2 + '" stroke="#dedad0" stroke-width="1"/>' +
      '<text x="' + padL + '" y="' + (stripY2 - 7) + '" font-family="ui-monospace,Consolas,monospace" font-size="9.5" fill="#26455b" font-weight="700">' + lblStrip2 + '</text>' +
      dotsBan +
      '</svg>';

    // Build Cloudflare NS cluster rows (exact NS-pair queries; commercial-only MF clusters rendered as static .infra-row)
    var maxCf = 138;
    var cfExplorerMeta = {
      'autumn + wells': { clickable: true, view: 'banned', countInDb: 11 },
      'grant + uma': { clickable: true, view: 'unblocked', countInDb: 31 },
      'aaden + edna': { clickable: false, view: 'banned', countInDb: 1 },
      'neil + perla': { clickable: false, view: 'banned', countInDb: 0 },
      'nova + santino': { clickable: true, view: 'unblocked', countInDb: 13 },
      'austin + sreeni': { clickable: true, view: 'unblocked', countInDb: 3 }
    };
    var cfRowsHtml = infra.cloudflareClusters.map(function (c) {
      var wUnb = (c.unblockedCount / maxCf * 100).toFixed(1);
      var wMf = (c.mfBannedCount / maxCf * 100).toFixed(1);
      var prof = LANG === 'pl' ? c.profilePl : c.profileEn;
      var meta = cfExplorerMeta[c.shortLabel] || { clickable: false, view: 'unblocked', countInDb: 0 };
      if (!meta.clickable) {
        var staticVal = c.totalDomains + (LANG === 'pl' ? ' domen (XML MF)' : ' domains (MF XML)');
        return '<div class="infra-row">' +
          '<div class="infra-row-top"><span>' + esc(c.shortLabel) + '.ns.cloudflare.com</span><span class="infra-row-val" style="color:#514e49">' + esc(staticVal) + '</span></div>' +
          '<div class="infra-track"><div class="infra-fill-unb" style="width:' + wUnb + '%"></div><div class="infra-fill-mf" style="width:' + wMf + '%"></div></div>' +
          '<div class="infra-row-note">' + esc(prof) + '</div>' +
        '</div>';
      }
      var actVal = LANG === 'pl'
        ? c.totalDomains + ' domen (filtruj ' + meta.countInDb + ' →)'
        : c.totalDomains + ' domains (filter ' + meta.countInDb + ' →)';
      return '<button type="button" class="infra-row-btn" data-cas-jump-q="' + esc(c.nsPair) + '" data-cas-jump-view="' + meta.view + '">' +
        '<div class="infra-row-top"><span>' + esc(c.shortLabel) + '.ns.cloudflare.com</span><span class="infra-row-val">' + esc(actVal) + '</span></div>' +
        '<div class="infra-track"><div class="infra-fill-unb" style="width:' + wUnb + '%"></div><div class="infra-fill-mf" style="width:' + wMf + '%"></div></div>' +
        '<div class="infra-row-note">' + esc(prof) + '</div>' +
      '</button>';
    }).join('');

    // Build Registrar rows (exact registrar match; __other_reg__ filters exact 23/105)
    var regRowsHtml = infra.registrars.map(function (rg) {
      var nameDisp = rg.registrar;
      if (LANG === 'en' && nameDisp.indexOf('Pozostali') === 0) {
        nameDisp = 'Other registrars (13 entities)';
      }
      var qTok = nameDisp.indexOf('Aftermarket') === 0 ? 'Aftermarket.pl Limited' :
                 nameDisp.indexOf('Openprovider') === 0 ? 'Hosting Concepts' :
                 nameDisp.indexOf('Netim') === 0 ? 'Netim' :
                 nameDisp.indexOf('Dynadot') === 0 ? 'Dynadot' : '__other_reg__';
      var pctStr = fmtNum(rg.pct105, 1) + '% (' + rg.count105 + '/105) →';
      var vecAStr = LANG === 'pl'
        ? 'Wektor A .pl: ' + fmtNum(rg.pctPlVecA80, 1) + '% (' + rg.countPlVecA80 + '/80)'
        : '.pl Vector A: ' + fmtNum(rg.pctPlVecA80, 1) + '% (' + rg.countPlVecA80 + '/80)';
      return '<button type="button" class="infra-row-btn" data-cas-jump-q="' + esc(qTok) + '" data-cas-jump-view="unblocked">' +
        '<div class="infra-row-top"><span>' + esc(nameDisp) + '</span><span class="infra-row-val">' + pctStr + '</span></div>' +
        '<div class="infra-track"><div class="infra-fill-unb" style="width:' + rg.pctPlVecA80 + '%"></div></div>' +
        '<div class="infra-row-note">' + esc(vecAStr) + '</div>' +
      '</button>';
    }).join('');

    // Build Voivodeship bars
    var maxVoiv = voivs[0] ? voivs[0].total : 59;
    var voivHtml = voivs.map(function (v) {
      var wPct = (v.total / maxVoiv * 100).toFixed(1);
      var subTxt = LANG === 'pl'
        ? v.publicSector + ' publicznych · ' + v.vectorB1 + ' żywych serwerów B1 · kliknij, aby filtrować →'
        : v.publicSector + ' public-sector · ' + v.vectorB1 + ' live B1 victim servers · click to filter →';
      return '<button type="button" class="voiv-btn" data-cas-jump-voiv="' + esc(v.voivodeship) + '">' +
        '<div class="voiv-btn-top"><strong>' + esc(voivTitleCase(v.voivodeship)) + '</strong><span>' + v.total + '</span></div>' +
        '<div class="silo-cohort-track"><div class="silo-cohort-fill" style="width:' + wPct + '%"></div></div>' +
        '<div class="voiv-btn-sub">' + esc(subTxt) + '</div>' +
      '</button>';
    }).join('');

    root.innerHTML =
      '<div class="comp-view-bar" role="tablist">' +
        '<button type="button" class="comp-view-tab is-active" role="tab" aria-selected="true" data-infra-tab="clusters"><span class="comp-view-idx">01</span>' + esc(tab1Lbl) + '</button>' +
        '<button type="button" class="comp-view-tab" role="tab" aria-selected="false" data-infra-tab="survival"><span class="comp-view-idx">02</span>' + esc(tab2Lbl) + '</button>' +
        '<button type="button" class="comp-view-tab" role="tab" aria-selected="false" data-infra-tab="voiv"><span class="comp-view-idx">03</span>' + esc(tab3Lbl) + '</button>' +
      '</div>' +
      '<div class="comp-panel is-active" data-infra-panel="clusters">' +
        '<div class="infra-two-col">' +
          '<div class="infra-box">' +
            '<h4>' + (LANG === 'pl' ? 'Powtarzalne pary serwerów nazw Cloudflare (NS)' : 'Recurring Cloudflare nameserver (NS) pairs') + '</h4>' +
            '<p class="infra-box-sub">' + (LANG === 'pl'
              ? 'W puli ~250 tys. par NS kolizja 34 domen na jednej parze ma p < 10⁻¹²⁰. Ceglasty = domeny nieblokowane, szary = zablokowane w MF.'
              : 'Across Cloudflare\'s ~250k NS pair pool, 34 domains sharing one pair has p < 10⁻¹²⁰. Rust = unblocked, grey = MF-banned.') + '</p>' +
            '<div class="infra-list">' + cfRowsHtml + '</div>' +
          '</div>' +
          '<div class="infra-box">' +
            '<h4>' + (LANG === 'pl' ? 'Koncentracja rejestratorów przechwytywania (RDAP N=105)' : 'Drop-catch registrar concentration (RDAP N=105)') + '</h4>' +
            '<p class="infra-box-sub">' + (LANG === 'pl'
              ? '4 podmioty obsługują 78,1% zbadanej próby (79,6% po ważeniu IPW; 87,5% w Wektorze A domen .pl). Próba obejmuje 95,2% aktywnych domen RSPO bez .eu (przed limitem HTTP 429 NASK).'
              : 'Top 4 registrars hold 78.1% of resolved domains (79.6% IPW-weighted; 87.5% within .pl Vector A). Covers 95.2% of active non-.eu RSPO domains prior to NASK HTTP 429 quota.') + '</p>' +
            '<div class="infra-list">' + regRowsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="comp-panel" data-infra-panel="survival">' +
        '<div class="km-grid">' +
          '<div class="km-svg-wrap">' + kmSvg + '</div>' +
          '<div class="km-stats-col">' +
            '<div class="km-stat-card"><span class="micro">' + (LANG === 'pl' ? 'Przetrwanie bez blokady (KM, N=101)' : 'Unblocked survival (KM, N=101)') + '</span><strong>' + fmtNum(surv.kaplanMeierCheckpoints.d150, 1) + '<small>' + (LANG === 'pl' ? '% po 150 dniach' : '% at 150 days') + '</small></strong><p>' + (LANG === 'pl'
              ? 'Łączna estymacja Kaplana–Meiera (19 wykrytych + 82 prawostronnie ucięte domeny publiczne): po pełnym roku (365 dni) poza Rejestrem MF pozostaje nadal 63,0% przejętych domen.'
              : 'Combined Kaplan–Meier estimator (19 caught + 82 right-censored public drop-catches): 63.0% remain unblocked 365 days after registration.') + '</p></div>' +
            '<div class="km-stat-card"><span class="micro">' + (LANG === 'pl' ? 'Wiek aktywnych przejęć (N=82)' : 'Active takeover age (N=82)') + '</span><strong>151<small>' + (LANG === 'pl' ? 'dni (mediana)' : 'days (median)') + '</small></strong><p>' + (LANG === 'pl'
              ? 'Rozstęp ćwiartkowy IQR: 75–209 dni (148 dni dla ścisłych rejestratorów drop-catch 2025–2026, N=77; rekord: zlobekgizycko[.]pl — 816 dni).'
              : 'IQR: 75–209 days (148 days for strict 2025–2026 drop-catch registrars, N=77; max: zlobekgizycko[.]pl — 816 days).') + '</p></div>' +
            '<div class="km-stat-card"><span class="micro">' + (LANG === 'pl' ? 'Opóźnienie wpisu MF (N=19 złapanych)' : 'MF detection lag (N=19 caught)') + '</span><strong>131<small>' + (LANG === 'pl' ? 'dni (mediana)' : 'days (median)') + '</small></strong><p>' + (LANG === 'pl'
              ? 'Od 28 dni (piw[.]olawa[.]pl) przez 307 dni (sudlugie[.]pl) do 317 dni (spnasielsk[.]pl; IQR: 83–155 dni).'
              : 'Ranges from 28 days (piw[.]olawa[.]pl) and 307 days (sudlugie[.]pl) to 317 days (spnasielsk[.]pl; IQR: 83–155 days).') + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="comp-panel" data-infra-panel="voiv">' +
        '<div class="voiv-grid">' + voivHtml + '</div>' +
      '</div>';

    var tabBtns = root.querySelectorAll('[data-infra-tab]');
    var panels = root.querySelectorAll('[data-infra-panel]');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-infra-tab');
        tabBtns.forEach(function (b) {
          var active = b.getAttribute('data-infra-tab') === target;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-infra-panel') === target);
        });
      });
    });
  }

  // Main Explorer State & Mount
  function mountExplorer(container, data) {
    var state = {
      view: 'unblocked', // 'unblocked' | 'victims' | 'banned' | 'govlinks'
      q: '',
      cohort: '',
      vector: '',
      voiv: '',
      onlyPublic: false,
      onlyLive: false,
      onlyRspo: false,
      onlyMc: false,
      limit: 30
    };

    function parseUrlParams() {
      var sp = new URLSearchParams(window.location.search);
      var v = sp.get('view');
      if (v === 'unblocked' || v === 'victims' || v === 'banned' || v === 'govlinks') {
        state.view = v;
      }
      state.q = sp.get('q') || '';
      state.cohort = sp.get('cohort') || '';
      state.vector = sp.get('vec') || '';
      state.voiv = sp.get('voiv') || '';
      state.onlyPublic = sp.get('public') === '1';
      state.onlyLive = sp.get('live') === '1';
      state.onlyRspo = sp.get('rspo') === '1';
      state.onlyMc = sp.get('mc') === '1';
      state.limit = 30;
    }

    function applyPresetObject(params) {
      state.view = params.view || 'unblocked';
      state.q = params.q || '';
      state.cohort = params.cohort || '';
      state.vector = params.vec || '';
      state.voiv = params.voiv || '';
      state.onlyPublic = params.public === '1';
      state.onlyLive = params.live === '1';
      state.onlyRspo = params.rspo === '1';
      state.onlyMc = params.mc === '1';
      state.limit = 30;
      syncControls();
      render();
    }

    function applyPresetQuery(qs) {
      var sp = new URLSearchParams(qs);
      applyPresetObject({
        view: sp.get('view') || 'unblocked',
        q: sp.get('q') || '',
        cohort: sp.get('cohort') || '',
        vec: sp.get('vec') || '',
        voiv: sp.get('voiv') || '',
        public: sp.get('public') || '',
        live: sp.get('live') || '',
        rspo: sp.get('rspo') || '',
        mc: sp.get('mc') || ''
      });
    }

    parseUrlParams();

    var reportCanon = LANG === 'pl'
      ? 'https://roleplayingtech.com/pl/lab/panstwo-linkuje-do-kasyna/'
      : 'https://roleplayingtech.com/en/lab/state-registries-casinos/';

    var voivOptions = data.summary.voivodeships.map(function (v) {
      return '<option value="' + esc(v.voivodeship) + '">' + esc(voivTitleCase(v.voivodeship)) + ' (' + v.total + ')</option>';
    }).join('');

    container.innerHTML =
      '<div class="bzp-embed-head">' +
        '<strong>' + esc(T.embedHeadTitle) + '</strong>' +
        '<a href="' + reportCanon + '" target="_blank" rel="noopener noreferrer">' + esc(T.embedFullLink) + '</a>' +
      '</div>' +
      '<div class="cas-safety-banner" role="note">' +
        '<span class="cas-safety-badge">' + esc(T.safetyBadge) + '</span>' +
        '<div>' + T.safetyCopy + '</div>' +
      '</div>' +
      '<div class="cas-dataset-tabs" role="tablist">' +
        '<button type="button" class="cas-ds-tab" data-cas-view="unblocked" role="tab">' +
          '<span class="cas-ds-kicker">' + esc(T.tabUnblockedKicker) + '</span>' +
          '<span class="cas-ds-title">' + esc(T.tabUnblockedTitle) + '</span>' +
          '<span class="cas-ds-count">291</span>' +
        '</button>' +
        '<button type="button" class="cas-ds-tab" data-cas-view="victims" role="tab">' +
          '<span class="cas-ds-kicker">' + esc(T.tabVictimsKicker) + '</span>' +
          '<span class="cas-ds-title">' + esc(T.tabVictimsTitle) + '</span>' +
          '<span class="cas-ds-count">22</span>' +
        '</button>' +
        '<button type="button" class="cas-ds-tab" data-cas-view="banned" role="tab">' +
          '<span class="cas-ds-kicker">' + esc(T.tabBannedKicker) + '</span>' +
          '<span class="cas-ds-title">' + esc(T.tabBannedTitle) + '</span>' +
          '<span class="cas-ds-count">68</span>' +
        '</button>' +
        '<button type="button" class="cas-ds-tab" data-cas-view="govlinks" role="tab">' +
          '<span class="cas-ds-kicker">' + esc(T.tabGovKicker) + '</span>' +
          '<span class="cas-ds-title">' + esc(T.tabGovTitle) + '</span>' +
          '<span class="cas-ds-count">9 <small style="font-size:12px;color:#98513c">(10 href)</small></span>' +
        '</button>' +
      '</div>' +
      '<div class="bzp-lenses">' +
        '<span class="bzp-lenses-label">' + esc(T.presetsLabel) + '</span>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=unblocked">' + esc(T.pAllUnb) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=unblocked&live=1">' + esc(T.pLiveReg) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=unblocked&public=1">' + esc(T.pPublic) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=unblocked&q=grant.ns.cloudflare.com%20%2B%20uma.ns.cloudflare.com">' + esc(T.pGrantUma) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=unblocked&q=WAYBACK_CLONED">' + esc(T.pWayback) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=victims&public=1">' + esc(T.pVictimsPub) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=banned&rspo=1">' + esc(T.pBannedRspo) + '</button>' +
        '<button type="button" class="bzp-lens" data-cas-preset="view=banned&mc=1">' + esc(T.pBannedMc) + '</button>' +
      '</div>' +
      '<div class="bzp-kpis" id="cas-kpis"></div>' +
      '<div class="bzp-controls">' +
        '<div class="cas-filters-grid">' +
          '<input type="search" class="bzp-input" id="cas-q" placeholder="' + esc(T.searchPh) + '" aria-label="' + esc(T.searchPh) + '">' +
          '<select class="bzp-select" id="cas-cohort" aria-label="' + esc(T.allCohorts) + '"></select>' +
          '<select class="bzp-select" id="cas-vec" aria-label="' + esc(T.allVectors) + '">' +
            '<option value="">' + esc(T.allVectors) + '</option>' +
            '<option value="VECTOR_A_FULL_CASINO_TAKEOVER">' + esc(T.vecA) + ' (242)</option>' +
            '<option value="VECTOR_B2_DROPCAUGHT_SEO_FACADE">' + esc(T.vecB2) + ' (27)</option>' +
            '<option value="VECTOR_B1_LIVE_CMS_COMPROMISE">' + esc(T.vecB1) + ' (22)</option>' +
          '</select>' +
          '<select class="bzp-select" id="cas-voiv" aria-label="' + esc(T.allVoivs) + '">' +
            '<option value="">' + esc(T.allVoivs) + '</option>' +
            voivOptions +
          '</select>' +
          '<button type="button" class="bzp-reset-btn" id="cas-reset">' + esc(T.resetBtn) + '</button>' +
        '</div>' +
        '<div class="bzp-toggles">' +
          '<div class="bzp-check-group">' +
            '<label class="bzp-check"><input type="checkbox" id="cas-chk-pub"><span>' + esc(T.chkPublic) + '</span></label>' +
            '<label class="bzp-check"><input type="checkbox" id="cas-chk-live"><span>' + esc(T.chkLive) + '</span></label>' +
          '</div>' +
          '<div class="bzp-utils">' +
            '<button type="button" class="bzp-util-btn" id="cas-csv">' + esc(T.csvBtn) + '</button>' +
            '<a class="bzp-util-btn" href="/assets/lab/casino-state-2026.json" download style="display:inline-flex;align-items:center">' + esc(T.jsonBtn) + '</a>' +
            '<button type="button" class="bzp-util-btn" id="cas-embed-btn">' + esc(T.embedBtn) + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="bzp-embed-box" id="cas-embed-box">' +
          '<p>' + esc(T.embedInfo) + '</p>' +
          '<code class="bzp-embed-code">&lt;iframe src="' + reportCanon + '?embed=1" width="100%" height="780" style="border:1px solid #22211f;background:#f7f6f2" loading="lazy" title="' + esc(T.embedHeadTitle) + '"&gt;&lt;/iframe&gt;</code>' +
        '</div>' +
      '</div>' +
      '<div class="bzp-status-bar" id="cas-status"></div>' +
      '<div class="cas-table-wrap" id="cas-table"></div>' +
      '<div class="bzp-more-wrap" id="cas-more-wrap"></div>' +
      '<div class="bzp-embed-credit">' +
        '<span>' + esc(T.embedCreditLeft) + '</span>' +
        '<a href="' + reportCanon + '" target="_blank" rel="noopener noreferrer">roleplayingtech.com ↗</a>' +
      '</div>';

    var elQ = container.querySelector('#cas-q');
    var elCohort = container.querySelector('#cas-cohort');
    var elVec = container.querySelector('#cas-vec');
    var elVoiv = container.querySelector('#cas-voiv');
    var elChkPub = container.querySelector('#cas-chk-pub');
    var elChkLive = container.querySelector('#cas-chk-live');
    var elReset = container.querySelector('#cas-reset');
    var elCsv = container.querySelector('#cas-csv');
    var elEmbedBtn = container.querySelector('#cas-embed-btn');
    var elEmbedBox = container.querySelector('#cas-embed-box');
    var elKpis = container.querySelector('#cas-kpis');
    var elStatus = container.querySelector('#cas-status');
    var elTable = container.querySelector('#cas-table');
    var elMoreWrap = container.querySelector('#cas-more-wrap');

    function populateCohortDropdown() {
      if (state.view === 'banned') {
        elCohort.innerHTML =
          '<option value="">' + esc(T.allCohorts) + '</option>' +
          '<option value="PUBLIC_OR_REGISTRY_INSTITUTION">' + esc(T.catPubReg) + '</option>' +
          '<option value="WIKIPEDIA_CITED_PL_DOMAIN">' + esc(T.catWiki) + '</option>';
      } else {
        elCohort.innerHTML =
          '<option value="">' + esc(T.allCohorts) + '</option>' +
          '<option value="ACTIVE_RSPO_2025_2026">' + esc(T.cohRspoAct) + ' (105)</option>' +
          '<option value="ABANDONED_RSPO_2018_2023">' + esc(T.cohRspoHist) + ' (139)</option>' +
          '<option value="ACTIVE_RPWDL_PODMIOTY_LECZNICZE_2026">' + esc(T.cohRpwdl) + ' (41)</option>' +
          '<option value="ACTIVE_REJESTR_ZLOBKOW_2026">' + esc(T.cohZlobki) + ' (6+4)</option>';
      }
      elCohort.value = state.cohort;
    }

    function syncControls() {
      populateCohortDropdown();
      elQ.value = state.q;
      elVec.value = state.vector;
      elVoiv.value = state.voiv;
      elChkPub.checked = state.onlyPublic;
      elChkLive.checked = state.onlyLive;
      elVec.disabled = (state.view === 'victims' || state.view === 'banned' || state.view === 'govlinks');
      elVoiv.disabled = (state.view === 'banned' || state.view === 'govlinks');
      elCohort.disabled = (state.view === 'govlinks');

      container.querySelectorAll('[data-cas-view]').forEach(function (btn) {
        var active = btn.getAttribute('data-cas-view') === state.view;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function getFilteredRows() {
      var qLow = state.q.trim().toLowerCase().replace(/\./g, '[.]');
      var qPlain = state.q.trim().toLowerCase();

      function matchesText(haystack) {
        if (!qPlain) return true;
        var h = haystack.toLowerCase();
        return h.indexOf(qPlain) !== -1 || h.indexOf(qLow) !== -1;
      }

      if (state.view === 'govlinks') {
        return data.govBipLinks.filter(function (g) {
          if (state.onlyPublic && !g.isGovPl && !g.isBip) return false;
          var blob = [g.sourceUrl, g.sourceLabelPl, g.sourceLabelEn, g.defangedTargetDomain, g.notePl, g.noteEn, g.targetCategory].join(' ');
          return matchesText(blob);
        });
      }

      if (state.view === 'banned') {
        return data.mfBanned.filter(function (r) {
          if (state.cohort && r.domainCategory !== state.cohort) return false;
          if (state.onlyPublic && r.domainCategory !== 'PUBLIC_OR_REGISTRY_INSTITUTION') return false;
          if (state.onlyLive && !r.stillLiveRspo && !r.stillLiveRpwdl2 && r.govOrBipSourceUrls.length === 0) return false;
          if (state.onlyRspo && !r.stillLiveRspo) return false;
          if (state.onlyMc && !r.inMcRes65294) return false;
          var blob = [
            r.defangedDomain, r.entityOrContextName, r.mfBanDate, r.nsPair,
            r.wikipediaArticles.join(' '), r.rpwdlNotePl, r.rpwdlNoteEn, r.domainCategory
          ].join(' ');
          return matchesText(blob);
        });
      }

      var base = state.view === 'victims'
        ? data.unblocked.filter(function (r) { return r.vectorTier === 'VECTOR_B1_LIVE_CMS_COMPROMISE'; })
        : data.unblocked;

      return base.filter(function (r) {
        if (state.cohort) {
          if (state.cohort === 'ACTIVE_REJESTR_ZLOBKOW_2026') {
            if (r.registryCohort !== 'ACTIVE_REJESTR_ZLOBKOW_2026' && !r.alsoInZlobki2026) return false;
          } else if (r.registryCohort !== state.cohort) {
            return false;
          }
        }
        if (state.vector && r.vectorTier !== state.vector) return false;
        if (state.voiv && r.voivodeship !== state.voiv) return false;
        if (state.onlyPublic && !r.isPublicSector) return false;
        if (state.onlyLive && !r.stillLiveAnyPrimaryRegistry) return false;
        if (state.onlyMc && !r.inMcRes65294) return false;
        if (qPlain === '__other_reg__') {
          var regLow = (r.registrar || '').toLowerCase();
          if (!regLow) return false;
          return regLow.indexOf('aftermarket') === -1 &&
                 regLow.indexOf('hosting concepts') === -1 &&
                 regLow.indexOf('openprovider') === -1 &&
                 regLow.indexOf('netim') === -1 &&
                 regLow.indexOf('dynadot') === -1;
        }
        var blob = [
          r.defangedDomain, r.entityName, r.entityType, r.city, r.gmina, r.powiat,
          r.voivodeship, r.nsPair, r.registrar, r.detectedBrands, r.facadeSubtype,
          r.defangedRedirectHub, r.cmsFamily, r.entityId
        ].join(' ');
        return matchesText(blob);
      });
    }

    function renderKpis(rows) {
      if (state.view === 'govlinks') {
        var domSum = rows.reduce(function (acc, g) { return acc + g.domAnchorOccurrences; }, 0);
        var govCnt = rows.filter(function (g) { return g.isGovPl; }).length;
        var bipCnt = rows.filter(function (g) { return g.isBip; }).length;
        elKpis.innerHTML =
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi1Lbl) + '</span><span class="bzp-kpi-val">' + rows.length + '</span><span class="bzp-kpi-sub">' + esc(T.kpi1SubGov) + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpiGovDofollow) + '</span><span class="bzp-kpi-val">' + domSum + '</span><span class="bzp-kpi-sub">' + (LANG === 'pl' ? 'bez atrybutu rel="nofollow"' : 'zero rel="nofollow" attributes') + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpiGovDomains) + '</span><span class="bzp-kpi-val">' + govCnt + '</span><span class="bzp-kpi-sub">gov.pl/web/klimat + bbpn.gov.pl</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpiGovBip) + '</span><span class="bzp-kpi-val">' + bipCnt + '</span><span class="bzp-kpi-sub">' + (LANG === 'pl' ? 'Biuletyny Informacji Publicznej' : 'Municipal BIP portals') + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpiGovCounty) + '</span><span class="bzp-kpi-val">' + (rows.length - govCnt - bipCnt) + '</span><span class="bzp-kpi-sub">powiat.klodzko.pl → 301</span></div>';
        return;
      }

      if (state.view === 'banned') {
        var pubBan = rows.filter(function (r) { return r.domainCategory === 'PUBLIC_OR_REGISTRY_INSTITUTION'; }).length;
        var rspoBan = rows.filter(function (r) { return r.stillLiveRspo; }).length;
        var rspoCardsSum = rows.reduce(function (acc, r) { return acc + (r.stillLiveRspo ? Number(r.liveRspoCardsCount || 0) : 0); }, 0);
        var rspoActiveSum = rows.filter(function (r) { return r.stillLiveActiveRspoCard; }).length;
        var mcBan = rows.filter(function (r) { return r.inMcRes65294; }).length;
        var wikiBan = rows.filter(function (r) { return r.wikipediaArticlesCount > 0; }).length;
        var wikiUnique = {};
        rows.forEach(function (r) {
          (r.wikipediaArticles || []).forEach(function (a) { wikiUnique[a] = true; });
        });
        var wikiUniqueCnt = Object.keys(wikiUnique).length;
        var cardsUnit = LANG === 'pl' ? '/ ' + rspoCardsSum + ' kart' : '/ ' + rspoCardsSum + ' cards';
        var activeSub = LANG === 'pl' ? 'w tym ' + rspoActiveSum + ' aktywne placówki' : 'incl. ' + rspoActiveSum + ' active cards';
        var wikiSub = LANG === 'pl' ? wikiUniqueCnt + ' artykułów encyklopedycznych' : 'across ' + wikiUniqueCnt + ' encyclopedia articles';
        elKpis.innerHTML =
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi1Lbl) + '</span><span class="bzp-kpi-val">' + rows.length + '</span><span class="bzp-kpi-sub">' + esc(T.kpi1SubBan) + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi2Lbl) + '</span><span class="bzp-kpi-val">' + pubBan + '</span><span class="bzp-kpi-sub">' + esc(T.catPubReg) + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpiBanRspo) + '</span><span class="bzp-kpi-val">' + rspoBan + '<small>' + esc(cardsUnit) + '</small></span><span class="bzp-kpi-sub">' + esc(activeSub) + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi4Lbl) + '</span><span class="bzp-kpi-val">' + mcBan + '</span><span class="bzp-kpi-sub">' + esc(T.kpi4Sub) + '</span></div>' +
          '<div class="bzp-kpi"><span class="bzp-kpi-label">Wikipedia (.pl)</span><span class="bzp-kpi-val">' + wikiBan + '</span><span class="bzp-kpi-sub">' + esc(wikiSub) + '</span></div>';
        return;
      }

      var pubCnt = rows.filter(function (r) { return r.isPublicSector; }).length;
      var liveCnt = rows.filter(function (r) { return r.stillLiveAnyPrimaryRegistry; }).length;
      var mcCnt = rows.filter(function (r) { return r.inMcRes65294; }).length;
      var cfCnt = rows.filter(function (r) { return r.nsProvider === 'Cloudflare'; }).length;
      var cfPct = rows.length ? fmtNum(cfCnt / rows.length * 100, 1) : '0';
      var sub1 = state.view === 'victims' ? T.kpi1SubVic : T.kpi1SubUnb;

      elKpis.innerHTML =
        '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi1Lbl) + '</span><span class="bzp-kpi-val">' + rows.length + '</span><span class="bzp-kpi-sub">' + esc(sub1) + '</span></div>' +
        '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi2Lbl) + '</span><span class="bzp-kpi-val">' + pubCnt + '<small>(' + (rows.length ? fmtNum(pubCnt / rows.length * 100, 0) : 0) + '%)</small></span><span class="bzp-kpi-sub">' + esc(T.kpi2Sub) + '</span></div>' +
        '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi3Lbl) + '</span><span class="bzp-kpi-val">' + liveCnt + '</span><span class="bzp-kpi-sub">' + esc(T.kpi3Sub) + '</span></div>' +
        '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi4Lbl) + '</span><span class="bzp-kpi-val">' + mcCnt + '</span><span class="bzp-kpi-sub">' + esc(T.kpi4Sub) + '</span></div>' +
        '<div class="bzp-kpi"><span class="bzp-kpi-label">' + esc(T.kpi5Lbl) + '</span><span class="bzp-kpi-val">' + cfPct + '<small>%</small></span><span class="bzp-kpi-sub">' + cfCnt + ' / ' + rows.length + ' · ' + esc(T.kpi5Sub) + '</span></div>';
    }

    function renderRows(rows) {
      var shown = rows.slice(0, state.limit);
      elStatus.innerHTML = '<div>' + esc(T.showing) + ' <strong>' + shown.length + '</strong> ' + esc(T.of) + ' <strong>' + rows.length + '</strong> ' + esc(T.matching) + '</div>';

      if (state.view === 'govlinks') {
        var govHead =
          '<div class="cas-row is-head">' +
            '<div>' + esc(T.colGovTarget) + '</div>' +
            '<div>' + esc(T.colGovPage) + '</div>' +
            '<div>' + esc(T.colGovStatus) + '</div>' +
            '<div style="grid-column:span 2">' + esc(T.colGovNote) + '</div>' +
            '<div style="text-align:right">' + esc(T.colVerify) + '</div>' +
          '</div>';
        var govBody = shown.map(function (g) {
          var lbl = LANG === 'pl' ? g.sourceLabelPl : g.sourceLabelEn;
          var note = LANG === 'pl' ? g.notePl : g.noteEn;
          return '<div class="cas-row">' +
            '<div class="cas-cell-dom"><span class="defang-dom is-rust">' + esc(g.defangedTargetDomain) + '</span><small>href: ' + esc(g.defangedHref) + ' (' + g.domAnchorOccurrences + '×)</small></div>' +
            '<div class="cas-cell-inst"><strong>' + esc(lbl) + '</strong><span>' + esc(g.sourceHost) + ' · dofollow</span></div>' +
            '<div class="cas-cell-vec"><span class="bzp-badge is-rust">' + esc(g.targetCategory) + '</span></div>' +
            '<div class="cas-cell-silo" style="grid-column:span 2">' + esc(note) + '</div>' +
            '<div class="cas-cell-verify"><a class="cas-verify-link" href="' + esc(g.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(T.openSourcePage) + '</a></div>' +
          '</div>';
        }).join('');
        elTable.innerHTML = govHead + govBody;
      } else if (state.view === 'banned') {
        var banHead =
          '<div class="cas-row is-head">' +
            '<div>' + esc(T.colDom) + '</div>' +
            '<div>' + esc(T.colInst) + '</div>' +
            '<div>' + esc(T.colMfXml) + '</div>' +
            '<div>' + esc(T.colSilo) + '</div>' +
            '<div>' + esc(T.colInfra) + '</div>' +
            '<div style="text-align:right">' + esc(T.colVerify) + '</div>' +
          '</div>';
        var banBody = shown.map(function (r) {
          var badges = '';
          if (r.stillLiveActiveRspoCard) badges += '<span class="bzp-badge is-rust">' + esc(T.badgeRspoActive) + '</span>';
          else if (r.stillLiveRspo) badges += '<span class="bzp-badge is-pending">' + esc(T.badgeRspoLive) + ' (' + r.liveRspoCardsCount + ')</span>';
          if (r.stillLiveRpwdl2) badges += '<span class="bzp-badge is-rust">' + esc(T.badgeRpwdlLive) + '</span>';
          if (r.inMcRes65294) badges += '<span class="bzp-badge">' + esc(T.badgeMc) + '</span>';
          if (r.govOrBipSourceUrls.length > 0) badges += '<span class="bzp-badge is-rust">' + esc(T.badgeGovLink) + '</span>';
          if (r.wikipediaArticlesCount > 0) badges += '<span class="bzp-badge">' + esc(T.badgeWiki) + ': ' + r.wikipediaArticlesCount + '</span>';

          var lagTxt = r.mfEnforcementLagDays != null ? ' · ' + r.mfEnforcementLagDays + 'd lag' : '';
          var ctxName = r.entityOrContextName || (r.wikipediaArticles[0] ? 'Wikipedia: ' + r.wikipediaArticles.slice(0, 2).join(', ') : cohortLabel(r.domainCategory));
          var rpwdlNote = LANG === 'pl' ? r.rpwdlNotePl : r.rpwdlNoteEn;
          var entriesLbl = LANG === 'pl' ? ' wpis(y)' : (r.mfBannedSubdomainsCount === 1 ? ' entry' : ' entries');

          return '<div class="cas-row">' +
            '<div class="cas-cell-dom"><span class="defang-dom">' + esc(r.defangedDomain) + '</span><small>' + esc(cohortLabel(r.domainCategory)) + '</small></div>' +
            '<div class="cas-cell-inst"><strong>' + esc(ctxName) + '</strong>' + (rpwdlNote ? '<span>' + esc(rpwdlNote) + '</span>' : '') + '</div>' +
            '<div class="cas-cell-vec"><strong>' + esc(r.mfBanDate) + '</strong><br><small>' + r.mfBannedSubdomainsCount + entriesLbl + esc(lagTxt) + '</small></div>' +
            '<div class="cas-cell-silo"><div class="bzp-badges" style="margin-top:0">' + badges + '</div></div>' +
            '<div class="cas-cell-infra"><code>' + esc(r.nsPair || T.noNs) + '</code></div>' +
            '<div class="cas-cell-verify">' +
              '<a class="cas-verify-link" href="' + esc(r.officialVerificationUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(r.officialVerificationLabel) + ' ↗</a>' +
            '</div>' +
          '</div>';
        }).join('');
        elTable.innerHTML = banHead + banBody;
      } else {
        var unbHead =
          '<div class="cas-row is-head">' +
            '<div>' + esc(T.colDom) + '</div>' +
            '<div>' + esc(T.colInst) + '</div>' +
            '<div>' + esc(T.colVec) + '</div>' +
            '<div>' + esc(T.colSilo) + '</div>' +
            '<div>' + esc(T.colInfra) + '</div>' +
            '<div style="text-align:right">' + esc(T.colVerify) + '</div>' +
          '</div>';
        var unbBody = shown.map(function (r) {
          var isVictim = r.vectorTier === 'VECTOR_B1_LIVE_CMS_COMPROMISE';
          var vecBadgeCls = isVictim ? 'is-open' : (r.vectorTier === 'VECTOR_B2_DROPCAUGHT_SEO_FACADE' ? 'is-pending' : 'is-rust');
          var subNote = '';
          if (r.facadeSubtype === 'WAYBACK_CLONED_SCHOOL_PBN') subNote = '<small style="display:block;margin-top:4px;color:#514e49">' + esc(T.subWayback) + '</small>';
          else if (r.facadeSubtype === 'CASINO_BLOG_OR_CRASH_GAME_FACADE') subNote = '<small style="display:block;margin-top:4px;color:#514e49">' + esc(T.subCrash) + '</small>';
          else if (isVictim) subNote = '<small style="display:block;margin-top:4px;color:#26455b;font-weight:600">' + esc(T.badgeCert) + '</small>';
          else if (r.defangedRedirectHub) subNote = '<small style="display:block;margin-top:4px;color:#68655f">301 → ' + esc(r.defangedRedirectHub) + '</small>';

          var siloBadges = '';
          if (r.stillLiveAnyPrimaryRegistry) siloBadges += '<span class="bzp-badge is-rust">' + esc(T.badgeLiveReg) + '</span>';
          if (r.inMcRes65294) siloBadges += '<span class="bzp-badge">' + esc(T.badgeMc) + '</span>';
          if (r.govOrBipSourceUrls.length > 0) siloBadges += '<span class="bzp-badge is-rust">' + esc(T.badgeGovLink) + '</span>';
          if (r.redirectsToMfBannedHub) siloBadges += '<span class="bzp-badge is-cancel">' + esc(T.badgeMfHub) + '</span>';
          siloBadges += '<span class="bzp-badge ' + (r.isPublicSector ? 'is-eu' : '') + '">' + esc(r.isPublicSector ? T.badgePublic : T.badgeNonPublic) + '</span>';

          var locParts = [r.city, voivTitleCase(r.voivodeship), cohortLabel(r.registryCohort)].filter(Boolean).join(' · ');
          var scaleNote = LANG === 'pl' ? r.scaleNotePl : r.scaleNoteEn;
          var infraTop = r.nsPair ? r.nsPair.replace(/\.ns\.cloudflare\.com/g, '') : r.nsProvider;
          var regShort = r.registrar ? ' · ' + r.registrar : '';
          var ageTxt = r.daysUnblockedSinceTakeover != null ? r.daysUnblockedSinceTakeover + ' ' + T.daysUnblocked : (r.earliestDetectedInjectionDate ? 'CMS inj.: ' + r.earliestDetectedInjectionDate : '');

          var remedyText = isVictim ? T.remedyCert : T.remedyMf;
          var drawerId = 'drawer-' + r.id;

          return '<div class="cas-row' + (isVictim ? ' is-victim-row' : '') + '">' +
            '<div class="cas-cell-dom"><span class="defang-dom' + (isVictim ? '' : ' is-rust') + '">' + esc(r.defangedDomain) + '</span>' + (ageTxt ? '<small>' + esc(ageTxt) + '</small>' : '') + '</div>' +
            '<div class="cas-cell-inst"><strong>' + esc(r.entityName) + '</strong><span>' + esc(locParts) + (scaleNote ? ' · ' + esc(scaleNote) : '') + '</span></div>' +
            '<div class="cas-cell-vec"><span class="bzp-badge ' + vecBadgeCls + '">' + esc(vectorLabel(r.vectorTier)) + '</span>' + subNote + '</div>' +
            '<div class="cas-cell-silo"><div class="bzp-badges" style="margin-top:0">' + siloBadges + '</div></div>' +
            '<div class="cas-cell-infra"><code>' + esc(infraTop + regShort) + '</code></div>' +
            '<div class="cas-cell-verify">' +
              '<a class="cas-verify-link" href="' + esc(r.officialRegistryUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(r.officialRegistryLabel) + ' ↗</a>' +
              '<button type="button" class="cas-detail-toggle" data-toggle-drawer="' + drawerId + '">' + esc(T.detailsOpen) + '</button>' +
            '</div>' +
            '<div class="cas-row-drawer" id="' + drawerId + '">' +
              '<div class="cas-drawer-grid">' +
                '<div><small>' + esc(T.drawerRegStatus) + '</small>' + esc(cohortLabel(r.registryCohort)) + ' · ID: <code>' + esc(r.entityId || '—') + '</code>' + (r.govOrBipSourceUrls.length ? ' · BIP/gov.pl: ' + esc(r.govOrBipSourceUrls.join(', ')) : '') + '</div>' +
                '<div><small>' + esc(T.drawerTech) + '</small>NS: <code>' + esc(r.nsPair || '—') + '</code> · ASN: <code>' + esc(r.asn || '—') + '</code>' + (r.rdapRegistrationDate ? ' · RDAP: <code>' + esc(r.rdapRegistrationDate) + '</code>' : '') + (r.cmsFamily ? ' · CMS: <code>' + esc(r.cmsFamily) + '</code>' : '') + '</div>' +
                '<div><small>' + esc(T.drawerRemedy) + '</small>' + esc(remedyText) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        elTable.innerHTML = unbHead + unbBody;
      }

      if (rows.length > state.limit) {
        elMoreWrap.innerHTML =
          '<button type="button" class="bzp-util-btn" id="cas-more-btn">' + esc(T.loadMore) + ' (' + (rows.length - state.limit) + ')</button>';
        var btnMore = elMoreWrap.querySelector('#cas-more-btn');
        if (btnMore) {
          btnMore.addEventListener('click', function () {
            state.limit += 50;
            renderRows(rows);
          });
        }
      } else {
        elMoreWrap.innerHTML = '';
      }

      elTable.querySelectorAll('[data-toggle-drawer]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var did = btn.getAttribute('data-toggle-drawer');
          var dr = document.getElementById(did);
          if (!dr) return;
          var open = dr.classList.toggle('is-open');
          btn.textContent = open ? T.detailsClose : T.detailsOpen;
        });
      });
    }

    function render() {
      var rows = getFilteredRows();
      renderKpis(rows);
      renderRows(rows);
    }

    // Event bindings inside explorer
    container.querySelectorAll('[data-cas-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.view = btn.getAttribute('data-cas-view');
        state.cohort = '';
        state.vector = '';
        state.onlyRspo = false;
        state.onlyMc = false;
        state.limit = 30;
        syncControls();
        render();
      });
    });

    container.querySelectorAll('[data-cas-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPresetQuery(btn.getAttribute('data-cas-preset'));
      });
    });

    elQ.addEventListener('input', function () {
      state.q = elQ.value;
      state.limit = 30;
      render();
    });
    elCohort.addEventListener('change', function () {
      state.cohort = elCohort.value;
      state.limit = 30;
      render();
    });
    elVec.addEventListener('change', function () {
      state.vector = elVec.value;
      state.limit = 30;
      render();
    });
    elVoiv.addEventListener('change', function () {
      state.voiv = elVoiv.value;
      state.limit = 30;
      render();
    });
    elChkPub.addEventListener('change', function () {
      state.onlyPublic = elChkPub.checked;
      state.limit = 30;
      render();
    });
    elChkLive.addEventListener('change', function () {
      state.onlyLive = elChkLive.checked;
      state.limit = 30;
      render();
    });
    elReset.addEventListener('click', function () {
      applyPresetObject({ view: 'unblocked' });
    });
    elEmbedBtn.addEventListener('click', function () {
      elEmbedBox.classList.toggle('is-open');
    });

    // Defanged CSV export
    elCsv.addEventListener('click', function () {
      var rows = getFilteredRows();
      var lines = [];
      function csvCell(v) {
        var s = String(v == null ? '' : v).replace(/"/g, '""');
        return '"' + s + '"';
      }
      if (state.view === 'govlinks') {
        lines.push(['source_url', 'defanged_target_domain', 'defanged_href', 'dom_occurrences', 'status'].join(','));
        rows.forEach(function (g) {
          lines.push([g.sourceUrl, g.defangedTargetDomain, g.defangedHref, g.domAnchorOccurrences, g.targetCategory].map(csvCell).join(','));
        });
      } else if (state.view === 'banned') {
        lines.push(['defanged_domain', 'category', 'mf_ban_date', 'lag_days', 'live_rspo', 'in_mc_65294', 'wiki_articles_count', 'entity_or_context', 'official_verification_url'].join(','));
        rows.forEach(function (r) {
          lines.push([r.defangedDomain, r.domainCategory, r.mfBanDate, r.mfEnforcementLagDays, r.stillLiveRspo, r.inMcRes65294, r.wikipediaArticlesCount, r.entityOrContextName, r.officialVerificationUrl].map(csvCell).join(','));
        });
      } else {
        lines.push(['defanged_domain', 'vector_tier', 'facade_subtype', 'registry_cohort', 'entity_id', 'entity_name', 'public_sector', 'voivodeship', 'city', 'still_live_primary_registry', 'in_mc_65294', 'ns_pair', 'registrar', 'rdap_date', 'days_unblocked', 'official_registry_url'].join(','));
        rows.forEach(function (r) {
          lines.push([r.defangedDomain, r.vectorTier, r.facadeSubtype, r.registryCohort, r.entityId, r.entityName, r.isPublicSector, r.voivodeship, r.city, r.stillLiveAnyPrimaryRegistry, r.inMcRes65294, r.nsPair, r.registrar, r.rdapRegistrationDate, r.daysUnblockedSinceTakeover, r.officialRegistryUrl].map(csvCell).join(','));
        });
      }
      var blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'casino-state-' + state.view + '-defanged.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Globalpreset delegation from prose, hero KPIs, Figure 01, Figure 02, and Figure 03!
    document.addEventListener('click', function (ev) {
      var presetEl = ev.target.closest('[data-cas-preset]');
      if (presetEl && !container.contains(presetEl)) {
        ev.preventDefault();
        applyPresetQuery(presetEl.getAttribute('data-cas-preset'));
        var expSec = document.getElementById('explorer');
        if (expSec) expSec.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      var jumpQ = ev.target.closest('[data-cas-jump-q]');
      if (jumpQ) {
        ev.preventDefault();
        applyPresetObject({
          view: jumpQ.getAttribute('data-cas-jump-view') || 'unblocked',
          q: jumpQ.getAttribute('data-cas-jump-q') || ''
        });
        var expSec2 = document.getElementById('explorer');
        if (expSec2) expSec2.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      var jumpVoiv = ev.target.closest('[data-cas-jump-voiv]');
      if (jumpVoiv) {
        ev.preventDefault();
        applyPresetObject({
          view: 'unblocked',
          voiv: jumpVoiv.getAttribute('data-cas-jump-voiv') || ''
        });
        var expSec3 = document.getElementById('explorer');
        if (expSec3) expSec3.scrollIntoView({ behavior: 'smooth' });
      }
    });

    syncControls();
    render();
  }

  function init() {
    var container = document.getElementById('casino-explorer');
    if (!container) return;
    var src = container.getAttribute('data-src') || '/assets/lab/casino-state-2026.json';
    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!IS_EMBED) {
          mountInfraTabs(data);
        }
        mountExplorer(container, data);
      })
      .catch(function (err) {
        console.error('Failed to load casino-state dataset:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
