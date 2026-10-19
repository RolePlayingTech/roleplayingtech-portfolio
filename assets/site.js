(function () {
  var root = document.documentElement;
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    function countUp(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var duration = 1600;
      var start = null;
      function step(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      el.textContent = '0';
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
    root.classList.add('js-ready');
  }

  // Load handwritten font Caveat asynchronously for photo captions
  if (!document.getElementById('rpt-hand-font')) {
    var link = document.createElement('link');
    link.id = 'rpt-hand-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap';
    document.head.appendChild(link);
  }

  var lang = (root.getAttribute('lang') || 'pl').toLowerCase().indexOf('en') === 0 ? 'en' : 'pl';

  var PHOTOS = [
    { id: 'p01', g: 'uae', pl: 'Yas Marina, Abu Zabi ’21 — finał F1', en: 'Yas Marina, Abu Dhabi ’21 — F1 finale' },
    { id: 'p02', g: 'bkk', pl: 'Bangkok, Tajlandia ’22 — Wat Arun', en: 'Bangkok, Thailand ’22 — Wat Arun' },
    { id: 'p03', g: 'th-n', pl: 'Północna Tajlandia ’22 — sanktuarium słoni', en: 'Northern Thailand ’22 — elephant sanctuary' },
    { id: 'p04', g: 'pkk', pl: 'Prachuap Khiri Khan ’22 — widok na zatokę', en: 'Prachuap Khiri Khan ’22 — bay viewpoint' },
    { id: 'p05', g: 'pkk', pl: 'Prachuap Khiri Khan ’22 — na schodach do świątyni', en: 'Prachuap Khiri Khan ’22 — on the temple steps' },
    { id: 'p06', g: 'th-s', pl: 'Zatoka Tajlandzka ’23 — ukryta plaża', en: 'Gulf of Thailand ’23 — quiet cove' },
    { id: 'p07', g: 'sapa', pl: 'Sa Pa, Wietnam ’23 — wioska Cat Cat', en: 'Sa Pa, Vietnam ’23 — Cat Cat village' },
    { id: 'p08', g: 'sapa', pl: 'Sa Pa, Wietnam ’23 — na kamiennych schodach', en: 'Sa Pa, Vietnam ’23 — on the stone steps' },
    { id: 'p09', g: 'fan', pl: 'Fansipan, Wietnam ’23 — świątynie w chmurach', en: 'Fansipan, Vietnam ’23 — temples in the mist' },
    { id: 'p10', g: 'fan', pl: 'Fansipan, Wietnam ’23 — ponad chmurami (3143 m)', en: 'Fansipan, Vietnam ’23 — above the clouds' },
    { id: 'p11', g: 'nb', pl: 'Tràng An, Wietnam ’23 — wśród wapiennych skał', en: 'Tràng An, Vietnam ’23 — limestone karsts' },
    { id: 'p12', g: 'hl', pl: 'Hạ Long, Wietnam ’23 — wzgórze Ba Đèo', en: 'Hạ Long, Vietnam ’23 — Ba Đèo hill garden' },
    { id: 'p13', g: 'hm', pl: 'Hang Múa, Wietnam ’23 — dolina Tam Cốc', en: 'Hang Múa, Vietnam ’23 — overlooking Tam Cốc' },
    { id: 'p14', g: 'hm', pl: 'Hang Múa, Ninh Bình ’23 — grań smoka', en: 'Hang Múa, Ninh Bình ’23 — dragon ridge' },
    { id: 'p15', g: 'hm', pl: 'Ninh Bình, Wietnam ’23 — pola ryżowe z góry', en: 'Ninh Bình, Vietnam ’23 — rice fields below' },
    { id: 'p16', g: 'tc', pl: 'Tam Cốc, Wietnam ’23 — wiosłowanie stopami', en: 'Tam Cốc, Vietnam ’23 — rowing with feet' },
    { id: 'p17', g: 'ang', pl: 'Angkor Thom, Kambodża ’23 — przed Bajonem', en: 'Angkor Thom, Cambodia ’23 — Bayon temple' },
    { id: 'p18', g: 'tap', pl: 'Ta Prohm, Kambodża ’23 — drzewa na murach', en: 'Ta Prohm, Cambodia ’23 — trees over stone' },
    { id: 'p19', g: 'tap', pl: 'Ta Prohm, Kambodża ’23 — korzenie w Angkorze', en: 'Ta Prohm, Cambodia ’23 — roots in Angkor' },
    { id: 'p20', g: 'ang', pl: 'Angkor Wat, Kambodża ’23 — zachód słońca', en: 'Angkor Wat, Cambodia ’23 — at sunset' },
    { id: 'p21', g: 'bok', pl: 'Phnom Bokor, Kambodża ’23 — na skraju chmur', en: 'Phnom Bokor, Cambodia ’23 — cliffside mist' },
    { id: 'p22', g: 'ala', pl: 'Åva, Wyspy Alandzkie ’26 — grobla przez archipelag', en: 'Åva, Åland Islands ’26 — island causeway' },
    { id: 'p23', g: 'est', pl: 'Paldiski, Estonia ’26 — poranek nad Bałtykiem', en: 'Paldiski, Estonia ’26 — Baltic morning camp' },
    { id: 'p24', g: 'fin', pl: 'Południowa Finlandia ’26 — biwak nad zatoką', en: 'Southern Finland ’26 — camp by the bay' },
    { id: 'p25', g: 'uae', pl: 'Dubaj, ZEA ’21 — pod Burdż Chalifa', en: 'Dubai, UAE ’21 — beneath Burj Khalifa' },
    { id: 'p26', g: 'waw', pl: 'Warszawa ’26 — start wyprawy rowerowej', en: 'Warsaw ’26 — setting off north by bike' },
    { id: 'p27', g: 'sto', pl: 'Sztokholm, Szwecja ’26 — kanał przy Gamla Stan', en: 'Stockholm, Sweden ’26 — canal by Gamla Stan' },
    { id: 'p28', g: 'lit', pl: 'Dreverna, Litwa ’26 — nad Zalewem Kurońskim', en: 'Dreverna, Lithuania ’26 — Curonian Lagoon' },
    { id: 'p29', g: 'bkk', pl: 'Thonburi, Bangkok ’24 — domy nad kanałem', en: 'Thonburi, Bangkok ’24 — canal-side houses' },
    { id: 'p30', g: 'kan', pl: 'Kanchanaburi, Tajlandia ’24 — Wat Tham Suea', en: 'Kanchanaburi, Thailand ’24 — Wat Tham Suea' },
    { id: 'p31', g: 'kan', pl: 'Sai Yok, Tajlandia ’24 — wodospad Sai Yok Noi', en: 'Sai Yok, Thailand ’24 — Sai Yok Noi falls' },
    { id: 'p32', g: 'cr', pl: 'Chiang Rai, Tajlandia ’24 — Niebieska Świątynia', en: 'Chiang Rai, Thailand ’24 — Blue Temple' },
    { id: 'p33', g: 'cr', pl: 'Chiang Rai, Tajlandia ’24 — Biała Świątynia', en: 'Chiang Rai, Thailand ’24 — White Temple' },
    { id: 'p34', g: 'mek', pl: 'Pakbeng, Laos ’24 — przystanek nad Mekongiem', en: 'Pakbeng, Laos ’24 — stop along the Mekong' },
    { id: 'p35', g: 'mek', pl: 'Rzeka Mekong, Laos ’24 — rejs do Luang Prabang', en: 'Mekong River, Laos ’24 — boat to Luang Prabang' },
    { id: 'p36', g: 'ks', pl: 'Kuang Si, Laos ’24 — turkusowe kaskady', en: 'Kuang Si, Laos ’24 — turquoise cascades' },
    { id: 'p37', g: 'ks', pl: 'Kuang Si, Laos ’24 — dżungla przy wodospadzie', en: 'Kuang Si, Laos ’24 — jungle by the falls' },
    { id: 'p38', g: 'lp', pl: 'Luang Prabang, Laos ’24 — procesja o świcie', en: 'Luang Prabang, Laos ’24 — dawn alms ritual' },
    { id: 'p39', g: 'nk', pl: 'Nong Khiaw, Laos ’24 — dolina rzeki Nam Ou', en: 'Nong Khiaw, Laos ’24 — Nam Ou river valley' },
    { id: 'p40', g: 'nk', pl: 'Nong Khiaw, Laos ’24 — zmierzch nad górami', en: 'Nong Khiaw, Laos ’24 — dusk over the peaks' },
    { id: 'p41', g: 'nk', pl: 'Nong Khiaw, Laos ’24 — wieczór nad Nam Ou', en: 'Nong Khiaw, Laos ’24 — evening on the Nam Ou' },
    { id: 'p42', g: 'nk', pl: 'Nong Khiaw, Laos ’24 — szczyt ponad chmurami', en: 'Nong Khiaw, Laos ’24 — viewpoint above town' },
    { id: 'p43', g: 'vv', pl: 'Nam Xay, Vang Vieng ’24 — na skalnej iglicy', en: 'Nam Xay, Vang Vieng ’24 — on the karst peak' },
    { id: 'p44', g: 'vv', pl: 'Vang Vieng, Laos ’24 — lot motoparalotnią', en: 'Vang Vieng, Laos ’24 — paramotor flight' },
    { id: 'p45', g: 'kl', pl: 'Khao Lak, Tajlandia ’24 — Muay Thai na plaży', en: 'Khao Lak, Thailand ’24 — beach Muay Thai' },
    { id: 'p46', g: 'sto', pl: 'Sztokholm, Szwecja ’26 — widok na Djurgården', en: 'Stockholm, Sweden ’26 — view of Djurgården' },
    { id: 'p47', g: 'ks', pl: 'Kuang Si, Laos ’24 — wodospad z lotu ptaka', en: 'Kuang Si, Laos ’24 — waterfall from above' },
    { id: 'p48', g: 'nk', pl: 'Nong Khiaw, Laos ’24 — przełom rzeki Nam Ou', en: 'Nong Khiaw, Laos ’24 — Nam Ou river gorge' },
    { id: 'p49', g: 'vv', pl: 'Vang Vieng, Laos ’24 — zachód za krasami', en: 'Vang Vieng, Laos ’24 — sunset behind karsts' },
    { id: 'p50', g: 'ayu', pl: 'Ayutthaya, Tajlandia ’24 — Wat Ratchaburana', en: 'Ayutthaya, Thailand ’24 — Wat Ratchaburana' },
    { id: 'p51', g: 'ala', pl: 'Brändö, Alandy ’26 — szlak przez archipelag', en: 'Brändö, Åland ’26 — road through the islands' },
    { id: 'p52', g: 'lat', pl: 'Jūrkalne, Łotwa ’26 — biwak na klifie', en: 'Jūrkalne, Latvia ’26 — cliff camp by the sea' }
  ];

  // Shuffle helper that avoids repeating the same location group first
  function buildDeck() {
    var pool = PHOTOS.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    var primary = [];
    var overflow = [];
    var seenGroups = {};
    pool.forEach(function (item) {
      if (!seenGroups[item.g]) {
        seenGroups[item.g] = true;
        primary.push(item);
      } else {
        overflow.push(item);
      }
    });
    return primary.concat(overflow);
  }

  var deck = buildDeck();
  var deckCursor = 0;

  function nextPhoto() {
    if (deckCursor >= deck.length) {
      deck = buildDeck();
      deckCursor = 0;
    }
    return deck[deckCursor++];
  }

  function createPolaroid(slotClass, rotDeg, alignClass) {
    var item = nextPhoto();
    var fig = document.createElement('figure');
    fig.className = 'bg-polaroid ' + slotClass + (alignClass ? ' ' + alignClass : '');
    fig.style.setProperty('--rot', rotDeg + 'deg');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', (lang === 'en' ? 'Travel photo: ' : 'Zdjęcie z podróży: ') + item[lang]);

    var img = document.createElement('img');
    img.src = '/assets/polaroids/' + item.id + '.webp';
    img.alt = item[lang];
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 260;
    img.height = 195;

    var cap = document.createElement('figcaption');
    var spanText = document.createElement('span');
    spanText.className = 'pol-text';
    spanText.textContent = item[lang];

    var spanCycle = document.createElement('span');
    spanCycle.className = 'pol-cycle';
    spanCycle.setAttribute('aria-hidden', 'true');
    spanCycle.title = lang === 'en' ? 'Click for another photo' : 'Kliknij, aby wylosować inne zdjęcie';
    spanCycle.textContent = '↻';

    cap.appendChild(spanText);
    cap.appendChild(spanCycle);
    fig.appendChild(img);
    fig.appendChild(cap);

    function swapPhoto() {
      var next = nextPhoto();
      fig.classList.add('is-swapping');
      var nextImg = new Image();
      nextImg.onload = function () {
        img.src = nextImg.src;
        img.alt = next[lang];
        spanText.textContent = next[lang];
        fig.setAttribute('aria-label', (lang === 'en' ? 'Travel photo: ' : 'Zdjęcie z podróży: ') + next[lang]);
        fig.classList.remove('is-swapping');
      };
      nextImg.src = '/assets/polaroids/' + next.id + '.webp';
    }

    var isTouch = window.matchMedia('(hover: none)').matches;
    fig.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isTouch && !fig.classList.contains('is-active')) {
        document.querySelectorAll('.bg-polaroid.is-active').forEach(function (other) {
          if (other !== fig) other.classList.remove('is-active');
        });
        fig.classList.add('is-active');
      } else {
        swapPhoto();
      }
    });

    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        swapPhoto();
      }
    });

    return fig;
  }

  document.addEventListener('click', function () {
    document.querySelectorAll('.bg-polaroid.is-active').forEach(function (el) {
      el.classList.remove('is-active');
    });
  });

  function mountSingle(selector, slotClass, rotDeg, alignClass) {
    var host = document.querySelector(selector);
    if (!host) return;
    host.classList.add('has-polaroids');
    host.appendChild(createPolaroid(slotClass, rotDeg, alignClass));
  }

  function mountPair(selector, slotA, rotA, slotB, rotB) {
    var host = document.querySelector(selector);
    if (!host) return;
    host.classList.add('has-polaroids');
    var tray = document.createElement('div');
    tray.className = 'pol-mobile-tray';
    tray.appendChild(createPolaroid(slotA, rotA, ''));
    tray.appendChild(createPolaroid(slotB, rotB, ''));
    host.appendChild(tray);
  }

  // Home page slots
  mountSingle('.intro', 'pol-slot-intro-1', 4.2, '');
  mountSingle('.intro', 'pol-slot-intro-2', -3.6, '');
  mountSingle('.intro', 'pol-slot-intro-3', 2.8, '');
  mountSingle('#work', 'pol-slot-work-1', -3.4, '');
  mountPair('#work', 'pol-slot-work-2', 3.5, 'pol-slot-work-3', -2.9);
  mountSingle('#numbers .offset', 'pol-slot-numbers-1', -3.8, '');
  mountSingle('#numbers .offset', 'pol-slot-numbers-2', 3.4, '');
  mountSingle('#about .about-strip', 'pol-slot-about', 3.1, '');
  mountPair('#about', 'pol-slot-scene-1', -3.6, 'pol-slot-scene-2', 3.2);
  mountSingle('#help .offset', 'pol-slot-help-1', -3.4, '');
  mountPair('#help .offset', 'pol-slot-help-2', 3.7, 'pol-slot-help-3', -2.8);
  mountSingle('#links .offset', 'pol-slot-links-1', 3.2, '');
  mountSingle('#links .offset', 'pol-slot-links-2', -3.5, '');
  mountSingle('#contact .contact-grid', 'pol-slot-contact-1', -2.9, '');
  mountSingle('#contact .contact-grid', 'pol-slot-contact-2', 3.3, '');

  // About page slots
  mountSingle('.bio', 'pol-slot-bio-1', -3.5, '');
  mountPair('.bio', 'pol-slot-bio-2', 3.2, 'pol-slot-bio-3', -2.8);
  mountSingle('.bio', 'pol-slot-bio-4', 3.6, '');
  var bioStrip = document.querySelector('.bio-polaroid-strip');
  if (bioStrip) {
    [-3.2, 2.4, -2.6].forEach(function (rot, idx) {
      bioStrip.appendChild(createPolaroid('pol-slot-biostrip-' + (idx + 1), rot, ''));
    });
  }

  // Project detail page slots
  mountPair('.detail-story', 'pol-slot-detail-1', -3.3, 'pol-slot-detail-2', 3.1);

  // One-tap Copy Email button next to main contact links
  var mailLinks = document.querySelectorAll('#contact .text-link[href^="mailto:"], .plain-contact .quiet-link[href^="mailto:"]');
  mailLinks.forEach(function (link) {
    if (!navigator.clipboard) return;
    var row = document.createElement('div');
    row.className = 'email-row';
    link.parentNode.insertBefore(row, link);
    row.appendChild(link);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-email-btn';
    var defaultLabel = lang === 'en' ? 'Copy email' : 'Kopiuj adres';
    var copiedLabel = lang === 'en' ? 'Copied ✓' : 'Skopiowano ✓';
    btn.textContent = defaultLabel;

    btn.addEventListener('click', function () {
      navigator.clipboard.writeText('stuczynski.g@gmail.com').then(function () {
        btn.textContent = copiedLabel;
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = defaultLabel;
          btn.classList.remove('is-copied');
        }, 2200);
      });
    });

    row.appendChild(btn);
  });
})();
