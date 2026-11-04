# Metodologia i specyfikacja weryfikacji · Raport NR 03 („Cyberbezpieczny Samorząd” — wszystkie 2 809 JST)

- **Raport PL:** `https://roleplayingtech.com/pl/lab/cyberbezpieczny-samorzad/`
- **Raport EN:** `https://roleplayingtech.com/en/lab/municipal-cybersecurity/`
- **Zbiór danych JSON:** [`/assets/lab/jst-cyber-2026.json`](../../assets/lab/jst-cyber-2026.json)
- **Okno pomiarowe:** `03–04.11.2026` (34 dni po twardym terminie zakończenia i rozliczenia projektów grantowych `FERC.02.02-CS.01-001/23`, tj. `30.09.2026`).

## 1. Rekonstrukcja pełnej populacji 2 809 ustawowych JST i uzgodnienie z CPPC co do grosza

Podstawą adresową badania był wykaz teleadresowy jednostek samorządu terytorialnego publikowany przez MSWiA (`jst_2026_04_16.xls`, `2 807` rekordów) skrzyżowany po 7-cyfrowym kodzie `TERYT` z:
1. krajowym rejestrem podziału terytorialnego GUS TERYT (`2 809` jednostek na 2026 r.: `2 479` gmin w tym `66` miast na prawach powiatu, `314` powiatów ziemskich i `16` województw),
2. oficjalną listą rankingową pozytywnie ocenionych wniosków Centrum Projektów Polska Cyfrowa w naborze `FERC.02.02-CS.01-001/23` (*Cyberbezpieczny Samorząd*, aktualizacja z `24.02.2025`, `2 511` wniosków na łączną kwotę `1 483 979 072,49 zł` oraz komunikat CPPC o `2 495` podpisanych umowach na `1 474 312 573,61 zł`).

W trakcie audytu krzyżowego (Faza C) wykryto i skorygowano sześć rozbieżności rejestrowych:
- **Uzupełnienie 2 gmin pominiętych w pliku MSWiA:** w wykazie MSWiA brakowało dwóch ustawowych gmin miejsko-wiejskich: **Gminy Włoszczowa (`2613063`)** oraz **Gminy Baborów (`1602013`)** — obie figurują w GUS TERYT oraz na liście rankingowej CPPC (`lp. 631` na `850 000,00 zł` i `lp. 760` na `473 947,00 zł`).
- **Usunięcie fałszywego dopasowania powiatowego na Gminie Branice (`1602023`):** wobec braku Baborowa w pliku MSWiA zapasowa reguła powiatowa przypisała początkowo grant Baborowa sąsiedniej Gminie Branice w tym samym powiecie głubczyckim. Po korekcie wszystkie `2 511` wniosków CPPC uzgadniają się w 100% co do pojedynczego grosza (`1 483 979 072,49 zł`).
- **Korekta dziedziczenia RFC 7489 na 8 subdomenach pocztowych** (m.in. `powiat.kedzierzyn-kozle.pl`, `starostwo.krotoszyn.pl`, `um.sandomierz.pl`, `poczta.gminalezajsk.pl`, `powiat.tatry.pl`, `um.starogard.pl`, `um.zory.pl`, `powiat.bartoszyce.pl`), korekta literówki TLD w `2007072 Śniadowo` (`sniadowo.pl`, brak DMARC), aktualizacja 3 gmin po migracji z dawnych skrzynek komercyjnych na własne domeny z kwarantanną DMARC oraz uzupełnienie domen pocztowych 2 starostw dolnośląskich z pustą kolumną e-mail w pliku MSWiA (`0219000` i `0222000`).

## 2. Protokół pomiaru poczty urzędowej (`MX`, `SPF`, `DMARC`, `DNSSEC`) i benchmark `.gov.pl`

- Z puli `2 809` JST wyodrębniono **`2 779` domen instytucjonalnych** (własne domeny `.pl`/`.eu`, subdomeny `.gov.pl` oraz wspólne węzły miejsko-gminne) oraz **`30` gmin działających na żywo na zewnętrznych skrzynkach komercyjnych lub współdzielonych domenach ISP** (potwierdzonych ręcznym i automatycznym sprawdzeniem aktualnych stron głównych oraz BIP).
- Dla każdej strefy pocztowej sprawdzono rekordy `MX`, `A`, `TXT` (`v=spf1` z licznikiem zapytań mechanizmów DNS wg RFC 7208 pkt 4.6.4 — limit 10 zapytań), `_dmarc.<domena>` oraz dziedziczenie z domeny organizacyjnej wg **RFC 7489 pkt 6.6.3** ( z uwzględnieniem tagu `sp=` dla subdomen oraz odrzucenia duplikatów `v=DMARC1` jako `PermError`), a także flagę kryptograficznej walidacji `DNSSEC AD=True`. Wszystkie jednostki wymienione z nazwy w tekście zweryfikowano podwójnie przez niezależne serwery DoH (`dns.google` oraz `cloudflare-dns.com`).
- Identyczną procedurą przebadano wszystkie **`1 395` domen zarejestrowanych w strefie `.gov.pl`**, w tym **`1 124` aktywne domeny pocztowe posiadające rekord `MX`**.

### Odporność testu hipotezy zerowej na wybór mianownika

| Wariant populacji domen instytucjonalnych | `N` | Brak skutecznego DMARC | Grantobiorcy vs bez grantu | Test χ² Yatesa (`p`) | Dokładny test Fishera (`p`) | Podatne łącznie (`brak + p=none`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Pełna populacja 2 809 JST po weryfikacji live (główna baza)** | **2 779** | **362 (13,03%)** | **12,77% vs 15,20%** | **0,2777** | **0,2357** | **734 (26,41%)** |
| Pełna populacja 2 809 JST bez 2 starostw pustych w MSWiA | 2 777 | 362 (13,04%) | 12,78% vs 15,20% | 0,2800 | 0,2360 | 734 (26,43%) |
| Wyłącznie 2 807 JST z arkusza MSWiA po korektach Fazy C | 2 775 | 361 (13,01%) | 12,75% vs 15,20% | 0,2732 | 0,2351 | 733 (26,41%) |
| Surowy skan Fazy A przed korektami subdomen i migracji | 2 773 | 361 (13,02%) | 12,75% vs 15,25% | 0,2646 | 0,2340 | 737 (26,58%) |

## 3. Pomiar śledzenia Zero-Click w przeglądarce Chromium (Playwright Stealth)

Sam statyczny kod w HTML nie przesądza o naruszeniu prywatności, jeśli menedżer zgód (CMP) wstrzymuje wykonanie skryptów zewnętrznych do czasu wyrażenia zgody. Dlatego wszystkie **350 witryn ze statycznym śladem skryptów Mety** oraz losową próbę kontrolną **100 witryn korzystających wyłącznie z Google Tag Managera** (plus 20 dodatkowych kontenerów GTM) odwiedzono czystą instancją przeglądarki Chromium (`headless`, świeży profil bez ciasteczek, zamaskowana flaga `navigator.webdriver`, **zero kliknięć w baner cookies**, 10 sekund nasłuchu żądań sieciowych po `domcontentloaded`):
- Spośród **346 osiągalnych stron z kodem Mety** aż **336 (97,11%)** nawiązało połączenie z serwerami Mety przed jakąkolwiek zgodą użytkownika: **331** poprzez niezablokowane wtyczki społecznościowe (`connect.facebook.net/.../sdk.js` / `facebook.com/plugins/page.php`), a **5** poprzez pełny, komercyjny **Meta Pixel** (`fbevents.js` + beacon `facebook.com/tr` + ciasteczko `_fbp` w 4 z 5 przypadków oraz aktywny skrypt `Automatic Advanced Matching` `udwv[em]` na portalu Tarnowa).
- **9 witryn z tej samej grupy** prawidłowo zablokowało ładowanie skryptów Mety i Google przed wyrażeniem zgody, stanowiąc bezpośredni dowód wykonalności technicznej zgodnej z art. 399 PKE i wyrokiem TSUE C-40/17 (*Fashion ID*).

## 4. Podstawa prawna i ograniczenia metodologiczne

- **Podstawa prawna poczty podmiotów publicznych:** `art. 24 ust. 1 i 2`, `art. 27 ust. 7`, `art. 40 ust. 1` oraz `art. 47` *Ustawy z dnia 28 lipca 2023 r. o zwalczaniu nadużyć w komunikacji elektronicznej* (`Dz.U. 2023 poz. 1703`; t.j. `Dz.U. 2024 poz. 1803`) — obowiązek stosowania `SPF`, `DMARC` i `DKIM` od **25 grudnia 2023 r.** (Uwaga: ustawa nie definiuje minimalnej polityki `p=quarantine`/`p=reject`, dlatego w analizie rygorystycznie oddzielamy całkowity brak rekordu DMARC łamiący ustawę wprost od polityki `p=none` spełniającej literalne minimum rekordu bez blokowania spoofingu).
- **Ograniczenie selektorów DKIM:** publiczny DNS nie pozwala pasywnie wylistować prywatnych nazw selektorów `<selector>._domainkey` bez posiadania nagłówka wysłanej wiadomości e-mail z danego urzędu; dlatego pomiar DNS ocenia kompletnie `MX`, `SPF`, `DMARC` i `DNSSEC`, nie stawiając zarzutów o brak samego klucza DKIM.
- **Granica zewnętrznego audytu:** pomiar nie ocenia wewnętrznej sieci urzędu (backupów, segmentacji VLAN, EDR, szkoleń ani audytów SZBI sfinansowanych z grantu).
