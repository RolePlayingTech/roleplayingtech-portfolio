# Metodologia i przewodnik weryfikacji źródłowej · Państwo linkuje do kasyna (NR 02 · 11.2026)

**Data snapshotu (stan główny danych):** `03.11.2026` (ponowna weryfikacja żywych kart API i stron `.gov.pl` / `BIP`: `04.11.2026`)  
**Zbiór danych:** [`assets/lab/casino-state-2026.json`](../../assets/lab/casino-state-2026.json) (`291` domen aktywnych poza blokadą DNS + `68` domen zablokowanych w Rejestrze MF nadal obecnych w publicznych bazach/Wikipedii + `9` stron `.gov.pl` / starostw / `BIP` z `10` linkami `dofollow`)  
**Skrypty ETL i weryfikacji:** [`scripts/build_casino_state_dataset.py`](../../scripts/build_casino_state_dataset.py) · [`scripts/verify_casino_report.py`](../../scripts/verify_casino_report.py) · [`scripts/generate_casino_og.py`](../../scripts/generate_casino_og.py)  
**Zasada bezpieczeństwa i prawa (art. 29 u.g.h. + ochrona ofiar włamań):** Wszystkie domeny przejęte, afiliacyjne i zainfekowane zapisano w postaci trwale zneutralizowanej (`przyklad[.]pl`, `hxxps://...`), bez ani jednego klikalnego linku do witryn hazardowych oraz bez ujawniania wersji wtyczek/PHP i dokładnych ścieżek wstrzyknięć dla pojedynczych żywych serwerów z Wektora B1.

---

## 1. Zakres badania i pięć publicznych źródeł pierwotnych

Śledztwo odpowiada na pytanie, co dzieje się z własnymi domenami internetowymi (`.pl`, `.edu.pl`, `.com.pl`, regionalnymi i `.eu`) wpisanymi przez polskie szkoły, przedszkola, żłobki, szpitale i przychodnie do państwowych rejestrów referencyjnych — oraz czy rejestry poszczególnych resortów wymieniają informacje z listą blokad DNS prowadzoną przez Ministra Finansów.

Wykorzystano pięć oficjalnych źródeł państwowych (oraz pomocniczo polskojęzyczną Wikipedię, protokół RDAP NASK/EURid/ICANN, zapytania autorytatywne DNS-over-HTTPS i archiwum Wayback Machine CDX):

1. **Rejestr Szkół i Placówek Oświatowych (`RSPO`, MEN / Centrum Informatyczne Edukacji):**
   - publiczny interfejs REST API `https://rspo.gov.pl/api/Institution/{id}` oraz zrzuty tabelaryczne SIO/RSPO z lat `2018–2026` (`dane.gov.pl`), prowadzone na podstawie **art. 7 ust. 1 pkt 10, ust. 2 oraz art. 36 ust. 1 pkt 1 i ust. 2–3 ustawy z dnia 15 kwietnia 2011 r. o systemie informacji oświatowej** (`Dz.U. 2026 poz. 803`; 7-dniowy ustawowy termin aktualizacji danych), zawierające zadeklarowane pole `stronaInternetowa` wraz ze statusem publicznym/niepublicznym, typem placówki, liczbą uczniów i datą likwidacji (`liquidationDate`).
2. **Rejestr Podmiotów Wykonujących Działalność Leczniczą (`RPWDL2`, MZ / Centrum e-Zdrowia):**
   - nocny pełny zrzut `CSV_Rpm_aktywne` z portalu `dane.gov.pl` (zasób `70070`, sygnatura `Info.txt: 2026-11-03 00:00:00`), obejmujący relacyjnie połączone tabele podmiotów (`podmioty.csv`), zakładów leczniczych (`zaklady.csv`) i komórek organizacyjnych (`komorki.csv`), weryfikowany z kartami ksiąg rejestrowych na `https://rpwdl2.ezdrowie.gov.pl/`.
3. **Rejestr Żłobków i Klubów Dziecięcych (`MRPiPS`, portal Emp@tia):**
   - publiczny wykaz `https://empatia.mpips.gov.pl/web/piu/dla-swiadczeniobiorcow/rodzina/d3/rejestr-zlobkow-i-klubow` (`dane.gov.pl`), zawierający adresy WWW żłobków samorządowych i niepublicznych.
4. **Ustawowy *Wykaz stron internetowych i aplikacji mobilnych podmiotów publicznych* (`Ministerstwo Cyfryzacji`):**
   - prowadzony na podstawie **art. 14 ust. 4 ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych**, publikowany na `dane.gov.pl` (zbiór `1875`: najnowszy opublikowany zasób `65294` z `2025-03-13` [stan danych: `2024-04-30`] liczący `98 048` wierszy oraz wcześniejszy zasób `40236` z `2022-07-20` liczący `98 039` wierszy, wykorzystywany porównawczo).
5. **Rejestr Domen Służących do Oferowania Gier Hazardowych Niezgodnie z Ustawą (`Ministerstwo Finansów / KAS`):**
   - urzędowy plik maszynowy XML `https://hazard.mf.gov.pl/api/Register` udostępniany przedsiębiorcom telekomunikacyjnym i dostawcom usług płatniczych na podstawie **art. 15f ust. 3 ustawy z dnia 19 listopada 2009 r. o grach hazardowych** (`Dz.U. 2025 poz. 595 t.j.`), obejmujący `59 376` wpisów z okresu `2017-04-12 – 2026-11-03`.

Dodatkowo wykonano przeszukanie zewnętrznych odnośników w polskojęzycznej Wikipedii (`pl.wikipedia.org` API `exturlusage`) oraz bezpośrednią weryfikację kodu źródłowego HTML (`GET` z kontrolą przekierowań `301/302/307/308`) na oficjalnych podstronach rządowych `gov.pl`, witrynach parków narodowych, starostw powiatowych i gminnych Biuletynów Informacji Publicznej (`BIP`).

---

## 2. Budowa czterech kohort, deduplikacja `eTLD+1` i odsiew platform współdzielonych

Aby zbadać wyłącznie **własne domeny placówek**, z surowych pól adresów WWW odrzucono:
- subdomeny rządowe i samorządowe w strefach chronionych (`*.gov.pl`, `*.samorzad.gov.pl`, miejskie i gminne domeny `*.bip.*`, `*.eduwarszawa.pl`, `*.wroclaw.pl` itp.),
- konta na platformach społecznościowych i komercyjnych kreatorach współdzielonych (`facebook.com`, `edupage.org`, `szkolnastrona.pl`, `superszkolna.pl`, `wixsite.com`, `blogspot.com`, `wordpress.com`, `znanylekarz.pl`),
- oczywiste literówki adresów e-mail wpisanych w pole WWW (np. `wp.pl`, `op.pl`, `gmail.com`, `interia.pl`, `poczta.onet.pl`).

Każdy adres sprowadzono do **rejestrowalnej domeny głównej `eTLD+1`** według pełnej listy **Mozilla Public Suffix List (`PSL`)**, z uwzględnieniem polskich sufiksów funkcjonalnych i regionalnych drugiego oraz trzeciego poziomu (np. `.edu.pl`, `.com.pl`, `.org.pl`, `.net.pl`, `.waw.pl`, `.krakow.pl`, `.wroc.pl`, `.gda.pl`, `.katowice.pl`, `.lubin.pl`, `.bedzin.pl`, `.klodzko.pl`, `.olawa.pl`). Dodatkowo odfiltrowano domeny powtarzające się u więcej niż `3` niezależnych podmiotów (wspólne portale sieci klinik prywatnych lub organów prowadzących), zachowując ścisłą relację „domena placówki → placówka”.

### Lejek liczbowy badania (`35 730` skanów → `35 583` unikalnych domen głównych)

| Kohorta badawcza | Przeskanowane domeny `eTLD+1` | Wykryte aktywne domeny hazardowe poza blokadą MF | Częstość (`%`) i przedział ufności `95% CI` (Wilsona) | Wciąż obecne na żywo w rejestrze źródłowym (`03–04.11.2026`) |
| :--- | ---: | ---: | ---: | ---: |
| **1. Aktywne szkoły i placówki RSPO (`2025/2026`)** | `14 286` | **`105`** *(+4 zablokowane w MF = `109 / 14 290`)* | **`0,735%`** (`0,608%–0,889%`) · z MF: `0,763%` | **`88`** *(+25 z kohorty hist. = **`113`** w `rspo.gov.pl`, w tym `87` kart aktywnych i `48` szkół/przedszkoli publicznych)* |
| **2. Historyczne domeny RSPO (`2018–2023`, nieobecne w aktywnej puli)** | `8 198` | **`139`** *(+9 zablokowanych w MF = `148 / 8 207`)* | **`1,696%`** (`1,439%–1,999%`) · z MF: `1,803%` | **`25`** *(na archiwalnych/aktywnych kartach `rspo.gov.pl`)* |
| **3. Podmioty lecznicze RPWDL (`2026`)** | `11 860` | **`41`** | **`0,346%`** (`0,255%–0,469%`) · świeży zrzut `RPWDL2`: `37 / 12 421 = 0,298%` | **`37`** *(w nocnym zrzucie `RPWDL2` z `03.11.2026`, `36` ściśle aktywnych)* |
| **4. Rejestr Żłobków i Klubów Dziecięcych (`2026`, bez duplikatów RSPO)** | `1 386` *(pełna pula żłobków: `2 304`)* | **`6`** *(pełna pula z częścią wspólną RSPO: **`10 / 2 304`**)* | **`0,433%`** (`0,199%–0,940%`) · pełna pula: **`0,434%`** | **`6`** *(łącznie z `2` domenami wspólnymi z RSPO: **`8`** żywych wpisów w Rejestrze Żłobków)* |
| **Suma skanów kohortowych / unikalne domeny główne** | `35 730` skanów (`-147` części wspólnych = **`35 583`** unikalnych) | **`291`** (`287` w `100%` poza blokadą DNS w Polsce + `4` z `301` do zablokowanych hubów MF) | **`0,818%`** (`0,729%–0,917%`) | **`156`** w macierzystej kohorcie / **`158` (`54,3%`)** w co najmniej jednym z 3 rejestrów pierwotnych (+ **`137`** w Wykazie MC `65294`) |

**Istotne ustalenia przekrojowe i dekompozycja kohort:**
- **Publiczne vs niepubliczne w aktywnym RSPO (`N = 14 286`):** w podmiotach samorządowych/publicznych wykryto **`64 / 8 210` (`0,780%`)**, a w niepublicznych **`41 / 6 076` (`0,675%`)** — dokładny test Fishera daje **`p = 0,49`** (brak istotnej statystycznie różnicy; problem ma charakter strukturalny i dotyka obu sektorów niemal identycznie). W całej próbie `291` domen podmioty sektora publicznego stanowią **`166 / 291` (`57,0%`)**.
- **Dlaczego „historyczne RSPO” (`139` domen) to w większości żywe szkoły, a nie tylko zlikwidowane placówki:** ręczna i API-owa weryfikacja wszystkich `139` rekordów wykazała, że:
  1. **`93 z 139` (`66,9%`)** to **nadal działające szkoły i przedszkola**, które w ostatnich latach zmieniły adres strony WWW (np. przeszły na `samorzad.gov.pl`, miejski portal oświatowy lub nową domenę), lecz pozwoliły wygasnąć starej domenie `.pl` / `.edu.pl`, do której wciąż prowadzą linki z BIP, starostw, katalogów i archiwów;
  2. **`29 z 139` (`20,9%`)** to placówki formalnie zlikwidowane;
  3. **`12 z 139` (`8,6%`)** to placówki aktywne, które wyczyściły pole WWW w RSPO;
  4. **`3 z 139` (`2,2%`)** to placówki migrowane bezpośrednio na `gov.pl`;
  5. **`2 z 139` (`1,4%`)** (`zslie1[.]edu[.]pl` — warszawski zespół `4` szkół publicznych z `976` uczniami oraz `szkolaspoleczna[.]pl`) to aktywne zespoły wielojednostkowe, które automatyczny filtr anty-portalowy `freq <= 3` w kohorcie 1 odsunął do kohorty 2 (w bazie JSON oba rekordy posiadają jawną flagę `isActiveInstitution2026: true`).

---

## 3. Klasyfikacja trzech wektorów technicznych (`Vector A`, `Vector B2`, `Vector B1`) i reżim prawny

Każdą z `291` domen poddano analizie nagłówków HTTP, łańcucha przekierowań, certyfikatów TLS, rekordów `NS`/`A`/`AAAA` przez autorytatywne i rekurencyjne DoH (`8.8.8.8` / `1.1.1.1`), historii RDAP oraz struktury drzewa DOM (w tym reguł CSS ukrywania elementów i porównania z kopiami Wayback Machine). Pozwoliło to uniknąć błędu wrzucania ofiar włamań do jednego worka z przejętymi wygasłymi domenami:

### 3.1. Wektor A — Pełne przejęcie wygasłej domeny pod kasyno (`242 / 291 = 83,2%`)
- **Mechanizm:** po nieopłaceniu faktury przez szkołę, szpital lub projekt publiczny i upływie 30-dniowej kwarantanny w rejestrze NASK (`EXPIRED`), domena jest automatycznie rejestrowana przez bota przechwytującego (*drop-catching*) i delegowana na serwery DNS operatora afiliacyjnego (`237 / 242 = 97,9%` na `Cloudflare AS13335`). Strona główna (`200 OK`) wyświetla od razu pełnoekranową polskojęzyczną witrynę nielegalnego kasyna (`VOX Casino`, `NV Casino`, `Ice Casino`, `Vulkan Vegas`, `Lemon Casino`, `Vavada`, ` Verde`, `Hit'n'Spin`, `Mostbet` z deklaracją wpłat BLIK/kryptowalut) albo wykonuje przekierowanie `301/302` do jednego z **`31` domen-hubów** (z czego `27` hubów jest nieblokowanych w Polsce, a `4` domeny kierują do hubów wpisanych już do XML MF — stąd rozróżnienie `291` domen aktywnych globalnie i **`287` (`98,6%`) działających od początku do końca w sieciach polskich ISP**).
- **Właściwy środek prawny:** wpis do Rejestru MF na podstawie **art. 15f ust. 4 pkt 1 lit. a–b u.g.h.** (blokada DNS w 48 h).

### 3.2. Wektor B2 — Przejęta wygasła domena z fasadą PBN lub gry typu *crash* (`27 / 291 = 9,3%`)
- **Mechanizm:** domena również wygasła i należy w 100% do operatora hazardowego (`27 / 27 = 100,0%` za `Cloudflare`), ale zamiast formularza rejestracji kasyna na wejściu stawia kamuflaż wymierzony w klasyfikatory antyspamowe wyszukiwarek (wprowadzone przez Google w marcu 2024 r. pod nazwą *Expired Domain Abuse*):
  - **`15` domen (`WAYBACK_CLONED_SCHOOL_PBN`):** odtworzony z Wayback Machine autentyczny szablon dawnej polskiej szkoły, przedszkola lub przychodni (ze zdjęciami budynku, statutem i kroniką), w którego treść wpleciono akapity z linkami `dofollow` do kasyn online (np. `spnoskow[.]pl`, `spniemica[.]edu[.]pl`, `zsradzymin[.]pl`, `sp10szczecin[.]pl`);
  - **`12` domen (`CASINO_BLOG_OR_CRASH_GAME_FACADE`):** dedykowane blogi rankingowe kasyn oraz fałszywe strony poradnikowe gier losowych *crash* (*„Aviator”*, *„Chicken Road”*, np. `przedszkole384[.]pl` na warszawskiej Pradze-Południe, gdzie datę publikacji wpisu `date_gmt` antydatowano na `2022-11-06`, mimo przejęcia domeny `2025-12-26` i modyfikacji `modified_gmt: 2026-02-06`).
- **Właściwy środek prawny:** wpis do Rejestru MF na podstawie **art. 15f ust. 4 pkt 1 lit. b u.g.h.** w zw. z **art. 29 ust. 6 i 7 u.g.h.** (domeny służące wyłącznie do reklamowania i promowania nielegalnych gier hazardowych).

### 3.3. Wektor B1 — Włamanie i wstrzyknięcie spamu PHP/CSS na żywy serwer działającej instytucji (`22 / 291 = 7,6%`)
- **Mechanizm:** domena **nie wygasła** i nadal spoczywa na polskim lub unijnym hostingu (`21 / 22 = 95,5%` poza Cloudflare) autentycznej placówki, która publikuje na niej bieżące ogłoszenia dla rodziców lub pacjentów. Przestępcy wykorzystali niezałatane luki w systemie CMS lub przestarzałym środowisku serwerowym (zbiorczo w próbie `N = 22`: `17× WordPress`, `1× Joomla!`, `4×` autorskie/inne PHP, w tym niewspierane gałęzie `PHP 5.x` oraz starsze wtyczki kreatorów stron i sliderów) i wstrzyknęli ukryte w stylach CSS linki hazardowe (`position:absolute; left:-9999px`, `clip:rect(0,0,0,0)`, `width:1px; height:1px; overflow:hidden`, `opacity:0.003; z-index:-1`) lub ukryte podstrony *doorway* (w jednym z publicznych przedszkoli m.in. frazy o *„anulowaniu auto-wykluczenia z kasyna”*).
- **Struktura poszkodowanych serwerów (`22`):**
  - **`8` aktywnych jednostek sektora publicznego:** dwa publiczne zakłady opieki zdrowotnej (`szpital-zuromin[.]pl` — SPZZOZ w Żurominie, `61` aktywnych komórek klinicznych / `67` wierszy w księdze RPWDL; `spzozceglow[.]pl` — SPZOZ w Cegłowie, `13` aktywnych poradni / `25` wierszy w księdze RPWDL), publiczny żłobek samorządowy (`zlobekstarzyno[.]pl` — `38` miejsc, `33` zapisanych dzieci), zespół 4 szkół publicznych w Warszawie (`zslie1[.]edu[.]pl`, `976` uczniów), trzy przedszkola publiczne (`przedszkole337[.]pl`, `przedszkole2[.]klodzko[.]pl`, `przedszkolemochy[.]pl`) oraz szkoła podstawowa (`szkola-gultowy[.]pl`);
  - **`1` nieużywany serwer dawnej szkoły publicznej** (`pspsycyna[.]pl` — łącznie `9` serwerów publicznych);
  - **`13` podmiotów niepublicznych** (prywatne przedszkola, żłobki, szkoły językowe i przychodnie).
- **Weryfikacja dat modyfikacji (`modified_gmt` vs `date_gmt`):** w systemie WordPress wstrzyknięcie ukrytego bloku do istniejącej od lat podstrony (np. zakładki grupy przedszkolnej utworzonej w `2019 r.`) zachowuje pierwotne `date_gmt`, zmieniając wyłącznie `modified_gmt` (np. październik `2026 r.`). W zbiorze `casino-state-2026.json` skorygowano te daty do rzeczywistego `modified_gmt`, aby nie przypisywać placówkom wieloletniej infekcji na podstawie daty utworzenia podstrony.
- **Kluczowa granica ustawowa (`art. 15f ust. 5`, `art. 15g ust. 2` oraz `art. 29 ust. 4 u.g.h.`):** wpisanie którejkolwiek z tych `22` domen do Rejestru MF byłoby **błędem prawnym i operacyjnym** — z mocy **art. 15f ust. 5 u.g.h.** zmusiłoby dostawców internetu w ciągu 48 godzin do zablokowania całej domeny działającego szpitala powiatowego lub przedszkola i przekierowania pacjentów na komunikat o przestępstwie skarbowym (a dostawców płatności do odcięcia usług na mocy **art. 15g ust. 2**), pozostawiając placówce jedynie następczy sprzeciw z **art. 15f ust. 7**, mimo że ofiara włamania nie prowadzi bezprawnej promocji hazardu w rozumieniu **art. 29 ust. 4 u.g.h.** Serwery z Wektora B1 wymagają **skoordynowanego zgłoszenia incydentu do `CERT Polska` (`CSIRT NASK`)** w trybie ustawy o KSC w celu oczyszczenia serwerów przez administratorów.

---

## 4. Analiza 10-letniego skoku domen `.pl` w Rejestrze Hazardowym MF (`59 376` wpisów XML)

Operatorzy kasyn często rotują subdomenami (`casino1.domena`, `casino2.domena`) lub kolejnymi prefiksami liczbowymi. Aby sprawdzić, czy gwałtowny wzrost polskich domen `.pl` w Rejestrze MF w latach `2025–2026` nie jest artefaktem wielokrotnego wpisywania subdomen tej samej witryny, policzono szereg czasowy `2017–2026` w **czterech rygorystycznych wariantach metodologicznych**:

1. **Wariant podstawowy (prezentowany na Wykresie 01 i w KPI): chronologiczna deduplikacja `eTLD+1` wg pełnej listy Mozilla PSL** — każda unikalna domena główna (z rozróżnieniem m.in. `.edu.pl`, `.waw.pl`, `.com.pl`) jest liczona **tylko raz w historii rejestru**, w roku swojego pierwszego pojawienia się w XML MF:
   - **`2023`:** `36` domen `.pl` na `4 391` nowych domen głównych ogółem = **`0,82%`**,
   - **`2024`:** `37 / 4 188` = **`0,88%`**,
   - **`2025`:** `124 / 2 216` = **`5,60%`**,
   - **`2026` (do `03.11.2026`):** **`931 / 4 328` = `21,51%`** → **wzrost udziału o `26,2×`** względem 2023 r.
2. **Wariant ICANN-only PSL (traktujący strefy regionalne jako jedną strefę `.pl`):** `0,82%` (`2023`) → `5,62%` (`2025`) → **`21,94%` (`921 / 4 198` w `2026`)** (`26,8×`).
3. **Deduplikacja `eTLD+1` wewnątrz każdego roku osobno:** `0,75%` (`2023`) → `5,47%` (`2025`) → **`21,48%` (`2026`)**.
4. **Surowe wpisy XML bez deduplikacji (`N = 59 376`):** `76 / 10 932` (**`0,70%`** w `2023`) → `1 731 / 7 491` (**`23,11%`** w `2026`) → **wzrost o `33,0×`**.

Niezależnie od przyjętej metody deduplikacji skok przekracza **26-krotność**. Analiza nazw i archiwów Wayback Machine dla `1 055` unikalnych domen `.pl` zablokowanych w latach `2025–2026` potwierdziła, że **ponad `570`** z nich nie ma słowotwórczego związku z grami losowymi — to przejęte dawne domeny polskich szkół, szpitali, gminnych ośrodków pomocy społecznej, parafii, lokalnych firm, projektów unijnych i stron cytowanych w Wikipedii (`39` zablokowanych domen `.pl` wciąż widniało w przypisach `72` haseł polskiej Wikipedii).

---

## 5. Śledztwo infrastrukturalne DNS-over-HTTPS, rejestratorzy RDAP i estymator przeżycia Kaplana–Meiera

### 5.1. Ominięcie polskiego sinkhole'a DNS i atrybucja kont `Cloudflare`
Polscy operatorzy telekomunikacyjni przekierowują ruch DNS dla domen z Rejestru MF na serwer ostrzegawczy Ministerstwa Finansów (`195.187.6.34`). Odpytanie globalnych serwerów autorytatywnych i rekurencyjnych DoH (`8.8.8.8` / `1.1.1.1`) dla połączonego ekosystemu **`859` domen przejętych** (`242` Wektor A + `27` Wektor B2 + `27` nieblokowanych hubów + `563` przejęte niehazardowe `.pl` z Rejestru MF) wykazało:
- **`710 z 859` (`82,7%`)** całej puli — oraz **`710 z 738` (`96,2%`)** domen aktywnie rozwiązujących się w DNS (po odjęciu `121` domen już wygasłych/porzuconych po blokadzie MF) — korzysta z serwerów nazw `*.ns.cloudflare.com` i reverse-proxy `Cloudflare` (`AS13335`).
- Cloudflare przydziela każdemu kontu (workspace'owi) deterministyczną parę dwóch imion męskich i żeńskich (`np. grant + uma`). W naszej próbie `710` domen zaobserwowaliśmy `574` unikalne hosty `*.ns.cloudflare.com`, co daje dziesiątki tysięcy możliwych kombinacji par — tymczasem **zaledwie `5` par serwerów nazw skupia `233 z 710` domen (`32,8%`)**:
  1. `autumn + wells`: **`138`** domen (w 100% przejęte `.pl` zablokowane przez MF w 2026 r.),
  2. `grant + uma`: **`34`** domeny (**`31` nieblokowanych szkół i placówek z naszej próby + `1` nieblokowany hub `puchalskidietetyk[.]pl` + `2` zablokowane w MF domeny `.pl`: `budowajablonki[.]pl` i `personelgroup[.]pl`**),
  3. `aaden + edna`: **`28`** domen (zablokowane `.pl`),
  4. `neil + perla`: **`20`** domen (zablokowane `.pl`),
  5. `nova + santino`: **`13`** nieblokowanych domen oświatowych i medycznych (`VOX Casino`),
  - oraz m.in. klaster mieszany `austin + sreeni` (**`6`** domen: **`3` nieblokowane szkoły `sp2-biala-podlaska[.]eu`, `szkolastryjki[.]pl`, `zsp7zory[.]eu` obok `3` zablokowanych w MF, w tym `spnasielsk[.]pl`** z rekordowym `317`-dniowym opóźnieniem blokady).

### 5.2. Koncentracja rejestratorów RDAP i ważenie odwrotnością prawdopodobieństwa (`IPW`)
Publiczny protokół RDAP NASK (`https://rdap.dns.pl/domain/...`) udostępnia aktualnego rejestratora i datę utworzenia bieżącego cyklu rejestracji (`registration` event). Ze względu na limity zapytań protokołu RDAP pobrano pełne rekordy dla **`105` z `291`** nieblokowanych domen, uzyskując jednak **`95,2%` pokrycia w głównej kohorcie aktywnych szkół RSPO 2025/2026 poza strefą `.eu`** (`EURid` nie zwraca daty rejestracji w publicznym RDAP).
- W próbie `N = 105`: `Aftermarket.pl Limited` (`Michau Enterprises Ltd.`) obsługuje **`41` domen (`39,0%`)**, `Openprovider` (`Hosting Concepts B.V.`) **`21` (`20,0%`)**, `Netim` **`12` (`11,4%`)**, `Dynadot` **`8` (`7,6%`)** — łącznie **Top 4 = `82 / 105` (`78,1%`)**.
- W podpróbie czystych przejęć wygasłych domen `.pl` z Wektora A (`N = 80`): `Aftermarket.pl` = **`39 / 80` (`48,8%`)**, Top 4 = **`70 / 80` (`87,5%`)**.
- **Kontrola obciążenia doborem próby (`Inverse Probability Weighting — IPW` względem 4 kohort):** po przeważeniu wyników odwrotnością prawdopodobieństwa zbadania RDAP w każdej kohorcie udział `Aftermarket.pl` wynosi **`40,2%`**, a udział Top 4 rejestratorów **`79,6%`** — potwierdzając, że koncentracja nie jest artefaktem niepełnego odpytania kohorty historycznej.

### 5.3. Czas ekspozycji i estymator Kaplana–Meiera z prawostronnym cenzurowaniem (`N = 101`)
Aby rzetelnie oszacować, jak długo przejęta domena publiczna działa w Polsce bez blokady DNS, połączono dwie komplementarne grupy z dokładnymi datami rejestracji RDAP z lat `2024–2026`:
- **`N = 19` zaobserwowanych zdarzeń blokady (`event = 1`):** przejęte domeny podmiotów publicznych, które ostatecznie trafiły do Rejestru MF — czas życia $\Delta t = t_{\text{MF}} - t_{\text{RDAP}}$ wynosi medianowo **`131 dni` kalendarzowych** (`130 dni` wg dokładnych znaczników czasu; rozstęp ćwiartkowy `IQR: 83–155 dni`, minimum `28 dni` dla `piw[.]olawa[.]pl`, drugie maksimum `307 dni` dla `sudlugie[.]pl`, maksimum `317 dni` dla `spnasielsk[.]pl`);
- **`N = 82` obserwacje prawostronnie cenzurowane (`event = 0`):** aktywne, wciąż **niezablokowane** domeny z Wektora A przejęte w latach `2024–2026`, których dotychczasowy czas działania bez blokady do `03.11.2026` wynosi medianowo **`151 dni` kalendarzowych** (`150 dni` timestampowo; `IQR: 75–209 dni`, maksimum `816 dni`; w ścisłej podgrupie przejęć z lat `2025–2026` `N = 77` mediana wynosi **`148 dni`**).

Nieparametryczny estymator iloczynowy Kaplana–Meiera:

$$\hat{S}(t) = \prod_{i:\, t_i \le t} \left(1 - \frac{d_i}{n_i}\right)$$

gdzie $n_i$ oznacza liczbę domen pozostających w ekspozycji tuż przed dniem $t_i$, a $d_i$ liczbę wpisów do Rejestru MF w dniu $t_i$, daje na próbie **`N = 101`**:
- **$\hat{S}(30\text{ dni}) = 98,97\%$ (`99,0%`)**
- **$\hat{S}(90\text{ dni}) = 94,47\%$ (`94,5%`)** — niemal 19 na 20 przejętych domen działa swobodnie przez pierwszy kwartał,
- **$\hat{S}(150\text{ dni}) = 83,03\%$ (`83,0%`)**
- **$\hat{S}(180\text{ dni}) = 77,31\%$ (`77,3%`)** — ponad trzy czwarte omija blokadę przez pół roku,
- **$\hat{S}(365\text{ dni}) = 62,95\%$ (`63,0%`)**, a **mediana czasu do zablokowania przekracza `317 dni`** ($\hat{S}(t) > 50\%$ w całym obserwowanym oknie zdarzeń).

**Zastrzeżenie metodologiczne:** data `registration` w RDAP wyznacza dolną granicę (początek własności domeny przez obecnego abonenta); w pojedynczych przypadkach treść kasynowa mogła zostać podpięta kilka dni lub tygodni po przechwyceniu na aukcji, choć dla seryjnych kont Cloudflare (`grant + uma`, `nova + santino`) konfiguracja DNS następuje z reguły automatycznie w dniu rejestracji.

---

## 6. Instrukcja samodzielnej weryfikacji (krok po kroku, bez wchodzenia na strony kasyn)

Każdy dziennikarz, urzędnik lub badacz może samodzielnie potwierdzić kluczowe ustalenia raportu wyłącznie na oficjalnych serwerach rządowych (`.gov.pl` / `BIP`) i w otwartym kodzie repozytorium — **bez otwierania jakiejkolwiek domeny hazardowej**:

1. **Sprawdzenie spójności matematycznej, linków i pełnej neutralizacji domen (`[.]`) w repozytorium:**
   ```powershell
   py -X utf8 scripts/verify_casino_report.py
   ```
   Skrypt (czysty Python 3.12 stdlib) weryfikuje wszystkie sumy kontrolne w `assets/lab/casino-state-2026.json`, zgodność liczb w polskiej i angielskiej wersji HTML, poprawność krzywej Kaplana–Meiera oraz gwarantuje `0` niezneutralizowanych domen hazardowych i `0` ujawnionych wersji podatnych wtyczek na żywych serwerach Wektora B1.

2. **Potwierdzenie zablokowanych przez MF kasyn wiszących na żywo w `rspo.gov.pl`:**
   - Pobierz oficjalną kartę API publicznej szkoły w Różankach (`RSPO 93026`) lub w Woli Rasztowskiej (`RSPO 48899`):
     ```powershell
     curl.exe -s https://rspo.gov.pl/api/Institution/93026
     curl.exe -s https://rspo.gov.pl/api/Institution/48899
     ```
   - Porównaj zwrócone pole `stronaInternetowa` z urzędowym plikiem XML Ministra Finansów (`https://hazard.mf.gov.pl/api/Register`, wpisy z `2026-08-21` oraz `2026-08-13`).

3. **Potwierdzenie aktywnego linku z `gov.pl` do domeny zablokowanej przez MF ponad 21 miesięcy temu:**
   - Pobierz kod HTML oficjalnej podstrony Ministerstwa Klimatu i Środowiska i wyszukaj odnośnik do gry edukacyjnej:
     ```powershell
     curl.exe -s https://www.gov.pl/web/klimat/badz-odkrywca-parkow-narodowych | Select-String "odkrywcaparkownarodowych"
     ```
   - Sprawdź tę samą nazwę domeny w pliku `https://hazard.mf.gov.pl/api/Register` (wpis z `2025-01-16`).

4. **Potwierdzenie relacyjnej sieroty `70` wierszy szpitalnych w nocnym zrzucie `RPWDL2` (`Księga 000000014475`):**
   - Pobierz paczkę `CSV_Rpm_aktywne` z portalu `dane.gov.pl` (zasób `70070`) lub otwórz księgę `000000014475` na `https://rpwdl2.ezdrowie.gov.pl/`: tabela główna `podmioty.csv` ma wyczyszczone pole WWW, natomiast `zaklady.csv` (`2` wiersze) i `komorki.csv` (`68` zamkniętych historycznie komórek w aktywnej księdze) nadal przechowują domenę zablokowaną w Rejestrze MF pod pozycją `53557` (`2026-03-04`).
