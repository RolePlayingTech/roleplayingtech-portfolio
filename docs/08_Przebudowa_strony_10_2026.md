# 08 · Przebudowa strony — październik 2026 / Site rebuild — October 2026

> **Stan / As of:** 16.10.2026. Opis obecnej struktury strony i decyzji podjętych razem z właścicielem. Fakty i ograniczenia nadal są w [07](07_AKTUALNY_KONTEKST_PUBLICZNY.md).

## Cel / Goal

**PL:** Strona ma pokazywać autora jako skromnego, ciekawego świata człowieka, który łączy różne dziedziny — i jednocześnie sprawiać, że ktoś chce z nim porozmawiać o współpracy. Bez sprzedażowego tonu, bez stawiania się w kontrze do innych, bez hasła „ciekawe projekty mile widziane, zwykłe też”. Charakter wynika z całości: projektów, zasad pracy i drobnych szczegółów.

**EN:** The site should present the author as a modest, curious person who connects different fields, while making visitors want to talk about working together. No sales tone, no contrarian jabs, no slogan about preferring interesting projects. The character comes from the whole page.

## Strona główna / Home page (`/pl/`, `/en/`)

| # | Sekcja / Section | Co zawiera / Contents |
| --- | --- | --- |
| — | Hero | Duży napis „RolePlayingTech.”, jedno zdanie o tym, czym się zajmuje autor, linijka „Teraz / jesień 2026”. **Bez imienia i nazwiska** — to świadoma decyzja właściciela. / No name in the hero, on purpose. |
| — | Pasek dziedzin / Marquee | Wolno przesuwające się pary: Historia × AI, Inżynieria środowiska × elektronika, Kod × treści itd. Zatrzymuje się po najechaniu, nie rusza się przy `prefers-reduced-motion`. |
| 01 | Projekty / Projects | Cztery projekty, przy każdym rola autora (samodzielnie z AI, współtworzone z bratem, część techniczna cudzych badań). |
| 02 | W liczbach / In numbers | Animowane liczby obserwujących (orientacyjnie, 10/2026) + karta o dłuższych formatach na YouTubie Świadka Dziejów. |
| 03 | Osoba / About | Krótka historia, RolePlayingLife, wyprawy rowerowe z namiotem i góry, panorama `assets/camp.jpg`. |
| 04 | Współpraca / Work together | Cztery sytuacje „z czym można przyjść” z linkami do projektów-dowodów oraz trzy zasady: styk różnych światów, z sensem, otwarcie o AI. |
| 05 | W sieci / Elsewhere | Wszystkie profile: autor (X, Instagram, LinkedIn, Substack), Świadek Dziejów (strona, YouTube, TikTok, Instagram, Facebook), Crewly, Mumro (social media wkrótce), Discord (zaproszenia ogłaszane w social mediach, bez stałego linku). |
| 06 | Kontakt / Contact | E-mail, LinkedIn, X. |

Imię i nazwisko pojawia się tylko w stopce. / The name only appears in the footer.

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
