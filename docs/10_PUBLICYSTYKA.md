# Publicystyka + Narzędzia i Dane — otwarta notatka robocza

> **Stan / As of:** 03.11.2026  
> **Status:** otwarta notatka robocza i dziennik działań autora (nie jest to tekst na stronę `/pl/` ani `/en/`).  
> **Nadrzędne fakty i ograniczenia:** [07 · Aktualny kontekst publiczny](07_AKTUALNY_KONTEKST_PUBLICZNY.md).

## Informacja o publicznym charakterze tej notatki (Read this first)

**PL:** Mam pełną świadomość, że to repozytorium jest publiczne. Trzymam tutaj robocze notatki i zapis bieżących ruchów wokół publicystyki i współpracy z mediami, żeby zachować ciągłość kontekstu między sesjami oraz różnymi agentami AI, z którymi pracuję. Szukanie formuły współpracy, testowanie pomysłów, brak odpowiedzi czy odmowa to normalna część roboty — nie ma powodu robić z tego tajemnicy.

Dla porządku i szacunku wobec rozmówców **nie wrzucam tu**: screenów ani treści prywatnej korespondencji, indywidualnych adresów mailowych spoza publicznych stron redakcyjnych, stawek finansowych ani niepublicznych ustaleń.

**EN:** This note is intentionally kept in a public repository so different AI agents and sessions share the same working context. Exploring media collaborations, pitching ideas and not always getting a reply is normal work — nothing secret here. Private correspondence, non-public contacts and financial terms are never stored in this repo.

---

## 1. Główna teza: dlaczego „sam tekst” to za mało i o co mi naprawdę chodzi

W realiach 2025–2026 zwykłe artykuły tekstowe („opinie z głowy” i proste podsumowania) mocno tracą rację bytu — wyszukiwarki i podsumowania AI (Zero-Click / AI Overviews) zjadają ruch informacyjny, a sieć jest zalana poprawnym, generycznym tekstem.

Moim celem nie jest więc klepanie klasycznych wierszówek konkurujących z tysiącem innych komentatorów, tylko **połączenie publicystyki z inżynierią: umiejętnością zebrania danych, zbudowania narzędzia, interaktywnego modułu albo pipeline'u badawczego**. Jednocześnie chcę:
1. **Zacząć na tym realnie zarabiać** (zamówienia na materiały specjalne, partnerstwa cyklu, narzędzia pod śledztwa/analizy lub raporty interaktywne).
2. **Budować rozpoznawalność** pod ciekawe, nieszablonowe projekty i współprace.
3. **Pisać**, bo samo układanie myśli w dłuższą formę daje mi frajdę.

---

## 2. Co mówi rynek mediów w 2025–2026 (wnioski z Reddit, Nieman Lab, Digiday i polskich redakcji)

Przegląd dyskusji branżowych (`r/Journalism`, `r/webdev`, `r/datascience`, *Nieman Lab*, *Digiday*, *Press.pl*, *Wirtualnemedia.pl*) potwierdza tę intuicję bardzo twardo:

1. **AI nie potrafi „streścić” narzędzia w wynikach wyszukiwania.** Portale zaliczyły dwucyfrowe spadki ruchu z wyszukiwarek na zwykłych tekstach, dlatego najmocniej bronią się **interaktywne kalkulatory, mapy, wyszukiwarki baz danych i symulatory osadzone w artykule**, w których czytelnik sprawdza własną sytuację, miasto albo branżę (długi czas sesji, powracający czytelnicy, realny powód do subskrypcji).
2. **W polskich redakcjach jest ostry podział: „AI do danych i researchu — TAK; AI do generowania treści — NIE”.** Większość dużych wydawców (RASP, Agora, ZPR, Polska Press) wprowadziła w latach 2025–2026 twarde regulaminy zakazujące generowania artykułów przez modele i walczy o zaufanie odbiorców zmęczonych „AI slopem”.
   - **Kluczowy wniosek komunikacyjny:** Kiedy piszę do redakcji o *„automatyzacji treści i social mediów oraz generatywnym wideo”* (jak przy opisie Mumro i początków Świadka), u redaktora może zapalić się czerwona lampka: *„ktoś chce nam sprzedać generator contentu”*. Kiedy zamiast tego pokazuję **własny zbiór danych, skrypt badawczy z twardym linkowaniem do źródeł (zero halucynacji), aparaturę pomiarową (MFC) albo interaktywny moduł do artykułu** — trafiam dokładnie w to, czego w newsroomach brakuje.
3. **Na świecie rośnie rola *Editorial Engineer* / *Computational Journalist*, a w Polsce duże portale kontraktują zewnętrznych twórców danych.**
   - Na świecie (*Nieman Lab*, *JournalismAI*) najbardziej poszukiwani techniczni ludzie w mediach budują dziś skrojone pod konkretne śledztwo pipeline'y do przekopywania rejestrów publicznych, dokumentów i anomalii z pełną ścieżką audytu źródeł.
   - W Polsce mało która redakcja ma własny dział *Interactive Lab*, dlatego portale wchodzą w partnerstwa z niezależnymi twórcami (przykład rynkowy z lipca 2025+: oficjalna współpraca **Gazeta.pl z „Kartografią Ekstremalną”** Szymona Pifczyka wokół autorskich opracowań danych i map).
4. **Jak zarabiają twórcy w stylu *The Pudding* (`pudding.cool`):** Na Reddicie praktycy *interactive data storytelling* podkreślają, że nikt nie wystawia ogłoszeń „kupię interaktywny esej”, dopóki nie zobaczy działającej próbki. Najlepiej działa model: **zbudować i wypuścić 1–2 głośne materiały „tekst + żywe narzędzie/dane” u siebie** (i nagłośnić na X / LinkedInie), a potem przychodzić do redakcji i firm B2B z gotowym formatem do osadzenia lub zamówienia.

---

## 3. Trzy ścieżki działania dla mojego profilu („Narzędzie + Publicystyka”)

### Ścieżka 1: „Tekst + Interaktywny Moduł / Własne Dane” (najmocniejsza karta przetargowa)
Zamiast wysyłać sam szkic opinii, przychodzę do redakcji z **materiałem opartym na danych, które sam zebrałem skryptem, oraz małym interaktywnym widżetem** (czystym HTML/JS możliwe do osadzenia w artykule przez `iframe` albo podlinkowania):
- *Przykład mechanizmu:* pobranie i przeanalizowanie tysięcy publicznych rekordów (np. polskich przetargów publicznych z hasłem „AI”, ogłoszeń o pracę w IT 2023 vs. 2026, cen/parametrów z otwartych rejestrów, aktywności botów w polskim internecie) + krótka wyszukiwarka/kalkulator dla czytelnika + przystępnie napisany artykuł z wnioskami.
- Żaden newsroomowy dziennikarz bez zaplecza programistycznego nie zrobi tego w dwa dni, a żaden chatbot tego nie wygeneruje bez danych.

### Ścieżka 2: Współpraca przy śledztwach na danych i narzędziach researchowych (*Editorial Engineering*)
Wsparcie redakcji śledczych i analitycznych od strony technicznej: budowa jednorazowych lub stałych narzędzi do przekopywania dużych zrzutów dokumentów, rejestrów (KRS, zamówienia, oświadczenia, archiwa), monitoringu zmian oraz weryfikacji źródeł z rygorystycznym zachowaniem śladu źródłowego (doświadczenie z `agent-harness-kit`, `mcp-surface-kit` i pracy na archiwach/źródłach).

### Ścieżka 3: Autorskie eseje praktyka (jako uzupełnienie, nie jedyny produkt)
Klasyczne dłuższe teksty tam, gdzie liczy się głos człowieka z wewnątrz branży (np. kulisy budowania systemów z agentami vs. „kod na ślinę”, pułapka przepracowania przy AI, wejście z AI do laboratorium przy MFC). Wysyłane jako krótki pitch pod wierszówkę, kiedy mam akurat gotową myśl.

---

## 4. Gdzie uderzać pod kątem „Narzędzie + Dane + Publicystyka”

| Redakcja / Miejsce | Dlaczego pasuje do modelu „Narzędzie + Tekst” | Publiczny kontakt |
| --- | --- | --- |
| **Zero.pl** | Młody, duży portal z ambicjami śledczymi i analitycznymi, kierowany przez dziennikarkę świetnie rozumiejącą technologię i AI, ale bez wieloletniego wewnętrznego działu *data-interactive*. Konkretny materiał z własnym zbiorem danych / kalkulatorem wyróżni się natychmiast. | `redakcja@zero.pl` / bezpośredni kontakt redakcyjny |
| **XYZ.pl** | Medium ekonomiczno-analityczne dla wymagającego czytelnika biznesowego. Unikają tanich SEO-kalkulatorów, ale autorska analiza danych rynkowych (np. realny rynek pracy IT/AI w Polsce na twardych liczbach, przetargi, energetyka/koszty AI) to ich rdzeń. | `kontakt@xyz.pl` / pion Newsroom & Innovation |
| **BIQdata (Wyborcza.pl)** / **Gazeta.pl** | Najbardziej osadzone w kulturze *data journalism* miejsce w Polsce (BIQdata pod kierunkiem Vadima Makarenki) oraz portal, który już udowodnił otwartość na partnerstwa z niezależnymi twórcami danych (case *Kartografii Ekstremalnej*). | `redakcja@wyborcza.pl` / kanały redakcyjne Gazeta.pl |
| **Frontstory.pl** | Czołowa w Polsce redakcja śledcza pracująca na dużych bazach danych, rejestrach i OSINT-cie (Fundacja Reporterów). Miejsce nie pod felieton, ale pod współpracę technologiczno-analityczną przy trudnych zbiorach danych i tropieniu dezinformacji/przepływów. | `kontakt@fundacjareporterow.org` |
| **HomoDigital.pl** / **Subiektywnie o Finansach** | Ekosystem Macieja Samcika żyje z konkretu, liczenia na palcach i chronienia czytelnika przed naciągaczami. Interaktywne porównywarki, policzone koszty i chłodne rozbieranie obietnic AI na czynniki pierwsze pasują tu idealnie. | `redakcja@homodigital.pl` |
| **Demagog** / **CyberDefence24.pl** | Weryfikacja informacji, detekcja manipulacji/botów, bezpieczeństwo systemów AI i polityka cyfrowa — naturalny styk z narzędziami weryfikacyjnymi i kontrolą uprawnień agentów. | Kanały `demagog.org.pl` · `redakcja@cyberdefence24.pl` |
| **Spider’s Web+** / **Magazyn Pismo** | Najlepsze adresy pod bardziej narracyjną, eseistyczną opowieść (np. reportażowo-warsztatowy tekst z interaktywnym dodatkiem lub wizualizacją). | `kontakt@spidersweb.pl` · `redakcja@magazynpismo.pl` |

---

## 5. Dziennik działań (dla ciągłości kontekstu między agentami)

- **28.10.2026 — Zero.pl:** wysłany pierwszy mail z otwartym pytaniem o możliwość współpracy (opis doświadczenia w IT/AI, Mumro, Świadka Dziejów oraz szerokiej otwartości od tekstów po wideo i narzędzia). Wysłane tuż przed długim weekendem listopadowym.
- **03.11.2026 — Korekta strategii i research rynkowy:**
  - Diagnoza pierwszego maila: był zbyt ogólny (wymagał od redakcji wymyślenia roli), a wzmianka o „automatyzacji działań w social mediach” mogła w newsroomie zabrzmieć jak oferta generatora treści, zamiast pokazać warsztat inżyniersko-analityczny.
  - Doprecyzowanie kierunku: **nie celujemy w samo pisanie prostych tekstów**, tylko w **łączenie publicystyki z budowaniem narzędzi, analizą danych i interaktywnymi modułami**, których nie zastąpi zwykły prompt.
  - Zbudowany i opublikowany na `roleplayingtech.com` pierwszy pokazowy materiał w formule **„Szeroki raport analityczny + Interaktywne wykresy + Baza danych”**:
    - **Temat:** *Na co polskie instytucje naprawdę wydają pieniądze pod hasłem AI? Analiza i baza 171 postępowań z Biuletynu Zamówień Publicznych (01.01.2024 – 03.11.2026)* — osadzony w kontekście wejścia krajowych przepisów nadzorczych AI pod koniec października 2026 r.
    - **Adresy na żywo i pliki w repozytorium:** sekcja zbiorcza `/pl/lab/` i `/en/lab/` (`lab/index.html`), raport PL `/pl/lab/przetargi-ai/index.html`, raport EN `/en/lab/ai-tenders/index.html`, dane i moduły `/assets/lab/bzp-ai-2024-2026.json`, `/assets/lab/bzp-explorer.js`, `/assets/lab/bzp-explorer.css` (dwa wplecione wykresy interaktywne, pełna wyszukiwarka z eksportem CSV oraz tryb `?embed=1` dla redakcji).
  - Kolejny krok do wyboru:
    1. Wypuścić autorski wątek na X (`@rpl_0x`) z podlinkowanymi widokami filtrów (np. wdrożenia z 1 ofertą `?cat=software_deploy&single=1#explorer`, województwo śląskie `?prov=Śląskie#explorer`, wydatki poboczne `?incidental=1&cat=incidental#explorer`).
    2. W okolicach **09–10.11.2026** wysłać krótki follow-up w wątku do Zero.pl — już nie z ogólnym pytaniem, tylko z działającym linkiem do opublikowanego raportu + propozycją podobnych śledztw na danych / interaktywnych modułów dla czytelników.
    3. Równolegle odezwać się z działającą próbką „dane + narzędzie + tekst” do wybranych redakcji z tabeli wyżej (`XYZ.pl`, `BIQdata`/`Gazeta.pl`, `HomoDigital` lub `Frontstory`).

> **Wskazówka dla kolejnych agentów AI pracujących w tym repozytorium:**  
> Pamiętajcie, że celem autora w mediach jest **połączenie publicystyki z budowaniem działających narzędzi i analizą danych**, a nie masowe wysyłanie zwykłych felietonów. Przy kolejnych ruchach dopisujcie tu krótko datę, redakcję i status — **nigdy nie wklejając** prywatnej korespondencji, niepublicznych maili ani stawek finansowych.
