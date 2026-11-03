# Plan pogłębienia dziennikarskiego · Skąd bierze się jedna oferta w publicznych wdrożeniach AI?

> **Punkt wyjścia:** Raport i baza 171 postępowań z Biuletynu Zamówień Publicznych (`2024–2026`, `/pl/lab/przetargi-ai/`)  
> **Zjawisko do wyjaśnienia:** W kategorii szkoleń AI mediana wynosi **6 ofert** na przetarg (do 23 ofert przy części kursu za `7 200 zł` na Politechnice Świętokrzyskiej, `2026/BZP 00465518`), natomiast we wdrożeniach oprogramowania spada do **1 oferty** (**27 z 41** rozstrzygniętych umów z jawną liczbą oferentów, czyli **65,9%**, zawarto bez żadnej konkurencji cenowej).  
> **Cel materiału nr 2:** Ustalić na podstawie dokumentacji SWZ, załączników technicznych (OPZ), protokołów postępowań oraz rozmów z obiema stronami rynku, **które przypadki wynikają z obiektywnych barier technicznych i regulacyjnych, a które ze sposobu przygotowania przetargu lub pośpiechu grantowego**.

---

## 1. Założenie warsztatowe (brak z góry przyjętej tezy o nadużyciach)

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
- **Dlaczego w próbie:** Klasyczny przykład podłączenia istniejącego systemu obrazowania producenta do centralnej platformy państwowej CeZ. Pozwala zbadać, czy podmiot trzeci jest w ogóle technicznie i licencyjnie w stanie wykonać taką integrację bez udziału dostawcy PACS (w bazie występują bliźniacze 1-ofertowe wdrożenia w Opolu `2026/BZP 00183188` z Pixel Technology na `922 770,00 zł` oraz w Siedlcach `2026/BZP 00141601` z SoloSys na `285 360,00 zł`, poprzedzone unieważnieniem `2026/BZP 00100988`).

#### 2. VoiceBot medyczny wpięty w system szpitalny HIS
- **Numer BZP:** `2026/BZP 00297319` (umowa z `2026-06-17`)
- **Zamawiający:** Kliniczne Centrum Ginekologii, Położnictwa i Neonatologii w Opolu
- **Wykonawca:** Krajowy Operator Chmury Medycznej Sp. z o.o.
- **Kwota brutto:** `453 427,20 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Zakup wymaganych licencji oraz wdrożenie modułu systemu HIS — usługa wirtualnego asystenta pacjenta (VoiceBot) wraz ze szkoleniem personelu oraz utrzymaniem i aktualizacją na 3 lata
- **Źródło w BZP:** [Karta ogłoszenia `08decd2e-1286-bf9f-5fad-9500015f73b9`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08decd2e-1286-bf9f-5fad-9500015f73b9)
- **Dlaczego w próbie:** Krajowy Operator Chmury Medycznej jest najczęstszym wykonawcą w całym zbiorze (7 umów na `1,96 mln zł` / `1 960 190,20 zł` — w Cieszynie, Opolu, Poznaniu dwukrotnie, Zamościu, Legnicy oraz w Siedlcach `2025/BZP 00497656` na `154 242 zł`). Co szczególnie istotne dowodowo: **4 z tych 7 umów** (`1,28 mln zł` — Cieszyn `2026/BZP 00310345`, Poznań `2024/BZP 00574495` i `2026/BZP 00514632`, Zamość `2025/BZP 00560401`) zawarto bez przetargu w trybie **zamówienia z wolnej ręki** (art. 305 pkt 1 w zw. z art. 214 ust. 1 pkt 1 Pzp) z wprost wpisanym w sekcji 3 ogłoszenia uzasadnieniem, że KOChM jest jedynym podmiotem uprawnionym do integracji VoiceBota z posiadanym przez szpitale systemem HIS AMMS (Asseco Poland S.A.), a pozostałe **3 umowy** w trybie podstawowym (Opole, Siedlce, Legnica) zakończyły się **jedną ofertą**. Zestawienie tego wzorca z innym 1-ofertowym wdrożeniem VoiceBota zintegrowanego z HIS CliniNET w Narodowym Instytucie Kardiologii w Warszawie (`2026/BZP 00213382`, SOFTBLUE S.A., `253 527,60 zł`) pokazuje w czystej postaci mechanizm uzależnienia architektonicznego od dostawcy systemu bazowego.

#### 3. Specjalistyczne AI dla farmakoterapii i apteki szpitalnej
- **Numer BZP:** `2026/BZP 00201117` (umowa z `2026-04-15`)
- **Zamawiający:** Uniwersytecki Szpital Kliniczny w Opolu
- **Wykonawca:** Pharmdiver Sp. z o.o.
- **Kwota brutto:** `202 950,00 zł` · **Środki UE / KPO:** tak
- **Przedmiot:** Zakup, dostawa i wdrożenie oprogramowania AI wspierającego proces doboru leków przez lekarzy i farmaceutów w USK w Opolu
- **Źródło w BZP:** [Karta ogłoszenia `08de9b8d-7c33-3c74-5fad-95000119adfd`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de9b8d-7c33-3c74-5fad-95000119adfd)
- **Dlaczego w próbie:** Przykład wąskiej niszy klinicznej (analiza interakcji lekowych i alertów farmakoterapeutycznych w polskich bazach leków). Ten sam wykonawca dwa tygodnie później zawarł analogiczną umowę z 1 ofertą w Szpitalu Specjalistycznym im. L. Rydygiera w Krakowie (`2026/BZP 00272273`, `159 288,69 zł`). Sprawdzimy, czy na polskim rynku istnieje realny konkurencyjny odpowiednik spełniający wymogi kliniczne.

#### 4. Modele językowe (LLM) do strukturyzacji dokumentacji w hurtowni danych medycznych
- **Numer BZP:** `2026/BZP 00172477` (umowa z `2026-03-25`)
- **Zamawiający:** Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu
- **Wykonawca:** upmedic sp. z o.o.
- **Kwota brutto:** `528 900,00 zł` · **Środki UE:** tak
- **Przedmiot:** Dostarczenie licencji oprogramowania wykonującego strukturyzację (indeksowanie) oraz przeszukiwanie nieustrukturyzowanych danych opisowych w hurtowni danych medycznych w oparciu o modele językowe
- **Źródło w BZP:** [Karta ogłoszenia `08de8b15-6546-c3c4-5fad-950001e70dca`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de8b15-6546-c3c4-5fad-950001e70dca)
- **Dlaczego w próbie:** Postępowanie ma udokumentowaną historię dwukrotnego podejścia — 10 marca 2026 r. zamawiający unieważnił wcześniejszy przetarg o tym samym tytule (`2026/BZP 00146627`, również z 1 ofertą). Porównanie obu SWZ i zawiadomienia o unieważnieniu pokaże czarno na białym, co zmieniło się między podejściami i dlaczego inne firmy NLP/LLM nie wystartowały.

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
- **Punkt odniesienia:** Samodzielny moduł webowy z jasno wskazanym stosem modelowym (obok rekordowego pod względem frekwencji wdrożenia chatbota dla kandydatów na ASP w Krakowie `2026/BZP 00450838` za `74 784,00 zł`, gdzie spłynęło aż **19 ofert** — [karta BZP](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08df18ac-026d-a248-db89-6a00017db3b5)).

#### K3. Dedykowana platforma inżynieryjna do pozyskiwania danych treningowych AI (3 oferty)
- **Numer BZP:** `2025/BZP 00601774` (umowa z `2025-12-12`)
- **Zamawiający:** Uniwersytet Marii Curie-Skłodowskiej w Lublinie
- **Wykonawca:** Significant Results Sp. z o.o.
- **Kwota brutto:** `269 370,00 zł` · **Liczba ofert:** **`3`** · **Środki UE:** nie
- **Przedmiot:** Budowa platformy do pozyskiwania danych do trenowania algorytmów sztucznej inteligencji
- **Źródło w BZP:** [Karta ogłoszenia `08de3c85-f817-1f39-d6d3-f50001e769cf`](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08de3c85-f817-1f39-d6d3-f50001e769cf)
- **Punkt odniesienia:** Zamówienie wytwórcze (*custom software*) finansowane poza presją kamieni milowych KPO, pozwalające porównać swobodę opisu przedmiotu zamówienia i czas dany wykonawcom na wycenę.

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
| **8** | **Reżim finansowania: KPO vs FERS vs środki własne** | Źródło finansowania w SWZ i wzorze umowy (np. inwestycja D1.1.2 KPO w szpitalach), klauzule o utracie finansowania przy przekroczeniu kamienia milowego i sztywna data odbioru końcowego. | Czy sztywne terminy rozliczenia KPO w 2026 r. wymuszały kupowanie rozwiązań najszybszych w integracji z obecnym dostawcą kosztem szerszej konkurencji? |

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
