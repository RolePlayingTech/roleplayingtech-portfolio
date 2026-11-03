# Metodologia i raport audytu zbioru: Przetargi AI w polskim sektorze publicznym (BZP 2024–2026)

**Data snapshotu (stan danych):** `03.11.2026` (`2026-11-03T23:59:59`)  
**Zbiór danych:** [`assets/lab/bzp-ai-2024-2026.json`](../../assets/lab/bzp-ai-2024-2026.json) (171 postępowań: 159 podstawowych + 12 pobocznych)  
**Skrypt audytowy i ETL:** [`scripts/audit_bzp_data.py`](../../scripts/audit_bzp_data.py) (Python 3, wyłącznie biblioteka standardowa)

---

## 1. Zakres badania i źródło danych

Zbiór obejmuje zamówienia publiczne o wartości poniżej progów unijnych (tzw. zamówienia krajowe publikowane w **Biuletynie Zamówień Publicznych — BZP** na platformie `ezamowienia.gov.pl`), w których ogłoszenie główne opublikowano między **1 stycznia 2024 r. a 3 listopada 2026 r.**

- **Czego zbiór nie obejmuje:** przetargów powyżej progów unijnych publikowanych wyłącznie w Dzienniku Urzędowym UE (**TED**) — takich jak wielomilionowe centralne zakupy infrastruktury GPU dla ośrodków superkomputerowych (np. Cyfronet, PCSS, NASK/PLLum) — oraz drobnych zakupów podprogowych realizowanych poza ustawą Pzp (poniżej 130 000 zł netto, o ile zamawiający nie opublikował dobrowolnie ogłoszenia w BZP).
- **Dlaczego BZP jest cennym barometrem:** pokazuje codzienną absorpcję narzędzi AI na poziomie pojedynczego szpitala powiatowego, urzędu pracy, starostwa, szkoły czy wydziału uczelni.

---

## 2. Pobieranie danych z API BZP, limit `PageSize=500` i łączenie po `tenderId`

Dane źródłowe pochodzą z publicznego endpointu API platformy e-Zamówienia:

```text
GET https://ezamowienia.gov.pl/mo-board/api/v1/notice
```

### Kluczowe reguły techniczne zastosowane w [`scripts/audit_bzp_data.py`](../../scripts/audit_bzp_data.py)

1. **Wymagane parametry i limit `PageSize=500`:** endpoint wymaga podania `NoticeType` (`ContractNotice`, `TenderResultNotice`, `NoticeUpdateNotice`), zakresu dat `PublicationDateFrom` / `PublicationDateTo` oraz `PageSize` (maksymalnie `500`). Gdy zapytanie zwraca dokładnie `500` rekordów (`len(batch) >= 500`), skrypt rekurencyjnie dzieli przedział dat na mniejsze okna, aż każda paczka zwróci `< 500` rekordów — eliminując ciche ucinanie wyników.
2. **Obejście błędu filtrowania `TenderId` po stronie serwera BZP:** parametr URL `TenderId` jest przez serwer BZP **ignorowany** (endpoint zwraca pełną listę ogłoszeń z danego okna czasowego niezależnie od podanego `TenderId`). Aby niezawodnie połączyć ogłoszenie o zamówieniu (`ContractNotice`) z późniejszym ogłoszeniem o wyniku (`TenderResultNotice`) oraz zmianami ogłoszenia (`NoticeUpdateNotice`):
   - najpierw pobierane jest macierzyste ogłoszenie po `NoticeNumber` w celu odczytania identyfikatora postępowania `tenderId` (`ocds-148610-...`) oraz dokładnej nazwy zamawiającego (`organizationName`),
   - następnie odpytywane są `TenderResultNotice` i `NoticeUpdateNotice` z filtrem `OrganizationName=<unikalny człon nazwy>` w oknie od daty publikacji ogłoszenia do `2026-11-03T23:59:59`, a właściwe dopasowanie `item["tenderId"] == tenderId` wykonywane jest ściśle po stronie Pythona.
3. **Weryfikacja `htmlBody`:** każdy z 171 rekordów ma zweryfikowaną pełną treść HTML ogłoszenia (sekcje `2.11` / `2.14` współfinansowanie UE, `4.x` opis przedmiotu i podział na części, `5.1` zawarcie umowy vs unieważnienie, `6.1` liczba ofert na część, `6.4` cena wybranej oferty vs `8.2` wartość zawartej umowy, `7.3.1` wykonawca, `8.1` data podpisania umowy).

---

## 3. Odsiew fałszywych trafień i artefaktów administracyjnych

Surowe wyszukiwanie słów kluczowych (`AI`, `sztuczna inteligencja`, `uczenie maszynowe`, `machine learning`, `LLM`, `chatbot`, `voicebot`) w BZP generuje szum leksykalny. Na etapie budowy i audytu zbioru zastosowano:

- **Odsiew kolizji skrótowców i zbitek literowych:** odrzucenie ogłoszeń weterynaryjnych i sanitarnych, w których skrót `AI` oznacza *Avian Influenza* (ptasią grypę), a także przypadkowych dopasowań podciągów w języku polskim i angielskim (np. `maja`, `katedra` vs `EDR`, `zasad` vs `sąd`), rozwiązanych przez dopasowanie na granicach słów.
- **Rozróżnienie wydatków pobocznych (`incidental`):** postępowania, w których fraza „Sztuczna Inteligencja” występuje wyłącznie w nazwie własnej jednostki organizacyjnej lub wydarzenia — np. remont toalet i zakup mebli dla Wydziału Informatyki i Sztucznej Inteligencji, obsługa prawna i podatkowa instytutu badawczego czy catering na konferencję naukową — pozostawiono w bazie dla pełnej przejrzystości źródłowej, ale wydzielono do osobnej kategorii `incidental` (domyślnie wyłączonej z głównych KPI).
- **Sieroty administracyjne w BZP:** zidentyfikowano i oznaczono przypadek Polskiego Instytutu Ekonomicznego (`2026/BZP 00317670`, `PZP.3.2026` z `2026-07-01`, godz. `12:13`), w którym zamawiający omyłkowo pozostawił w tytule nazwę wcześniejszego badania CAWI o generatywnej AI (`PZP.2.2026`, rozstrzygniętego w `2026/BZP 00377244` na kwotę `51 000 zł`), podczas gdy opis przedmiotu zamówienia dotyczył ubóstwa energetycznego i transportowego. Po 97 minutach (`13:51`) PIE opublikował nowe postępowanie pod poprawionym tytułem (`2026/BZP 00318033`), pozostawiając pierwotny rekord bez formalnego ogłoszenia o unieważnieniu (`subStatus: "pending_result"` z jawną adnotacją w `scopeNotePl`/`scopeNoteEn`).

---

## 4. Klasyfikacja kategorii (`category`), zakresu AI (`aiScope`) i podstatusów (`subStatus`)

### 4.1. Pięć kategorii przedmiotowych (`category`)

1. **`software_deploy` (Wdrożenia i systemy AI):** systemy dziedzinowe i licencje oprogramowania wykorzystującego AI/ML — m.in. szpitalne voiceboty i wirtualne rejestratorki, integracje z Platformą Usług Inteligentnych (PUI) Centrum e-Zdrowia, systemy AI do radiologii/endoskopii/farmakoterapii, chatboty RAG, systemy detekcji zagrożeń sieciowych (NDR/EDR z ML) oraz zakupy korpusów tekstowych do trenowania modeli LLM.
2. **`hardware_lab` (Serwery GPU, laboratoria i aparatura):** serwery obliczeniowe i stacje robocze GPU, przełączniki i zasilanie klastrów AI/ML, stanowiska badawcze i roboty humanoidalne/edukacyjne dla katedr i pracowni AI oraz aparatura diagnostyczna/laboratoryjna z modułami AI.
3. **`training` (Szkolenia, kursy i warsztaty):** szkolenia stacjonarne, zdalne i e-learningowe z praktycznego wykorzystania narzędzi AI, prompt engineeringu, uczenia maszynowego i AI w dydaktyce lub administracji.
4. **`consulting` (Badania, audyty i doradztwo):** badania ilościowe/jakościowe (CAWI/IDI) dotyczące adopcji AI na rynku pracy i w gminach, analizy wykonalności oraz audyty systemów AI.
5. **`incidental` (Wydatki poboczne — poza rdzeniem AI):** roboty remontowo-budowlane, dostawy mebli i krzeseł, obsługa prawna, wyjazdy hotelowe i usługi gastronomiczne, które trafiły do BZP wyłącznie przez nazwę jednostki lub konferencji (12 postępowań, w tym 11 umów na `5 216 219,04 zł`).

**Weryfikacje kategorii podczas audytu:**
- **`2026/BZP 00124082` (Wojewódzki Szpital Rehabilitacyjny dla Dzieci w Ameryce, `1 275 295,98 zł`, 6 części):** przeklasyfikowano z `hardware_lab` na `software_deploy` oraz oznaczono `aiScope: "mixed"`. Weryfikacja pełnej treści `TenderResultNotice` wykazała, że wbrew skrótowemu tytułowi (*„Dostawa sprzętu komputerowego, usług AI wspierających…”*) większość wartości zamówienia stanowią wdrożenia oprogramowania i chmury (`663 739,98 zł`, czyli **52,0%** — w tym Część 2: wspomaganie tworzenia dokumentacji medycznej za `490 770,00 zł` oraz Część 3: wirtualna rejestratorka za `164 999,58 zł`, plus Część 5: chmura `7 970,40 zł`), przewyższające część sprzętową (`474 657,00 zł`, **37,2%** — Część 1: dedykowany Serwer AI za `471 336,00 zł` i Część 4: monitory za `3 321,00 zł`), przy udziale Części 6 obejmującej ogólne szkolenia IT dla administratorów (`136 899,00 zł`, **10,7%**).
- **`2025/BZP 00462052` (rozstrzygnięte, `378 668,73 zł`) oraz `2025/BZP 00398324` (unieważnione) — PZLPiT „Mazowsze”:** przeklasyfikowano z `software_deploy` na `hardware_lab` (spójnie z pierwszą edycją tego samego przetargu `2025/BZP 00387604`), ponieważ wszystkie 3 części mają kody CPV sprzętu elektroakustycznego (`32342410-9 Sprzęt dźwiękowy`, `31711120-0 Przetworniki`, `32342412-3 Głośniki`) i obejmują fizyczne systemy odsłuchu, przetwarzania dźwięku z AI oraz przetworniki A/C i C/A.

### 4.2. Zakres AI (`aiScope`: `"pure"` | `"mixed"` | `"incidental"`)

W zamówieniach publicznych zdarzają się duże kontrakty ryczałtowe, w których komponent AI jest połączony w jednej niepodzielnej kwocie z robotami budowlanymi, ciężką aparaturą medyczną lub wieloletnią usługą fizyczną. Zamiast arbitralnie zgadywać „procent AI” w takim kontrakcie, wprowadzono jawne pole `aiScope`:

- **`"pure"` (139 postępowań podstawowych, 97 umów na `19 633 244,40 zł`):** zamówienia skoncentrowane bezpośrednio na oprogramowaniu AI, infrastrukturze pod obliczenia/badania AI, szkoleniach z AI lub badaniach nad AI (w tym postępowania wieloczęściowe, w których części nie-AI zostały kwotowo odseparowane i wyłączone). Standardowa logistyka sali i wyżywienia (`CPV 55*`) w ramach dedykowanego szkolenia stacjonarnego z AI pozostaje w `"pure"`, gdyż stanowi normalny koszt organizacji szkolenia.
- **`"mixed"` (20 postępowań podstawowych, 13 umów na `12 568 918,85 zł`):** zamówienia z rdzenia zbioru, w których wspólny ryczałt (lub wieloczęściowy pakiet bez możliwości czystego wydzielenia wszystkich kosztów nie-AI) łączy AI z co najmniej jednym z czterech istotnych zakresów nie-AI:
  1. **Roboty projektowo-budowlane („zaprojektuj i wybuduj”, `CPV 45*` / `712*`):** np. budowa Laboratorium AI wraz z tomografem komputerowym na UJD w Częstochowie (`2026/BZP 00163288`, `4 943 925,00 zł`) oraz hybrydowe instalacje OZE z AI na Politechnice Poznańskiej (`2026/BZP 00164948`).
  2. **Fizyczne usługi nietechnologiczne (`CPV 7971*`):** 37-miesięczna fizyczna ochrona obiektów i kontrola dostępu z AI w Łukasiewicz–WIT (`2025/BZP 00543355`, `2 159 382,81 zł`).
  3. **Ciężka aparatura diagnostyczna, optyczna, elektroakustyczna lub połączone laboratoria VR/AV (`CPV 3311*`, `3312*`, `3851*`, `323424*`):** kliniczne aparaty USG z głowicami i modułem AI (Sochaczew `332 042,00 zł`, Nowa Sól `199 000,00 zł`), badawczy mikroskop fluorescencyjny dla MIR-PIB (`619 999,92 zł`), studyjny sprzęt audio i przetworniki dla PZLPiT „Mazowsze” (`378 668,73 zł`) oraz wspólne laboratoria technologii immersyjnych i AI (Tarnów, UPJPII Kraków).
  4. **Szerokie pakiety korporacyjnego IT lub audytów wieloobszarowych:** ryczałty łączące narzędzia AI z rozbudową PACS/RIS (Opole `922 770,00 zł`), wdrożeniem ogólnego systemu EZD i zarządzania majątkiem (Bydgoszcz `785 290,43 zł`), budową systemu zarządzania zadaniami i Intranetu (Powiat Łowicki `680 682,00 zł`), ogólnymi szkoleniami administratorów IT w pakiecie KPO (Szpital w Ameryce `1 275 295,98 zł`) lub łącznym audytem bezpieczeństwa informacji, BCMS, WCAG 2.1 i AI (Brzesko `29 520,00 zł`, Augustów `32 668,80 zł`).
- **`"incidental"` (12 postępowań, 11 umów na `5 216 219,04 zł`):** zawsze tożsame z `category === "incidental"`.

### 4.3. Podstatusy postępowań nierozstrzygniętych (`subStatus`)

Dla wszystkich rekordów `status === "open_or_pending"` (18 postępowań po audycie) wyznaczono względem daty snapshotu `2026-11-03`:
- **`"open_for_bids"` (4 postępowania):** termin składania ofert przypada na `2026-11-03` lub później (`2026-11-05` do `2026-11-12`) — faktycznie otwarte nabory ofert.
- **`"pending_result"` (14 postępowań):** termin składania ofert minął przed `2026-11-03`, lecz do końca dnia `2026-11-03` zamawiający nie opublikował w BZP ogłoszenia `TenderResultNotice` (trwa badanie i ocena ofert albo nie opublikowano jeszcze wyniku).

---

## 5. Reguły dla zamówień wieloczęściowych, mianownika ofert, dat i flagi UE

1. **Wydzielanie części AI w przetargach wielotematycznych:** jeżeli postępowanie dzieli się na części (zadania/pakiety), które w `TenderResultNotice` posiadają odrębne sekcje rozstrzygnięcia (`6.1`, `6.4`, `7.3.1`, `8.1`, `8.2`), a niektóre części nie dotyczą AI (np. szkolenie z wypalenia zawodowego, kosztorysowanie w programie Norma Pro, pracownia OZE, standardowe tablety, szkolenia z cyberbezpieczeństwa/SZBI), w polach `amountPln`, `bids`, `contractDate` i `contractors` zapisano **wyłącznie rozstrzygnięte części dotyczące AI**. Pełną wartość całego postępowania zapisano w `lotsInfo.fullProceedingAmountPln` wraz z opisem w `lotsInfo` i `scopeNotePl`/`scopeNoteEn`.
2. **Zakaz sumowania ofert między częściami (`bids`):** w postępowaniach wieloczęściowych ci sami wykonawcy często składają oferty na kilka części równolegle — zsumowanie `6.1` dałoby pozorną, zawyżoną liczbę konkurentów (np. `23 + 15 + 22 = 60` zamiast maksymalnie `23` w `2026/BZP 00465518`). Przyjęto jednolitą regułę: `bids` oznacza **maksymalną liczbę ofert złożonych na pojedynczą część AI** w danym postępowaniu, natomiast pełny rozkład ofert na części (np. `23 / 15 / 22 oferty w 3 częściach`) jest jawnie podany w `lotsInfo.bidsNotePl` i `bidsNoteEn`.
3. **Mianownik wskaźnika pojedynczych ofert (`singleBidPct`):** spośród **110** rozstrzygniętych umów podstawowych **6** zawarto w trybie zamówienia z wolnej ręki (art. 214 Pzp — m.in. przedłużenia chmurowych voicebotów i specjalistyczne szkolenia autorskie), gdzie w sekcji `6.1` BZP nie występuje konkurencyjny nabór ofert (`bids: null`). Wskaźnik `bids === 1` liczony jest uczciwie wyłącznie wobec **104** umów zawartych w trybach konkurencyjnych ze znaną liczbą ofert (`45 / 104 = 43,3%`).
4. **Rok ogłoszenia (`year`) a rok zawarcia umowy (`contractDate`):** pole `year` (`2024`, `2025`, `2026`) oznacza rok publikacji ogłoszenia w BZP. Ponieważ zamawiający ma ustawowy czas na publikację ogłoszenia o wyniku po podpisaniu kontraktu, **3 umowy ogłoszone w styczniu 2024 r. zostały fizycznie podpisane w grudniu 2023 r.**:
   - `2024/BZP 00014936` (Łukasiewicz–EMAG, umowa `2023-12-07`, `468 507,00 zł`),
   - `2024/BZP 00014935` (Łukasiewicz–EMAG, umowa `2023-12-07`, `141 450,00 zł`),
   - `2024/BZP 00007399` (Akademia Marynarki Wojennej — Część 3 AI, umowa `2023-12-14`, `1 482,00 zł`).
   Eksplorator udostępnia przełącznik obu perspektyw (`Wg ogłoszenia` vs `Wg umowy`).
5. **Flaga współfinansowania unijnego (`eu`):** w formularzach BZP informacja o finansowaniu ze środków UE (KPO, FERS, FENG, programy regionalne, Interreg) znajduje się w **sekcji `2.11.)`** dla `TenderResultNotice`, natomiast w `ContractNotice` znajduje się w **sekcji `2.14.)`** (podczas gdy sekcja `2.11.)` w `ContractNotice` dotyczy zastrzeżenia z art. 94 Pzp). Audyt naprawił błąd pierwotnego parsera, który sprawdzał wyłącznie `2.11.)`, korygując `eu: false -> true` w **15 rekordach** (11 nowo rozstrzygniętych/unieważnionych oraz 4 otwartych).

---

## 6. Pełny rejestr korekt audytowych (przed → po)

### 6.1. Podpięcie brakujących ogłoszeń o wyniku `TenderResultNotice` (17 postępowań)

Spośród 35 rekordów mających przed audytem status `open_or_pending`, **17** posiadało opublikowane w BZP do `03.11.2026` ogłoszenie `TenderResultNotice` powiązane tym samym `tenderId` (**12 zawartych umów** i **5 unieważnień**). We wszystkich 17 rekordach zaktualizowano `url` bezpośrednio do karty `TenderResultNotice`, zachowując pierwotny link ogłoszenia o zamówieniu w `contractNoticeUrl`.

| Ogłoszenie (`bzp`) | Wynik (`resultBzp`) | Zamawiający | Zmiana statusu | Kwota brutto AI (PLN) | Oferty (`bids`) | Data umowy | Wykonawca |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- | :--- |
| `2026/BZP 00202349` | `2026/BZP 00310877` | Uniwersytet Jagielloński | `open` → **`resolved`** | `59 904,00` | `5` | `2026-06-26` | Instytut Innowacyjnej Edukacji Sp. z o.o. |
| `2026/BZP 00201712` | `2026/BZP 00267052` | Szpital Miejski nr 4 w Gliwicach | `open` → **`resolved`** | `195 619,20` | `1` | `2026-05-25` | COSCA Krzysztof Starościak |
| `2026/BZP 00200063` | `2026/BZP 00291854` | WUP w Kielcach *(tylko Cz. 2 AI)* | `open` → **`resolved`** | `8 900,28` | `5` | `2026-06-12` | Zoneo Oleksiewicz S.K.A. |
| `2026/BZP 00196528` | `2026/BZP 00243856` | WUP we Wrocławiu | `open` → **`resolved`** | `34 160,00` | `7` | `2026-05-13` | PC Open Sp. z o.o. |
| `2026/BZP 00160577` | `2026/BZP 00271902` | Szpital im. L. Rydygiera w Krakowie *(Pak. 1 i 3)* | `open` → **`resolved`** | `353 758,77` | `1` | `2026-05-11` | MAXTO ITS Sp. z o.o.; Brainomix Europe Limited |
| `2025/BZP 00411633` | `2025/BZP 00517087` | UOKiK (system AI dark patterns) | `open` → **`resolved`** | `209 100,00` | `4` | `2025-10-29` | Firstscore Sp. z o.o. |
| `2025/BZP 00395552` | `2025/BZP 00497656` | Mazowiecki Szpital Woj. w Siedlcach | `open` → **`resolved`** | `154 242,00` | `1` | `2025-09-22` | Krajowy Operator Chmury Medycznej Sp. z o.o. |
| `2025/BZP 00206791` | `2025/BZP 00253400` | Zespół Szkół nr 18 we Wrocławiu | `open` → **`resolved`** | `56 000,00` | `4` | `2025-05-27` | Tomasz Jarosz |
| `2025/BZP 00204201` | `2025/BZP 00263829` | UKW w Bydgoszczy *(poboczne: catering)* | `open` → **`resolved`** | `14 079,60` | `3` | `2025-05-14` | PW „GRAN” Antoni Kujawa |
| `2025/BZP 00177761` | `2025/BZP 00255537` | Politechnika Warszawska *(Cz. 2–3 AI)* | `open` → **`resolved`** | `157 520,00` | `5` | `2025-05-28` | Instytut Innowacyjnej Edukacji Sp. z o.o. |
| `2025/BZP 00165927` | `2025/BZP 00263281` | Szpital Powiatowy w Sochaczewie *(mixed)* | `open` → **`resolved`** | `332 042,00` | `1` | `2025-05-23` | EMS - Euromed Medical Solution Sp. z o.o. |
| `2025/BZP 00114347` | `2025/BZP 00191385` | WUP w Szczecinie | `open` → **`resolved`** | `114 173,00` | `6` | `2025-04-14` | MW Consulting Sp. z o.o. |
| `2026/BZP 00204213` | `2026/BZP 00254063` | Kociewskie Centrum Zdrowia | `open` → **`cancelled`** | — | `1` | — | — |
| `2026/BZP 00178793` | `2026/BZP 00219608` | Kociewskie Centrum Zdrowia | `open` → **`cancelled`** | — | `1` | — | — |
| `2026/BZP 00164948` | `2026/BZP 00226264` | Politechnika Poznańska *(mixed)* | `open` → **`cancelled`** | — | `brak` | — | — |
| `2024/BZP 00283560` | `2024/BZP 00608403` | Politechnika Warszawska | `open` → **`cancelled`** | — | `3` | — | — |
| `2024/BZP 00245676` | `2024/BZP 00608321` | Politechnika Warszawska | `open` → **`cancelled`** | — | `2` | — | — |

### 6.2. Korekty błędów pisarskich BZP i wydzielenia części AI (przed → po)

| BZP | Zamawiający | Przed audytem | Po audycie (tylko AI / poprawna umowa) | Pełne postępowanie | Uzasadnienie ze źródła BZP (`htmlBody`) |
| :--- | :--- | ---: | ---: | ---: | :--- |
| `2026/BZP 00009631` | Centrum e-Zdrowia | `544 000,00 zł` *(w BZP 8.2: `5 440 000 zł`)* | **`544 000,00 zł`** (`4` oferty) | `544 000,00 zł` | Zweryfikowano kartę `08de4ded-90a3-9604-d6d3-f5000169f1af`: najniższa oferta `6.2 = 544 000 zł`, wybrana oferta `6.4 = 544 000 zł`, omyłka pisarska o jedno zero w `8.2 = 5 440 000 zł` (`typoFixed: true`). |
| `2024/BZP 00014936` | Łukasiewicz – EMAG | `1 405 521,00 zł` (`1` oferta) | **`468 507,00 zł`** (`1` oferta) | `468 507,00 zł` | Wykonawca (`net-o-logy Sp. z o.o.`) wygrał wszystkie 3 części AI (`209 100 + 185 607 + 73 800 = 468 507 zł` w sekcji `6.4`). Zamawiający wpisał łączną wartość umowy `468 507 zł` trzykrotnie w sekcji `8.2` każdej części, co zawyżało sumę o **937 014 zł**. |
| `2025/BZP 00133931` | ZSO w Pawłowicach | `567 090,63 zł` (`18` ofert) | **`143 712,00 zł`** (`6` ofert) | `567 090,63 zł` | Wydzielono **Zadanie 3** (pomoce dydaktyczne do pracowni AI: `143 712 zł`, `6` ofert). Wyłączono Zadanie 2 (pracownia OZE: `357 567,15 zł`, `4` oferty) i wspólne Zadanie 1 (ogólne laptopy/tablety/monitory dla pracowni i gabinetów psychologa/pedagoga: `65 811,48 zł`, `18` ofert). |
| `2026/BZP 00304575` | UMWD we Wrocławiu | `34 823,00 zł` (`12` ofert) | **`16 684,00 zł`** (`10` ofert) | `34 823,00 zł` | Wydzielono **Zadanie 2** (szkolenia z AI w administracji: `16 684 zł`, `10` ofert, Karina Lniska). Wyłączono Zadanie 1 (wypalenie zawodowe: `9 015 zł`) i Zadanie 3 (Norma Pro: `9 124 zł`). |
| `2026/BZP 00213280` | SPZOZ w Augustowie | `89 037,94 zł` (`5` ofert) | **`32 668,80 zł`** (`3` oferty, `mixed`) | `89 037,94 zł` | Wydzielono **Część 1** (audyt końcowy projektu KPO D1.1.2 obejmującego cyfryzację, cyber i AI: `32 668,80 zł`, `3` oferty). Wyłączono czysto nie-AI Część 3 (SZBI: `36 900 zł`) i Część 4 (e-learning cyber: `19 469,14 zł`). |
| `2024/BZP 00007399` | Akademia Marynarki Wojennej | `5 082,00 zł` (`2` oferty, `2023-12-11`) | **`1 482,00 zł`** (`2` oferty, `2023-12-14`) | `5 082,00 zł` | Wydzielono **Część 3** (AI i ChatGPT w dydaktyce: `1 482 zł`, `2` oferty). Wyłączono Część 1 (techniki negocjacyjne: `3 600 zł`, `1` oferta). |
| `2026/BZP 00200063` | WUP w Kielcach *(nowy wynik)* | `open_or_pending` | **`8 900,28 zł`** (`5` ofert) | `54 139,68 zł` | W `2026/BZP 00291854` wydzielono **Część 2** (6 słuchawek z tłumaczeniem AI: `8 900,28 zł`, `5` ofert); wyłączono Część 1 (30 standardowych tabletów: `45 239,40 zł`, `15` ofert). |
| `2025/BZP 00177761` | Politechnika Warszawska *(nowy wynik)* | `open_or_pending` | **`157 520,00 zł`** (`5` ofert) | `236 280,00 zł` | W `2025/BZP 00255537` wydzielono **Części 2 i 3** dotyczące AI (`2 × 78 760 zł = 157 520 zł`; `4` i `5` ofert); wyłączono Część 1 (cyberbezpieczeństwo: `78 760 zł`, `4` oferty). |

### 6.3. Higiena tekstowa, CPV i ujednolicenie wykonawców

- **Domknięcie 6 uciętych opisów CPV** pełnymi nazwami ze słownika CPV BZP: `22200000-2 (Gazety, dzienniki, czasopisma i magazyny)` (`00212938`), `38000000-5 (Sprzęt laboratoryjny, optyczny i precyzyjny (z wyjątkiem szklanego))` (`00172386`, `00137563`), `31700000-3 (Urządzenia elektroniczne, elektromechaniczne i elektrotechniczne)` (`00618565`), `72000000-5 (Usługi informatyczne: konsultacyjne, opracowywania oprogramowania, internetowe i wsparcia)` (`00126499`, `00101972`).
- **Usunięcie znaków łamania linii, twardych spacji (`\xa0`) i wielokrotnych spacji** we wszystkich polach tekstowych (`title`, `org`, `city`, `cpv`), w tym korekta podwójnej spacji w `UNIWERSYTET JANA DŁUGOSZA W CZĘSTOCHOWIE` i `MORSKI INSTYTUT RYBACKI - PAŃSTWOWY INSTYTUT BADAWCZY`.
- **Czyszczenie i kanonizacja nazw wykonawców:** usunięto doklejone adresy, kody pocztowe oraz numery `NIP`/`REGON` (m.in. `Medalion Technology P.S.A.`, `Dwór Mościbrody Sp. z o.o.`, `Precoptic Co. Wojciechowscy Sp. j.`, `UpHOTEL Sp. z o.o.`), uzupełniono brakującego czwartego wykonawcę części chmurowej w `2026/BZP 00124082` (`OPEGIEKA Sp. z o.o.`) oraz ujednolicono warianty pisowni powtarzających się podmiotów (`Krajowy Operator Chmury Medycznej Sp. z o.o.`, `Instytut Innowacyjnej Edukacji Sp. z o.o.`, `Stinet Sp. z o.o.`, `E4I Sp. z o.o.`, `net-o-logy Sp. z o.o.`, `Pharmdiver Sp. z o.o.`, `Gigaserwer Sp. z o.o.`, `Sages Sp. z o.o.`, `Progress Systemy Komputerowe Sp. z o.o.`, `MW Consulting Sp. z o.o.`, `PC Open Sp. z o.o.`).

---

## 7. Zaktualizowane KPI po audycie (stan na `03.11.2026`)

### 7.1. Główne przekroje zbioru (przed audytem vs po audycie)

| Przekrój zbioru | Postępowania | Podpisane umowy (`resolved`) | Brak wyniku (`open_for_bids` + `pending`) | Unieważnione (`cancelled`) | Suma umów brutto | Mediana umowy | Średnia umowa | Jedna oferta (`bids = 1`) | Współfinansowanie UE (postępowania / kwota umów) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| *Przed audytem — rdzeń (159)* | *159* | *99* | *34* | *26* | *31 965 244,77 zł* | *180 000,01 zł* | *322 881,26 zł* | *41 / 93 (44,1%)* | *76 / 159 (47,8%) · 20 262 636,10 zł* |
| **Po audycie — rdzeń AI (`core`, 159)** | **159** | **110** | **18** *(4 + 14)* | **31** | **32 202 163,25 zł** | **170 722,00 zł** | **292 746,94 zł** | **45 / 104 (43,3%)** | **91 / 159 (57,2%) · 21 104 526,58 zł** |
| **Tylko czysty zakres AI (`pure`, 139)** | **139** | **97** | **16** *(4 + 12)* | **26** | **19 633 244,40 zł** | **154 242,00 zł** | **202 404,58 zł** | **37 / 91 (40,7%)** | **81 / 139 (58,3%) · 12 434 374,37 zł** |
| **Zamówienia mieszane (`mixed`, 20)** | **20** | **13** | **2** *(0 + 2)* | **5** | **12 568 918,85 zł** | **619 999,92 zł** | **966 839,91 zł** | **8 / 13 (61,5%)** | **10 / 20 (50,0%) · 8 670 152,21 zł** |
| **Wydatki poboczne (`incidental`, 12)** | **12** | **11** | **0** *(0 + 0)* | **1** | **5 216 219,04 zł** | **64 000,00 zł** | **474 201,73 zł** | **0 / 11 (0,0%)** | **3 / 12 (25,0%) · 179 946,09 zł** |
| **Cała baza łącznie (`all`, 171)** | **171** | **121** | **18** *(4 + 14)* | **32** | **37 418 382,29 zł** | **156 087,00 zł** | **309 242,83 zł** | **45 / 115 (39,1%)** | **94 / 171 (55,0%) · 21 284 472,67 zł** |

### 7.2. Przekrój według kategorii zamówień

| Kategoria | Postępowania | Umowy | Brak wyniku | Unieważnione | Suma umów brutto | Mediana umowy | Jedna oferta (`bids = 1`) | Mediana ofert | Udział UE (postępowania / kwota) | W tym tylko `pure` (umowy / kwota) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Wdrożenia i systemy AI (`software_deploy`)** | 62 | 45 | 5 *(1+4)* | 12 | **17 174 549,95 zł** | 255 348,00 zł | **27 / 41 (65,9%)** | 1,0 | 44 / 62 (71,0%) · 11,89 mln zł | 40 umów · 11 351 128,73 zł |
| **Serwery GPU, lab. i aparatura (`hardware_lab`)** | 48 | 30 | 8 *(2+6)* | 10 | **11 741 856,99 zł** | 171 356,00 zł | **14 / 30 (46,7%)** | 2,0 | 10 / 48 (20,8%) · 6,45 mln zł | 24 umowy · 5 058 548,16 zł |
| **Szkolenia, kursy i warsztaty (`training`)** | 36 | 26 | 3 *(1+2)* | 7 | **2 462 262,50 zł** | 47 000,00 zł | **3 / 24 (12,5%)** | 6,0 | 30 / 36 (83,3%) · 2,22 mln zł | 26 umów · 2 462 262,50 zł |
| **Badania, audyty i doradztwo (`consulting`)** | 13 | 9 | 2 *(0+2)* | 2 | **823 493,81 zł** | 51 000,00 zł | **1 / 9 (11,1%)** | 3,0 | 7 / 13 (53,8%) · 0,55 mln zł | 7 umów · 761 305,01 zł |
| *Wydatki poboczne (`incidental`)* | *12* | *11* | *0* | *1* | *5 216 219,04 zł* | *64 000,00 zł* | *0 / 11 (0,0%)* | *5,0* | *3 / 12 (25,0%) · 0,18 mln zł* | *—* |

### 7.3. Dynamika roczna (rdzeń AI — 159 postępowań)

#### A. Według roku publikacji ogłoszenia w BZP (`year`)

| Rok ogłoszenia | Postępowania (`core`) | Podpisane umowy | Brak wyniku | Unieważnione | Suma umów brutto (`core`) | Mediana umowy | Jedna oferta (`bids = 1`) | Tylko `pure` (postępowania / umowy / kwota) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **2024** | 24 | 18 | 0 | 6 | **4 054 302,01 zł** | 120 472,50 zł | 7 / 16 (43,8%) | 24 post. · 18 umów · **4 054 302,01 zł** |
| **2025** | 41 | 35 | 1 *(0+1)* | 5 | **8 558 196,78 zł** | 154 242,00 zł | 13 / 34 (38,2%) | 35 post. · 31 umów · **5 068 103,32 zł** |
| **2026** *(do 03.11)* | 94 | 57 | 17 *(4+13)* | 20 | **19 589 664,46 zł** | 199 000,00 zł | 25 / 54 (46,3%) | 80 post. · 48 umów · **10 510 839,07 zł** |

#### B. Według rzeczywistego roku zawarcia umowy (`contractDate`)

| Rok zawarcia umowy | Podpisane umowy (`core`) | Suma umów brutto | Mediana umowy | Jedna oferta (`bids = 1`) | Umowy ze wsparciem UE (liczba / kwota) |
| :--- | ---: | ---: | ---: | ---: | ---: |
| **2023** *(ogłoszone w I 2024)* | 3 | **611 439,00 zł** | 141 450,00 zł | 2 / 3 (66,7%) | 1 · 1 482,00 zł |
| **2024** | 15 | **3 442 863,01 zł** | 99 495,00 zł | 5 / 13 (38,5%) | 5 · 998 352,19 zł |
| **2025** | 37 | **8 954 868,71 zł** | 154 242,00 zł | 14 / 36 (38,9%) | 21 · 3 245 756,02 zł |
| **2026** *(do 03.11)* | 55 | **19 192 992,53 zł** | 199 000,00 zł | 24 / 52 (46,2%) | 43 · 16 858 936,37 zł |

### 7.4. Przekrój według sektorów zamawiających (rdzeń AI — 159 postępowań)

| Sektor publiczny | Postępowania | Umowy | Brak wyniku | Unieważnione | Suma umów brutto | Mediana umowy | Jedna oferta (`bids = 1`) | Mediana ofert | Udział UE (postępowania / kwota umów) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Uczelnie i nauka** | 71 | 47 | 10 *(1+9)* | 14 | **15 237 849,68 zł** | 97 096,20 zł | 19 / 46 (41,3%) | 2,0 | 26 / 71 (36,6%) · 7 547 879,21 zł |
| **Ochrona zdrowia** | 38 | 31 | 1 *(0+1)* | 6 | **11 362 360,08 zł** | 255 348,00 zł | **20 / 27 (74,1%)** | 1,0 | 31 / 38 (81,6%) · 9 459 727,08 zł |
| **Samorządy, WUP i instytucje reg.** | 30 | 21 | 4 *(2+2)* | 5 | **2 700 425,24 zł** | 96 692,76 zł | 2 / 21 (9,5%) | 5,0 | 22 / 30 (73,3%) · 2 045 063,74 zł |
| **Administracja centralna i agencje** | 16 | 8 | 3 *(1+2)* | 5 | **2 695 666,25 zł** | 310 722,50 zł | 4 / 8 (50,0%) | 2,0 | 9 / 16 (56,2%) · 1 852 144,55 zł |
| **Szkoły i oświata** | 4 | 3 | 0 | 1 | **205 862,00 zł** | 56 000,00 zł | 0 / 2 (0,0%) | 5,0 | 3 / 4 (75,0%) · 199 712,00 zł |

### 7.5. Przekrój regionalny według województw (rdzeń AI — 159 postępowań)

| Województwo | Postępowania | Umowy | Brak wyniku | Unieważnione | Suma umów brutto | Mediana umowy | Jedna oferta (`bids = 1`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Mazowieckie** | 44 | 30 | 5 | 9 | **10 692 881,05 zł** | 265 858,25 zł | 17 / 30 (56,7%) |
| **Śląskie** | 20 | 14 | 4 | 2 | **8 659 990,25 zł** | 295 837,14 zł | 5 / 13 (38,5%) |
| **Dolnośląskie** | 14 | 12 | 1 | 1 | **2 004 033,50 zł** | 92 441,00 zł | 2 / 12 (16,7%) |
| **Opolskie** | 7 | 5 | 0 | 2 | **1 729 945,20 zł** | 202 950,00 zł | 3 / 5 (60,0%) |
| **Wielkopolskie** | 9 | 6 | 1 | 2 | **1 567 098,20 zł** | 232 915,00 zł | 2 / 4 (50,0%) |
| **Małopolskie** | 22 | 12 | 3 | 7 | **1 541 497,81 zł** | 67 344,00 zł | 8 / 12 (66,7%) |
| **Warmińsko-mazurskie** | 2 | 1 | 0 | 1 | **1 275 295,98 zł** | 1 275 295,98 zł | 0 / 1 (0,0%) |
| **Łódzkie** | 7 | 5 | 1 | 1 | **994 559,66 zł** | 75 030,00 zł | 1 / 4 (25,0%) |
| **Pomorskie** | 7 | 5 | 0 | 2 | **793 286,35 zł** | 38 580,67 zł | 1 / 4 (25,0%) |
| **Kujawsko-pomorskie** | 1 | 1 | 0 | 0 | **785 290,43 zł** | 785 290,43 zł | 1 / 1 (100,0%) |
| **Lubelskie** | 9 | 5 | 1 | 3 | **679 002,14 zł** | 156 087,00 zł | 0 / 4 (0,0%) |
| **Podkarpackie** | 1 | 1 | 0 | 0 | **492 000,00 zł** | 492 000,00 zł | 1 / 1 (100,0%) |
| **Podlaskie** | 4 | 4 | 0 | 0 | **418 384,40 zł** | 93 209,40 zł | 3 / 4 (75,0%) |
| **Zachodniopomorskie** | 6 | 3 | 2 | 1 | **340 973,00 zł** | 114 173,00 zł | 0 / 3 (0,0%) |
| **Lubuskie** | 2 | 2 | 0 | 0 | **200 750,00 zł** | 100 375,00 zł | 1 / 2 (50,0%) |
| **Świętokrzyskie** | 4 | 4 | 0 | 0 | **27 175,28 zł** | 7 900,00 zł | 0 / 4 (0,0%) |

### 7.6. Powtarzający się wykonawcy (co najmniej 2 wygrane postępowania w rdzeniu AI)

*Kwoty w postępowaniach wielowykonawczych przypisano dokładnie według wygranych części w sekcji `8.2` BZP.*

| Wykonawca | Liczba postępowań (`core`) | Łączna wartość umów brutto | Specjalizacja i zamawiający |
| :--- | ---: | ---: | :--- |
| **Krajowy Operator Chmury Medycznej Sp. z o.o.** | **7** | **1 960 190,20 zł** | Chmurowe systemy VoiceBot i Chatbot dla szpitali (Cieszyn, Opole, Poznań ×2, Zamość, Siedlce, Legnica) |
| **Instytut Innowacyjnej Edukacji Sp. z o.o.** | **4** | **221 381,00 zł** | Szkolenia akademickie z AI (PW, UJ, Politechnika Świętokrzyska, AMW Gdynia) |
| **Stinet Sp. z o.o.** | **3** | **1 292 422,50 zł** | Coroczne utrzymanie i wsparcie systemu detekcji zagrożeń ML w NCBJ (Otwock) |
| **E4I Sp. z o.o.** | **3** | **734 932,05 zł** | Roboty humanoidalne, platformy mobilne i motion capture dla Politechniki Częstochowskiej |
| **Vida Andrzej Tarasek** | **2** | **722 010,00 zł** | Subskrypcje oprogramowania cyberbezpieczeństwa EDR z AI dla PARP |
| **net-o-logy Sp. z o.o.** | **2** | **609 957,00 zł** | Infrastruktura sieciowa i serwerowa AI/ML dla Łukasiewicz–EMAG w Katowicach *(po korekcie 3× `8.2`)* |
| **Gigaserwer Sp. z o.o.** | **2** | **471 582,00 zł** | Serwery GPU do treningu modeli AI dla UJD w Częstochowie (Cz. 1) i Politechniki Lubelskiej |
| **Sages Sp. z o.o.** | **2** | **404 126,08 zł** | Analiza AI dla dostępności cyfrowej (Ministerstwo Cyfryzacji) oraz Chatbot AI (NAWA) |
| **Pharmdiver Sp. z o.o.** | **2** | **362 238,69 zł** | Oprogramowanie AI wspierające dobór farmakoterapii w szpitalach w Krakowie i Opolu |
| **MW Consulting Sp. z o.o.** | **2** | **302 973,00 zł** | Szkolenia wyjazdowe z zastosowań AI w administracji publicznej (WUP Wrocław, WUP Szczecin) |
| **PC Open Sp. z o.o.** | **2** | **112 840,00 zł** | Szkolenia z wykorzystania AI w służbach zatrudnienia i administracji (WUP Wrocław ×2) |
| **Progress Systemy Komputerowe Sp. z o.o.** | **2** | **95 971,93 zł** | Zestawy i stacje komputerowe dla Politechniki Lubelskiej i UMCS w Lublinie |
| **VOLVOX Consulting Bartłomiej Czauderna** | **2** | **62 188,80 zł** | Audyty projektów transformacji cyfrowej i systemów AI w szpitalach (Augustów Cz. 1, Brzesko) |

---

## 8. English Summary: Methodology & Post-Audit KPIs (`2026-11-03`)

### Scope & Audit Pipeline
- **Source & Snapshot:** Official Polish Public Procurement Bulletin (**BZP**, `ezamowienia.gov.pl`) covering domestic (sub-EU-threshold) public tenders published between **2024-01-01 and 2026-11-03**. Above-threshold EU tenders published exclusively in **TED** (e.g., national supercomputing GPU clusters) are outside BZP's statutory scope.
- **Reproducible ETL ([`scripts/audit_bzp_data.py`](../../scripts/audit_bzp_data.py)):** Written in Python 3 (standard library only). Automatically splits query date windows whenever `PageSize=500` saturates and joins `ContractNotice`, `TenderResultNotice`, and `NoticeUpdateNotice` records by `tenderId` in Python (bypassing the BZP API server bug where the `TenderId` query parameter is ignored).
- **Key Audit Corrections:**
  1. **17 missing `TenderResultNotice` outcomes linked** (12 newly `resolved` contracts, 5 newly `cancelled` proceedings), reducing unresolved core tenders from `34` to **`18`** (`4` `open_for_bids` with deadlines on or after `2026-11-03`, and `14` `pending_result` past their bid deadline with no BZP award notice yet).
  2. **Multi-lot isolation & clerical fixes:** Isolated AI-only lots in 6 multi-topic tenders (`UMWD Wrocław`, `ZSO Pawłowice`, `AMW Gdynia`, `WUP Kielce`, `Politechnika Warszawska`, `SPZOZ Augustów`), verified Centrum e-Zdrowia's 10× clerical error (`2026/BZP 00009631`: `5,440,000 PLN` in section `8.2` vs `544,000 PLN` winning bid in `6.4` at `08de4ded-90a3-9604-d6d3-f5000169f1af`), and uncovered a 3× repeated combined-contract entry in `2024/BZP 00014936` (`Łukasiewicz–EMAG`: `468,507 PLN` repeated across 3 lots = `1,405,521 PLN`, corrected to **`468,507 PLN`**, reducing `net-o-logy Sp. z o.o.`'s 2-contract total from `1.55M PLN` to `609,957 PLN`).
  3. **Non-additive multi-lot bid rule:** For multi-lot tenders, `bids` records the maximum bid count on any single AI lot (never summing bids across lots), with exact per-lot distributions stored in `lotsInfo`. Single-source (`wolna ręka`, Art. 214) awards (`bids: null`, 6 core contracts) are excluded from the competitive single-bid denominator (`45 / 104 = 43.3%`).
  4. **Explicit `aiScope` (`"pure"` | `"mixed"` | `"incidental"`):** Flagged **20 core proceedings** (13 signed contracts totaling `12,568,918.85 PLN`) as `"mixed"` where an inseparable lump sum or hybrid KPO package bundles AI with construction works, physical guard services, clinical ultrasound/microscopy/stage-audio hardware, or broad enterprise ERP/EZD/PACS/Intranet deployments — leaving **139 `"pure"` AI core proceedings** (97 signed contracts totaling **`19,633,244.40 PLN`**).
  5. **EU co-financing (`eu`) & string hygiene:** Fixed `ContractNotice` section `2.14.)` parsing (`15` records updated `false -> true`), completed all `6` truncated CPV strings, stripped newlines/NBSP/double spaces, and canonicalized all vendor names.

### Headline Post-Audit KPIs (Core AI Universe: 159 Proceedings)
- **Proceedings:** `159` core (`110` signed contracts · `18` no BZP result [`4` open for bids + `14` past deadline] · `31` cancelled) + `12` incidental (`11` signed for `5,216,219.04 PLN`, `1` cancelled) = **`171` total**.
- **Signed Contract Value (Gross):** **`32,202,163.25 PLN`** across `110` core contracts (median **`170,722.00 PLN`**); **`19,633,244.40 PLN`** across `97` pure-scope AI contracts (median **`154,242.00 PLN`**).
- **Single-Bid Rate:** **`43.3%`** overall in core (`45` of `104` competitive contracts), rising to **`65.9%`** in AI software deployments (`27 / 41`) and **`74.1%`** in hospitals & healthcare (`20 / 27`), vs **`12.5%`** in trainings (`3 / 24`, median `6.0` bids).
- **EU / KPO Co-Financing:** **`57.2%`** of core proceedings (`91 / 159`) and **`21,104,526.58 PLN`** across `70` EU-backed core contracts (`81.6%` of healthcare tenders and `83.3%` of training tenders).
