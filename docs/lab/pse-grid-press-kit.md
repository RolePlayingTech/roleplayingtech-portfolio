# Press Kit / Nota dla redakcji — Raport NR 04 (KSE / PSE 2024–2026)
## Wyłączamy tanie słońce, gdy prąd jest drogi. Co pokazały 73 924 kwadranse pracy sieci PSE

- **URL raportu (PL):** `https://roleplayingtech.com/pl/lab/redysponowanie-oze-pse/`
- **URL raportu (EN):** `https://roleplayingtech.com/en/lab/polish-grid-curtailment/`
- **Dane źródłowe JSON:** `https://roleplayingtech.com/assets/lab/pse-grid-2026.json`
- **Autor:** Grzegorz Stuczyński (`stuczynski.g@gmail.com` · X: `@rpl_0x`)

---

## Najważniejsze liczby (zweryfikowane na 73 924 kwadransach PSE API v2)

1. **1 805,05 GWh ściętego OZE w 2026 YTD (`01.01–02.11.2026`, +36,1% r/r wobec `1 326,29 GWh` w 2025 YTD):** `1 262,60 GWh` fotowoltaiki (`+29,5%`) oraz `542,45 GWh` wiatru (`+54,4%`). Aż **`98,84%` (`1 784,03 GWh`)** to redukcje bilansowe całego systemu, a tylko **`1,16%` (`21,03 GWh`)** lokalne przeciążenia sieciowe.
2. **Koniec mitu ujemnych cen i niedziel:** **`58,56%`** zredysponowanej energii (`1 056,97 GWh`) przepadło w **dni robocze (pon.–pt.)**, a **`66,57%` (`1 201,60 GWh`)** wyłączono przy **dodatnich cenach hurtowych (`RCE > 0`)**. Przy drogim prądzie **`RCE ≥ 250 zł/MWh`** ścięto **`497,42 GWh` (`27,56%` wolumenu, `+89,9%` r/r)** w `3 276` kwadransach — **2,41× częściej** niż przy cenach zerowych lub ujemnych (`1 361` kwadr.). Powyżej `400 zł/MWh` ścięto `183,42 GWh` (`+477,5%` r/r).
3. **Fizyczna przyczyna — podłoga cieplna pod szczyt o 20:00:** Analiza `106` bloków w `37` elektrowniach (`gen-jw`) pokazuje, że w dni robocze drogich redukcji bloki cieplne nie schodzą o 12:00 niżej niż **`7,98 GW` (`7 981,9 MW`)**, bo między 12:00 a 20:00 muszą urosnąć na **`13,63 GW` (`+5,64 GW` rampy cieplnej; `+7,11 GW` z pełnym obrotem elektrowni szczytowo-pompowych ESP)**. W ekstremalną środę `24.06.2026` po ścięciu `19,20 GWh` PV w ciągu dnia wieczorna cena skoczyła o 20:00 do **`2 567,7 zł/MWh` (`RCE`)** i **`2 947,6 zł/MWh` (`CEN`)**.
4. **Gilotyna pełnej godziny (`:00`):** Mimo 15-minutowego Rynku Bilansującego od czerwca 2024 r. aż **`96,75%` (`2 263 z 2 339`)** skoków redukcji OZE `≥ 200 MW` oraz **`100,00%` (`1 136 z 1 136`)** skoków `≥ 500 MW` następuje równo o pełnej godzinie zegarowej `:00`.
5. **Sześć granic — przepływy kołowe vs kable HVDC:** Podczas wyłączeń przy `RCE ≥ 250 zł/MWh` z Niemiec wpływa do Polski średnio **`+605,2 MW` nieplanowanego przepływu kołowego** (`+607,3 MW` fizycznie przy `+2,1 MW` handlowo, z odpływem `-738,3 MW` kołowo do Czech), natomiast kable stałoprądowe HVDC z Litwy (`+79,3 MW` handlowo) i Szwecji (`+66,1 MW` handlowo) automatycznie importują prąd do Polski z powodu wysokiej polskiej ceny giełdowej. W `862` kwadransach (`140,68 GWh`) Polska była podczas redukcji OZE fizycznym importerem netto ogółem.
6. **355,09 mln zł ze wzoru kontra 105,5 mln zł w gotówce:** Wycena ściętego w 2026 YTD wolumenu po cenach rynkowych `max(0, RCE)` daje `251,46 mln zł`, a według wzoru PSE po cenie niezbilansowania `max(0, CEN)` — **`355,09 mln zł`**, podczas gdy łączne wypłaty gotówkowe PSE za lata `2023 – VII 2026` wyniosły **`105,5 mln zł`** (stawka jakościowa na rachunkach wzrosła od lutego 2026 r. do **`33,16 zł/MWh`** wobec `10,18 zł/MWh` w 2021 r.).

---

## Osadzanie interaktywnej tabeli w artykułach (`iframe`)

Redakcje mogą bezpłatnie osadzać wykresy i wyszukiwarkę 37 elektrowni oraz 140 dób redukcji (z podaniem źródła):

```html
<iframe src="https://roleplayingtech.com/pl/lab/redysponowanie-oze-pse/?embed=1&lens=plants" width="100%" height="760" style="border:1px solid #dbd7cd;background:#f7f6f2" loading="lazy"></iframe>
```
