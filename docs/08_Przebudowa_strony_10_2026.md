# 08 · Przebudowa strony — październik 2026 / Site rebuild — October 2026

> **Stan / As of:** 22.10.2026. Opis obecnej struktury strony i decyzji podjętych razem z właścicielem. Fakty i ograniczenia nadal są w [07](07_AKTUALNY_KONTEKST_PUBLICZNY.md).

## Cel / Goal

**PL:** Strona ma pokazywać autora jako skromnego, ciekawego świata człowieka, który łączy różne dziedziny — i jednocześnie sprawiać, że ktoś chce z nim porozmawiać o współpracy. Bez sprzedażowego tonu, bez stawiania się w kontrze do innych, bez hasła „ciekawe projekty mile widziane, zwykłe też”. Charakter wynika z całości: projektów, zasad pracy i drobnych szczegółów.

**EN:** The site should present the author as a modest, curious person who connects different fields, while making visitors want to talk about working together. No sales tone, no contrarian jabs, no slogan about preferring interesting projects. The character comes from the whole page.

## Strona główna / Home page (`/pl/`, `/en/`)

| # | Sekcja / Section | Co zawiera / Contents |
| --- | --- | --- |
| — | Hero | Duży napis „RolePlayingTech.”, jedno zdanie o tym, czym się zajmuje autor, linijka „Teraz / jesień 2026”. **Bez imienia i nazwiska** — to świadoma decyzja właściciela. / No name in the hero, on purpose. |
| 01 | Projekty / Projects | Cztery projekty, przy każdym rola autora (samodzielnie z AI, współtworzone z bratem, część techniczna cudzych badań). |
| 02 | Edukacja i open source / Learning & open source | Spokojny panel Akademii Mumro (`academy.mumro.io`) + dwa otwarte repozytoria CLI (`agent-harness-kit`, `mcp-surface-kit`), notatka o bezpłatnej społeczności Discord (zaproszenia na X) i link do podstrony `/pl/education/` (`/en/education/`). |
| 03 | W liczbach / In numbers | Liczby obserwujących (orientacyjnie, 10/2026) + karta o dłuższych formatach na YouTubie Świadka Dziejów. |
| 04 | Osoba / About | Krótka historia, RolePlayingLife, wyprawy rowerowe z namiotem i góry, link do `/pl/about/`. |
| 05 | Współpraca / Work together | Cztery sytuacje „z czym można przyjść” z linkami do projektów-dowodów oraz trzy zasady: styk różnych światów, z sensem, otwarcie o AI. |
| 06 | W sieci / Elsewhere | Wszystkie profile: autor (X, Instagram, LinkedIn, Substack), Świadek Dziejów (strona, YouTube, TikTok, Instagram, Facebook), Crewly, Mumro (strona + Akademia, social media wkrótce), Discord (zaproszenia ogłaszane w social mediach, bez stałego linku). |
| 07 | Kontakt / Contact | E-mail, LinkedIn, X. |

Imię i nazwisko pojawia się tylko w stopce (oraz na podstronie „O mnie”). / The name only appears in the footer (and on the About page).

## Podstrona edukacji i open source (`/pl/education/`, `/en/education/`)

Szerszy przegląd czterech ścieżek tematycznych, playbooków i słownika Akademii Mumro (`academy.mumro.io`), szczegółowy opis otwartych narzędzi CLI (`RolePlayingTech/agent-harness-kit`, `RolePlayingTech/mcp-surface-kit`) i repozytorium Akademii (`RolePlayingTech/mumro-academy`) oraz informacja o społeczności Discord i publikacjach na X / Substacku. Skrót `/education/` przekierowuje do `/pl/education/`.

## Strony projektów / Project pages

Każda ma blok „W sieci / Elsewhere” z profilami projektu i na końcu krótkie zaproszenie do kontaktu dopasowane do tematu. Stare kopie w `/work/` przekierowują do `/pl/work/…`.

## Technicznie / Technical notes

- Nadal statyczny HTML + CSS na GitHub Pages, bez frameworka i bez kroku budowania. / Still static HTML + CSS.
- `assets/site.js` — jeden mały, własny skrypt (bez zewnętrznych bibliotek) do łagodnego pojawiania się sekcji i odliczania liczb. Strona działa i pokazuje wszystkie treści także bez JavaScriptu (po 3 s awaryjnie odsłania elementy). / One small first-party script; the page works without it.
- Style nowych sekcji są na końcu `assets/minimal.css`.

## Do aktualizacji / Keep up to date

- Liczby obserwujących w sekcji „W liczbach” (`data-count` w `pl/index.html` i `en/index.html`) oraz w opisie Świadka Dziejów — zawsze z datą.
- Linia „Teraz / jesień 2026” w hero.
- Profile Mumro, kiedy powstaną.
