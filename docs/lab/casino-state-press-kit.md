# Pakiet dystrybucji, materiały prasowe i prawo do odpowiedzi · Państwo linkuje do kasyna (NR 02 · 11.2026)

> **Tytuł śledztwa:** *Jak państwowe rejestry i strony .gov.pl napędzają ruch nielegalnym kasynom*  
> **Wersja polska (lokalny draft):** `/pl/lab/panstwo-linkuje-do-kasyna/` · **Wersja angielska:** `/en/lab/state-registries-casinos/`  
> **Autor badania, kodu i tekstu:** Grzegorz Stuczyński ([roleplayingtech.com](https://roleplayingtech.com/pl/)) · **Kontakt:** `stuczynski.g@gmail.com`  
> **Status kontaktów zewnętrznych (stan na `04.11.2026`):** **PRZED WYSYŁKĄ (`0` wysłanych wiadomości zewnętrznych).** Wszystkie poniższe zapytania prasowe oraz zgłoszenie koordynacyjne dla `CERT Polska` zostały przygotowane do akceptacji przed publikacją.

---

## 1. Propozycja zajawki artykułu (Lead / Teaser do newslettera, Substacka i karty głównej)

**Wariant krótki (zajawka na listę artykułów / newsletter):**
> Państwo jedną ręką blokuje nielegalne kasyna w rejestrze Ministerstwa Finansów, a drugą — poprzez oficjalne rejestry szkół (`RSPO`), podmiotów leczniczych (`RPWDL2`), żłobków, wykaz Ministerstwa Cyfryzacji i podstrony `.gov.pl` oraz `BIP` — samo kieruje do nich obywateli i roboty wyszukiwarek. Przeskanowałem `35 583` unikalne domeny polskich placówek i zestawiłem je z `59 376` wpisami rejestru hazardowego MF. Znalazłem **`291` aktywnych, niezablokowanych domen** prowadzących z Polski do kasyn (`158` wciąż wisi w żywych kartach rejestrów), **`9` stron `.gov.pl`, starostw i `BIP` z `10` linkami `dofollow`** (w tym link z `gov.pl/web/klimat` wiszący **657 dni po blokadzie MF**) oraz **26,2-krotny skok** udziału domen `.pl` w rejestrze hazardowym między 2023 a 2026 rokiem.

---

## 2. Wersje do mediów społecznościowych (X oraz LinkedIn)

### 2.1. Pojedynczy mocny post na X (`@rpl_0x`)

Państwo jedną ręką ściga nielegalny hazard, a drugą samo linkuje do kasyn ze stron `.gov.pl`, BIP i oficjalnych rejestrów szkół oraz szpitali.

Przeskanowałem 35 583 domeny z RSPO, RPWDL2 i Rejestru Żłobków i skrzyżowałem je z 59 376 wpisami rejestru hazardowego MF. Co wyszło w danych:

• **291** dawnych lub zainfekowanych domen szkół, przedszkoli, żłobków i przychodni kieruje dziś z Polski do kasyn poza blokadą DNS (**158** nadal wisi w żywych kartach rejestrów).
• Na `gov.pl/web/klimat` od **657 dni po blokadzie MF** wisi przycisk „pobierz grę dla dzieci”, prowadzący do przejętej domeny kasynowej.
• Dawna polska domena szkoleniowa programu UNICEF, MEN i Microsoft (`learningpassport[.]pl`) od **527 dni** działa bez blokady jako kasyno online, zbierając przekierowanie ze szkoły muzycznej z BIP powiatu.
• Udział domen `.pl` w rejestrze hazardowym MF skoczył między 2023 a 2026 r. **26,2×** (z **0,82%** do **21,51%**), a **94,5%** przejętych domen działa bez blokady co najmniej 90 dni.
• **8** przypadków to żywe serwery publicznych szpitali i szkół z ukrytym spamem PHP — wpisanie ich na listę blokad MF z mocy prawa (art. 15f ust. 5) odcięłoby pacjentów od strony szpitala w 48 godzin.

Pełne śledztwo, metodologia i zanonimizowana wyszukiwarka rekordów:
[link po zatwierdzeniu publikacji]

*(Do posta dołączona minimalistyczna karta `1200×630`: `assets/lab/og-casino-state-2026-pl.png`.)*

---

### 2.2. Rozwinięty wątek na X (6 części — dla czytelników technicznych i dziennikarzy)

**1/6**  
Klikasz na stronie `.gov.pl` Ministerstwa Klimatu link do pobrania gry edukacyjnej o parkach narodowych albo otwierasz oficjalną kartę szkoły w `rspo.gov.pl`. Zamiast edukacji — polskojęzyczne kasyno online z wpłatą BLIK.  
Przebadałem skryptem **35 583** unikalne domeny szkół, szpitali i żłobków z 4 rejestrów państwowych + pełny plik XML Rejestru Hazardowego MF (**59 376** wpisów). Wątek z twardymi danymi 🧵👇

**2/6**  
Skala zjawiska w rejestrze MF eksplodowała w ostatnich kilkunastu miesiącach.  
Po chronologicznej deduplikacji domen głównych (`eTLD+1` wg pełnej listy PSL) udział końcówki `.pl` wśród nowo blokowanych domen hazardowych wynosił w 2023 r. **0,82%** (36 z 4 391). W 2025 r. urósł do **5,60%**, a w 2026 r. do **21,51%** (931 z 4 328) — **26,2-krotny skok**. Ponad 570 z nich to przejęte dawne polskie domeny niehazardowe.

**3/6**  
Dlaczego grupy afiliacyjne polują akurat na wygasłe domeny szkół, przedszkoli i SPZOZ-ów?  
Bo kiedy gmina przenosi szkołę na `samorzad.gov.pl` albo zamyka projekt unijny i przestaje płacić ~100 zł/rok za starą domenę `.pl` lub `.edu.pl`, linki `dofollow` zostają na lata w `rspo.gov.pl`, `RPWDL2`, wykazie MC (`dane.gov.pl`, **159** trafień), BIP-ach (**9** stron / **10** linków) i Wikipedii (**39** zablokowanych domen w **72** hasłach). Kasyno kupuje na aukcji gotowy autorytet państwa w Google.

**4/6**  
Systemy resortów nie rozmawiają ze sobą nawet PO nałożeniu blokady przez Ministra Finansów:  
• `rspo.gov.pl` wciąż wyświetla **9** zablokowanych przez MF domen na **16** kartach (w tym 2 aktywne szkoły publiczne),  
• nocny zrzut `RPWDL2` trzyma zablokowaną 244 dni wcześniej domenę szpitala powiatowego w **70** podrzędnych rekordach zakładów i komórek,  
• a estymator przeżycia Kaplana–Meiera (`N = 101`) pokazuje, że **94,5%** przejętych domen działa bez blokady ≥ 90 dni (mediana > 317 dni).

**5/6**  
Najważniejszy niuans techniczno-prawny, którego nie widać bez inspekcji DOM:  
Spośród **291** aktywnych domen poza blokadą MF **269** to wygasłe domeny przejęte przez syndykaty (`242` pełne kasyna + `27` fasad PBN/gier crash, w tym klony starych szkół z Wayback Machine; **82,7%** całego ekosystemu stoi za Cloudflare, a **5** kont obsługuje **32,8%** ruchu).  
Ale **22** domeny (**8** aktywnych publicznych szpitali, żłobków i szkół) to **żywe serwery placówek po włamaniu do CMS** z linkami ukrytymi w CSS (`left:-9999px`). Wrzucenie ich do rejestru MF z mocy art. 15f ust. 5 zablokowałoby całą stronę działającego szpitala w 48h — dlatego wymagają ścieżki naprawczej `CERT Polska`, a nie blokady DNS.

**6/6**  
Naprawa nie wymaga wielomilionowego systemu IT: wystarczy ~50 linii kodu synchronizujących codziennie `RSPO`, `RPWDL2`, Rejestr Żłobków i wykaz MC z plikiem XML `hazard.mf.gov.pl`, wyłączenie linków `dofollow` na kartach zlikwidowanych szkół oraz alert z NASK do samorządu, gdy domena z wykazu publicznego wpada w 30-dniową kwarantannę.  
Cały raport, wykresy i baza (wszystkie domeny zneutralizowane `[.]`): [link po zatwierdzeniu]

---

### 2.3. Post na LinkedIn

**Jak państwowe rejestry i strony `.gov.pl` nieświadomie budują pozycjonowanie nielegalnym kasynom — wnioski z audytu 35 583 domen sektora edukacji i ochrony zdrowia**

Cyfryzacja polskich szkół, przedszkoli i samorządów przyniosła w ostatnich latach porządkowanie adresów pod bezpiecznym parasolem `gov.pl` i `samorzad.gov.pl`. Równolegle jednak odsłoniła lukę w cyklu życia domen publicznych, którą na przemysłową skalę zaczęły wykorzystywać zagraniczne sieci afiliacyjne nielegalnego hazardu.

W nowym raporcie na RolePlayingTech połączyłem cztery publiczne bazy referencyjne — Rejestr Szkół i Placówek Oświatowych (`RSPO`), Rejestr Podmiotów Wykonujących Działalność Leczniczą (`RPWDL2`), Rejestr Żłobków oraz ustawowy Wykaz stron podmiotów publicznych Ministerstwa Cyfryzacji — z pełnym plikiem XML Rejestru Domen Zakazanych Ministerstwa Finansów (`59 376` wpisów z lat 2017–2026) oraz analizą DNS-over-HTTPS, RDAP i kodu HTML.

Pięć ustaleń, które pokazują problem systemowy:

1. **26,2-krotny skok udziału domen `.pl` w rejestrze hazardowym MF:** po rygorystycznej deduplikacji do unikalnych domen głównych (`eTLD+1`) udział końcówki `.pl` wśród nowo blokowanych domen wzrósł z **0,82%** w 2023 r. do **5,60%** w 2025 r. i **21,51%** w 2026 r. Ponad 570 zablokowanych w latach 2025–2026 adresów to przejęte po wygaśnięciu polskie domeny niemające wcześniej nic wspólnego z hazardem.
2. **291 aktywnych domen poza blokadą DNS (w tym 158 wciąż w żywych rejestrach):** na 35 583 zbadane unikalne domeny szkół, przychodni, szpitali i żłobków 291 kieruje dziś z Polski do kasyn online lub ich zapleczy SEO (287 od początku do końca poza blokadą polskich operatorów). Ponad połowa nadal widnieje jako oficjalny adres WWW w kartach `RSPO`, `RPWDL2` lub Rejestru Żłobków, a 137 figuruje w otwartym wykazie Ministerstwa Cyfryzacji.
3. **Brak synchronizacji między resortami nawet po blokadzie MF:** na podstronie `gov.pl/web/klimat` oraz witrynie parku narodowego przez **657 dni po wpisaniu domeny do rejestru MF** pozostał aktywny link do pobrania gry edukacyjnej dla dzieci prowadzący do zablokowanej domeny kasynowej. Z kolei dawna polska domena szkoleniowa programu *Learning Passport* (realizowanego przez koalicję UNICEF, MEN, Microsoft, IBE i partnerów) wygasła wiosną 2025 r. i od **527 dni** działa bez blokady jako witryna kasyna.
4. **94,5% przejętych domen działa swobodnie przez pierwszy kwartał:** analiza przeżycia Kaplana–Meiera (`N = 101` domen z datami RDAP) wskazuje, że przy obecnym trybie ręcznego dokumentowania wpisów blokada DNS nie nadąża za automatycznym przechwytywaniem wygasłych nazw (78,1% badanych przejęć przechodzi przez 4 akredytowanych rejestratorów, a 82,7% całego ekosystemu korzysta z proxy Cloudflare).
5. **Dlaczego nie wolno wrzucać wszystkich przypadków na listę blokad DNS:** rozdzielenie techniczne ujawniło obok **269** wygasłych domen przejętych przez syndykaty (w tym 15 klonów dawnych szkół odtworzonych z Wayback Machine pod kątem filtrów Google) także **22 żywe, zainfekowane serwery realnie działających placówek** — w tym **8 jednostek publicznych** (dwa powiatowe/gminne podmioty lecznicze SPZOZ, żłobek samorządowy oraz pięć szkół i przedszkoli). Wpisanie ich do rejestru MF z mocy art. 15f ust. 5 ustawy hazardowej w 48 godzin odcięłoby pacjentów od całej strony działającego szpitala (mimo braku bezprawnej promocji w rozumieniu art. 29 ust. 4) — dlatego wymagają one wsparcia naprawczego `CERT Polska`.

W materiale publikuję pełną metodologię, interaktywne wykresy oraz zanonimizowaną wyszukiwarkę rekordów (z neutralizacją `przyklad[.]pl` i bez ujawniania wersji podatnego oprogramowania aktywnych placówek, aby nie wystawiać ich na wtórne ataki). Przed publikacją przygotowałem też pakiet pytań prasowych dla resortów i instytucji oraz zgłoszenie techniczne dla `CERT Polska`.

Link do opracowania: [link po zatwierdzeniu]

---

### 2.4. Minimalistyczna miniaturka / karta Open Graph (`1200×630`)
- **Wersja PL:** [`assets/lab/og-casino-state-2026-pl.png`](../../assets/lab/og-casino-state-2026-pl.png) (generowana deterministycznie z pliku JSON skryptem [`scripts/generate_casino_og.py`](../../scripts/generate_casino_og.py))
- **Wersja EN:** [`assets/lab/og-casino-state-2026-en.png`](../../assets/lab/og-casino-state-2026-en.png)

---

## 3. Instrukcja osadzenia interaktywnej bazy (`?embed=1`) dla redakcji

Parametr `?embed=1` przełącza raport w kompaktowy tryb widżetu prasowego (bez nagłówka nawigacyjnego, długich rozdziałów i stopki serwisu), z wbudowanym ostrzeżeniem prawnym z art. 29 u.g.h. i trwale zneutralizowanymi domenami (`[.]`).

```html
<!-- Widok 1: 291 aktywnych domen poza blokadą MF -->
<iframe
  src="https://roleplayingtech.com/pl/lab/panstwo-linkuje-do-kasyna/?embed=1&view=unblocked"
  width="100%"
  height="820"
  style="border:1px solid #dbd7cd;background:#f7f6f2"
  loading="lazy"
  title="Państwo linkuje do kasyna — baza 291 domen i 5 rejestrów (RolePlayingTech)">
</iframe>

<!-- Widok 2: 9 oficjalnych stron .gov.pl, starostw i BIP z 10 linkami dofollow -->
<iframe
  src="https://roleplayingtech.com/pl/lab/panstwo-linkuje-do-kasyna/?embed=1&view=govlinks"
  width="100%"
  height="680"
  style="border:1px solid #dbd7cd;background:#f7f6f2"
  loading="lazy"
  title="Aktywne linki dofollow ze stron .gov.pl i BIP do przejętych domen (RolePlayingTech)">
</iframe>
```

---

## 4. Kompletny pakiet Prawa do Ustosunkowania Się (`Right-of-Reply`) i Zgłoszenia Koordynacyjnego (`CERT Polska`)

> **WAŻNE Z ZAŁOŻEŃ ETYCZNYCH I BEZPIECZEŃSTWA:**  
> Do momentu zatwierdzenia materiału przez autora **nie wysłano żadnej wiadomości e-mail ani formularza do podmiotów zewnętrznych (`0` kontaktów zewnętrznych)**. Poniższe teksty są gotowe do wysyłki przed publikacją produkcyjną; wszystkie nazwy domen w treści pism są zapisane bezpiecznie (`[.]`), aby nie generować aktywnych odnośników w systemach pocztowych urzędów.

### 4.1. Grupa 1 — Ministerstwo Finansów i Krajowa Administracja Skarbowa (`KAS`)
- **Kanały oficjalne:** Wydział Prasowy MF (`dziennikarze@mf.gov.pl`), Komunikacja KAS (`komunikacja.KAS@mf.gov.pl`)

> Szanowni Państwo,
>
> przygotowuję do publikacji raport analityczny oparty na krzyżowej weryfikacji publicznych rejestrów państwowych (`RSPO`, `RPWDL2`, `Rejestr Żłobków`, ustawowy *Wykaz stron internetowych podmiotów publicznych* prowadzony przez MC na podstawie art. 14 ust. 4 ustawy o dostępności cyfrowej) z prowadzonym przez Ministra Finansów *Rejestrem domen służących do oferowania gier hazardowych niezgodnie z ustawą* (`hazard.mf.gov.pl`) według stanu na 3–4 listopada 2026 r.
>
> W toku badania zidentyfikowałem **269 przejętych po wygaśnięciu domen dawnych szkół, przedszkoli, żłobków i podmiotów leczniczych** (`242` domeny z pełnymi witrynami kasyn online oraz `27` dedykowanych serwisów afiliacyjnych / fasad PBN i symulatorów gier typu *crash*), a także **31 domen-hubów przekierowujących** (w tym `27` nieblokowanych — m.in. `learningpassport[.]pl`, dawną polską domenę szkoleniową programu Biura UNICEF ds. Reagowania na Potrzeby Uchodźców w Polsce, MEN, IBE, Fundacji SOK i Microsoft, która od 25 maja 2025 r., czyli od **527 dni** według stanu na 3.11.2026 r., serwuje polskojęzyczne kasyno VOX Casino), które **nie figurują w Rejestrze MF**, mimo że większość nadal widnieje w rejestrach `rspo.gov.pl`, `RPWDL2` lub wykazie Ministerstwa Cyfryzacji. Równocześnie dla próby `19` wygasłych domen publicznych, które trafiły do Rejestru MF w latach 2025–2026, mediana czasu od ponownej rejestracji domeny (`RDAP`) do wpisu w `hazard.mf.gov.pl` wyniosła **131 dni** (zakres 28–317 dni), a w całym rejestrze MF udział unikalnych domen głównych `.pl` wzrósł między 2023 a 2026 r. **26,2-krotnie** (z `0,82%` do `21,51%`).
>
> Uprzejmie proszę o stanowisko Ministerstwa Finansów i Krajowej Administracji Skarbowej w następujących kwestiach:
> 1. Z czego wynika kilkumiesięczne opóźnienie (mediana 131 dni w zbadanej próbie domen publicznych; 94,5% przeżycia ≥ 90 dni wg estymatora Kaplana–Meiera dla `N = 101`) pomiędzy uruchomieniem nielegalnego kasyna lub serwisu promującego hazard na przejętej domenie `.pl` / `.edu.pl` a dokonaniem wpisu do Rejestru na podstawie art. 15f ust. 4 pkt 1 lit. a i b ustawy o grach hazardowych? Czy KAS prowadzi zautomatyzowany monitoring wygasających domen podmiotów publicznych?
> 2. Jaką praktykę kwalifikacyjną stosuje MF/KAS wobec domen zapleczowych (`PBN` odtwarzających archiwalny wygląd szkoły z wplecionymi linkami do kasyn oraz blogów gier typu „Aviator” / „Chicken Road”) w świetle art. 15f ust. 4 pkt 1 lit. b u.g.h. w zw. z art. 29 ust. 6 i 7 u.g.h.?
> 3. W jaki sposób KAS postępuje w sytuacji odwrotnej — gdy ukryte linki hazardowe zostały bezprawnie wstrzyknięte na **aktywny serwer działającego publicznego szpitala, przychodni, żłobka lub szkoły** (zidentyfikowałem 22 takie zainfekowane serwery, w tym 8 aktywnych jednostek publicznych, m.in. 2 podmioty lecznicze SPZOZ)? Ponieważ wpis do Rejestru z mocy **art. 15f ust. 5 u.g.h.** uruchamia obowiązkową blokadę całej domeny u operatorów telekomunikacyjnych w ciągu 48 godzin (oraz odcięcie usług płatniczych z art. 15g ust. 2), a nieświadoma ofiara włamania nie prowadzi bezprawnej promocji hazardu w rozumieniu art. 29 ust. 4 u.g.h., czy MF/KAS odstępuje wówczas od wpisu do Rejestru i przekazuje sprawę do CSIRT NASK / CERT Polska?
> 4. Czy po wpisaniu dawnej domeny publicznej do `hazard.mf.gov.pl` Ministerstwo Finansów powiadamia administratorów innych rejestrów państwowych (`MEN/CIE`, `Centrum e-Zdrowia`, `MC`, redakcje portalu `gov.pl`), aby usunęli aktywne odnośniki do zablokowanych domen (np. `odkrywcaparkownarodowych[.]pl` zablokowana 16.01.2025 r., do której 657 dni później nadal linkuje `gov.pl/web/klimat`, czy `pzzoz[.]bedzin[.]pl` zablokowana 04.03.2026 r., wciąż obecna w 70 podrzędnych rekordach w `RPWDL2`)?
> 5. Analiza autorytatywnych serwerów DNS wykazała, że `710 z 859` domen badanego ekosystemu (`82,7%` całości i `96,2%` domen aktywnie rozwiązujących się w DNS) korzysta z sieci Cloudflare, przy czym pojedyncza para serwerów nazw (`autumn.ns.cloudflare.com + wells.ns.cloudflare.com`) obsługuje aż **138 zablokowanych przez MF domen `.pl`**. Czy MF/KAS kieruje do firmy Cloudflare lub rejestratorów domen formalne nakazy podjęcia działań w trybie art. 9 unijnego Aktu o usługach cyfrowych (DSA)?

---

### 4.2. Grupa 2 — Ministerstwo Edukacji Narodowej (`MEN`), Centrum Informatyczne Edukacji (`CIE`) oraz Instytut Badań Edukacyjnych (`IBE`)
- **Kanały oficjalne:** Biuro Prasowe MEN (`biuro.prasowe@men.gov.pl`), Sekretariat CIE (`sekretariat@cie.gov.pl`), IBE (`ibe@ibe.edu.pl`)

> Szanowni Państwo,
>
> w ramach przygotowywanego przeze mnie raportu badawczego zweryfikowałem dane serwowane na żywo przez publiczny interfejs API Rejestru Szkół i Placówek Oświatowych (`https://rspo.gov.pl/api/Institution/{id}`, stan na 3–4 listopada 2026 r.). Badanie wykazało, że:
> - **113 domen internetowych widniejących na żywo na kartach placówek w `rspo.gov.pl`** (`88` z kohorty aktywnej 2025/2026 oraz `25` z kohorty historycznej; łącznie `87` aktywnych kart placówek, w tym **48 aktywnych szkół i przedszkoli publicznych**) kieruje dziś do nielegalnych kasyn internetowych, zapleczy SEO hazardu lub zainfekowanych stron z ukrytymi linkami kasynowymi;
> - mimo 7-dniowego ustawowego obowiązku aktualizacji danych z art. 7 ust. 1 pkt 10, ust. 2 oraz art. 36 ust. 1 pkt 1 i ust. 2–3 ustawy o systemie informacji oświatowej (`Dz.U. 2026 poz. 803`), **9 domen oficjalnie wpisanych przez Ministra Finansów do Rejestru Domen Zakazanych (`hazard.mf.gov.pl`) nadal wyświetla się na żywo w `rspo.gov.pl` na 16 kartach placówek**, w tym na **3 kartach placówek aktywnych (`liquidationDate: null`)**: dwóch szkół publicznych — Szkoły Podstawowej im. Jana Pawła II w Różankach (`RSPO 93026`, `zsrozanki[.]pl`) oraz Szkoły Podstawowej im. Jana III Sobieskiego w Woli Rasztowskiej (`RSPO 48899`, `spwolarasztowska[.]pl`) — i jednej placówki niepublicznej (`RSPO 48079`, `dzierzno[.]pl`), a także na **13 kartach placówek zlikwidowanych**;
> - ponadto dawna polska domena szkoleniowa `learningpassport[.]pl` (wykorzystywana w latach 2023–kwiecień 2025 r. w kursach dla nauczycieli realizowanych w koalicji Biura UNICEF ds. Reagowania na Potrzeby Uchodźców w Polsce, MEN/MEiN, Microsoft, IBE i Fundacji SOK) po wygaśnięciu w maju 2025 r. została przejęta i od **527 dni** (stan na 3.11.2026 r.) prowadzi bez blokady do nielegalnego kasyna VOX Casino (odbierając m.in. przekierowanie `301` z domeny publicznej Szkoły Muzycznej II st. w Bystrzycy Kłodzkiej `sm2bystrzyca[.]pl`, `RSPO 127974`).
>
> Uprzejmie proszę o odpowiedź na następujące pytania:
> 1. Dlaczego system `rspo.gov.pl` nie weryfikuje automatycznie utrzymywanych adresów stron WWW szkół względem publicznego pliku XML Rejestru Domen Zakazanych Ministerstwa Finansów (`hazard.mf.gov.pl`) oraz wygasania domen w rejestrze NASK?
> 2. Dlaczego na archiwalnych kartach placówek zlikwidowanych w `rspo.gov.pl` system publikuje aktywne odnośniki zewnętrzne bez atrybutu `rel="nofollow"`, przekazując po wygaśnięciu domeny autorytet portalu `.gov.pl` podmiotom przejmującym adres? Czy MEN/CIE planuje wyłączenie aktywnego linkowania na kartach jednostek zlikwidowanych?
> 3. Który podmiot był formalnym abonentem domeny `learningpassport[.]pl` w momencie zakończenia cyklu szkoleniowego wiosną 2025 r. oraz czy rozważane jest ostrzeżenie szkół i zgłoszenie domeny do Rejestru MF?
> 4. Czy MEN planuje wydanie wytycznych dla organów prowadzących (JST) dotyczących bezpiecznego wygaszania dawnych domen `.pl` / `.edu.pl` podczas migracji szkół na portale `samorzad.gov.pl`?

---

### 4.3. Grupa 3 — Ministerstwo Zdrowia (`MZ`) i Centrum e-Zdrowia (`CeZ`)
- **Kanały oficjalne:** Biuro Komunikacji MZ (`biurokomunikacji@mz.gov.pl`), Sekretariat CeZ (`biuro@cez.gov.pl`)

> Szanowni Państwo,
>
> w ramach badania bezpieczeństwa rejestrów publicznych przeanalizowałem nocny zrzut Rejestru Podmiotów Wykonujących Działalność Leczniczą (`RPWDL2` na portalu `dane.gov.pl`, zasób `70070`, stan `2026-11-03 00:00:00`). Ustaliłem, że:
> 1. W aktualnej bazie `RPWDL2` widnieje **37 domen podmiotów leczniczych** (`36` ściśle aktywnych), które obecnie prowadzą do nielegalnych kasyn online (po wygaśnięciu i przejęciu domeny) albo padły ofiarą włamania do systemu CMS i serwują ukryte treści hazardowe — w tym dwa publiczne zakłady opieki zdrowotnej SPZOZ: SPZZOZ w Żurominie (`szpital-zuromin[.]pl` — `61` aktywnych komórek klinicznych / `67` łącznie w księdze) oraz SPZOZ w Cegłowie (`spzozceglow[.]pl` — `13` aktywnych komórek poradni / `25` łącznie w księdze), traktowane w moim raporcie jednoznacznie jako poszkodowane ofiary włamania zewnętrznego.
> 2. Dawna domena Powiatowego Zespołu Zakładów Opieki Zdrowotnej w Będzinie/Czeladzi (`pzzoz[.]bedzin[.]pl`, **Numer księgi rejestrowej: `000000014475`**, `ID Księgi: 258909`), wpisana przez Ministra Finansów do Rejestru Domen Zakazanych w dniu **4 marca 2026 r.** (poz. `53557`), **244 dni po blokadzie MF nadal widnieje w aktualnym zrzucie `RPWDL2` (`CSV_Rpm_aktywne`)** — mimo usunięcia adresu z tabeli głównej `podmioty.csv`, adres `www.pzzoz[.]bedzin[.]pl` pozostał w **`70` podrzędnych rekordach aktywnej księgi**: `2` rekordach zakładów leczniczych (`zaklady.csv`) oraz `68` rekordach zamkniętych komórek organizacyjnych (`komorki.csv`).
>
> Uprzejmie proszę o stanowisko Ministerstwa Zdrowia i Centrum e-Zdrowia:
> 1. Dlaczego wyczyszczenie nieaktualnego adresu WWW z tabeli `podmioty` w systemie `RPWDL2` nie powoduje kaskadowej aktualizacji lub walidacji tego samego adresu w powiązanych tabelach `zaklady` i `komorki` publikowanych w zrzucie aktywnych ksiąg?
> 2. Czy Centrum e-Zdrowia (oraz sektorowy CSIRT CeZ) planuje automatyczne krzyżowanie adresów URL wpisanych do `RPWDL2` z plikiem XML Rejestru Domen Zakazanych MF (`hazard.mf.gov.pl`) oraz powiadamianie podmiotów leczniczych o wykrytych wstrzyknięciach SEO/CMS?

---

### 4.4. Grupa 4 — Ministerstwo Cyfryzacji (`MC`) oraz NASK-PIB (`dns.pl` / `OSE`)
- **Kanały oficjalne:** Biuro Komunikacji MC (`media@cyfra.gov.pl`, DW: `dostepnosc.cyfrowa@cyfra.gov.pl`), Biuro Prasowe NASK-PIB (`media@nask.pl`)

> Szanowni Państwo,
>
> zestawiłem prowadzony przez Ministra Cyfryzacji ustawowy *Wykaz stron internetowych i aplikacji mobilnych podmiotów publicznych* (art. 14 ust. 4 ustawy o dostępności cyfrowej, `dane.gov.pl` zbiór `1875`: najnowszy opublikowany zasób `65294` z 13.03.2025 r., stan danych 30.04.2024 r., 98 048 wierszy, oraz wcześniejszy zasób `40236` z 20.07.2022 r.) z Rejestrem Domen Zakazanych MF (`hazard.mf.gov.pl`), danymi rejestru `.pl` (NASK) oraz weryfikacją HTTP/DOM na dzień 3–4 listopada 2026 r. Ustaliłem, że:
> - w najnowszym zasobie `65294` oficjalnego wykazu MC znajduje się **159 domen kierujących do nielegalnych kasyn lub zainfekowanych ukrytym spamem hazardowym**: **22 domeny już zablokowane przez Ministra Finansów** oraz **137 domen nieblokowanych** (w zasobie `40236` odpowiednio **161 domen**: `23` zablokowane w MF + `138` nieblokowanych);
> - domeny funkcjonalne w strefie **`.edu.pl`** (np. `sp47krakow[.]edu[.]pl`, `sptrzemesnia[.]edu[.]pl`, `ppp1gdynia[.]edu[.]pl`, `splubiczdolny[.]edu[.]pl`) po upływie 30-dniowej kwarantanny są automatycznie rejestrowane przez zagranicznych pośredników na rzecz operatorów kasyn bez jakiejkolwiek weryfikacji statusu oświatowego abonenta.
>
> Uprzejmie proszę o stanowisko Ministerstwa Cyfryzacji oraz NASK-PIB:
> 1. Czy Ministerstwo Cyfryzacji wdroży automatyczną walidację ustawowego wykazu (`zbiór 1875`) względem pliku XML Rejestru Domen Zakazanych MF (`hazard.mf.gov.pl`) oraz kwarantanny domen w rejestrze NASK?
> 2. Czy MC i NASK-PIB rozważają wprowadzenie mechanizmu ostrzegawczego (np. automatycznego alertu `CSIRT NASK` do organu prowadzącego oraz wydłużonego okresu ochronnego *redemption* dla domen ujętych w rejestrach `RSPO`, `RPWDL2` i wykazie z art. 14 ust. 4 w momencie wejścia domeny w 30-dniową kwarantannę)?
> 3. Czy NASK-PIB rozważa wprowadzenie weryfikacji uprawnień podmiotów rejestrujących nazwy w strefie funkcjonalnej `.edu.pl` (na wzór strefy `.gov.pl`), aby ukrócić masowe przejmowanie adresów `.edu.pl` pod nielegalny hazard?

---

### 4.5. Grupa 5 — Ministerstwo Klimatu i Środowiska (`MKiŚ`) oraz Biebrzański Park Narodowy (`BbPN`)
- **Kanały oficjalne:** Wydział Komunikacji Medialnej MKiŚ (`media@klimat.gov.pl`), Sekretariat BbPN (`sekretariat@biebrza.org.pl`)

> Szanowni Państwo,
>
> podczas audytu linków wychodzących z portali w domenie rządowej `.gov.pl` (stan na 4 listopada 2026 r.) ustaliłem, że oficjalne podstrony:
> - **Ministerstwa Klimatu i Środowiska:** `https://www.gov.pl/web/klimat/badz-odkrywca-parkow-narodowych` (odnośnik *„link do pobrania gry w wersji desktop”*), oraz
> - **Biebrzańskiego Parku Narodowego:** `https://bbpn.gov.pl/promocja-parkow-narodowych`
>
> nadal zawierają aktywne linki `dofollow` prowadzące do domeny **`odkrywcaparkownarodowych[.]pl`**. Po zakończeniu projektu unijnego POIiŚ domena ta wygasła, została przejęta pod nielegalny hazard i już **16 stycznia 2025 r.** (**657 dni temu**) została wpisana przez Ministra Finansów do Rejestru Domen Zakazanych (`hazard.mf.gov.pl`), przy czym na autorytatywnych serwerach DNS nadal utrzymuje aktywną infrastrukturę kasynową czerpiącą autorytet SEO z domeny `.gov.pl`.
>
> Uprzejmie proszę o informację, kiedy nieaktualne odnośniki zostaną usunięte z obu witryn oraz czy resort wprowadził zasady utrzymywania domen edukacyjnych (lub przekierowywania treści wyłącznie na `gov.pl`) po zakończeniu projektów grantowych.

---

### 4.6. Grupa 6 — Koalicja programu *Learning Passport* w Polsce (`UNICEF` / `Biuro UNICEF ds. Reagowania na Potrzeby Uchodźców` / `Fundacja SOK`)
- **Kanały oficjalne:** Stowarzyszenie Polski Komitet Narodowy UNICEF (`unicef@unicef.pl`), z prośbą o konsultację z Biurem UNICEF ds. Reagowania na Potrzeby Uchodźców w Polsce (UNICEF ECARO) oraz Fundacją SOK.

> Szanowni Państwo,
>
> w przygotowywanym przeze mnie raporcie badawczym opisuję problem przejmowania wygasłych domen projektów edukacyjnych w Polsce przez operatorów nielegalnych kasyn online. Odnotowując wprost w tekście, że główna międzynarodowa platforma kursowa działa nieprzerwanie pod adresem `poland.learningpassport.org`, zwracam się z pytaniem dotyczącym polskiej domeny szkoleniowej **`learningpassport[.]pl`** (`szkolenia.learningpassport[.]pl`), wykorzystywanej w latach 2023 – kwiecień 2025 r. w szkoleniach nauczycieli realizowanych wspólnie przez Biuro UNICEF ds. Reagowania na Potrzeby Uchodźców w Polsce, MEN (dawniej MEiN), Microsoft, IBE oraz Fundację SOK.
>
> Z danych archiwalnych i rejestrowych (`RDAP`) wynika, że 45 dni po ostatnim zapisie edukacyjnym (10.04.2025 r.) domena wygasła, **25 maja 2025 r.** została przechwycona za pośrednictwem `Aftermarket.pl Limited` i od **527 dni** (stan na 3.11.2026 r.) wyświetla bez blokady witrynę nielegalnego kasyna (**VOX Casino**). Uprzejmie proszę o informację, który z partnerów wykonawczych był formalnym abonentem domeny `learningpassport[.]pl` w chwili zakończenia cyklu wiosną 2025 r. oraz czy rozważają Państwo zgłoszenie jej do Rejestru MF (`hazard.mf.gov.pl`) lub podjęcie kroków przed Sądem Polubownym ds. Domen Internetowych przy PIIT.

---

### 4.7. Grupa 7 — Poszkodowane instytucje publiczne z infekcją CMS (`Vector B1`) oraz jednostki z linkami w `BIP` / stronach powiatowych
- **Adresaci (sekretariaty i IOD/IT wg BIP):** `SPZZOZ w Żurominie`, `SPZOZ w Cegłowie / UMiG Cegłów`, `Urząd m.st. Warszawy (Bemowo, Praga-Południe, Wawer, Śródmieście — dot. przedszkola nr 337, zespołu szkół ZSLiE nr 1 oraz linków w BIP przedszkola nr 384 i SP nr 109)`, `UM w Kłodzku / Przedszkole nr 2 w Kłodzku`, `Starostwo Powiatowe w Kłodzku (link do sm2bystrzyca[.]pl)`, `UG Puck / Żłobek w Starzynie`, `UG Przemęt`, `UG Kostrzyn`, `UMiG Sztum (BIP Zespołu Szkół w Czerninie)`, `PZZOZ w Będzinie`.

> Szanowni Państwo,
>
> zwracam się do Państwa w trybie dziennikarskim oraz w ramach odpowiedzialnego powiadamiania o zagrożeniach cyberbezpieczeństwa (*responsible disclosure*). Przygotowuję raport o tym, jak zagraniczne grupy przestępcze wykorzystują wygasłe domeny oraz luki w systemach CMS do ukrytego pozycjonowania nielegalnych kasyn online.
>
> Chcę na wstępie jednoznacznie podkreślić: **w przypadku aktywnych serwerów placówek (`Wektor B1`) przygotowywany przeze mnie raport opisuje Państwa jednostkę wyłącznie jako poszkodowaną ofiarę zewnętrznego włamania informatycznego**, w którym złośliwe odnośniki zostały celowo ukryte przed pracownikami w stylach CSS poza widocznym obszarem ekranu. W publicznym raporcie i bazie danych nie ujawniam żadnych szczegółów wersji oprogramowania ani ścieżek mogących ułatwić atak osobom trzecim, a wszystkie oczyszczone przed publikacją strony oznaczam wyraźnym statusem naprawczym (`CLEANED_AFTER_NOTIFICATION`).
>
> Uprzejmie proszę o weryfikację wskazanej witryny / wpisu w BIP przez obsługę informatyczną oraz krótką informację zwrotną, czy incydent został przekazany do oczyszczenia i zgłoszony do `CERT Polska` (`incydent.cert.pl`).

---

### 4.8. Grupa 8 — Pośrednicy infrastrukturalni (`Aftermarket.pl`, `Openprovider`, `Cloudflare`)
- **Kanały oficjalne:** `Aftermarket.pl / Michau Enterprises Limited` (`kontakt@aftermarket.pl`), `Openprovider / Hosting Concepts B.V.` (`https://www.openprovider.com/contact`), `Cloudflare, Inc.` (`press@cloudflare.com`).
- **Zakres zapytań (z jawnym odnotowaniem zautomatyzowanego protokołu EPP oraz wyłączeń odpowiedzialności pośredników z art. 4–8 unijnego Aktu o usługach cyfrowych — DSA):**
  1. **`Aftermarket.pl` (`41 / 105 = 39,0%` zbadanych domen RDAP oraz `39 / 80 = 48,8%` czystych przejęć `.pl` w Wektorze A; `40,2%` po ważeniu IPW) oraz `Openprovider` (`21 / 105 = 20,0%`):** pytania o procedury weryfikacji tożsamości abonentów hurtowo przechwytujących dawne domeny szkół i szpitali w świetle **art. 28 dyrektywy NIS2**, reakcję na wpisywanie tych domen do Rejestru MF oraz ocenę pomysłu wydłużonej kwarantanny ochronnej NASK dla domen z rejestrów publicznych.
  2. **`Cloudflare, Inc.` (`710 / 859 = 82,7%` całego ekosystemu i `710 / 738 = 96,2%` aktywnie rozwiązujących się domen; `138` zablokowanych w MF domen `.pl` na jednej parze `autumn + wells` oraz `34` domeny na parze `grant + uma`):** pytania o to, czy polskie organy (`MF / KAS`, `CERT Polska`) przesyłają do Cloudflare formalne nakazy w trybie **art. 9 DSA**, oraz czy wielokrotne wpisywanie ponad stu domen z jednego konta klienckiego na ustawową listę hazardową państwa członkowskiego UE uruchamia przegląd *Trust & Safety* na poziomie konta.

---

### 4.9. Zgłoszenie techniczne incydentów bezpieczeństwa do `CERT Polska` (`CSIRT NASK`)
- **Adresat ustawowy:** `incydent.cert.pl` / `info@cert.pl` (do wysyłki natychmiast po decyzji użytkownika, przed publikacją publiczną).
- **Zawartość pakietu technicznego (niepublikowana w otwartym repozytorium):**
  1. Pełna lista `22` żywych zainfekowanych serwerów instytucjonalnych (`Wektor B1` — w tym `8` aktywnych jednostek publicznych: `2` podmioty lecznicze SPZOZ, `1` żłobek samorządowy, `5` szkół/przedszkoli publicznych) wraz z dokładnymi nagłówkami środowiskowymi i lokalizacją ukrytych bloków DOM/CSS w celu szybkiego oczyszczenia przez administratorów w kanałach KSC;
  2. Lista `269` przejętych wygasłych domen (`Wektor A + B2`) i `31` hubów przekierowujących oraz `9` stron `.gov.pl` / starostw / `BIP` z `10` aktywnymi linkami `dofollow`.
