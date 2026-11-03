# Pakiet redakcyjny i prasowy · Zamówienia publiczne AI w Polsce (BZP 2024–2026)

> **Materiał źródłowy:** *Na co polskie instytucje naprawdę wydają pieniądze pod hasłem AI? Analiza i baza 171 postępowań z Biuletynu Zamówień Publicznych (01.01.2024 – 03.11.2026)*  
> **Autor opracowania, kodu i weryfikacji danych:** Grzegorz Stuczyński ([roleplayingtech.com](https://roleplayingtech.com/pl/))  
> **Data publikacji zbioru:** 3 listopada 2026 r. · **Kontakt:** `stuczynski.g@gmail.com`

Dokument jest przeznaczony dla dziennikarzy, redakcji i badaczy, którzy chcą zweryfikować liczby z raportu, osadzić interaktywną bazę przetargów we własnym artykule, pobrać otwarty zbiór danych lub wspólnie rozwinąć wybrany wątek na dokumentach źródłowych.

---

## 1. Jednostronicowe streszczenie (Executive Summary)

### Główna teza
Przegląd samych nagłówków ogłoszeń w Biuletynie Zamówień Publicznych tworzy złudzenie, że polskie instytucje pod hasłem sztucznej inteligencji kupują głównie krótkie szkolenia dla urzędników. Po połączeniu ogłoszeń w postępowania, oczyszczeniu błędów rejestru i zsumowaniu **podpisanych umów** obraz odwraca się: kursy stanowią wprawdzie **22,6% postępowań** (36 ze 159), ale pochłaniają tylko **7,6% zakontraktowanych pieniędzy** (`2,46 mln zł`). **Blisko 90% budżetu (89,8% — 28,92 mln zł)** płynie na wdrożenia oprogramowania dziedzinowego (`17,17 mln zł`) oraz serwery GPU, laboratoria i aparaturę (`11,74 mln zł`) — przede wszystkim na uczelniach i w szpitalach. Jednocześnie tam, gdzie zaczynają się realne wdrożenia systemów IT, niemal znika konkurencja cenowa: w **65,9% rozstrzygniętych umów wdrożeniowych** (27 z 41 ze znaną liczbą ofert) wystartował tylko jeden wykonawca.

### Najważniejsze liczby ze zbioru (01.01.2024 – 03.11.2026)
- **Próba po deduplikacji i czyszczeniu:** **171 postępowań** zrekonstruowanych z **304 powiązanych ogłoszeń** w API `ezamowienia.gov.pl` (w tym **159 postępowań podstawowych** oraz **12 wydzielonych wydatków pobocznych**; **32 ze 171** postępowań zakończyło się unieważnieniem, w tym 31 w rdzeniu; **18** pozostaje bez wyniku w BZP: 4 otwarte nabory ofert i 14 postępowań po terminie składania ofert).
- **Wartość podpisanych umów podstawowych (`core`):** **32,20 mln zł brutto** (`32 202 163,25 zł`) w **110 rozstrzygniętych kontraktach** (mediana `170,7 tys. zł`, średnia `292,7 tys. zł`). Z tego 97 umów o czystym zakresie AI (`aiScope: "pure"`) stanowi **19,63 mln zł** (61,0%, mediana `154,2 tys. zł`), a 13 zamówień mieszanych ryczałtowych (`aiScope: "mixed"`) to **12,57 mln zł** (39,0%, mediana `620,0 tys. zł`). Dwanaście wydzielonych postępowań pobocznych (`incidental`) obejmuje dodatkowo **11 podpisanych umów na 5,22 mln zł** (`5 216 219,04 zł`).
- **Dynamika roczna (wartość podpisanych umów podstawowych wg roku ogłoszenia w BZP):**
  - **2024:** `4,05 mln zł` (`4 054 302,01 zł`, 18 umów z 24 postępowań; 3 umowy ogłoszone w styczniu 2024 r. na kwotę `611,4 tys. zł` podpisano w grudniu 2023 r.),
  - **2025:** `8,56 mln zł` (`8 558 196,78 zł`, 35 umów z 41 postępowań),
  - **2026 (do 03.11.2026):** `19,59 mln zł` (`19 589 664,46 zł`, 57 umów z 94 postępowań) — **4,8-krotny wzrost** wartości zawieranych umów względem 2024 roku.
- **Struktura kategorii (ogłoszenia vs realne pieniądze w rdzeniu AI):**
  - **Wdrożenia oprogramowania i systemów AI (`software_deploy`):** `39,0%` postępowań (62), **`53,3%` kwoty** (`17,17 mln zł` w 45 umowach, mediana `255,3 tys. zł`).
  - **Sprzęt GPU, laboratoria i aparatura (`hardware_lab`):** `30,2%` postępowań (48), **`36,5%` kwoty** (`11,74 mln zł` w 30 umowach, mediana `171,4 tys. zł`).
  - *Razem wdrożenia i sprzęt/lab:* **blisko 90% (89,8%) kwoty** umów podstawowych (`28,92 mln zł`).
  - **Szkolenia, kursy i warsztaty (`training`):** `22,6%` postępowań (36), ale tylko **`7,6%` kwoty** (`2,46 mln zł` w 26 umowach, mediana `47,0 tys. zł`).
  - **Badania, audyty i doradztwo (`consulting`):** `8,2%` postępowań (13) i **`2,6%` kwoty** (`0,82 mln zł` w 9 umowach, mediana `51,0 tys. zł`).
- **Kto kupuje najwięcej:** uczelnie i instytuty naukowe (`15,24 mln zł`, 47 umów) oraz szpitale i ochrona zdrowia (`11,36 mln zł`, 31 umów) odpowiadają łącznie za **82,6% zakontraktowanych środków** (`26,60 mln zł`). Regionalnie liderem jest województwo mazowieckie (**`10,69 mln zł`**, 30 umów), a na mocnym drugim miejscu plasuje się śląskie (**`8,66 mln zł`**, 14 umów, co stanowi **26,9%** krajowej kwoty).
- **Pęknięty rynek ofert:** w całym zbiorze podstawowym **45 ze 104 umów** ze znaną liczbą ofert (**43,3%**; pozostałe **6 umów na `1,33 mln zł` zawarto bez przetargu w trybie z wolnej ręki** na podst. art. 214 Pzp) rozstrzygnięto przy pojedynczej ofercie. W szkoleniach mediana wynosi **6 ofert** (rekord: **23 oferty** na pojedynczą część kursu na Politechnice Świętokrzyskiej za `7 200 zł` łącznie w 3 częściach, `2026/BZP 00465518`), natomiast we wdrożeniach oprogramowania mediana wynosi **1 ofertę** (**27 z 41 konkurencyjnych umów**, czyli **65,9%** bez rywalizacji cenowej, plus **4 umowy szpitalne z wolnej ręki**; w ochronie zdrowia pojedyncza oferta wystąpiła w 20 z 27 przetargów, tj. **74,1%**, a kolejne 4 kontrakty zawarto z wolnej ręki).
- **Udział środków unijnych (KPO / FERS / programy regionalne):** **70 ze 110 podpisanych umów podstawowych (63,6%)** o łącznej wartości **21,10 mln zł (65,5% kwoty umów)** korzysta ze współfinansowania UE (w ujęciu postępowań: 91 ze 159 postępowań podstawowych, czyli 57,2%).

### Nota metodologiczna i granice zbioru (ważne przy cytowaniu)
1. **Zakres BZP (zamówienia poniżej progów unijnych):** Biuletyn Zamówień Publicznych rejestruje krajowe zamówienia podprogowe (dla dostaw i usług zazwyczaj do ok. `0,6–0,9 mln zł` netto zależnie od typu zamawiającego, a znacznie wyżej dla robót budowlanych i usług społecznych). Wielomilionowe kontrakty centralnych ministerstw czy Centralnego Ośrodka Informatyki publikowane w unijnym dzienniku **TED** stanowią osobny segment rynku i nie wchodzą do niniejszej bazy.
2. **Podniesienie dolnego progu Pzp od 1 stycznia 2026 r.:** W latach **2024–2025** obowiązek stosowania Prawa zamówień publicznych i publikacji w BZP zaczynał się od **130 000 zł netto**, natomiast od **1 stycznia 2026 r.** próg ten wzrósł ustawowo do **170 000 zł netto**. Drobniejsze zakupy z przedziału `130–170 tys. zł` netto, które w latach 2024–2025 były widoczne w BZP, w 2026 r. mogły być udzielane w trybach regulaminowych poza Biuletynem (o ile nie były częścią większego zamówienia). Wzrost łącznej kwoty umów w 2026 r. do `19,59 mln zł` nastąpił więc mimo podniesienia dolnego progu wejścia do rejestru, natomiast zmiana progu wpływa na porównywalność najniższego przedziału kwotowego rok do roku.
3. **Wartość zawartych umów brutto ≠ roczne wypłaty kasowe:** Kwoty w bazie odzwierciedlają pełną wartość brutto podpisanych umów z ogłoszeń o wyniku (`TenderResultNotice`), często obejmującą 12-, 24- lub 36-miesięczne licencje, pakiety wsparcia albo dostawy wieloetapowe, a nie faktyczne roczne przepływy pieniężne w budżecie jednostki.
4. **Wydzielenie 12 wydatków pobocznych (`5,22 mln zł`) i korekta omyłek:** Z surowych wyników API usunięto fałszywe trafienia językowe (m.in. badania weterynaryjne w kierunku ptasiej grypy — *Avian Influenza, AI* — oraz przypadkowe zbitki liter w nazwach własnych). Dwanaście postępowań (11 podpisanych umów na `5,22 mln zł` / `5 216 219,04 zł`), w których fraza „Sztuczna Inteligencja” wynikała wyłącznie z nazwy wydziału lub konferencji (np. remont budowlany sal WIiSI Politechniki Częstochowskiej `2026/BZP 00320127` za `4,63 mln zł`, zakup krzeseł, obsługa prawna, catering), pozostawiono w otwartym pliku JSON z flagą `category: "incidental"`, wyłączając je domyślnie z sumy wydatków technologicznych. Skorygowano też dwie istotne anomalie rejestru BZP: oczywistą omyłkę pisarską o jedno zero w sekcji 8.2 ogłoszenia Centrum e-Zdrowia (`2026/BZP 00009631`: wpisane `5 440 000 zł` zamiast ceny wybranej oferty `544 000 zł` z sekcji 6.4) oraz trzykrotne powielenie łącznej kwoty ryczałtu w sekcji 8.2 trzech części w instytucie Łukasiewicz–EMAG (`2024/BZP 00014936`: wpisane trzykrotnie `468 507 zł`, co zawyżało sumę o `937 014 zł`). Pełny rejestr korekt zawiera dokumentacja [`docs/lab/bzp-methodology.md`](bzp-methodology.md).
5. **Zamówienia łączone (aparatura + roboty adaptacyjne):** Część dużych kontraktów infrastrukturalnych łączy stanowiska AI z ciężką aparaturą diagnostyczną i pracami adaptacyjnymi. Największy pojedynczy kontrakt w puli podstawowej — Uniwersytet Jana Długosza w Częstochowie (`2026/BZP 00163288`, `4,94 mln zł` brutto) — zawarto w formule *„zaprojektuj i wybuduj”* na utworzenie Laboratorium Sztucznej Inteligencji w Diagnostyce Obrazowej wraz z dostawą i instalacją tomografu komputerowego. Przy omawianiu rekordowych kwot należy zaznaczać łączony zakres tego zamówienia (`aiScope: "mixed"`).

---

## 2. Jak pobrać wersję PDF i surowe dane

- **Raport interaktywny (PL):** [https://roleplayingtech.com/pl/lab/przetargi-ai/](https://roleplayingtech.com/pl/lab/przetargi-ai/)
- **Raport interaktywny (EN):** [https://roleplayingtech.com/en/lab/ai-tenders/](https://roleplayingtech.com/en/lab/ai-tenders/)
- **Czysty eksport PDF do druku i archiwizacji redakcyjnej:** otwórz stronę raportu w przeglądarce (Chrome, Edge, Firefox lub Safari) i wybierz `Drukuj` (`Ctrl+P` / `Cmd+P`) → **Zapisz jako PDF**. Raport posiada dedykowany arkusz stylów druku (`@media print`), który automatycznie ukrywa paski nawigacyjne, przyciski sterujące i stopki formularzy, składając tekst, wykresy i zestawienia do czystego formatu A4 z zachowaniem linków źródłowych.
- **Pełny, otwarty zbiór JSON (171 rekordów z linkami do BZP):** [https://roleplayingtech.com/assets/lab/bzp-ai-2024-2026.json](https://roleplayingtech.com/assets/lab/bzp-ai-2024-2026.json)
- **Eksport CSV (całość lub dowolny wycinek):** przejdź do sekcji wyszukiwarki na dole raportu (`#explorer`), ustaw potrzebne filtry (np. sektor, województwo, 1 oferta, dotacja UE) i kliknij przycisk **`Pobierz CSV`** (`Export CSV`). Plik zawiera kodowanie UTF-8, kwoty brutto, liczbę ofert, wykonawców i bezpośrednie adresy URL do kart ogłoszeń na `ezamowienia.gov.pl`.
- **Pełna dokumentacja metodologiczna w repozytorium:** [`docs/lab/bzp-methodology.md`](bzp-methodology.md).

---

## 3. Instrukcja osadzenia interaktywnej wyszukiwarki (`?embed=1`) dla redakcji

Redakcje internetowe i lokalne portale mogą bezpłatnie osadzić interaktywną wyszukiwarkę przetargów bezpośrednio w treści własnego artykułu. Parametr `?embed=1` wyłącza nagłówek serwisu, rozdziały tekstowe i stopkę autora, pozostawiając wyłącznie żywy pasek wskaźników KPI, interaktywne słupki podziału, filtry wyszukiwania, tabelę z odnośnikami do BZP oraz dyskretną belkę źródłową pod tabelą.

### Zasada cytowania i atrybucji
Osadzenie widżetu oraz wykorzystanie oczyszczonego zbioru danych w publikacjach prasowych jest bezpłatne pod warunkiem zachowania czytelnego wskazania źródła:
> *Źródło danych i opracowanie: Grzegorz Stuczyński / [RolePlayingTech.com](https://roleplayingtech.com/pl/lab/przetargi-ai/) na podstawie Biuletynu Zamówień Publicznych (`ezamowienia.gov.pl`, 2024–2026).*

### Gotowe kody `<iframe>` do wklejenia w CMS

**1. Widok pełny (wszystkie 159 postępowań podstawowych, sortowanie od najwyższej kwoty):**
```html
<iframe
  src="https://roleplayingtech.com/pl/lab/przetargi-ai/?embed=1"
  width="100%"
  height="820"
  style="border:1px solid #dbd7cd;background:#f7f6f2"
  loading="lazy"
  title="Przetargi AI w Polsce (BZP 2024–2026) — RolePlayingTech">
</iframe>
```

**2. Widok zawężony do wdrożeń oprogramowania rozstrzygniętych przy 1 ofercie:**
```html
<iframe
  src="https://roleplayingtech.com/pl/lab/przetargi-ai/?embed=1&cat=software_deploy&single=1"
  width="100%"
  height="780"
  style="border:1px solid #dbd7cd;background:#f7f6f2"
  loading="lazy"
  title="Wdrożenia oprogramowania AI z 1 ofertą (BZP 2024–2026) — RolePlayingTech">
</iframe>
```

**3. Widok zawężony do szpitali i ochrony zdrowia:**
```html
<iframe
  src="https://roleplayingtech.com/pl/lab/przetargi-ai/?embed=1&sector=Ochrona+zdrowia"
  width="100%"
  height="820"
  style="border:1px solid #dbd7cd;background:#f7f6f2"
  loading="lazy"
  title="Zamówienia AI w szpitalach i ochronie zdrowia (BZP 2024–2026) — RolePlayingTech">
</iframe>
```

*Wskazówka:* dowolny inny wycinek (np. wybrane województwo `?embed=1&prov=%C5%9Al%C4%85skie`, konkretne miasto `?embed=1&q=Krak%C3%B3w` lub angielską wersję językową pod adresem `/en/lab/ai-tenders/?embed=1`) można wygenerować jednym kliknięciem za pomocą przycisku **`Osadź w artykule (iframe)`** nad tabelą w raporcie.

---

## 4. Trzy propozycje kątów tematycznych i współpracy redakcyjnej

Zebrany zbiór traktuję jako punkt wyjścia do dokładniejszej pracy na dokumentach źródłowych. Chętnie przygotuję dla redakcji dedykowany wycinek danych, dodatkowy moduł interaktywny lub wspólny materiał wokół jednego z trzech tematów:

### Kąt 1 · Rynek jednej oferty i wyłączności HIS/PACS w publicznym IT i medycynie
Dlaczego do prostego szkolenia z narzędzi generatywnych za `7 200 zł` zgłasza się 23 wykonawców, a przy zakupach systemów klinicznych, integracji obrazowych PACS/PUI, narzędzi dla aptek szpitalnych czy systemów detekcji zagrożeń sieciowych w `65,9%` przetargów (27 z 41 umów ze znaną liczbą ofert) wpływa tylko jedna oferta, a kolejne 4 kontrakty szpitalne zawierane są z wolnej ręki? Najczęstszy wykonawca w całej bazie — Krajowy Operator Chmury Medycznej (`7 umów na 1,96 mln zł`) — zdobył 4 kontrakty z wolnej ręki z wprost wpisanym w ogłoszeniach uzasadnieniem wyłączności na integrację VoiceBota z systemem szpitalnym HIS AMMS (Asseco), a w pozostałych 3 przetargach był jedynym oferentem. Temat pozwala zbadać na dokumentacji SWZ, gdzie kończą się obiektywne bariery techniczne i brak otwartych API, a gdzie zaczyna pośpiech grantowy KPO i wąskie referencje. *(Szczegółowy plan tego badania znajduje się w pliku `docs/lab/bzp-single-bid-investigation.md`.)*

### Kąt 2 · Rachunek po wygaśnięciu dotacji UE/KPO w latach 2028–2029
**Co mówią twarde dane z BZP:** `70 ze 110` podpisanych umów podstawowych (`63,6%`) i `21,10 mln zł` (`65,5%` całej kwoty umów) współfinansowano ze środków europejskich — głównie z Krajowego Planu Odbudowy w ochronie zdrowia oraz programu FERS na uczelniach i w urzędach pracy. Typowe umowy obejmują licencję, chmurę lub utrzymanie na okres 12–36 miesięcy.  
**Co jest hipotezą wymagającą weryfikacji w instytucjach:** w latach `2028–2029` zbiegną się w czasie dwa zjawiska. Po pierwsze, wygasną okresy finansowania grantowego, a koszty zmienne (ruch chmurowy i tokeny w voicebotach/LLM, płatne aktualizacje konektorów po zmianach w systemach HIS/PACS) przejdą na budżety bieżące szpitali i urzędów. Po drugie, zgodnie z harmonogramem unijnego **AI Act** (oraz dyskutowanymi w ramach pakietu uproszczeniowego **Digital Omnibus** przesunięciami stosowania przepisów dla systemów wysokiego ryzyka na **grudzień 2027 r.** i **sierpień 2028 r.**), narzędzia AI używane m.in. w diagnostyce medycznej, triażu czy rekrutacji publicznej wejdą w reżim pełnych wymogów dokumentacyjnych, nadzorczych i audytowych. Sprawdzenie u dyrektorów szpitali i kwestorów uczelni, które z dzisiejszych wdrożeń mają policzony budżet utrzymania po 2028 roku, to materiał łączący finanse publiczne z realiami regulacji.

### Kąt 3 · Brudne rejestry publiczne kontra automatyczne podsumowania AI
Konkretne studium warsztatowe pokazujące, dlaczego bezkrytyczne wpuszczenie agenta AI do publicznego rejestru bez deterministycznej walidacji źródeł zawyżyłoby wydatki państwa o ponad **11 mln zł** (a wliczając wydatki poboczne o ponad **16 mln zł**). W polskim BZP wyszukiwanie „AI” i „sztucznej inteligencji” zwraca jednocześnie testy na wirusa ptasiej grypy (*Avian Influenza*), remont budowlany sal dydaktycznych Wydziału Informatyki i Sztucznej Inteligencji za `4,63 mln zł` (i łącznie 12 wydatków pobocznych na `5,22 mln zł`), catering konferencyjny, urzędową literówkę o jedno zero w sekcji 8.2 ogłoszenia Centrum e-Zdrowia (`5,44 mln zł` zamiast `544 tys. zł`, czyli błąd o `4,90 mln zł` na jednym wierszu) oraz trzykrotne zsumowanie ryczałtu umowy w sekcji 8.2 instytutu Łukasiewicz–EMAG (`2024/BZP 00014936`, sztuczne zawyżenie o `937 tys. zł`). Dobry punkt wyjścia do tekstu o higienie danych publicznych i o tym, gdzie w pracy newsroomu przebiega granica między użytecznym skryptem badawczym a halucynacją lub powieleniem błędu z formularza (zob. pełny rejestr korekt w [`docs/lab/bzp-methodology.md`](bzp-methodology.md)).

---

## 5. Nota o autorze i kontakt

**Grzegorz Stuczyński** — twórca projektu **RolePlayingTech**, łączący doświadczenie inżynierskie (wcześniej wsparcie techniczne, testy, systemy ERP, administracja, DevOps i programowanie) z analizą danych oraz publicystyką technologiczną. Pracuje niezależnie (nie prowadzi agencji marketingowej ani PR), budując autorskie narzędzia, otwarte pakiety dla środowiska pracy agentów kodujących ([Agent Harness Kit](https://github.com/RolePlayingTech/agent-harness-kit), [MCP Surface Kit](https://github.com/RolePlayingTech/mcp-surface-kit)), dwujęzyczną [Akademię Mumro](https://academy.mumro.io/pl/) oraz interaktywne analizy oparte na zweryfikowanych źródłach publicznych. Przy implementacji kodu korzysta szeroko ze wsparcia narzędzi AI, odpowiadając osobiście za architekturę pipeline'u, weryfikację dokumentów źródłowych i każdą publikowaną liczbę.

- **E-mail (kontakt bezpośredni dla redakcji):** `stuczynski.g@gmail.com`
- **Strona i sekcja analiz:** [roleplayingtech.com/pl/](https://roleplayingtech.com/pl/) · [roleplayingtech.com/pl/lab/](https://roleplayingtech.com/pl/lab/)
- **X (bieżące notatki z badań):** [@rpl_0x](https://x.com/rpl_0x)
- **LinkedIn:** [Grzegorz Stuczyński](https://www.linkedin.com/in/grzegorz-stuczy%C5%84ski-764383131/)
- **GitHub / Substack:** [github.com/RolePlayingTech](https://github.com/RolePlayingTech) · [roleplayinglife.substack.com](https://roleplayinglife.substack.com/)

---

## 6. English Summary (Press & Editorial Note)

- **Overview:** Between 1 January 2024 and 3 November 2026, Polish public institutions published 304 AI-related procurement notices in Poland's domestic Public Procurement Bulletin (`ezamowienia.gov.pl`, BZP), deduplicated into **171 proceedings** (**159 core technology proceedings** + **12 isolated incidental tenders** such as department building renovations and catering; 32 proceedings were cancelled, including 31 in core, and 18 core tenders had no BZP award notice by 3 November 2026).
- **Key Findings:** Across **110 signed core contracts** worth **32.20M PLN gross** (median **170.7k PLN**), **nearly 90% of spending (89.8%, 28.92M PLN)** went to operational AI software deployments (`17.17M PLN`, 53.3%, 45 contracts) and GPU/laboratory/diagnostic hardware (`11.74M PLN`, 36.5%, 30 contracts). Pure-scope AI contracts accounted for **19.63M PLN** (61.0%, 97 contracts), while mixed-scope packages bundled with broader infrastructure or services totaled **12.57M PLN** (39.0%, 13 contracts). Prompt and AI workshops made up **22.6% of notices** (36 of 159), yet accounted for only **7.6% of contracted spend** (`2.46M PLN` in 26 contracts, median `47.0k PLN`). Consulting and feasibility studies represented **8.2% of notices** (13) and **2.6% of spend** (`0.82M PLN` in 9 contracts, median `51.0k PLN`). Meanwhile, **65.9% of awarded AI software deployments** (27 of 41 contracts with reported bid counts) attracted **only a single bidder** (rising to **74.1%** in healthcare, 20 of 27), compared with a median of 6 bids in training tenders (record: 23 bids). Overall in core, **43.3% of competitive contracts** (45 of 104; 6 were sole-source awards) were single-bid. **63.6% of signed core contracts** (70 of 110, worth `21.10M PLN` or 65.5% of value) were co-financed by EU funds (primarily Poland's KPO Recovery Plan and FERS).
- **Scope & Caveats:** BZP covers domestic procurement **below EU publication thresholds** (major central-government tenders published in the EU's TED journal form a separate tier). Note that Poland's minimum statutory national procurement threshold rose from **130,000 PLN net** (2024–2025) to **170,000 PLN net** on **1 January 2026**. Reported figures reflect total gross signed contract values (`TenderResultNotice`), not single-year cash disbursements; 2026 saw a **4.8x growth** in core contracted volume (`19.59M PLN` in 57 contracts) relative to 2024 (`4.05M PLN` in 18 contracts; note that 3 contracts advertised in Jan 2024 for `611.4k PLN` were signed in Dec 2023). Bundled contracts (such as Jan Długosz University's `4.94M PLN` design-and-build diagnostic imaging AI laboratory with a CT scanner, `2026/BZP 00163288`) are explicitly flagged as mixed scope. Data cleaning eliminated avian influenza false positives, isolated 12 incidental department tenders (`5.22M PLN` across 11 contracts), corrected a `10×` clerical typo in one Centrum e-Zdrowia notice (`5.44M PLN` → `544k PLN`), and rectified a 3× duplicated multi-lot entry at Łukasiewicz–EMAG (`2024/BZP 00014936`, saving `937k PLN` from duplicate inflation). See the complete audit report in [`docs/lab/bzp-methodology.md`](bzp-methodology.md).
- **Links, PDF & Free Newsroom Embed:**
  - Full English report & interactive explorer: [https://roleplayingtech.com/en/lab/ai-tenders/](https://roleplayingtech.com/en/lab/ai-tenders/) (use browser `Print -> Save as PDF` for clean A4 print formatting via `@media print`).
  - Open JSON dataset: [https://roleplayingtech.com/assets/lab/bzp-ai-2024-2026.json](https://roleplayingtech.com/assets/lab/bzp-ai-2024-2026.json) (CSV export also available inside the interactive explorer).
  - Embeddable English explorer: `https://roleplayingtech.com/en/lab/ai-tenders/?embed=1` (free to embed with source attribution to *Grzegorz Stuczyński / RolePlayingTech.com, data: ezamowienia.gov.pl*).
  - Editorial inquiries & custom data slices: `stuczynski.g@gmail.com`.
