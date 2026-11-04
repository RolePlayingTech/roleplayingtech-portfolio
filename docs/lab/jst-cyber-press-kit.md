# Press Kit dla redakcji ogólnopolskich i lokalnych · Raport NR 03 („Cyberbezpieczny Samorząd” — 2 809 JST)

- **Pełny raport PL + wyszukiwarka wszystkich 2 809 JST:** `https://roleplayingtech.com/pl/lab/cyberbezpieczny-samorzad/`
- **Wersja angielska (EN):** `https://roleplayingtech.com/en/lab/municipal-cybersecurity/`
- **Otwarty plik danych JSON (100% Polski):** `https://roleplayingtech.com/assets/lab/jst-cyber-2026.json`
- **Autor:** Grzegorz Stuczyński (`stuczynski.g@gmail.com` · X: `@rpl_0x`)
- **Licencja dla mediów:** bezpłatne wykorzystanie liczb, wykresów oraz osadzanie interaktywnej wyszukiwarki (`?embed=1`) z podaniem źródła i linkiem do raportu RolePlayingTech.

## 5 kluczowych liczb zweryfikowanych co do grosza i rekordu DNS (stan: 03–04.11.2026)

1. **1,48 mld zł rozdysponowane, 34 dni po terminie końcowym:** program `FERC.02.02 Cyberbezpieczny Samorząd` objął **2 511 pozytywnie ocenionych wniosków na 1 483 979 072,49 zł** (**2 495 podpisanych umów na 1 474 312 573,61 zł**) z twardym terminem rozliczenia **30 września 2026 r.** Nasza baza obejmuje **100% z 2 809 ustawowych samorządów w Polsce** (2 479 gmin, 314 powiatów, 16 województw).
2. **Co czwarty urząd z pocztą otwartą na podszycie (26,41%):** spośród **2 779 instytucjonalnych domen pocztowych** dokładnie **734** nie blokują sfałszowanych wiadomości e-mail (**362 [13,03%] bez działającego rekordu DMARC** wbrew obowiązkowi z art. 24 ust. 2 ustawy z 28.07.2023 r., `Dz.U. 2023 poz. 1703`, obowiązującemu od **25.12.2023 r.** + **372 [13,39%] na biernej polityce `p=none`**). Wśród nich jest **632 beneficjentów grantów na łączną kwotę 356,07 mln zł**, w tym **62 gminy z maksymalnym grantem ~850 tys. zł bez żadnego rekordu DMARC** (m.in. Gorzów Wlkp., Słupsk, Bytom, Włoszczowa) oraz **4 urzędy marszałkowskie na `p=none`** (dolnośląskie, lubelskie, podkarpackie, wielkopolskie) i **5 kolejnych miast MNP na `p=none`** (Wrocław, Zielona Góra, Jelenia Góra, Piotrków Tryb., Przemyśl).
3. **Statystycznie zerowy efekt grantu na brak DMARC (`p = 0,28`):** brak rekordu DMARC występuje u **12,77% laureatów programu (317 z 2 483)** wobec **15,20% samorządów bez grantu (45 z 296)** — różnica losowa (test χ² Yatesa `p = 0,2777`, Fisher `p = 0,2357`). Empirycznie potwierdza to w skali całego kraju diagnozę raportu **NIK P/25/003 z lipca 2026 r. (s. 8)**, że wskaźniki CPPC mierzyły wyłącznie zakupy i szkolenia, a nie realny wzrost cyberbezpieczeństwa.
4. **30 urzędów gmin na komercyjnych skrzynkach + chmura USA przed NASK:** na żywych stronach WWW i BIP **30 gmin** (z czego **28 wzięło 12,61 mln zł grantów**, w tym Ostrów Mazowiecka i Pisz po **850 000 zł** na `@home.pl`) wciąż obsługuje obywateli ze skrzynek `@post.pl`, `@onet.pl`, `@wp.pl`, `@gmail.com` i współdzielonych domen ISP. Jednocześnie z chmur USA (**Microsoft 365 [74] + Google Workspace [18] = 92 JST**) korzysta niemal dwa razy więcej samorządów niż z państwowej sieci **NASK/COI/PIONIER (55 JST)**. Dla porównania **Sądy i Prokuratura (365 domen `.gov.pl`)** dzięki centralnej bramce pocztowej mają zaledwie **2,47% podatnych domen**.
5. **336 z 346 stron ze skryptami Mety śledzi mieszkańców w 0. sekundzie bez zgody:** w czystej przeglądarce Chromium bez kliknięcia banera cookies **331 urzędów** ładuje niezablokowane wtyczki społecznościowe Mety (współadministrowanie z wyroku TSUE C-40/17 *Fashion ID* + art. 399 PKE), a **5 grantobiorców (4,11 mln zł dotacji: Woj. lubuskie, Gdynia, Tarnów, Polkowice, Powiat Świdnicki)** odpala pełny komercyjny **Meta Pixel (`fbevents.js` + `/tr`)**, w tym **Tarnów** z modułem *Automatic Advanced Matching* (`udwv[em]`) haszującym adresy e-mail z formularzy. Równocześnie **9 gmin** (m.in. Pruszcz Gdański, Trzebownisko, Mrągowo) wzorcowo blokuje skrypty przed zgodą.

## Gotowy kod osadzenia wyszukiwarki 2 809 samorządów dla portali lokalnych i ogólnopolskich

```html
<iframe
  src="https://roleplayingtech.com/pl/lab/cyberbezpieczny-samorzad/?embed=1#explorer"
  width="100%"
  height="760"
  style="border:1px solid #dbd7cd"
  loading="lazy"
  title="Sprawdź swój urząd: Cyberbezpieczny Samorząd — wszystkie 2 809 gmin, miast i powiatów (RolePlayingTech)">
</iframe>
```
