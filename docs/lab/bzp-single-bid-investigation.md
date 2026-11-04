# Plan pogłębienia dziennikarskiego · Skąd bierze się jedna oferta w publicznych wdrożeniach AI?

> **Punkt wyjścia:** Raport i baza 171 postępowań z Biuletynu Zamówień Publicznych (`2024–2026`, `/pl/lab/przetargi-ai/`)  
> **Zjawisko do wyjaśnienia:** Licząc sztuki umów, pojedyncza oferta pada w **43,3%** konkurencyjnych przetargów (`45 ze 104`), ale ważąc pieniądzem — **56,0% całej kwoty podpisanych kontraktów (`18,04 mln zł` z `32,20 mln zł`, `51 ze 110` umów łącznie z wolną ręką)** trafia na wejściu do wykonawców niemających rywala, a po uwzględnieniu odrzuceń konkurentów w trakcie badania ofert (`Sekcja 6.1.6`) **aż 60,7% wszystkich pieniędzy (`19,54 mln zł` w `59 ze 110` umów — `53,6%`) rozstrzygnięto bez żadnego ocalałego konkurenta**. W kategorii szkoleń AI mediana wynosi **6 ofert** na przetarg (do 23 ofert przy części kursu za `7 200 zł` na Politechnice Świętokrzyskiej, `2026/BZP 00465518`), natomiast we wdrożeniach oprogramowania AI bez konkurencji cenowej zawarto **65,9% przetargów otwartych** (`27 z 41`, na `12,09 mln zł`), a łącznie z wolną ręką — **31 z 45 kontraktów (`68,9%`) i aż 77,8% wszystkich wydatków na oprogramowanie (`13,37 z 17,17 mln zł`)**.  
> **Cel materiału nr 2:** Ustalić na podstawie dokumentacji SWZ, załączników technicznych (OPZ), protokołów postępowań oraz rozmów z obiema stronami rynku, **gdzie za brakiem konkurentów stoją już udowodnione w HTML ogłoszeń bariery architektoniczne (`HIS`/`PACS`) i regulacyjne, a gdzie szczegółowe warunki SWZ, kary umowne lub wyceny szacunkowe**.

---

## 1. Co rozstrzygają twarde dane i pełnotekstowy audyt HTML BZP przed lekturą SWZ — a czego muszą dowieść załączniki

Zanim otworzymy zewnętrzne Specyfikacje Warunków Zamówienia (SWZ), pogłębiony rozkład **110 podpisanych umów podstawowych (`32,20 mln zł` brutto)** oraz pełny audyt sekcji `3.1, 4.3, 5.2, 6.1.6, 6.2–6.4, 7.2 i 8.1` formularzy BZP rozstrzygają pięć faktów empirycznych:

### 1.1. Ważenie pieniądzem (`56,0%`), ukryta wolna ręka i odrzucenia ofert → `60,7%` budżetu (`19,54 mln zł`) bez ocalałego konkurenta
- W ujęciu liczbowym przetargi z 1 ofertą w `Sekcji 6.1` stanowią **`43,3%`** (`45 ze 104`), ale **ważone wartością kontraktów pochłaniają `54,1%` konkurencyjnych wydatków (`16,71 z 30,88 mln zł`, czyli `51,9%` całego rdzenia)**. Po doliczeniu **`6` umów wykazanych bez `Sekcji 6.1`** (`1,33 mln zł`, `4,1%`), **łącznie `51 ze 110` podpisanych umów (`46,4%`) o wartości `18,04 mln zł` (`56,0%` całego zbioru `32,20 mln zł`) nie miało na wejściu żadnej konkurencyjnej oferty**.
- **Ukryta wolna ręka (`Sekcja 3.1`):** cztery spośród `45` umów z wpisaną cyfrą `1` w `Sekcji 6.1` (`2,13 mln zł`: `Pixel Technology` `922,8 tys. zł` i `KOChM` `453,4 tys. zł` w Opolu, `upmedic` `528,9 tys. zł` na UMP w Poznaniu oraz `StatSoft` `227,5 tys. zł` na UP w Poznaniu) to w rzeczywistości ustawowe zamówienia z wolnej ręki (`art. 305 Pzp`), w których urzędnik wpisał zaproszonego wykonawcę jako `1` ofertę — co podnosi **faktyczną skalę zamówień z wolnej ręki do `10 ze 110` umów (`9,1%`) o wartości `3,46 mln zł` (`10,7%` wydatków)** (obok `41 ze 100` otwartych przetargów z 1 ofertą na `14,58 mln zł`; uzasadnienia `Sekcji 3.1.1` sięgają od praw autorskich `HIS` aż po dwudniowy warsztat AI w Zgierzu za `6 150 zł`, [karta `08dd0eef-fcd0-fc2e-985c-bb00013551de`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08dd0eef-fcd0-fc2e-985c-bb00013551de), uzasadniony zdaniem: *„Dominik Skowroński jest specjalistą w dziedzinie AI o wysokiej renomie, co czyni go osobowością jedyną i niepowtarzalną”*).
- **Odrzucenia rywali (`Sekcja 6.1.6`):** zamawiający **odrzucili `121 z 460` złożonych ofert (`26,3%` — ponad 1 na 4 oferty)**, w tym `46` (`10,0%`) za rażąco niską cenę (`6.1.7`). W **`8` wieloofertowych przetargach na `1,50 mln zł`** zdyskwalifikowano wszystkich rywali poza jednym — m.in. w Katowickim Centrum Onkologii na AI do mammografii przesiewowej ([`2025/BZP 00564260`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de2e7f-e0d4-32d8-0560-490001ac9ab6), umowa na `424,5 tys. zł` po odrzuceniu oferty `238,8 tys. zł`) oraz w dwóch dostawach robotów humanoidalnych `E4I` na Politechnice Częstochowskiej (`549,9 tys. zł` i `90,0 tys. zł`). Łącznie **`53 ze 104` umów z jawną liczbą ofert (`51,0%`) oraz `59 ze 110` kontraktów podstawowych (`53,6%`) na `19,54 mln zł` (`60,7%` wszystkich pieniędzy) zawarto bez ani jednego ocalałego konkurenta**.
- Na przeciwległym biegunie **`35` zatłoczonych przetargów przyciągających od `4 do 23 ofert`** (**`31,8%`** umów) dzieli między siebie zaledwie **`3,99 mln zł` (`12,4%` pieniędzy)**, a w **oprogramowaniu AI (`software_deploy`)** `31 z 45` umów (`68,9%`) i **`13,37 z 17,17 mln zł` (`77,8%` wydatków)** nie przeszło konkurencji cenowej.

### 1.2. Urwisko `170 000 zł` brutto (`52 / 52`), wymierny koszt braku rywala (`0%` vs `46%` dyskonta) i `63,5%` przetargów bez kryteriów jakości
- Wszystkie `n = 104` konkurencyjne kontrakty dzielą się równo `52 / 52` na kwocie **`170 000 zł` brutto**: poniżej `170 tys. zł` (`52` umowy, `3,43 mln zł` = `11,1%` kwoty) mediana wynosi **`4,5 oferty`** i tylko **`21,2%` (`11/52`)** to 1 oferta; od `170 tys. zł` wzwyż (`52` umowy, `27,45 mln zł` = `88,9%` kwoty) mediana spada do **`1 oferty`**, a **`65,4%` (`34/52`, `15,82 mln zł`)** przyciąga jednego oferenta. Podniesienie od 1.01.2026 r. progu Pzp ze `130 tys.` do **`170 tys. zł netto` (~`209 tys. zł brutto`)** wypycha poza obowiązkowy BZP właśnie dolną, konkurencyjną połowę rynku.
- **Ile podatnika kosztuje brak konkurenta (`Sekcja 4.3` netto vs `8.2` brutto):** w jednorodnej próbie dostaw IT i sprzętu opodatkowanych 23% VAT z czystym szacunkiem (`n = 31`), przy **1 ocalałej ofercie** (`n = 18`) mediana umowy brutto wynosi **`1,230×` szacunku netto (`100,0%` wyceny netto zamawiającego — `0%` rabatu)**; przy `2–3` ważnych ofertach (`n = 9`) spada do **`93,8%` szacunku netto (`1,153×`)**; a przy **`4+` ważnych ofertach** (`n = 4`) spada do **`54,0%` szacunku netto (`0,664×` — aż `46,0%` dyskonta netto)** (w całej próbie `n = 45` jednoczęściowych umów z czystym VAT mediana brutto/netto spada z `1,230×` do `0,758×`).
- **Rozstrzał wycen `13,25×` w IT przy zerowym filtrze jakości:** ważne oferty na serwery GPU różnią się medianowo tylko o **`1,12×`** (maks. `1,39×`), natomiast **w oprogramowaniu AI rozjeżdżają się o medianę `2,71×` i maksymalnie aż `13,25×`** (Szpital w Ameryce `2026/BZP 00124082` Cz. 3: `165,0 tys. zł` vs `2,19 mln zł`; UMCS Lublin `2025/BZP 00601774`: **`9,13×`**). Mimo to **`63,5%` konkurencyjnych przetargów (`94 ze 148`, a w oprogramowaniu AI aż `72,2%` — `39 z 54`) nie ma żadnych merytorycznych kryteriów jakości**, a na **100 ustawowo konkurencyjnych umów** jakość jednoznacznie pokonała niższą cenę **tylko `2` razy (`2,0%` — badania w WUP Warszawa i WUP Łódź, `0%` w IT i sprzęcie)**.

### 1.3. Udowodniony w BZP twardy *lock-in* `HIS/PACS`, rozwiązanie paradoksu „dwóch prędkości UE” oraz sekcja zwłok 31 unieważnień
- **Kontrast sektorowy i twardy *vendor lock-in*:** samorządy i WUP notują 1 ofertę w **`2 z 21` umów (`9,5%`)**, uczelnie w `19 z 46` (`41,3%`), agencje centralne w `4 z 8` (`50,0%`, przy najwyższym odsetku unieważnień **`38,5%` zakończonych = `5 z 13`**, tj. `31,3%` z `16`), a **szpitale w `20 z 27` przetargów (`74,1%`) i `24 z 31` umów (`77,4%`, `8,19 mln zł`) łącznie z wolną ręką**. Audyt pełnych ogłoszeń dowodzi przyczyny wprost: **każde postępowanie szpitalne wymieniające z nazwy posiadany system kliniczny lub centralny (`AMMS/Asseco`, `CliniNET`, `AGFA EI`, `Pixel`, `CeZ PUI`) zakończyło się zerem rywali (`12 z 12` podpisanych umów = `100,0%` + `4` unieważnienia; w całym `software_deploy` `16 z 17 = 94,1%` wobec `53,6%` *greenfield*)**, a WSS w Legnicy ([`2025/BZP 00478008`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de0c86-d42b-08ab-342c-6500019720dc)) zażądał wprost w Sekcji `5.4`, *„aby Wykonawca współpracował z Asseco Poland S.A lub posiadał jego autoryzację”*. Mediana pierwotnego okna na ofertę wynosi **`9,0` dni** wobec **`28,0` dni** oceny zamawiającego; w customowym IT `≥ 170 tys. zł` termin wydłużono w **`7 z 7` (`100%`)** wieloofertowych umów (mediana `16,0 dni`), lecz w szpitalach nawet **5-krotne wydłużenie z 12 do 27 dni** w NIKard ([`2026/BZP 00213382`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08dea12f-a0b9-e979-5fad-95000119fa03)) dało `1` ofertę.
- **Rozwiązanie paradoksu UE („dwie prędkości UE”):** zagregowane zamówienia z UE mają niższy wskaźnik 1 oferty (`41,8%`, `28 z 67`) niż krajowe (`45,9%`, `17 z 37`; pakiety mieszane `61,5%` vs czyste AI `40,7%`) **wyłącznie dlatego, że wieloletnie kursy `FERS` (`6–23` ofert) maskują wiosenny sprint szpitalny `KPO D1.1.2`**. W **`I półroczu 2026 r.`** szpitale ścisnęły **`26 z 38` (`68,4%`)** swoich przetargów AI z 34 miesięcy (`19` umów na `8,45 mln zł` przy **`84,2%` = `16 z 19`** braku konkurencji). Gdy okno KPO zamknęło się w połowie 2026 r., liczba przetargów szpitalnych spadła w `III kw. 2026 r.` do **`1` (`0` z KPO)**, a ogólnokrajowy wskaźnik 1 oferty spadł z **`64,7%` (`I kw.`) i `55,0%` (`II kw.`) do `0,0%` (`0 z 11` w `III kw. 2026 r.`)**.
- **Autopsja `31` unieważnień (`22,0%` ze `141` zakończonych; `19,5%` ze `159`):** tylko **`6 z 31` (`19,4%`)** upadło z braku ofert; w **`24 z 31` (`77,4%`)** złożono **co najmniej `53` oferty**, ale postępowania padły przez **szok budżetowy (`14 z 31 = 45,2%`)** lub **odrzucenie 100% ofert (`8 z 31 = 25,8%`)**, plus **`3 z 31` (`9,7%`)** wad proceduralnych/negocjacyjnych (`10 z 26 = 38,5%` inicjatyw porzucono na stałe). Co istotne strukturalnie (`Sekcja 7.2`): **MŚP wygrały `105 ze 110` umów (`95,5%`) i `30,21 mln zł` (`93,8%` kwoty)**, a uczelnie publiczne **`0 ze 110` (`0,0%`)**.

---

### 1.4. Założenie warsztatowe (cztery hipotezy szczegółowe do rozdzielenia w SWZ)

Pojedyncza oferta w zamówieniu publicznym na oprogramowanie nie jest automatycznym dowodem ustawienia przetargu. W publicznym IT i ochronie zdrowia mogą za nią stać cztery zupełnie różne mechanizmy:

1. **Uzależnienie architektoniczne (*vendor lock-in*):** szpital rozbudowuje już posiadany system kliniczny (HIS lub PACS), do którego dokumentację integracyjną, prawa zależne albo autoryzowane konektory ma wyłącznie producent systemu macierzystego lub jego partner wdrożeniowy.
2. **Wąska specjalizacja domenowa i regulacyjna:** na polskim rynku istnieje zaledwie jeden lub dwa podmioty oferujące gotowy, zwalidowany wyrób medyczny lub zbiór licencjonowanych polskojęzycznych korpusów prasowych.
3. **Presja kamieni milowych KPO i krótkie okna ofertowe:** 7–10 dni między ogłoszeniem a otwarciem ofert przy sztywnym terminie rozliczenia dotacji KPO zniechęca firmy zewnętrzne do kosztownej analizy przedwdrożeniowej i wzięcia na siebie ryzyka kar umownych.
4. **Nadmierne zawężenie warunków udziału i OPZ:** referencje przepisane pod konkretny wcześniejszy projekt, brak dopuszczenia rozwiązań równoważnych lub połączenie w jednym zadaniu niepowiązanych kompetencji.

Drugi materiał ma rozdzielić te cztery przyczyny na próbie **konkretnych postępowań** z naszej bazy: **7 zróżnicowanych kontraktów z 1 ofertą** oraz **4 wdrożeń wieloofertowych jako grupy kontrolnej**.

---

## 2. Próba badawcza z bazy BZP (`7` przypadków z 1 ofertą + `4` kontrolne)

### A. Siedem badanych kontraktów wdrożeniowych z 1 ofertą (`category: software_deploy`, `bids = 1`)

#### 1. Integracja szpitalnego systemu obrazowego PACS z Platformą Usług Inteligentnych (PUI)
- **Numer BZP:** `2026/BZP 00195811` (umowa z `2026-04-08`)
- **Zamawiający:** Narodowy Instytut Onkologii im. Marii Skłodowskiej-Curie – Państwowy Instytut Badawczy, Oddział w Gliwicach
- **Wykonawca:** Agfa Sp. z o.o.
- **Kwota brutto:** `485 850,00 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Integracja posiadanego systemu AGFA EI i wymiana danych z opracowaną przez Centrum e-Zdrowia Platformą Usług Inteligentnych (PUI) w zakresie AI
- **Źródło w BZP:** [Karta ogłoszenia `08de9958-93d1-c716-5fad-950001198a59`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de9958-93d1-c716-5fad-950001198a59)
- **Dlaczego w próbie:** Klasyczny przykład podłączenia istniejącego systemu obrazowania producenta do centralnej platformy państwowej CeZ. Pełny audyt wszystkich **`7` szpitalnych postępowań na podłączenie do `PUI`** pokazuje skalę zjawiska: **`0 z 7` przyciągnęło dwie oferty, aż `4 z 7` zakończyły się unieważnieniem** (w tym fiasko negocjacji z wolnej ręki w 4. WSZK we Wrocławiu [`2026/BZP 00180494`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de8fc6-1571-b697-5fad-9500011f3534)), a **3 podpisane kontrakty różnią się ceną aż `3,2-krotnie`** — od `285 360,00 zł` z SoloSys w Siedlcach ([`2026/BZP 00141601`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de7aad-0f25-1813-056e-e50001ac371c), po wcześniejszym unieważnieniu `2026/BZP 00100988`) przez `485 850,00 zł` w Gliwicach po `922 770,00 zł` w ustawowej wolnej ręce z Pixel Technology w Opolu ([`2026/BZP 00183188`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de909f-763a-ee4b-5fad-950001193755)).

#### 2. VoiceBot medyczny wpięty w system szpitalny HIS
- **Numer BZP:** `2026/BZP 00297319` (umowa z `2026-06-17`)
- **Zamawiający:** Kliniczne Centrum Ginekologii, Położnictwa i Neonatologii w Opolu
- **Wykonawca:** Krajowy Operator Chmury Medycznej Sp. z o.o.
- **Kwota brutto:** `453 427,20 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Zakup wymaganych licencji oraz wdrożenie modułu systemu HIS — usługa wirtualnego asystenta pacjenta (VoiceBot) wraz ze szkoleniem personelu oraz utrzymaniem i aktualizacją na 3 lata
- **Źródło w BZP:** [Karta ogłoszenia `08decd2e-1286-bf9f-5fad-9500015f73b9`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08decd2e-1286-bf9f-5fad-9500015f73b9)
- **Dlaczego w próbie:** Krajowy Operator Chmury Medycznej jest **numerem 1 w Polsce w zamówieniach czysto AI (`10,0%` całego rynku `pure` `19,63 mln zł`)** i najczęstszym wykonawcą w zbiorze (7 umów na `1,96 mln zł` / `1 960 190,20 zł` — Cieszyn, Opole, Poznań ×2, Zamość, Legnica, Siedlce). Audyt `Sekcji 3.1` dowodzi, że aż **`5 z tych 7 umów` (`1,74 mln zł`) zawarto ustawowo bez przetargu z wolnej ręki** (`4` bez sekcji 6.1 w Cieszynie, Zamościu i Poznaniu ×2 oraz niniejszą umowę w Opolu `2026/BZP 00297319` na `453,4 tys. zł`, gdzie zaproszonego wykonawcę wpisano jako `1` ofertę), a pozostałe **2 przetargi otwarte** (Siedlce z 7-dniowym oknem; Legnica [`2025/BZP 00478008`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de0c86-d42b-08ab-342c-6500019720dc) z wprost wpisanym w Sekcji `5.4` wymogiem współpracy lub autoryzacji `Asseco Poland S.A.`) dały po 1 ofercie. Co więcej, w Poznaniu roczne odnowienie z wolnej ręki ([`2024/BZP 00574495`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08dcf9a4-a65d-8d42-985c-bb0001343ae1) → [`2026/BZP 00514632`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08df38ab-d335-94f5-e2d6-6b000120bf02)) podrożało o **`+16,1%` (`219,9 tys. zł` → `255,3 tys. zł`)**, a w NIKard ([`2026/BZP 00213382`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08dea12f-a0b9-e979-5fad-95000119fa03), `253,5 tys. zł`, `CliniNET`) nawet **5-krotne wydłużenie terminu z 12 do 27 dni** nie przyciągnęło drugiego oferenta.

#### 3. Specjalistyczne AI dla farmakoterapii i apteki szpitalnej
- **Numer BZP:** `2026/BZP 00201117` (umowa z `2026-04-15`)
- **Zamawiający:** Uniwersytecki Szpital Kliniczny w Opolu
- **Wykonawca:** Pharmdiver Sp. z o.o.
- **Kwota brutto:** `202 950,00 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Zakup, dostawa i wdrożenie oprogramowania AI wspierającego proces doboru leków przez lekarzy i farmaceutów w USK w Opolu
- **Źródło w BZP:** [Karta ogłoszenia o wyniku `08de9b8d-7c33-3c74-5fad-95000119adfd`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de9b8d-7c33-3c74-5fad-95000119adfd) *(ogłoszenie o zamówieniu `2026/BZP 00146056` ze szacunkiem 4.3: [`08de7ddb-2c8d-db43-056e-e50001ac545f`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de7ddb-2c8d-db43-056e-e50001ac545f))*
- **Dlaczego w próbie:** Przykład wąskiej niszy klinicznej oraz braku kompresji cenowej przy 1 ofercie: szpital wycenił zamówienie w Sekcji `4.3` na **`111,5 tys. zł` netto**, a ostatecznie podpisał kontrakt na **`202 950,00 zł` brutto**. Dwa tygodnie później ten sam wykonawca zawarł analogiczną umowę z 1 ofertą w Szpitalu im. L. Rydygiera w Krakowie (`2026/BZP 00272273`, `159 288,69 zł`). Sprawdzimy w SWZ, czy na polskim rynku istnieje realny konkurencyjny odpowiednik spełniający wymogi kliniczne.

#### 4. Modele językowe (LLM) do strukturyzacji dokumentacji w hurtowni danych medycznych
- **Numer BZP:** `2026/BZP 00172477` (umowa z `2026-03-25`)
- **Zamawiający:** Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu
- **Wykonawca:** upmedic sp. z o.o.
- **Kwota brutto:** `528 900,00 zł` · **Środki UE:** tak
- **Przedmiot:** Dostarczenie licencji oprogramowania wykonującego strukturyzację (indeksowanie) oraz przeszukiwanie nieustrukturyzowanych danych opisowych w hurtowni danych medycznych w oparciu o modele językowe
- **Źródło w BZP:** [Karta ogłoszenia `08de8b15-6546-c3c4-5fad-950001e70dca`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de8b15-6546-c3c4-5fad-950001e70dca) *(wcześniejsze unieważnienie z 10.03.2026: [`08de7e6f-5da3-2eb6-056e-e50001ac599e`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de7e6f-5da3-2eb6-056e-e50001ac599e))*
- **Dlaczego w próbie:** Audyt HTML sekcji `3.1` i `5.2` ujawnił tu pełną sekwencję proceduralną: 10 marca 2026 r. uczelnia unieważniła otwarty przetarg `2026/BZP 00146627` po **odrzuceniu jedynej złożonej oferty spółki `upmedic`** (`art. 255 pkt 2 Pzp`), po czym zaledwie **14 dni później** udzieliła kontraktu na **`528 900,00 zł` w ustawowym trybie z wolnej ręki (`art. 305 Pzp`) dokładnie tej samej spółce `upmedic`** (wpisując ją w `6.1` jako `1` ofertę). Porównanie obu SWZ i protokołu pokaże, jaki wymóg formalny spowodował odrzucenie pierwszej oferty i na jakiej podstawie przełączono tryb na wolną rękę.

#### 5. Interaktywne punkty recepcyjne z awatarami AI w dużym szpitalu pediatrycznym
- **Numer BZP:** `2026/BZP 00137744` (umowa z `2026-02-18`)
- **Zamawiający:** Instytut „Pomnik – Centrum Zdrowia Dziecka” w Warszawie
- **Wykonawca:** Orange Polska S.A.
- **Kwota brutto:** `916 507,44 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Dostawa, instalacja oraz uruchomienie systemów wirtualnych awatarów AI pełniących funkcję interaktywnych punktów recepcyjnych w 5 lokalizacjach na terenie IPCZD (`ZP/CZD/167/25`)
- **Źródło w BZP:** [Karta ogłoszenia `08de792a-076e-d9e4-056e-e50001ac1d95`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de792a-076e-d9e4-056e-e50001ac1d95)
- **Dlaczego w próbie:** Wysokobudżetowe zamówienie (`916,5 tys. zł`) łączące kioski sprzętowe, warstwę telekomunikacyjną/sieciową oraz generatywnego asystenta głosowo-wizyjnego, w którym nie wystartował żaden mniejszy software house AI. Pozwala sprawdzić rolę łączenia dostawy sprzętu i integracji w jeden pakiet oraz wymogów kapitałowych/referencyjnych.

#### 6. Cyberbezpieczeństwo — detekcja zagrożeń sieciowych z analityką AI/ML
- **Numer BZP:** `2024/BZP 00594351` (umowa z `2024-11-13`)
- **Zamawiający:** Polska Agencja Rozwoju Przedsiębiorczości (PARP)
- **Wykonawca:** Softinet Sp. z o.o.
- **Kwota brutto:** `660 988,47 zł` · **Środki UE:** tak
- **Przedmiot:** Dostawa rozwiązania do wykrywania zagrożeń sieciowych i reagowania na nie z wykorzystaniem analityki i zaawansowanej sztucznej inteligencji
- **Źródło w BZP:** [Karta ogłoszenia `08dd049b-a7e4-c545-985c-bb000134b66e`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08dd049b-a7e4-c545-985c-bb000134b66e)
- **Dlaczego w próbie:** W zamówieniach cyberbezpieczeństwa (NDR/EDR) pojedyncza oferta często wiąże się z architekturą rejestracji projektów u globalnych producentów (*deal registration* w kanale partnerskim) albo rozbudową istniejącej matrycy bezpieczeństwa. Jako tło posłużą też trzy coroczne 1-ofertowe odnowienia wsparcia systemu ML w NCBJ w Otwocku (`2024/BZP 00517135`, `2025/BZP 00459150`, `2026/BZP 00483042` — Stinet sp. z o.o., łącznie `1,29 mln zł`).

#### 7. Zakup licencjonowanych korpusów tekstowych do trenowania modeli LLM
- **Numer BZP:** `2026/BZP 00032576` (umowa z `2025-11-21`, publikacja wyniku w styczniu 2026 r.)
- **Zamawiający:** Naukowa i Akademicka Sieć Komputerowa – Państwowy Instytut Badawczy (NASK-PIB)
- **Wykonawca:** Gremi Media S.A.
- **Kwota brutto:** `356 700,00 zł` · **Środki UE:** nie (środki krajowe)
- **Przedmiot:** Dane tekstowe do trenowania dużych modeli językowych — zakres II
- **Źródło w BZP:** [Karta ogłoszenia `08de535a-71c8-eb39-d6d3-f500016a6814`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de535a-71c8-eb39-d6d3-f500016a6814)
- **Dlaczego w próbie:** Zupełnie odrębna kategoria „surowca dla AI” (prawa autorskie i licencje na zredagowane korpusy prasowe pod polskie modele językowe, np. ekosystem PLLuM). Pozwala zbadać podział zamówienia na zakresy tematyczne i strukturę rynku wydawców gotowych udzielać licencji treningowych AI.

---

### B. Grupa kontrolna — 4 wdrożenia oprogramowania z wieloma ofertami (`bids >= 3`)

Grupa kontrolna pozwala uniknąć błędu poznawczego: pokazuje, jak napisano SWZ w postępowaniach wdrożeniowych o zbliżonej skali finansowej, które mimo to przyciągnęły realną rywalizację kilku lub kilkunastu firm.

#### K1. Samorządowy obieg zadań, Intranet i wewnętrzny Chatbot RAG (5 ofert)
- **Numer BZP:** `2026/BZP 00379906` (umowa z `2026-07-22`)
- **Zamawiający:** Powiat Łowicki (Starostwo Powiatowe w Łowiczu)
- **Wykonawca:** Agentic P.S.A.
- **Kwota brutto:** `680 682,00 zł` · **Liczba ofert:** **`5`** · **Środki UE:** tak
- **Przedmiot:** Wdrożenie Systemu Zarządzania Zadaniami i Chatbota z implementacją RAG oraz systemu Intranet wraz ze szkoleniami („Synergia w Starostwie powiatowym w Łowiczu”)
- **Źródło w BZP:** [Karta ogłoszenia `08def384-e932-a592-962b-1200019cd315`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08def384-e932-a592-962b-1200019cd315)
- **Punkt odniesienia:** Duży kontrakt samorządowy (`680,7 tys. zł`) z architekturą RAG na dokumentach wewnętrznych, ale wdrażany jako nowy system bez konieczności ingerencji w zamknięty kod szpitalnego HIS/PACS.

#### K2. Publiczny Chatbot AI oparty o modele językowe (6 ofert — oraz przypadek 19 ofert na uczelni)
- **Numer BZP:** `2025/BZP 00597887` (umowa z `2025-12-05`)
- **Zamawiający:** Fundacja Rozwoju Systemu Edukacji (FRSE)
- **Wykonawca:** WISE PEOPLE Sp. z o.o.
- **Kwota brutto:** `220 000,00 zł` · **Liczba ofert:** **`6`** · **Środki UE:** tak
- **Przedmiot:** Realizacja narzędzia internetowego chatbot AI FRSE wykorzystującego model OpenAI odpowiadającego na pytania dotyczące programu Erasmus+
- **Źródło w BZP:** [Karta ogłoszenia `08de3baf-908f-f6f5-d6d3-f50001ceafcd`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de3baf-908f-f6f5-d6d3-f50001ceafcd)
- **Punkt odniesienia:** Samodzielny moduł webowy z jasno wskazanym stosem modelowym oraz udokumentowaną lekcją z unieważnienia: w pierwszym podejściu ([`2025/BZP 00350395`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08ddce81-026b-e0c7-e769-360001c6cde1)) FRSE odrzuciła 3 tańsze oferty, przez co jedyna pozostała wycena (`393,6 tys. zł`) przekroczyła budżet `234,5 tys. zł`, natomiast powtórka zebrała 6 ważnych ofert i zamknęła się na `220 000,00 zł` (obok rekordowego pod względem frekwencji chatbota dla kandydatów na ASP w Krakowie `2026/BZP 00450838`, gdzie przy szacunku `177,5 tys. zł` netto spłynęło **19 ofert**, a umowa zamknęła się na `74 784,00 zł` brutto, tj. **`34,3%` szacunku netto** — [karta BZP](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08df18ac-026d-a248-db89-6a00017db3b5)).

#### K3. Dedykowana platforma inżynieryjna do pozyskiwania danych treningowych AI (3 oferty)
- **Numer BZP:** `2025/BZP 00601774` (umowa z `2025-12-12`)
- **Zamawiający:** Uniwersytet Marii Curie-Skłodowskiej w Lublinie
- **Wykonawca:** Significant Results Sp. z o.o.
- **Kwota brutto:** `269 370,00 zł` · **Liczba ofert:** **`3`** · **Środki UE:** nie
- **Przedmiot:** Budowa platformy do pozyskiwania danych do trenowania algorytmów sztucznej inteligencji
- **Źródło w BZP:** [Karta ogłoszenia `08de3c85-f817-1f39-d6d3-f50001e769cf`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de3c85-f817-1f39-d6d3-f50001e769cf)
- **Punkt odniesienia:** Zamówienie wytwórcze (*custom software*) finansowane poza presją kamieni milowych KPO, w którym trzy ważne oferty (zero odrzuceń) rozjechały się aż **`9,13-krotnie`** (`269,4 tys. zł` vs `2,46 mln zł` w Sekcji `6.2/6.3`) — idealny przypadek do zbadania, jak różne software house'y wyceniają ten sam OPZ przy braku merytorycznych kryteriów jakości.

#### K4. Algorytmiczny system VLM/LLM do wykrywania zwodniczych interfejsów (4 oferty)
- **Numer BZP:** `2025/BZP 00411633` (ogłoszenie) / `2025/BZP 00517087` (umowa z `2025-10-29`)
- **Zamawiający:** Urząd Ochrony Konkurencji i Konsumentów (UOKiK)
- **Wykonawca:** Firstscore Sp. z o.o.
- **Kwota brutto:** `209 100,00 zł` · **Liczba ofert:** **`4`** · **Środki UE:** nie
- **Przedmiot:** Opracowanie i wdrożenie systemu automatycznego wykrywania zwodniczych interfejsów (*dark patterns*) na stronach e-commerce z wykorzystaniem modeli wizyjno-językowych (VLM/LLM)
- **Źródło w BZP:** [Karta ogłoszenia o wyniku `08de1c60-b4cb-2009-6f2a-fc000173d783`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de1c60-b4cb-2009-6f2a-fc000173d783) *(ogłoszenie o zamówieniu: [08ddeec8-a1b9-6895-d903-3900014e8235](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08ddeec8-a1b9-6895-d903-3900014e8235))*
- **Punkt odniesienia:** Zamówienie administracji centralnej na zaawansowany system machine learning / computer vision podpięte podczas audytu zbioru, pokazujące, że precyzyjny opis zadania analitycznego może przyciągnąć dojrzałą rywalizację 4 wyspecjalizowanych zespołów AI.

---

## 3. Protokół weryfikacji dokumentacji SWZ i załączników (arkusz kodowania)

Dla każdego z 11 powyższych postępowań (7 badanych z 1 ofertą + 4 kontrolnych) pobieramy ze stron prowadzonego postępowania (platforma `ezamowienia.gov.pl`, `platformazakupowa.pl`, `eb2b` lub w trybie art. 74 Pzp — jawność protokołu postępowania wraz z załącznikami) komplet dokumentów i kodujemy te same osiem zmiennych:

| # | Badany wymiar dokumentacji | Co dokładnie sprawdzamy w SWZ, OPZ, wyjaśnieniach i protokole ZP | Hipoteza, którą testujemy |
| --- | --- | --- | --- |
| **1** | **Okno na złożenie oferty** | Liczba dni kalendarzowych i roboczych od publikacji `ContractNotice` do pierwotnego oraz ostatecznego terminu składania ofert (minimum z art. 283 Pzp to 7 dni). | Czy okno 7–9 dni przy złożonej integracji eliminuje firmy, które nie znały projektu przed publikacją? |
| **2** | **Wstępne konsultacje rynkowe (WKR) i unieważnienia** | Informacja w SWZ/protokole o przeprowadzeniu WKR (art. 84 Pzp), lista uczestników WKR oraz ewentualne wcześniejsze unieważnione postępowania na ten sam zakres. | Czy zamawiający badał rynek przed rozpisaniem OPZ i czy po unieważnieniu złagodził bariery, czy tylko zwiększył budżet? |
| **3** | **Warunki udziału i referencje** | Wymagana liczba, kwota i szczegółowość referencji (np. ogólne „wdrożenie systemu NLP/AI” vs „wdrożenie voicebota zintegrowanego z konkretnym HIS w szpitalu klinicznym”), certyfikaty ISO / MDR, dysponowanie kadrą. | Czy próg doświadczenia dopuszczał dojrzałe firmy AI spoza wąskiego kręgu dotychczasowych dostawców szpitalnych? |
| **4** | **Prawa zależne i integracja z HIS / PACS** | Zapisy OPZ i wzoru umowy dot. kodów źródłowych, autoryzacji producenta systemu macierzystego (HIS/PACS/RIS), standardów wymiany (HL7, DICOM, FHIR) oraz tego, kto pokrywa koszt licencji konektorowych dostawcy bazowego. | Czy wykonawca zewnętrzny musiałby kupować kosztowny i nieposiadający jawnego cennika interfejs od konkurenta będącego producentem HIS/PACS? |
| **5** | **Wymogi on-premise vs chmura** | Obowiązek instalacji na lokalnej infrastrukturze zamawiającego (wraz z dostawą serwerów/GPU lub rygorami sieci odseparowanej) vs dopuszczenie chmury kwalifikowanej w EOG. | Na ile wymóg pełnego wdrożenia lokalnego (*on-premise*) odcina dostawców oferujących sprawdzone modele SaaS/chmurowe? |
| **6** | **Pytania wykonawców i odpowiedzi (art. 284 Pzp)** | Liczba pytań do SWZ, wnioski o dopuszczenie rozwiązań równoważnych, prośby o dokumentację API i przesunięcie terminu — oraz treść odpowiedzi zamawiającego (zmiana SWZ vs „zgodnie z SWZ”). | Najtwardszy ślad zainteresowania rynku: czy inne firmy próbowały wystartować i na którym konkretnie punkcie OPZ zrezygnowały? |
| **7** | **Kary umowne, SLA i prawa autorskie** | Wysokość kar za dzień zwłoki/niedostępności, czasy reakcji serwisowej, wymóg przeniesienia pełni praw majątkowych do modelu/kodu vs licencja standardowa, termin wdrożenia od podpisania umowy. | Czy asymetria ryzyka prawnego i krótki czas uruchomienia (np. 14–30 dni) zniechęcają podmioty niemające gotowego produktu z półki? |
| **8** | **Reżim finansowania: kamienie milowe KPO D1.1.2 vs inne źródła** | Źródło finansowania w SWZ i wzorze umowy (np. szpitalna inwestycja D1.1.2 KPO), klauzule o utracie dotacji przy przekroczeniu kamienia milowego i sztywna data odbioru końcowego. | Choć w całej bazie umowy z UE mają *niższy* odsetek 1 oferty (`41,8%`) niż krajowe (`45,9%`), sprawdzamy, czy w samych szpitalach sztywny termin KPO wzmacnia przewagę obecnego dostawcy `HIS`/`PACS`. |

---

## 4. Zestawy pytań do rozmów (ton neutralny, badawczy, nieoskarżycielski)

### Zestaw A · Pytania do zamawiających publicznych (dyrekcje, działy IT i działy zamówień publicznych)

1. **Kontekst operacyjny zakupu:** Jaki konkretny problem w pracy placówki / instytucji miał rozwiązać kupowany system (np. przeciążenie rejestracji telefonicznej, wymóg podłączenia do centralnej Platformy Usług Inteligentnych CeZ, czas opisu badań) i jak wygląda jego wykorzystanie po wdrożeniu?
2. **Rozeznanie rynku przed ogłoszeniem:** W jaki sposób szacowali Państwo wartość zamówienia i sprawdzali, ile podmiotów na polskim rynku jest w stanie dostarczyć takie rozwiązanie? Czy przed publikacją ogłoszenia prowadzili Państwo wstępne konsultacje rynkowe lub zapytania szacunkowe — a jeśli tak, ile firm na nie odpowiedziało?
3. **Bariera integracji z istniejącymi systemami (HIS/PACS/ERP):** Na ile z perspektywy działu IT bezpieczne wpięcie nowego narzędzia AI było możliwe bez udziału producenta systemu głównego, z którego placówka już korzysta? Czy zewnętrzny wykonawca miałby dostęp do otwartej, udokumentowanej specyfikacji API bez dodatkowych opłat licencyjnych na rzecz dotychczasowego dostawcy?
4. **Wpływ harmonogramu dotacji (KPO / FERS):** Ile czasu dawał Państwu harmonogram rozliczenia grantu na przeprowadzenie postępowania, wdrożenie i odbiór końcowy? Czy sztywne kamienie milowe wpływały na długość terminu składania ofert lub decyzję o wyborze gotowego modułu zamiast zamówienia wytwórczego?
5. **Reakcja rynku w trakcie przetargu:** Czy w trakcie postępowania pojawiały się pytania od innych potencjalnych oferentów — i co Państwa zdaniem przesądziło o tym, że ostatecznie wpłynęła jedna oferta (bądź w grupie kontrolnej: aż 5–19 ofert)?
6. **Utrzymanie po zakończeniu projektu:** Jak oszacowali Państwo roczny koszt utrzymania licencji, infrastruktury chmurowej/tokenów i wsparcia integracyjnego po wygaśnięciu finansowania unijnego w latach 2028–2029?

### Zestaw B · Pytania do dostawców oprogramowania (startujących oraz rezygnujących ze złożenia oferty)

1. **Decyzja „startujemy / odpuszczamy”:** Ile ogłoszeń z BZP w obszarze AI odrzucają Państwo na etapie lektury SWZ i jakie trzy zapisy najczęściej przesądzają o rezygnacji ze składania oferty mimo posiadania odpowiedniej technologii?
2. **Koszt i ryzyko integracji z systemami zastanym (HIS/PACS/dziedzinowe):** Jak w praktyce wygląda wycena integracji z systemem medycznym lub urzędowym innego producenta, gdy nie są Państwo jego autorem? Czy zdarza się, że koszt konektora, brak dokumentacji interfejsu albo brak zgody na ingerencję w bazę danych czyni złożenie konkurencyjnej oferty niemożliwym?
3. **Czas na przygotowanie oferty i PoC:** Czy standardowe w trybie podstawowym BZP okno 7–10 dni od publikacji ogłoszenia wystarcza na rzetelne przeliczenie architektury, kosztów chmury/GPU i ryzyk prawnych przy wdrożeniu AI w podmiocie publicznym?
4. **Warunki udziału, referencje i kary umowne:** Jak oceniają Państwo proporcjonalność wymogów referencyjnych oraz pułapów kar umownych i SLA w przetargach finansowanych z KPO? Czy zdarzyło się Państwu zadać pytanie o zmianę warunków w trybie art. 284 Pzp i z jakim skutkiem?
5. **Specyfika wąskich nisz (pytanie do zwycięzców 1-ofertowych):** Z czego Państwa zdaniem wynikał brak konkurencyjnych ofert w wygranym postępowaniu — z niszowego charakteru produktu (np. certyfikacja medyczna, unikalny zbiór danych, gotowa integracja z PUI), z krótkiego czasu realizacji czy z niechęci software house'ów do sektora zamówień publicznych?
6. **Co otworzyłoby rynek:** Jakie dwie praktyczne zmiany (np. standardowe otwarte API / FHIR wymuszane w umowach bazowych, publikacja dokumentacji interfejsów wraz z SWZ, dłuższe terminy składania ofert, oddzielenie zakupu sprzętu od warstwy AI) realnie zwiększyłyby liczbę ofert w kolejnych przetargach?

---

## 5. Standard redakcyjny i rozdzielenie warstw w publikacji

Aby materiał zachował wiarygodność dokumentacyjną i był odporny na zarzut jednostronności, w gotowym tekście i towarzyszącej tabeli porównawczej obowiązują cztery twarde reguły:

1. **Warstwa 1 — Fakty z dokumentów (weryfikowalne przez czytelnika):** każda informacja o terminach, liczbie pytań do SWZ, wymaganych referencjach, kwotach i zapisach wzoru umowy musi wskazywać konkretny numer postępowania BZP oraz punkt/stronę dokumentu źródłowego.
2. **Warstwa 2 — Stanowiska stron (prawo do odpowiedzi przed publikacją):** każdy zamawiający i wykonawca opisany z nazwy w studium przypadku otrzymuje przed publikacją precyzyjne pytania o swój kontrakt oraz rozsądny termin na ustosunkowanie się do ustaleń z dokumentacji. Ich wyjaśnienia (np. o przyczynach technicznych *vendor lock-inu* lub wymogach bezpieczeństwa klinicznego) są przytaczane rzetelnie obok danych z SWZ.
3. **Warstwa 3 — Komentarz i wnioski autora:** interpretacja systemowa (np. ocena skutków finansowych braku otwartych API czy pośpiechu w wydatkowaniu KPO) jest wyraźnie oznaczona jako wniosek autorski, a nie ukryta w opisie stanu faktycznego.
4. **Brak domniemania złej woli:** jeżeli analiza SWZ wykaże, że pojedyncza oferta wynikała z obiektywnej wyłączności technicznej systemu macierzystego albo braku alternatywnego wyrobu na polskim rynku, raport stwierdza to wprost na korzyść zamawiającego — traktując ten przypadek jako ilustrację strukturalnej bariery wejścia, a nie błędu urzędniczego.
