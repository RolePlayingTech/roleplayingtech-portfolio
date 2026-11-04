# Metodologia i dokumentacja danych — Raport NR 04 (`pse-grid-2026.json`)
## Wyłączamy tanie słońce, gdy prąd jest drogi: 73 924 kwadranse pracy sieci PSE (2024–2026)

- **Autor analizy i kodu:** Grzegorz Stuczyński ([RolePlayingTech](https://roleplayingtech.com/pl/lab/redysponowanie-oze-pse/))
- **Zakres czasowy telemetrii:** `2024-09-24` (`2024-09-23 22:15 UTC`) – `2026-11-02` (`2026-11-02 23:00 UTC`) — **770 dób kalendarzowych, 73 924 ciągłe kwadranse (0 brakujących przedziałów)**
- **Zbiór publiczny:** [`/assets/lab/pse-grid-2026.json`](../../assets/lab/pse-grid-2026.json)
- **Skrypt budujący i asercje:** [`scripts/build_pse_grid_dataset.py`](../../scripts/build_pse_grid_dataset.py)
- **Skrypt weryfikacyjny QA:** [`scripts/verify_pse_report.py`](../../scripts/verify_pse_report.py)

---

## 1. Źródła pierwotne (PSE API v2, dokumenty PSE S.A. i URE)

1. **`poze-redoze` (`https://api.raporty.pse.pl/api/poze-redoze`):** 15-minutowe nierynkowe redysponowanie źródeł fotowoltaicznych (`PV`) i wiatrowych (`WI`) z podziałem na przyczynę bilansową i sieciową (wartości ujemne w `MW`; energia w `MWh = |MW| × 0,25 h`).
2. **`his-wlk-cal` (`https://api.raporty.pse.pl/api/his-wlk-cal`):** 15-minutowe wielkości podstawowe KSE: zapotrzebowanie krajowe (`demand`), generacja jednostek centralnie dysponowanych i aktywnych (`jg`), generacja poza RB (`jnwrb`), fotowoltaika (`pv`), wiatr (`wi`), magazyny/pompowanie (`jgm`) oraz saldo wymiany międzysystemowej równoległej (`swm_p`) i nierównoległej (`swm_np`).
3. **`rce-pln` oraz `energy-prices` (`https://api.raporty.pse.pl/api/energy-prices`):** 15-minutowa Rynkowa Cena Energii (`rce_pln`), cena jednolitego łączenia rynków dnia następnego (`csdac_pln`) oraz cena rozliczeniowa energii niezbilansowania (`cen_cost`, tj. $CEN_t$) wraz ze znakiem i wolumenem niezbilansowania systemu (`balance`).
4. **`przeplywy-mocy` oraz `pwm-rdn-rdb`:** 15-minutowe przepływy fizyczne na 6 przekrojach (`DE`, `CZ`, `SK`, `SE`, `LT`, `UA`) oraz 15-minutowe handlowe salda wymiany `RDN+RDB` (raport `pwm-rdn-rdb` publikowany przez PSE od `2026-01-01`).
5. **`gen-jw` (`https://api.raporty.pse.pl/api/gen-jw`):** 15-minutowe wykonanie mocy (`Generacja` oraz `Pobór`) dla **106 jednostek wytwórczych w 37 elektrowniach** w Polsce.
6. **Dokumenty regulacyjne i sprawozdawcze:**
   - PSE S.A., *Zasady wyliczania rekompensaty finansowej PV*, Konstancin-Jeziorna, marzec 2026 r. (`s. 2`: wzór $K = K^C + K^{WSP}$, wycena po $CEN_t$ przy ujemnym niezbilansowaniu oraz `pkt 2.1` $K^C = 0$ dla energii sprzedawanej Sprzedawcy Zobowiązanemu; `s. 3`: składniki wsparcia $K^{CERT}$ i $K^{AUK}$).
   - PSE S.A., *Redysponowanie OZE — spotkanie z wytwórcami*, prezentacja z 23 maja 2025 r. (slajd 6: przyczyny utrzymywania minimum `JG` oraz szczyt wieczorny `6 GW`; slajdy 18–20: godzinowy cykl planowania i kaskada poleceń OSP → OSD).
   - Prezes URE, *Sprawozdanie dotyczące redysponowania za 2024 rok*, październik 2025 r. (`722,34 GWh` OSP + `26,92 GWh` własne OSD) oraz decyzja taryfowa Prezesa URE na 2026 r. (`DRE.WPR.4211.1.4.2026.BTS`, stawka jakościowa `33,16 zł/MWh` netto od 1 lutego 2026 r.).

---

## 2. Kluczowe reguły metodologiczne i uniknięte pułapki

1. **Ciągłość czasu UTC i zmiany czasu CET/CEST:** Znacznik `dtime_utc` w API PSE oznacza **koniec** 15-minutowego okresu rozliczeniowego. Dzięki temu warunek `dtime_utc.minute == 15` wskazuje pierwszy kwadrans pełnej godziny zegarowej (`HH:00–HH:15`) niezależnie od czasu zimowego (`CET`) lub letniego (`CEST`). Szereg obejmuje 765 dób po 96 kwadransów, 3 jesienne doby zmiany czasu po 100 kwadransów (`2024-10-27`, `2025-10-26`, `2026-10-25`) i 2 wiosenne doby po 92 kwadranse (`2025-03-30`, `2026-03-29`) = **`73 924` kwadranse**.
2. **Porównywalność rok do roku (`YTD`):** Ponieważ `poze-redoze` w API v2 startuje `2024-09-24`, dynamiki roczne są liczone na identycznych oknach sezonowych **`01.01–02.11.2025` (`29 376` kwadr., `1 326,29 GWh`) vs `01.01–02.11.2026` (`29 376` kwadr., `1 805,05 GWh`, `+36,1%`)**.
3. **Uzupełnianie zerami (`fill_value=0.0`) w `gen-jw` i rozdzielenie trzech miar mocy:** Surowy strumień `gen-jw` pomija wiersze elektrowni całkowicie odstawionych w danej dobie (np. `Dolna Odra` w 2 z 9 dni). Zwykła średnia po obecnych wierszach zawyża moc o kilkadziesiąt MW. Skrypt `build_pse_grid_dataset.py` buduje pełny iloczyn kartezjański `864 kwadransów × 37 elektrowni` z `fill_value=0.0` i jawnie rozdziela:
   - **Czystą generację cieplną `gen-jw`** (`węgiel brunatny + węgiel kamienny + gaz CCGT + elektrociepłownie`): `7 981,9 MW` (`12:00`) → `13 625,8 MW` (`20:00`), rampa **`+5 643,9 MW` (`+5,64 GW`)**.
   - **Pełny wahacz sterowalny `gen-jw` z ESP netto** (`-775,8 MW` pompowania o `12:00` → `+693,7 MW` generacji o `20:00`): skok netto **`+7 113,4 MW` (`+7,11 GW`)**.
   - **Systemowe `JG` w `his-wlk-cal`** (obejmujące generację wodną `>0`, bez ujemnego poboru pomp `jgm`): `7 536,7 MW` → `13 834,9 MW` (**`+6 298,3 MW` / `+6,30 GW`**).
4. **Konwencja znaków na granicach i zakres przepływów kołowych:** Zgodnie z równaniem bilansu KSE wartości dodatnie (`+`) oznaczają wpływ energii **do Polski**, a wartości ujemne (`−`) wypływ energii **z Polski**. Przepływ kołowy definiujemy jako `loop_net = phys_net - sched_net` i liczymy go wyłącznie dla okresu `2026 YTD` (`01.01–02.11.2026`), w którym raport handlowy `pwm-rdn-rdb` ma stuprocentowe pokrycie.

---

## 3. Odtwarzalność i licencja

Kod analityczny oraz zagregowany zbiór JSON udostępniam otwarcie z zachowaniem atrybucji („Grzegorz Stuczyński / RolePlayingTech.com, na podstawie danych PSE S.A. i URE”). Aby zweryfikować wszystkie inwarianty liczbowe i strukturę HTML:

```powershell
py -X utf8 scripts/verify_pse_report.py
```
