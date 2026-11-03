# Kontekst autora — publiczny zapis do decyzji / Author context for decisions

> **Stan / As of:** 23.10.2026  
> **Status:** kontekst roboczy. Nie jest tekstem na stronę i nie wolno go wklejać do `/pl/` ani `/en/`.  
> **Nadrzędne fakty i zakazy:** [07 · Aktualny kontekst publiczny](07_AKTUALNY_KONTEKST_PUBLICZNY.md). Gdy ten plik i `07` się różnią w liczbie, autorstwie albo tym, co wolno powiedzieć publicznie, wygrywa `07`.

Ten dokument zbiera publicznie wypowiedziany sposób myślenia Grzegorza Stuczyńskiego: jak pracuje, jak układa projekty i jakie ograniczenia sam sobie stawia. Ma pomagać przy kolejnych decyzjach i przy pilnowaniu głosu. Nie jest strategią marketingową ani życiorysem do publikacji.

---

## English summary

Grzegorz Stuczyński (RolePlayingLife, [@rpl_0x](https://x.com/rpl_0x)) builds personal, cross-disciplinary projects with extensive AI assistance and keeps responsibility for architecture, review and merges. The recurring bet is the edge between fields — history and media, software and a lab bench — rather than another generic AI wrapper.

As of 22–23 October 2026 his own pinned post describes **Mumro** as an internal system that already runs several projects, including Świadek Dziejów' social publishing for about half a year. He is shaping it as if it might one day serve many independent clients, and he says openly that he does not know whether that commercial platform will happen. He does not want a hard sell. The free Mumro Academy and open CLI tools are how he shows the approach.

He treats pace as an operating constraint. A software-house burnout about five years earlier is why he prefers work he can use himself, why trips are part of the practice, and why he warns others that coding agents make overwork easier. Crewly stays co-created. MFC stays technical support for someone else's PhD, with no claim of scientific authorship. Do not add revenue, client names, a Discord headcount or a permanent invite.

X is the active public channel. The Substack weekly experiment (February–March 2026, 10 posts, 44 subscribers on 18 March 2026) has no later public posts in the archive API. LinkedIn could not be read without login.

---

## 1. Po co ten plik

Repozytorium jest publiczną stroną i jednocześnie miejscem, w którym ma zostać ślad decyzji. Strona pokazuje wybrane projekty. Ten plik trzyma powód, dla którego są ułożone właśnie tak.

Przy kolejnym ruchu warto sprawdzić pięć rzeczy, które wynikają z jego własnych wypowiedzi:

1. Czy to coś, z czego sam od razu korzysta, czy kolejny prototyp bez użytkownika.
2. Czy dokłada się do jednego systemu, czy powstaje obok jako osobny generator.
3. Czy da się to opowiedzieć bez zawyżania skali, autorstwa i przychodów.
4. Czy tempo da się utrzymać. Poprzednie odejście z etatu wzięło się z brania na siebie za dużo.
5. Czy edukacja zostaje darmowa, a Mumro nie zamienia się w nachalną reklamę.

Dokumenty `01`–`06` są historią projektowania strony. Nie wracać do odrzuconych haseł tylko dlatego, że leżą w `docs/`.

---

## 2. Skąd to jest i czego nie przeczytałem

| Źródło | Co dało się zobaczyć 23.10.2026 |
| --- | --- |
| [X / @rpl_0x](https://x.com/rpl_0x) | Profil, bio, liczby i kilka najnowszych wpisów, w tym przypięty opis Mumro. Wyszukiwarka X i starsza oś czasu wymagają logowania, więc pełnych 16 tys. wpisów nie ma w tym pliku. |
| Archiwa wtórne profilu | Pojedyncze starsze wpisy (wyprawa bałtycka, wczesne Crewly, powrót do publikowania, okres krypto). Daty w tych archiwach bywają niepewne. Twierdzenia z nich są niżej oznaczone. |
| [Substack RolePlayingLife](https://roleplayinglife.substack.com/) | Archiwum API: 10 wpisów, od 26.12.2025 („hello world”) do 31.03.2026. Późniejszych publicznych wpisów API nie zwróciło. |
| To repozytorium | README, `docs/07`, strony O mnie, Edukacja i opisy projektów. |
| [GitHub RolePlayingTech](https://github.com/RolePlayingTech) | Publiczny profil: Kraków, konto od 2016, rząd stu publicznych repozytoriów. |
| LinkedIn | Ściana logowania. Treści profilu tu nie ma. |
| Instagram, TikTok, Facebook, YouTube | Nieczytane w tej turze. Liczby obserwacji zostają takie, jak w `07` (orientacyjnie październik 2026). |

Cytaty poniżej są skrótem jego słów, nie materiałem na stronę. Wulgarne sformułowania z X zostawiam w znaczeniu, bez wklejania ich do publicznego copy.

---

## 3. Kim jest w sieci

**Imię i nazwisko:** Grzegorz Stuczyński. W sieci najczęściej **RolePlayingLife**, techniczna część to **RolePlayingTech**.

**X, odczyt 23.10.2026:** [@rpl_0x](https://x.com/rpl_0x), konto od lipca 2017, zweryfikowane konto indywidualne. Około **10,3 tys. obserwujących**, 458 obserwowanych, około **16,4 tys. wpisów**. Strona w profilu: roleplayingtech.com. Kategoria nadana przez platformę („Entertainment & Recreation”) nie jest jego opisem zawodu.

Bio, dosłownie:

> Były Fullstack Dev - przeżuty i wypluty przez branże IT  
> Piszę o Technologii, AI, Krypto, Rozkminy, Analizy, Ciekawostki, Fotografia i Podróże

**Droga, którą sam opisuje** (strona O mnie i wpisy na X; szczegóły faktów w `07`):

- Prace fizyczne, sklepy, magazyn, drukarnia, emigracja. Wyjazd do Dublina jako impuls do informatyki i studiów zaocznych.
- Potem wsparcie techniczne, testy, ERP, administracja, DevOps, automatyzacje, programowanie, także jako senior developer w software house.
- Na początku ciekawość i codzienna nauka. Później rutyna, odpowiedzialność i własne dokładanie sobie tempa. Odejście z zawodowego programowania na kilka lat. We wpisie z 22–23.10.2026 mówi o tym jako o zdarzeniu sprzed około pięciu lat.
- Generatywna AI ściągnęła go z powrotem do budowania, na własnych warunkach i na wyższym poziomie abstrakcji. Doświadczenie programistyczne służy do oceny całości, testów i odpowiedzialności za wynik, nie do ręcznego pisania każdej linijki.
- Starszy publiczny wpis (data w archiwum wtórnym niepewna) dokłada między etatem a AI okres krypto: nauka rynku, psychologii tłumu, narracji i spekulacji, po tym jak wciągnął go znajomy. Bio nadal wymienia krypto wśród tematów pisania. Z tych tekstów nie wynika, czym dziś handluje ani czy w ogóle inwestuje.

**RolePlayingLife** to podejście do życia: nie zamykać się w jednej roli, próbować rzeczy, które wcześniej omijał. Własne porównanie do rozwijania postaci w RPG jest metaforą, nie interfejsem strony. **RolePlayingTech** jest technologiczną częścią tego samego podejścia.

Poza ekranem: rower z namiotem i góry. Potwierdzona wyprawa 2026: Litwa, Łotwa, Estonia, Finlandia, Wyspy Alandzkie, Szwecja, powrót do Gdańska. W długim wpisie (archiwum, okolice 14.07.2026, zgodne z opisem na stronie): około 13 dni, 1500 km rowerem, 1000 km promem, 13 nocy na dziko, start w Suwałkach. Rok wcześniej: Kraków–Chorwacja. Osobno, okolice przełomu lipca i sierpnia 2026: pierwszy raz na Pol’and’Rock, po latach unikania festiwali i tłumów. Autor **nie żegluje**. Żegluje jego brat, współtwórca Crewly.

Kontakt publiczny: stuczynski.g@gmail.com. Lokalizacja na GitHubie: Kraków.

---

## 4. Jak myśli

To nie jest lista cech. To powtarzalne ruchy widoczne w tekstach.

**Najciekawsza praca jest na styku dziedzin.** Esej z 31.03.2026, [„Błękitne oceany sztucznej inteligencji”](https://roleplayinglife.substack.com/p/bekitne-oceany-sztucznej-inteligencji), stawia to wprost na przykładzie MFC. Wartość AI, która go obchodzi, to możliwość wejścia w dziedzinę, w której nie ma formalnego wykształcenia, na tyle głęboko, żeby rozmawiać z ekspertem jak partner. AI nie likwiduje przepaści i nie zastępuje doktorantki, która zna swoje bakterie. Jest mostem: pozwala zobaczyć połączenie i zadawać pytania w swoim tempie. Generatory tekstu, kodu i obrazów nazywa zatłoczonym środkiem mapy. Puste miejsce jest dalej od centrum: laboratorium, warsztat, pole, archiwum, klinika. Tekst jest obserwacją, nie apelem „zostań odkrywcą”.

Ta sama oś jest na stronie: historia z AI (Świadek Dziejów) oraz inżynieria środowiska z elektroniką i kodem (MFC). Mumro jest narzędziem, które z tej pracy wyrosło, a nie odwrotnie.

**Czyta źródło i oddziela interes od argumentu.** Długi wpis o liście NVIDII w sprawie modeli open-weight (archiwum, okolice 24–25.07.2026) jest charakterystyczny: sięga do PDF-u, odróżnia otwarte wagi od open source w sensie Open Source Initiative, zapisuje, które zdanie jest jego interpretacją biznesu NVIDII, i nie traktuje koalicji firm jako bezinteresownego manifestu. Jednocześnie nie wyrzuca argumentu tylko dlatego, że nadawca na nim zarabia.

**Nie ufa hype’owi i jednakowym powierzchniom.** Krótki komentarz z 21.10.2026: z AI łatwo zrobić stronę, która na pierwszy rzut oka wygląda dobrze, a jest sztampowa i może odrzucać. Długi wywód o projektowaniu stron i latach pracy jako UI designer jest wpisem **@popai_pl**, który Grzegorz zacytował. Tego życiorysu mu nie przypisywać. Jego własna droga, opisana przez niego, biegnie przez prace fizyczne i później przez wsparcie, testy, ERP, DevOps i programowanie.

**Publikuje też sceptycyzm wobec naganiaczy.** Wpis o kanale podróżniczym, który zszedł w sprzedaż nieruchomości (archiwum, okolice 23.07.2026), jest ostry wobec obietnic zwrotu i klubów dla bogatych. Pasuje do reszty: konkret, dystans, brak podziwu dla lejka.

**Narzędzia sprawdza i mówi, gdy jeszcze nie sprawdził.** Poleca rzeczy po obejrzeniu kodu albo wprost pisze, że jeszcze nie odpalał. W archiwum z okolicy maja 2026 (data niepotwierdzona bezpośrednio na X) opisuje powrót do Cursora po roku i nawyk czytania kodu, czasem także ręcznego pisania. Nazywa to „piętnem programisty”.

---

## 5. Jak pracuje

**Świadomy vibecoding, merge klika sam.** W przypiętym wpisie (około 22.10.2026): przy dużym projekcie stosuje pełny proces, taki jak wcześniej w software house, i osobiście klika merge. Architektura na początku ma znaczenie, bo wczesny bałagan wraca przy każdej dobudówce. Zanim pomyślał o Mumro komercyjnie, budował je jak projekt komercyjny.

**Agenci są pracownikami w wąskim sensie, nie autorami decyzji.** On ustala, co powstaje, jak system ma działać, jak to testować i co poprawić. W newsletterze z 18.03.2026 opisuje pracę zamiennie w Codexie, Claude Code i ówczesnym Antigravity, dobór modelu do zadania oraz subagentów odpalanych świadomie, żeby nie zaśmiecać głównego kontekstu. Później pisał, że z Antigravity korzysta wyraźnie mniej. Agent Harness Kit (publicznie 21.10.2026, [wpis](https://x.com/rpl_0x/status/2112880222403993937), repozytorium [RolePlayingTech/agent-harness-kit](https://github.com/RolePlayingTech/agent-harness-kit)) jest praktyczną wersją tej samej myśli: harness ma wynikać z konkretnego repozytorium, jego komend i ograniczeń, a nie z skopiowanego uniwersalnego zestawu instrukcji.

**Automatyzuje to, co już rozumie.** Cel: czas na następne ciekawe zagadnienie, nie większa liczba byle jakich materiałów. W lutym 2026 argumentował, że osobie, która ma przestrzeń na naukę, więcej da zrozumienie API, serwerów i kodu pisane z agentem niż kolejne tygodnie w n8n albo Make. Sam ma za sobą zlecenia w n8n i w kodzie. Tekst nie unieważnia tej historii. Mówi, w co dziś włożyłby czas nauki. n8n zostawia jako sensowne przy prostym, liniowym przepływie, szybkim prototypie i zespole bez osoby technicznej.

**Tempo jest częścią warsztatu.** Wpisy z października 2026 mówią to dwa razy, najpełniej [tutaj](https://x.com/rpl_0x/status/2113302944212758631). W software house sam nakręcał tempo, aż psychika nie wytrzymała. Przy agentach ta pętla jest łatwiejsza: szybki wynik, kolejny pomysł, przeskakiwanie między kartami, kiedy agent jeszcze pracuje. Można przesiedzieć kilkanaście godzin bez poczucia ciężkiej pracy, bo „to AI robiło”. Analiza wyników, decyzje i zmiana kontekstu też są pracą. Stąd hamulec: nie wszystko, co da się zrobić, trzeba zrobić, i nie od razu. Wyjazdy są tym hamulcem, nie przerwą od „prawdziwej” roboty. Pisze, że sam się na tym łapie i będzie do tego wracał, bo mało kto o tym mówi.

Bez zewnętrznego finansowania nie chce miesiącami rozwijać prototypów, z których nikt — w tym on — nie korzysta. Najchętniej robi rzeczy, których sam od razu używa.

---

## 6. Jak podchodzi do biznesu

Zdania poniżej są jego. Nie są planem, którego jeszcze nie ogłosił.

**Cały proces, nie jedna usługa.** Interesuje go droga od rozpoznania problemu, przez eksperyment, do działającego rozwiązania. Nie chce ograniczać się do jednego produktu albo jednej usługi. Współpraca, którą opisuje strona, zaczyna się od kilku zdań, bez prezentacji i specyfikacji. Może to być luźny pomysł albo konkretne zadanie.

**Budować i opublikować, potem zobaczyć.** Dwa dni po udostępnieniu Agent Harness Kit odezwała się ekipa z Chin od benchmarków agentów (zaproponowała swoje podejście do weryfikacji) oraz twórca marketplace’u skilli (propozycja publikacji i monetyzacji). Grzegorz nie ogłasza współpracy ani przychodu. Wniosek, który sam zapisuje: czasem warto budować, publikować i patrzeć, co się stanie. [Wpis z 23.10.2026](https://x.com/rpl_0x/status/2113541112321192024).

**Mumro ma być systemem, nie worekiem generatorów.** Przypięty opis, około 22.10.2026 ([wpis](https://x.com/rpl_0x/status/2113205795454087433)):

- Zaczął od planowania publikacji na potrzeby Świadka Dziejów.
- Potem lekka rozbudowa pod współpracę z klientem, dalej Crewly, kolejny klient i poboczne projekty. Nazw klientów nie podaje i nie należy ich dopisywać.
- Moduły, które wymienia jako istniejące: planner treści na wiele platform (w założeniu podobny do Buffera albo Postiza), automatyzacja odpowiedzi na komentarze, CMS artykułów, integracja z WordPressem, materiały promujące publikacje, generatory postów i rolek, boty na strony, analityka WWW i social mediów, audyt projektu pod strategię i kolejne publikacje, warstwa AI.
- Osobno: integracje MCP, własne narzędzia i skille, żeby systemem dało się sterować z asystenta.
- Pętla, na której mu zależy: analiza projektu, plan, materiały, publikacja, odczyt wyników, wnioski na następny raz.
- Na narzędziu działa kilka projektów. Social media Świadka Dziejów idą przez nie od około pół roku (licząc od października 2026).
- Równolegle przygotowuje stronę i social media Mumro. Pisze, że [@mumro_io](https://x.com/mumro_io) powoli rusza. Strona portfolio wciąż ma przy Mumro formułkę „social media wkrótce” — to rozjazd do sprawdzenia przy najbliższej aktualizacji strony, nie powód, żeby tę formułkę zmieniać pochopnie.

**Komercjalizacja Mumro jest pytaniem, nie decyzją.** Cytując sens przypiętego wpisu: dziś to wewnętrzne narzędzie, laboratorium, żywe portfolio i sposób pokazania klientom oraz partnerom, jak podchodzi do roboty. Rozwija je tak, jakby w przyszłości mogło obsłużyć wielu niezależnych klientów. Czy powstanie z tego większa platforma — nie wie. Nie będzie go nachalnie promował. Mumro może być „sponsorem” treści edukacyjnych, których z tej okazji ma być więcej. Akademia zostaje darmowa i pokazuje jego praktykę na przykładzie rozwiązań z Mumro. To jest zgodne ze stroną Edukacja: materiały da się użyć także bez jego produktów.

Na stronie opis Mumro jest węższy (planowanie i publikacja, własne użycie, możliwa współpraca z wybranymi partnerami, brak ogólnodostępnego SaaS). Przypięty wpis jest pełniejszy. Przy decyzjach produktowych brać wpis. Przy tekście na stronę brać ostrożniejszą wersję z `07`, dopóki on sam nie zechce przenieść szczegółów na witrynę.

**Edukacja jest warstwą zaufania, nie lejkiem.** Akademia Mumro: cztery ścieżki (systemy marki, wielokanałowa treść, WWW/SEO/rozmowy, agenci i MCP), playbooki, słownik, kod w [mumro-academy](https://github.com/RolePlayingTech/mumro-academy). Obok CLI: Agent Harness Kit i MCP Surface Kit. Discord jest bezpłatny, bez stałego linku. W newsletterze z 18.03.2026: linku nie upubliczniają celowo, zależy im na jakości; wejście przez maila z krótkim opisem, czym ktoś się zajmuje. Na stronie: zaproszenia otwierane co jakiś czas i ogłaszane w social mediach. W cudzym wpisie (archiwum wtórne) społeczność jest wspominana wspólnie z Krisem Krakowiakiem (@KrakowiakK). Strona mówi, że społeczność założył Grzegorz. Ról, udziałów i liczby osób tu nie dopisuję. `07` wprost zabrania podawania niepotwierdzonej liczby członków.

**Open source jest próbką warsztatu, nie osobną firmą.** Publiczne repozytoria w okolicy tej samej pracy, stan gwiazdek z 23.10.2026, tylko jako rząd wielkości: [social-media-manager](https://github.com/RolePlayingTech/social-media-manager) (kolejka publikacji, self-hosted, 17 gwiazdek), agent-harness-kit (6), mumro-academy (1). `social-media-manager` jest w tej samej okolicy problemu co początek Mumro. Nie jest kodem źródłowym Mumro i nie należy tak pisać.

---

## 7. Projekty jako jeden układ

Czytać je jako jedną praktykę, nie jako cztery oferty.

| Projekt | Rola w układzie | Co jest już powiedziane publicznie | Czego nie dopowiadać |
| --- | --- | --- | --- |
| **Świadek Dziejów** | Powód, dla którego powstało Mumro, i żywe medium: historia, mapa, tekst, film, fikcyjny narrator, odesłanie do źródeł. Social media idą przez Mumro od około wiosny 2026. | Ponad 50 tys. obserwacji łącznie na czterech platformach, nie unikalnych osób (orientacyjnie 10/2026). Na YouTube eksperymentuje z dłuższymi formami. Serwis: swiadek-dziejow.pl. | Nie sprowadzać projektu do pierwszych testów Veo. Nie podawać przychodów. |
| **Mumro** | System do tej pracy i laboratorium sposobu budowania. Własny, z dużą pomocą agentów. | Moduły z przypiętego wpisu (sekcja 6). Akademia darmowa. @mumro_io „powoli rusza”. | Nie nazywać tego ogólnodostępnym SaaS. Nie ogłaszać, że większa platforma na pewno powstanie. Nie wymyślać cennika ani listy klientów. |
| **Crewly** | Współtworzony produkt z realnymi użytkownikami, poza jego własną publikacją treści. | Platforma załóg, sterników i rejsów; na stronie także pierwsi klienci. W archiwum X: niedługo po starcie pisał o kilkuset rejestracjach i kilkudziesięciu rejsach oraz o późniejszej zakładce z kursami (crewly.pl/kursy). Daty tych wpisów w archiwum są pomieszane (maj i lipiec). | To sygnał wczesnej trakcji, nie aktualne KPI. Nie przedstawiać jako jego jednoosobowego produktu ani jako dowodu dużych przychodów. Nie robić z niego żeglarza. |
| **MFC Monitoring Station** | Dowód, że bierze zlecenie na styku dziedzin, których formalnie nie studiował. | Sprzęt i oprogramowanie pod badania doktoranckie innej osoby (Politechnika Krakowska). AI pomogło nadrobić elektronikę, którą kiedyś porzucił jako zbyt czasochłonne hobby. Stacja była użyta w eksperymencie. | Nie podawać nazwiska doktorantki. Nie przypisywać mu badań ani zwalidowanej dokładności pomiarów. |
| **Zlecenia** | Wcześniejszy i nadal możliwy sposób pracy: automatyzacje, integracje, strony, narzędzia, wideo. | Są w README jako mniejsze realizacje, bez marek. | Nie budować fikcyjnego portfolio klientów. |
| **Społeczność i pisanie** | Miejsce, w którym sprawdza narzędzia z ludźmi i zostawia ślad myślenia. | X jest kanałem aktywnym. Substack miał w lutym–marcu 2026 rytm tygodniowy; 18.03.2026 pisał o 44 zapisanych osobach i o szóstej notce. API archiwum kończy się na 31.03.2026. | Nie obiecywać częstotliwości. 44 osoby to stan z marca 2026, nie aktualna liczba. |

**Świadek a pieniądze.** W archiwum jest wpis zatytułowany jak relacja z dotychczasowych dochodów Świadka Dziejów (okolice 27.07.2026, treść wygląda na grafikę). Kwot tu nie ma. `07` zabrania wymyślania wyników finansowych, a ten plik ich nie odtwarza.

---

## 8. Głos i publikowanie

Na X pisze po polsku, pierwsze osoby, konkretnie, czasem ostro, kiedy mówi o wypaleniu albo o naciąganych obietnicach. Długie wątki pojawiają się przy tematach, które chce rozłożyć (przemysł AI, wyprawa, własny system). Krótsze wpisy to narzędzia, cytaty, zdjęcia z drogi.

Ludzie odpisują mu, że czyta się to jak relacja z roboty, bez naganiania na wyświetlenia. Tę opinię zostawiam jako cudzą, nie jako hasło do bio.

**Co wraca jako temat:**

- narzędzia agentowe, skille, harness, higiena kontekstu;
- własne projekty i to, czego się na nich nauczył;
- tempo pracy i uwaga;
- podróże, fotografia, rower;
- od czasu do czasu krypto i szersza analiza technologii, zwykle z zastrzeżeniem, co jest jego interpretacją.

**Czego sam nie chce z tego robić:** codzienna taśma eksperymentów dla samej taśmy. Wcześniej dużo publikował testy i poradniki, potem przestał, bo go to rozpraszało. Jesienią 2026 wraca do dłuższego pisania, z zapowiedzią większej ilości treści edukacyjnych przy Mumro, i jednocześnie pilnuje, żeby wyjazd został ważniejszy niż kolejny wątek o narzędziu.

Substack z pierwszego kwartału 2026 był próbą notatek „z frontu”: vibecoding, Antigravity, VPS z agentem, skille, Vertex, Codex i subagenci, frontend bez generycznego wyglądu, błękitne oceany. To zaplecze poglądów, nie kalendarz, którego trzeba dotrzymywać. Strona nie obiecuje rytmu publikacji i ten plik też nie.

---

## 9. Ograniczenia przy decyzjach

Zostawić, nawet jeśli jakiś pomysł brzmi spójnie:

- Osobista robota, nie agencja. Bez języka „zespół ekspertów”, „wdrożenia dla marek”, „case studies”, których nie ma.
- AI opisane uczciwie: duży udział w implementacji, człowiek przy kierunku, jakości i odpowiedzialności.
- Mumro: własne użycie i laboratorium. Większa platforma jest możliwością, którą sam oznacza jako niepewną.
- Crewly: współtworzone. MFC: wsparcie cudzych badań.
- Bez listy klientów, kwot, liczby osób na Discordzie i stałego zaproszenia.
- Bez twarzy i bez obowiązku nagrywania siebie jako warunku tej roboty.
- PL i EN na stronie. Ten plik może zostać po polsku z angielskim skrótem, bo jest zapleczem, nie stroną.
- Repozytorium jest publiczne razem z historią commitów. Nie wkładać tu kluczy, promptów operacyjnych, danych klientów, wyników pomiarów MFC ani notatek infrastrukturalnych.

---

## 10. Czego tu celowo nie ma

- Treści LinkedIna. Profil jest podany na stronie, odczyt bez logowania się nie udał.
- Pełnej osi czasu X. Konto ma około 16 tys. wpisów. Ten plik opiera się na profilu z 23.10.2026, kilku pełnych najnowszych wpisach i wyrywkowych starszych tekstach.
- Kwot, nazwisk klientów i nazwiska doktorantki.
- Instagramu i kanałów Świadka poza tym, co już stoi w `07` i na stronie.
- Planu, którego nie wypowiedział. Luki nie są zaproszeniem, żeby je wypełnić strategią z dokumentów `01`–`06`.

---

## 11. Źródła użyte 23.10.2026

- Profil i wpisy: [x.com/rpl_0x](https://x.com/rpl_0x), w szczególności statusy `2113205795454087433` (Mumro), `2113302944212758631` (tempo i wypalenie), `2112880222403993937` (Agent Harness Kit), `2113541112321192024` (odzew po open source), `2112929522316124283` (krótki komentarz o stronach).
- [Substack, archiwum API](https://roleplayinglife.substack.com/api/v1/archive?sort=new&offset=0&limit=20) oraz eseje z 25.02.2026 (vibecoding a n8n/Make), 18.03.2026 (Codex, subagenci, Świadek, Discord) i 31.03.2026 (błękitne oceany, MFC).
- README, `docs/07`, `pl/about/`, `pl/education/`, `pl/work/mumro/`.
- [github.com/RolePlayingTech](https://github.com/RolePlayingTech).

Przy następnej aktualizacji warto dopisać datę odczytu i nie nadpisywać starych liczb tak, jakby zawsze były prawdziwe. Październik 2026 jest już w `07` oznaczony jako stan do odświeżenia.
