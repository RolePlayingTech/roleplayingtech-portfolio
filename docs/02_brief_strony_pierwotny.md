# RolePlayingTech — brief strony WWW dla agenta AI
## Architektura informacji, copywriting PL/EN, projekty i wymagania wdrożeniowe

**Wersja:** 1.0 — brief roboczy, przekazanie do projektowania i implementacji  
**Data:** 15 października 2026  
**Domena główna:** https://www.roleplayingtech.com/  
**Dokument nadrzędny:** „01_Strategia_marki_RolePlayingTech” — przed tworzeniem strony przeczytaj oba dokumenty.

> **Instrukcja dla agenta projektującego/wdrażającego stronę**  
> Zbuduj profesjonalne, osobiste, dwujęzyczne portfolio niezależnego partnera kreatywno-technologicznego. Nie twórz fikcyjnych rezultatów, marek klientów, opinii ani zrzutów interfejsu. Materiały tekstowe opisane jako „robocze” są propozycjami do zatwierdzenia. Gdy brakuje zasobu (screenshot, film, liczba, zdjęcie), dodaj jednoznacznie oznaczony placeholder/TODO zamiast generować jego imitację. Architektura strony i treści powinny umożliwiać dalszą rozbudowę.

## 1. Zadanie strony i definicja sukcesu

Strona ma pełnić jednocześnie cztery role:

1. **Portfolio:** pokazać cztery flagowe projekty i rzeczywisty wkład twórcy.
2. **Wizytówka współpracy:** ułatwić zrozumienie, z jakim problemem lub pomysłem można się zgłosić, i szybko znaleźć kontakt.
3. **Żywe laboratorium:** umożliwiać publikowanie mniejszych eksperymentów, prototypów, testów narzędzi i wniosków.
4. **Przestrzeń autora:** zachować miejsce na teksty, publicystykę i osobistą historię RolePlayingLife — bez wymagania obecności przed kamerą.

**Priorytet:** dowody wykonanej pracy i klarowność propozycji współpracy. Filozofia jest dodatkiem nadającym osobowość, nie przeszkodą w dotarciu do informacji.

**Docelowy użytkownik:** ktoś z problemem, pomysłem lub ciekawym projektem: firma, startup, organizacja, instytucja edukacyjna/naukowa, redakcja, twórca, potencjalny partner. Nie projektować pod jedną wyłączną personę.

**Główna konwersja:** inicjacja wartościowej rozmowy poprzez e-mail lub wskazany kanał kontaktu. Nie dodawać cennika, lejków reklamowych, fałszywych liczników, kalendarza rezerwacji ani chatbotów tylko po to, aby strona wyglądała „bardziej sprzedażowo”.

## 2. Charakter i kierunek kreatywny

**Estetyka:** wyraźnie typograficzna, oszczędna, współczesna, techniczna, ale ludzka. Możliwy dark mode jako wariant bazowy; kolorystyka nie jest zatwierdzona. Dużo światła/oddechu, czytelne hierarchie, mocne rzeczywiste obrazy projektów, dyskretne interakcje.

**Czego unikać:** generic AI neonów, robotów z banków zdjęć, kosmicznych grafik, stockowych postaci z laptopem, sztucznego „agencyjnego” tonu, ogromnej chmury badge'y, poziomów RPG i gamifikacji udającej produkt, efektów 3D przesłaniających treść.

**Można subtelnie nawiązać do RolePlayingLife:** rytmem narracji, motywem odkrywania, numeracją rozdziałów/eksperymentów lub pojedynczą mikrointerakcją. Nie używać fragmentu utworu Bisza.

**Zdjęcie osobiste:** opcjonalnie autentyczne, także z podróży; nie wymuszać formalnego zdjęcia biznesowego. W żadnym miejscu nie jest wymagane wideo z twarzą twórcy.

## 3. Mapa serwisu (IA)

**Nawigacja główna** — logo „RolePlayingTech”, pozycje: Projects / Projekty; Lab; Writing / Teksty; About / O mnie; Contact / Kontakt; przełącznik PL / EN.

**Proponowane ścieżki URL:**

```text
/
  → prowadzi do wybranej wersji językowej w przewidywalny sposób
/pl/
/en/
/pl/projects/     /en/projects/
/pl/projects/mumro/     /en/projects/mumro/
/pl/projects/swiadek-dziejow/     /en/projects/swiadek-dziejow/
/pl/projects/crewly/     /en/projects/crewly/
/pl/projects/mfc-station/     /en/projects/mfc-station/
/pl/lab/     /en/lab/
/pl/writing/     /en/writing/
/pl/about/     /en/about/
/pl/contact/     /en/contact/
```

**Uwaga:** dokładna postać routingu może zostać dostosowana do zastanego projektu, ale ma być spójna i indeksowalna. Nie mieszać języków na jednej podstronie. Przełącznik prowadzi do odpowiednika treści, a gdy go brak — do odpowiedniego indeksu z jasnym oznaczeniem języka.

**Architektura publikacji:** osobne pozycje Lab i Writing, ale mogą korzystać ze wspólnego, prostego modelu treści. Nie wyświetlać pustego indeksu jako pełnoprawnej sekcji, jeśli nie ma jeszcze materiałów.

## 4. Strona główna — kolejność i cele sekcji

### 01. Header / Nawigacja

Logo tekstowe, maksymalnie kilka pozycji, przełącznik języka, klarowna nawigacja mobilna. Header może być sticky, o ile nie zabiera przestrzeni. Kontakt dostępny z dowolnego miejsca.

### 02. Hero / Pierwszy ekran

**Cel:** w kilka sekund odpowiedzieć na pytania: co to za osoba, co robi i dlaczego warto spojrzeć na projekty. Hero nie może wyglądać jak slogan agencji AI bez pokrycia.

**Copy robocze PL:**

- Eyebrow: „NIEZALEŻNY PARTNER KREATYWNO-TECHNOLOGICZNY”
- H1, wariant preferowany: „Odkrywam możliwości technologii. Buduję rzeczy, które mają sens.”
- Lead: „Łączę doświadczenie w IT, AI i kreatywność, aby zamieniać pomysły w działające produkty, automatyzacje i projekty cyfrowe. Od pierwszego eksperymentu po realne rozwiązanie.”
- CTA główne: „Zobacz projekty” → #projects
- CTA drugie: „Porozmawiajmy” → #contact lub /pl/contact/

**Draft EN:**

- Eyebrow: “INDEPENDENT CREATIVE & TECHNOLOGY PARTNER”
- H1: “Exploring technology. Building things that matter.”
- Lead: “I combine experience in software, AI and creative work to turn ideas into working products, automations and digital experiences. From the first experiment to a real solution.”
- Primary CTA: “Explore my work”
- Secondary CTA: “Let's talk”

**Wariant alternatywny, bardziej autorski:** PL „Eksperymentuję. Buduję. Automatyzuję. Idę dalej.” / EN “Explore. Build. Automate. Repeat.” Nie uznawać żadnego wariantu za ostatecznie zatwierdzony.

**Wizual:** można użyć eleganckiego, lekkiego kolażu fragmentów czterech prawdziwych projektów albo pozostawić minimalistyczny typograficzny hero. Nie generować fikcyjnego dashboardu. Ruch ograniczony i możliwy do wyłączenia.

### 03. Selected Work / Wybrane projekty

**Cel:** najważniejsza sekcja; duże, zróżnicowane wizualnie moduły, a nie cztery równe ikony. Każda realizacja ma pokazywać problem, rozwiązanie, rolę i obecny etap. Najpierw mocny kadr/demonstracja, potem konkretny opis.

**Kolejność robocza:** Mumro → Świadek Dziejów → MFC → Crewly. Nie jest zatwierdzona; można przetestować zamianę MFC i Crewly.

**Każda karta zawiera:** nazwę, 1 zdanie wartości, 2–3 zdania wyjaśnienia, 2–4 tagi, autentyczny materiał, link do case study, opcjonalnie link do działającego produktu. Bez agresywnych animacji. Zróżnicowane kadrowanie dla software'u, mediów, elektroniki i platformy.

**Robocze tytuły kart PL / EN:**

- **Mumro:** „Od narzędzia dla własnego projektu do platformy AI.” / “From an internal tool to a growing AI platform.”
- **Świadek Dziejów:** „Edukacyjny ekosystem treści, mediów i AI.” / “An AI-powered education and media ecosystem.”
- **MFC:** „Elektronika i oprogramowanie w służbie badań.” / “Electronics and software supporting research.”
- **Crewly:** „Platforma łącząca ludzi wokół żeglowania.” / “A platform connecting the sailing community.”

Po prezentacji czterech projektów można dać spokojny link „Wszystkie projekty” / “All projects”, jeśli istnieje indeks projektów.

### 04. What I Do / Jak możemy współpracować

**Cel:** przełożyć bogate portfolio na czytelne możliwości współpracy bez ograniczania się do jednej branży.

**Nagłówek PL:** „Masz pomysł albo problem do rozwiązania?”  
**EN:** “Have an idea or a problem worth solving?”

**Trzy grupy:**

1. **Explore / Zbadajmy możliwości** — pomysł, research, diagnoza, AI, konsultacje, prototyp.
2. **Build / Zbudujmy rozwiązanie** — aplikacje, integracje, automatyzacje, narzędzia i wybrane rozwiązania IoT.
3. **Create / Stwórzmy coś wartościowego** — filmy AI, grafiki, kampanie, edukacyjne formaty treści i publikacje.

**Lead PL:** „Najchętniej wchodzę w projekty od etapu pomysłu i wspólnie szukam najlepszego rozwiązania, ale jestem otwarty również na konkretne zlecenia i współprace.”

**Lead EN:** “I enjoy joining projects early, exploring possibilities and shaping the solution together — but I'm also open to focused commissions and collaborations.”

**Czego nie dodawać:** listy 30 technologii, deklaracji „robię wszystko”, gwarancji wyników bez diagnozy, cennika bez ustaleń.

### 05. How I Work / Jak pracuję

**Cel:** pokazać sposób myślenia i rolę AI bez uczenia odwiedzającego nadmiernie technicznego workflow.

**Nagłówek:** PL „Odkrywam. Buduję. Automatyzuję. Idę dalej.” / EN “Explore. Build. Automate. Repeat.”

**Krótka treść PL:** „Najpierw rozumiem problem i sprawdzam, co jest możliwe. Potem projektuję, buduję i testuję. Kiedy pojawiają się powtarzalne czynności, automatyzuję je, żeby skupić się na kolejnych wyzwaniach. AI pomaga mi sięgać dalej, ale kontrola jakości i odpowiedzialność za rezultat pozostają po mojej stronie.”

**EN:** “I start by understanding the problem and exploring what's possible. Then I design, build and test. Once a process becomes repetitive, I automate it to make room for the next challenge. AI expands what I can do, while responsibility for quality and the outcome remains mine.”

**Wizual:** zwięzły cykl czterech etapów lub jedno nienachalne zdanie obok małego schematu. Nie budować wielkiego pseudo-„proprietary framework”.

### 06. Lab & Writing / Eksperymenty i teksty

**Cel:** pokazać, że marka żyje; rozwijać indeks małych projektów i tekstów bez rozbudowy pełnego portfolio przy każdej publikacji.

**Nagłówek PL:** „Z laboratorium i notatnika”  
**EN:** “From the lab & notebook”

Dwa rodzaje wpisów: **Lab** (prototypy, testy modeli AI, workflowy, małe narzędzia, wnioski także z nieudanych prób) oraz **Writing** (eseje, publicystyka, artykuły techniczne, recenzje i analizy). Na stronie głównej maksymalnie 2–4 starannie wybrane elementy. Każdy z datą, typem i językiem.

Jeśli treści jeszcze nie zostały wybrane, przygotować komponenty i model danych, ale nie publikować sztucznych artykułów „Coming soon”. Można uruchomić sekcję w kolejnym etapie.

**Community:** krótka wzmianka o współtworzeniu społeczności Discord poświęconej AI, jeśli zostanie podany publiczny link i zgoda na jego publikację. Nie deklarować liczby członków bez danych.

### 07. About / Moja historia

**Cel:** osobowość, a nie długie CV. Rozdzielić „dlaczego działam” od „co mogę zrobić dla klienta”.

**Nagłówek PL:** „Nie planowałem wracać do IT. AI zmieniło moje podejście.”  
**EN:** “I didn't plan to return to tech. AI changed that.”

**Tekst roboczy PL:**

„Przez lata pracowałem w IT — od testowania i wdrożeń systemów po DevOps i programowanie. Z czasem zniknęło to, co napędzało mnie na początku: ciekawość, rozwój i przyjemność rozwiązywania nowych problemów. Po kilku latach odnalazłem to ponownie dzięki generatywnej AI. Dziś nie próbuję wracać do dawnej roli programisty. Buduję produkty, eksperymentuję z technologią, tworzę treści i szukam coraz ciekawszych wyzwań.

RolePlayingLife to moja filozofia traktowania życia jak przygody i nieustannego rozwijania postaci. RolePlayingTech jest jej technologiczną częścią.”

**Draft EN:**

“For years I worked in tech — from testing and software implementation to DevOps and development. Over time I lost what had made it exciting in the first place: curiosity, progress and the joy of solving new problems. Generative AI helped me rediscover that feeling. Today I'm not trying to return to my old identity as a programmer. I build products, experiment with technology, create and keep looking for more interesting challenges.

RolePlayingLife is my way of looking at life as an adventure and a process of continuous growth. RolePlayingTech is its technology-focused branch.”

Nie umieszczać cytatu z piosenki. Nie budować osi czasu kariery liczącej kilkadziesiąt punktów. Można dodać jedno autentyczne zdjęcie oraz link do dłuższej historii lub osobistych wpisów.

### 08. Collaboration CTA / Kontakt

**Nagłówek PL:** „Masz ciekawy pomysł? Porozmawiajmy.”  
**EN:** “Let's build something interesting.”

**PL:** „Nie musisz mieć gotowej specyfikacji. Możemy zacząć od rozmowy, wspólnie poszukać możliwości i sprawdzić, co da się stworzyć.”

**EN:** “You don't need a finished specification. We can start with a conversation, explore the possibilities and see what we can create.”

**Kanał główny:** e-mail publiczny: stuczynski.g@gmail.com — zweryfikować, czy ma pozostać preferowany przed wdrożeniem. Dodatkowo linki X i LinkedIn. Bez obowiązkowego formularza i bez niepotwierdzonych godzin dostępności.

### 09. Footer

Logo/tekst RolePlayingTech, dyskretne powiązanie „Part of RolePlayingLife”, przełącznik języka lub aktualny język, linki do profili i stron projektów oraz podstawowe informacje prawne zależne od zakresu zbierania danych (polityka prywatności, jeśli jest potrzebna).

## 5. Cztery strony case study — wspólny wzorzec

Każda podstrona powinna mieć podobną strukturę, ale inny charakter wizualny. Nie kopiować identycznego layoutu ze zmienionym tytułem, jeśli media na to nie pozwalają.

**Wymagane pola strukturalne:**

1. Tytuł i krótki podtytuł (problem / wartość).
2. Status produktu i dziedzina (jasno, bez pompowania skali).
3. Hero media — prawdziwy screenshot, demo, film lub zdjęcie instalacji.
4. Kontekst: skąd wzięła się potrzeba.
5. Problem, użytkownik i cel.
6. Podejście: decyzje, eksperymenty, wykorzystanie AI.
7. Rozwiązanie: co faktycznie działa i z jakich elementów się składa.
8. **Mój wkład** — najważniejsza sekcja: co robił autor, gdzie współpracował, za co odpowiadał.
9. Rezultaty: sprawdzone wskaźniki lub jakościowe efekty; data danych.
10. Wnioski i dalsze plany (bez podawania przyszłości jako faktów dokonanych).
11. Link do produktu i przejście do następnego case study.

### Mumro — dane i rekomendacja treści

**Roboczy tytuł PL:** „Mumro. Od potrzeby publikowania do własnego systemu AI.”  
**EN:** “Mumro. From a publishing need to an AI-powered platform.”

**Problem:** przy Świadku Dziejów rosła liczba powtarzalnych zadań związanych z produkcją, zarządzaniem i dystrybucją treści.

**Rozwiązanie:** stopniowo rozwijana platforma dla kontekstu marki, treści, planowania i publikacji, powiązań między artykułami i kanałami, analiz oraz integracji i narzędzi dla agentów AI. Przy opisach funkcji bazować na aktualnej dokumentacji Mumro, nie na domysłach.

**Rola:** samodzielny autor kierunku i rozwoju: architektura, specyfikacje, orkiestracja modeli i agentów AI przy implementacji, testowanie, bezpieczeństwo, optymalizacje.

**Stan:** używane we własnych projektach; dostęp dla wybranych partnerów może być rozważany; otwarty abonament nie jest obecnie podstawowym modelem sprzedaży. Nie dodawać fałszywych testimoniali i logo klientów.

**Media do zebrania:** 2–4 screenshoty interfejsu, 20–40 sekund demonstracji konkretnego przepływu (np. pomysł → artykuł → powiązane posty → plan publikacji), fragment mapy systemu, tylko publicznie bezpieczne dane.

**Linki:** https://mumro.io/pl/ oraz https://docs.mumro.io

### Świadek Dziejów — dane i rekomendacja treści

**Roboczy tytuł PL:** „Świadek Dziejów. Od filmowego eksperymentu do ekosystemu edukacyjnego.”  
**EN:** “Świadek Dziejów. From a video experiment to an education ecosystem.”

**Problem / pomysł:** tworzyć interesujące materiały historyczne wykorzystując AI, ale bez bezwartościowej, masowo generowanej treści; zachować walor edukacyjny i zachęcać do źródeł.

**Rozwiązanie:** rozpoznawalna postać, filmy i różne techniki AI, grafiki, artykuły, serwis edukacyjny, atlas/rozbudowane materiały, social media i proces publikacji wspierany przez Mumro.

**Rola:** własny projekt medialno-edukacyjny i rozwój jego koncepcji, narzędzi, treści i dystrybucji.

**Stan / metryki:** orientacyjnie na październik 2026 — TikTok ~27k, FB >21k, IG ~2,5k, YouTube ~1,8k; łącznie >50k **obserwacji, nie unikalnych osób**. Liczniki wymagają aktualizacji przed publikacją. Pojawiało się zainteresowanie nauczycieli wykorzystaniem materiałów; nie twierdzić automatycznie, że materiały zostały oficjalnie wdrożone w szkołach.

**Media do zebrania:** aktualny, jakościowy fragment wideo; zdjęcia/animacje postaci; kadry strony, atlasu, artykułów i grafik; zestawienie kanałów; ewentualnie zrzut analityki z datą. Nie opierać czołówki na dawnych viralu Veo 3 wyłącznie dla dużych liczb.

**Link:** https://swiadek-dziejow.pl

### MFC Monitoring Station — dane i rekomendacja treści

**Roboczy tytuł PL:** „MFC. Aparatura pomiarowa, elektronika i zdalny monitoring.”  
**EN:** “MFC. A research monitoring station combining hardware and software.”

**Problem:** monitorowanie parametrów mikrobiologicznego ogniwa paliwowego i zarządzanie wybranymi procesami doświadczalnymi.

**Rozwiązanie:** fizyczna stacja z mikrokontrolerem i elektroniką pomiarową, komunikacja internetowa, backend, historia i wizualizacja pomiarów, interfejs sterowania pompami. Istniejący publiczny dashboard opisuje m.in. ESP32, ADS1115, INA219, WebSocket i programy lokalne na ESP32.

**Rola:** projekt i wykonanie rozwiązania technicznego wspierającego badania doktorantki; łączenie własnego doświadczenia z mikrokontrolerami z AI przy rozwiązywaniu problemów. Nie przypisywać sobie autorstwa badań i wyników naukowych.

**Stan:** użyte w zakończonym etapie pomiarów; rozwój planowany. Pusty stan live jest normalny — w portfolio preferować bezpieczne zdjęcia i nagraną demonstrację, nie kierować użytkownika wprost do sterowania urządzeniem.

**Media do zebrania:** autentyczne zdjęcie konstrukcji przekazane w rozmowie (uzyskać plik w repozytorium zasobów projektu), 2–3 kadry dashboardu, schemat komunikacji, ewentualnie odanonimizowany wykres z historycznych pomiarów po zgodzie badaczki.

**Bezpieczeństwo:** sprawdzić dostęp publiczny, dane badawcze i sterowanie; nic nie powinno uruchamiać pomp przez nieautoryzowanego użytkownika. Link do live dashboardu można zastąpić statycznym demo.

**Link:** https://monitor-mfc.roleplayingtech.com

### Crewly — dane i rekomendacja treści

**Roboczy tytuł PL:** „Crewly. Lepsze miejsce do znalezienia ludzi na rejs.”  
**EN:** “Crewly. Helping sailors find people and opportunities.”

**Problem:** rozproszenie ogłoszeń dotyczących poszukiwania załogi, sterników i udziału w rejsach; trudna komunikacja na grupach społecznościowych.

**Rozwiązanie:** platforma internetowa odpowiadająca na potrzebę łączenia osób w środowisku żeglarskim. Nazwy funkcji i screenshoty zweryfikować na realnym produkcie.

**Rola:** współtworzenie produktu; przed publikacją doprecyzować osobisty wkład w koncepcję, architekturę, implementację, UX, treści itd. Nie sugerować solo autorstwa.

**Stan:** działający produkt, pierwsi użytkownicy/klienci, mała skala. Nie nazywać „rozwiniętym marketplace z setkami rezerwacji” bez dowodów.

**Media do zebrania:** screenshoty rzeczywistej platformy, ewentualne autorskie zdjęcia z żeglowania; materiały ze środowiska żeglarskiego powinny pokazywać realny kontekst.

**Link:** https://crewly.pl

## 6. Podstrony Lab i Writing

### Lab / Eksperymenty

Każdy wpis powinien być krótki i konkretny: tytuł, data, zdjęcie/demo, problem lub hipoteza, zastosowany sposób działania, rezultat, czego nie udało się osiągnąć, ewentualnie link do kodu albo narzędzia. Nie wymagać dużych case studies i SEO tekstów przy każdym eksperymencie. Dopuszczalne statusy: prototype, live, archived, work in progress. Brak obowiązku publikowania wszystkich prywatnych prób.

### Writing / Teksty

Pole na publicystykę i analizy bez budowania przymusowej roli komentatora. Artykuły mogą być po polsku lub angielsku. Każdy materiał powinien wyraźnie pokazywać język, datę, temat, ewentualnie miejsce pierwotnej publikacji. Możliwa karta przekierowująca do tekstu zewnętrznego (portal, Substack, X) zamiast kopiowania go na stronę. Jeśli tekst jest sponsorowany, zaznaczyć to.

**Filtry opcjonalne:** AI & Tools, Building, Media & Creativity, Thoughts. Nie wdrażać złożonego wyszukiwania na start, gdy treści jest mało.

## 7. Dostępne odnośniki i zasoby źródłowe

- Marka: https://www.roleplayingtech.com/
- X: https://x.com/rpl_0x
- Mumro: https://mumro.io/pl/
- Dokumentacja Mumro: https://docs.mumro.io
- Świadek Dziejów: https://swiadek-dziejow.pl
- Crewly: https://crewly.pl
- MFC: https://monitor-mfc.roleplayingtech.com
- Aktualna strona zawiera linki do LinkedIn, Substack, Instagram, TikTok i pozostałych mediów; prawidłowe adresy pobrać z działającej strony przed wdrożeniem.

Wszystkie wyświetlane statystyki z mediów społecznościowych traktować jako zmienne i opatrywać datą ostatniej aktualizacji, a w kodzie przechowywać w jednym miejscu.

## 8. Model treści — preferowany dla agenta

**Założenie:** oddzielić copy od komponentów. Agenta prosimy o zbudowanie prostego, łatwego w utrzymaniu modelu danych, niezależnie od wybranego frameworka.

Minimalne struktury:

```yaml
site:
  name: RolePlayingTech
  languages: [pl, en]
  primaryEmail: stuczynski.g@gmail.com  # potwierdzić
  socialLinks: []                       # uzupełnić sprawdzonymi URL
  heroVariant: proposed-A              # wybór roboczy
projects:
  - slug: mumro
    status: internal-active
    contribution: solo-ai-assisted
    published: true
    assets: []
  - slug: swiadek-dziejow
    status: active
    contribution: owner-creator
    published: true
    assets: []
  - slug: mfc-station
    status: research-stage-completed
    contribution: engineering-support
    published: true
    assets: []
  - slug: crewly
    status: live-early-traction
    contribution: co-created
    published: true
    assets: []
articles:
  - slug: example-only
    locale: pl
    type: lab # or writing
    title: TODO
    date: null
    published: false
```

To **przykład schematu**, nie instrukcja dosłownego nadpisania repozytorium. Nie publikować elementu `example-only`. Każdy projekt powinien wspierać osobne treści PL i EN, galerie, opis roli, CTA i status.

## 9. Wymagania funkcjonalne i jakościowe

**Języki / routing:** widoczne PL/EN, właściwe atrybuty `lang`, przełączanie odpowiedników stron, poprawne canonical i `hreflang`, brak automatycznego mieszania tekstów. Wybór języka użytkownika można zapamiętać, ale nie blokować ręcznego przełączenia ani indeksowania.

**Responsywność:** mobile first, czytelna typografia, właściwe kadrowanie mediów, dotykowe elementy nawigacji, brak poziomego przewijania, czytelne tabele i galerii.

**Dostępność:** semantyczne HTML, jeden H1 na stronę, logiczne nagłówki, focus widoczny, obsługa klawiaturą, alt dla zdjęć i opis dla filmów, kontrast tekstu, `prefers-reduced-motion`, przełącznik języka z odpowiednimi etykietami.

**Wydajność:** zoptymalizowane obrazy (formaty nowoczesne i responsywne), lazy loading poza hero, poster dla filmów, brak autoplay z dźwiękiem, umiarkowany JS, ograniczenie dużych bibliotek animacji. Core Web Vitals mierzyć po wdrożeniu, a nie obiecywać wynik bez testu.

**Bezpieczeństwo:** żadnych kluczy API w frontendzie; nie podłączać strony portfolio do uprzywilejowanych endpointów Mumro lub MFC bez audytu; linkowanie do MFC tylko w zakresie bezpiecznym dla badań i sprzętu. Nie kopiować prywatnych danych pomiarowych ani treści klientów.

**SEO:** unikalne title/description dla języków i case studies, poprawna hierarchia treści, OG/Twitter Cards z autentycznych obrazów, sitemap XML, robots.txt, canonical, `hreflang`, przyjazne adresy. Opcjonalny schema.org `Person`, `WebSite`, `CreativeWork/SoftwareApplication` tylko zgodnie z faktami. Nie wpisywać fałszywych ocen, `AggregateRating` ani klientów.

**Analityka i prywatność:** rozważyć lekką, zgodną z wymogami prywatności analitykę. Jeśli pojawią się narzędzia wymagające zgody, zaprojektować właściwy mechanizm. Minimum wydarzeń: kliknięcie „Kontakt”, otwarcie case study, kliknięcia w produkty, zmiana języka. Nie implementować ukrytego śledzenia.

**Utrzymanie:** copy, projekty, metryki i publikacje powinny dać się zmieniać bez edycji wielu komponentów. Proste Markdown/MDX lub lekki CMS tylko jeśli uzasadniony. Twórca ma doświadczenie techniczne; rozwiązanie powinno być przejrzyste dla dalszej pracy z agentami AI.

## 10. Lista materiałów potrzebnych od właściciela

**Niezbędne przed publikacją v1:**

- Potwierdzenie finalnego nagłówka hero i preferowanego e-maila.
- Logo/wordmark lub decyzja o logo tekstowym; ewentualne kolory i preferowany motyw.
- Po jednym reprezentatywnym, prawdziwym materiale wizualnym na projekt.
- Mumro: screenshot i najlepiej krótkie demo z zamazanymi danymi wrażliwymi.
- Świadek Dziejów: aktualny film/fragment, kadr strony i aktualne metryki z datą.
- Crewly: aktualny zrzut produktu i potwierdzony opis osobistej roli.
- MFC: zdjęcie stanowiska, bezpieczny screen/dashboard, zgoda na ewentualne dane z badań.
- Zatwierdzone adresy social mediów oraz decyzja, czy linkować do Discorda.
- Finalna korekta tekstów PL i EN pod kątem naturalnego osobistego tonu.

**Można dodać później:** dłuższe filmy demo, diagramy architektury, indeks projektów pobocznych, publikacje redakcyjne, zdjęcie osobiste, RSS/newsletter, rozbudowane case study z pomiarami i rezultatem biznesowym.

## 11. Zakres prac — sugerowane etapy

### Faza 1: projekt treści i makiety

Przygotuj responsywny wireframe strony głównej oraz czterech podstron w dwóch językach. Zachowaj realną kolejność informacji i wskaż miejsca na assety. Nie dobieraj stockowych obrazów tylko po to, by prototyp wyglądał na kompletny. Zaproponuj 1–2 warianty hero, nie kilkanaście sloganów.

### Faza 2: MVP gotowe do pokazania

Wdrożona dwujęzyczna strona główna, karta kontaktu, działające przełączanie języka i cztery podstawowe strony case studies. Responsywny, szybki layout z rzeczywistymi screenshotami, bez pustych „Coming soon”. Lab/Writing można ograniczyć do indeksu tylko wtedy, gdy są prawdziwe treści.

### Faza 3: rozszerzenia

Wideo i galerie, rozbudowanie case studies, szablony Lab/Writing, analityka, optymalizacja SEO i dostępności, wybrane efekty ruchu, rozsądny proces publikacji nowych materiałów. Wydanie trzeciego autobiograficznego posta można zsynchronizować z ukończonym portfolio.

## 12. Kryteria akceptacji strony

1. Użytkownik w kilka sekund rozumie, co robi twórca i widzi link do projektów oraz kontaktu.
2. Cztery flagowe realizacje są widoczne na głównej stronie i prowadzą do odrębnych case studies.
3. W case studies jest jasno odróżniona rola twórcy od pracy współautorów i AI.
4. Nie ma zmyślonych statystyk, klientów, opinii ani szczegółów technicznych.
5. Mumro nie jest przedstawiane jako masowy, aktywnie sprzedawany SaaS.
6. Crewly nie jest przedstawiane jako projekt solo ani jako produkt z wielkimi przychodami.
7. Świadek Dziejów jest ekosystemem, nie tylko galerią dawnych virali.
8. MFC pokazuje rzeczywisty sprzęt i rozsądne granice dostępu do danych/sterowania.
9. PL/EN to kompletne i naturalne wersje, a nie częściowy interfejs z mieszanymi językami.
10. Strona działa wygodnie na telefonie i jest dostępna z klawiatury.
11. Kontakt nie wymaga zbędnej rejestracji ani formularza.
12. Dodanie nowego projektu, eksperymentu lub artykułu nie wymaga przebudowy całej strony.
13. Całość przypomina osobiste portfolio, nie anonimową agencję AI.

## 13. Zakazy interpretacyjne dla agenta

- **Nie** zmieniaj tożsamości autora na „full-stack developer” jako główny opis.
- **Nie** podkreślaj „wypalenia” jako jedynej cechy albo niezawodnego hasła marketingowego.
- **Nie** używaj fragmentu piosenki jako cytatu w treści lub grafice.
- **Nie** tworzyć bez zgody wymyślonych portretów, zrzutów ekranu aplikacji, wyników analityki ani referencji.
- **Nie** myl zleceń wykonanych w przeszłości z obecną stałą bazą klientów.
- **Nie** sugeruj, że twórca sam prowadzi badania mikrobiologiczne lub samodzielnie zbudował Crewly.
- **Nie** buduj przesadnej estetyki RPG ani strony sprzedającej szkolenia jako główny produkt.
- **Nie** wstawiaj fikcyjnego cennika, formularza zamówień ani płatności dla Mumro.
- **Nie** deklaruj, że modele AI zastępują weryfikację jakości, bezpieczeństwa i poprawności.

## 14. Otwarte decyzje wymagające zatwierdzenia

- Ostateczne hasło H1 i opis w pierwszym ekranie.
- Dokładna kolejność czterech projektów i wielkość ich sekcji.
- Preferowany motyw wizualny, paleta, fonty, logotyp.
- Czy w hero jest prywatne zdjęcie, czy tylko materiały projektów.
- Aktualne metryki społeczności i czy je w ogóle eksponować na pierwszym ekranie.
- W jakiej formie linkować MFC: live view czy nagrana demonstracja.
- Link zapraszający do społeczności Discord i poziom publiczności tej społeczności.
- Materiały do Lab/Writing na start.
- Konkretna technologia strony i sposób hostingu, po audycie obecnego repozytorium.

**Tryb pracy rekomendowany agentowi:** najpierw analizuj obecną stronę i zastane repozytorium; następnie zaproponuj mapę komponentów, makietę i checklistę assetów; wdrażaj modułowo; po każdej fazie pokazuj rzeczywisty podgląd i listę decyzji do zatwierdzenia.

## 15. Źródła referencyjne i uwagi końcowe

Ten brief bazuje głównie na wypowiedziach właściciela marki i drugim dokumencie strategicznym. Stan publicznych stron zweryfikowano 15.10.2026:

- https://www.roleplayingtech.com/
- https://mumro.io/pl/
- https://docs.mumro.io
- https://swiadek-dziejow.pl
- https://crewly.pl
- https://monitor-mfc.roleplayingtech.com

**To nie jest zlecenie wymyślenia gotowej marki zamiast autora.** Celem jest przełożenie już ustalonej osobistej filozofii i prawdziwych realizacji na stronę, która robi dobre pierwsze wrażenie, pokazuje projekty i ułatwia nawiązanie ciekawej współpracy.