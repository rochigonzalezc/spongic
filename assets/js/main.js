/* ==========================================================================
   SPONGIC — Lógica de la landing
   Sin dependencias. Todo lo configurable vive en config.js
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SPONGIC_CONFIG || {};
  var PACKS = CFG.packs || [];
  var STORAGE_KEY = 'spongic.cart.v1';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- utils */

  function money(n) {
    var m = CFG.moneda || {};
    try {
      return new Intl.NumberFormat(m.locale || 'es-AR', {
        style: 'currency',
        currency: m.codigo || 'ARS',
        maximumFractionDigits: 0
      }).format(n);
    } catch (e) {
      return (m.simbolo || '$') + n.toLocaleString('es-AR');
    }
  }

  function waLink(text) {
    var num = (CFG.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + num + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2400);
  }

  /* ------------------------------------------------------- links de config */

  function wireConfigLinks() {
    $$('[data-cfg-href]').forEach(function (a) {
      var kind = a.dataset.cfgHref;
      if (kind === 'instagram') {
        a.href = CFG.instagram || '#';
      } else if (kind === 'whatsapp') {
        a.href = waLink('¡Hola Spongic! Quería hacerles una consulta 👋');
      } else if (kind === 'email') {
        a.href = 'mailto:' + (CFG.email || '');
      }
    });

    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    var nota = $('#envioNota');
    if (nota) {
      nota.textContent = CFG.envioGratisDesde
        ? 'Envío sin cargo en compras desde ' + money(CFG.envioGratisDesde) + '. ' + (CFG.zonaEnvio || '')
        : (CFG.zonaEnvio || '');
    }

    var faqEnvio = $('#faqEnvio');
    if (faqEnvio && CFG.zonaEnvio) {
      // zonaEnvio ya viene como frase entera, así que se antepone el sí y listo
      faqEnvio.textContent = 'Sí, hacemos envíos. ' + CFG.zonaEnvio;
    }
  }

  /* ------------------------------------------------------------- burbujas */

  function heroBlobs() {
    var host = $('.hero-blobs');
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['rgba(240,180,41,.55)', 'rgba(232,117,44,.4)', 'rgba(185,196,232,.45)', 'rgba(240,180,41,.35)'];
    var frag = document.createDocumentFragment();
    colors.forEach(function (c, i) {
      var b = document.createElement('i');
      var size = 220 + Math.random() * 200;
      b.style.width = b.style.height = size + 'px';
      b.style.left = (Math.random() * 90) + '%';
      b.style.top = (10 + Math.random() * 70) + '%';
      b.style.background = c;
      b.style.animationDuration = (12 + Math.random() * 9) + 's';
      b.style.animationDelay = (-Math.random() * 10) + 's';
      frag.appendChild(b);
    });
    host.appendChild(frag);
  }

  function packsBlobs() {
    var host = $('.packs-blobs');
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['rgba(232,117,44,.55)', 'rgba(240,180,41,.42)', 'rgba(185,196,232,.4)'];
    var frag = document.createDocumentFragment();
    colors.forEach(function (c, i) {
      var b = document.createElement('i');
      var size = 300 + Math.random() * 180;
      b.style.width = b.style.height = size + 'px';
      b.style.left = (8 + i * 33 + Math.random() * 12) + '%';
      b.style.top = (10 + Math.random() * 65) + '%';
      b.style.background = c;
      b.style.animationDuration = (13 + Math.random() * 9) + 's';
      b.style.animationDelay = (-Math.random() * 10) + 's';
      frag.appendChild(b);
    });
    host.appendChild(frag);
  }

  /* --------------------------------------------------------- mascota camina
     Entra caminando desde el borde del hero; al terminar la animación de
     traslado (walkAcross) pasa de "caminando" a "llegó", que es lo que
     dispara el brazo levantado señalando el CTA. Solo desktop. */

  /* -------------------------------------------------------------- reveals */

  function reveals() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ nav */

  function nav() {
    var el = $('#nav');
    var onScroll = function () {
      el.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // marcar link activo según sección visible
    var links = $$('.nav__links a');
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          if (map[e.target.id]) map[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ----------------------------------------- poros de la esponja de la demo */

  function porosEsponja() {
    var svg = $('#spongePores');
    if (!svg) return;

    var W = 142, H = 100;
    var puestos = [];
    var ns = 'http://www.w3.org/2000/svg';

    // mezcla de calibres: muchos chicos, algunos medianos, pocos grandes
    var calibres = [
      { n: 130, min: 0.6, max: 1.4 },
      { n: 46,  min: 1.5, max: 2.6 },
      { n: 14,  min: 2.8, max: 4.2 }
    ];

    function libre(x, y, r) {
      for (var i = 0; i < puestos.length; i++) {
        var p = puestos[i];
        var dx = p.x - x, dy = p.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < p.r + r + 0.8) return false;
      }
      return true;
    }

    var frag = document.createDocumentFragment();

    // de grande a chico: los grandes necesitan el lugar libre
    for (var c = calibres.length - 1; c >= 0; c--) {
      var cal = calibres[c];
      for (var i = 0, intentos = 0; i < cal.n && intentos < cal.n * 30; intentos++) {
        var r = cal.min + Math.random() * (cal.max - cal.min);
        var x = r + Math.random() * (W - r * 2);
        var y = r + Math.random() * (H - r * 2);
        if (!libre(x, y, r)) continue;
        puestos.push({ x: x, y: y, r: r });
        i++;

        var poro = document.createElementNS(ns, 'circle');
        poro.setAttribute('cx', x.toFixed(2));
        poro.setAttribute('cy', y.toFixed(2));
        poro.setAttribute('r', r.toFixed(2));
        poro.setAttribute('fill', 'rgba(138,88,0,' + (0.34 + Math.random() * 0.28).toFixed(2) + ')');
        frag.appendChild(poro);

        // Los medianos y grandes llevan una luz tenue abajo a la derecha: es
        // el fondo del agujero recibiendo luz. Arriba a la izquierda los haría
        // ver como burbujas salientes en lugar de huecos.
        if (r > 1.5) {
          var luz = document.createElementNS(ns, 'circle');
          luz.setAttribute('cx', (x + r * 0.26).toFixed(2));
          luz.setAttribute('cy', (y + r * 0.3).toFixed(2));
          luz.setAttribute('r', (r * 0.44).toFixed(2));
          luz.setAttribute('fill', 'rgba(255,246,190,.28)');
          frag.appendChild(luz);
        }
      }
    }
    svg.appendChild(frag);
  }

  /* ------------------------------------------------- demo termosensible */

  function demo() {
    var range = $('#tempRange');
    var out   = $('#tempOut');
    var state = $('#tempState');
    var sponge= $('#sponge');
    var steam = $('.demo__steam');
    if (!range) return;

    function paint() {
      var t = +range.value;
      var p = (t - +range.min) / (+range.max - +range.min); // 0..1

      out.textContent = t + '°';
      sponge.style.setProperty('--soft', p.toFixed(3));

      // Vira de amarillo frío a ámbar cálido. El giro es corto a propósito:
      // llevándolo hasta el naranja dejaba de parecerse a la esponja real.
      var a = 'hsl(' + (54 - 12 * p) + ' 100% ' + (66 - 4 * p) + '%)';
      var b = 'hsl(' + (46 - 16 * p) + ' 92% ' + (52 - 4 * p) + '%)';
      sponge.style.setProperty('--sponge-a', a);
      sponge.style.setProperty('--sponge-b', b);

      var label, desc;
      if (t < 22)      { label = 'Firme';      desc = 'máximo agarre para lo pegado'; }
      else if (t < 38) { label = 'Flexible';   desc = 'el punto justo para el día a día'; }
      else if (t < 52) { label = 'Suave';      desc = 'ideal para platos y vasos'; }
      else             { label = 'Ultrasuave'; desc = 'para copas y antiadherentes'; }
      state.innerHTML = '<strong>' + label + '</strong> — ' + desc;

      steam.classList.toggle('is-on', t >= 45);
    }

    range.addEventListener('input', paint);
    paint();

    // apretá y probá
    var squishTimer;
    function squish() {
      sponge.classList.add('is-squished');
      clearTimeout(squishTimer);
      squishTimer = setTimeout(function () {
        sponge.classList.remove('is-squished');
      }, 260);
    }
    sponge.addEventListener('pointerdown', squish);
    sponge.addEventListener('click', function (e) { e.preventDefault(); });
    sponge.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); squish(); }
    });
  }

  /* ------------------------------------------------------------- carrito */

  var cart = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      // descartar ids que ya no existen en config
      var clean = {};
      Object.keys(data).forEach(function (id) {
        if (PACKS.some(function (p) { return p.id === id; }) && data[id] > 0) {
          clean[id] = Math.min(99, data[id] | 0);
        }
      });
      return clean;
    } catch (e) { return {}; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function packById(id) {
    return PACKS.filter(function (p) { return p.id === id; })[0];
  }

  function totals() {
    var items = 0, sum = 0;
    Object.keys(cart).forEach(function (id) {
      var p = packById(id);
      if (!p) return;
      items += cart[id];
      sum += p.precio * cart[id];
    });
    return { items: items, sum: sum };
  }

  function add(id) {
    cart[id] = (cart[id] || 0) + 1;
    save(); renderCart();
    var p = packById(id);
    toast((p ? p.nombre : 'Producto') + ' agregado al carrito');
    popCount();
  }

  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(99, q);
    save(); renderCart();
  }

  function popCount() {
    var c = $('#cartCount');
    c.classList.add('pop');
    setTimeout(function () { c.classList.remove('pop'); }, 300);
  }

  function renderPacks() {
    var grid = $('#packsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    PACKS.forEach(function (p) {
      var art = document.createElement('article');
      art.className = 'pack reveal' + (p.destacado ? ' pack--featured' : '');
      art.setAttribute('role', 'listitem');

      var unit = p.unidades > 1
        ? money(Math.round(p.precio / p.unidades)) + ' por unidad'
        : '1 unidad';

      art.innerHTML =
        (p.destacado ? '<span class="pack__tag">Más elegido</span>' : '') +
        '<h3 class="pack__name">' + p.nombre + '</h3>' +
        '<p class="pack__bajada">' + (p.bajada || '') + '</p>' +
        '<div class="pack__price">' +
          '<span class="pack__now">' + money(p.precio) + '</span>' +
          (p.precioAnterior ? '<span class="pack__was">' + money(p.precioAnterior) + '</span>' : '') +
        '</div>' +
        '<p class="pack__unit">' + unit + '</p>' +
        '<ul class="pack__list">' +
          (p.beneficios || []).map(function (b) { return '<li>' + b + '</li>'; }).join('') +
        '</ul>' +
        '<button class="btn btn--primary btn--block" data-add="' + p.id + '">' +
          'Agregar al carrito' +
        '</button>';

      grid.appendChild(art);
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (btn) add(btn.dataset.add);
    });
  }

  function renderCart() {
    var t = totals();

    // contador del nav
    var count = $('#cartCount');
    count.textContent = t.items;
    count.dataset.empty = t.items === 0 ? 'true' : 'false';

    var body  = $('#cartItems');
    var empty = $('#cartEmpty');
    var foot  = $('#cartFoot');
    var ship  = $('#shipBar');

    body.innerHTML = '';

    if (t.items === 0) {
      empty.hidden = false;
      foot.hidden = true;
      ship.hidden = true;
      body.hidden = true;
      return;
    }

    empty.hidden = true;
    foot.hidden = false;
    body.hidden = false;

    Object.keys(cart).forEach(function (id) {
      var p = packById(id);
      if (!p) return;
      var q = cart[id];

      var row = document.createElement('div');
      row.className = 'citem';
      row.innerHTML =
        '<div class="citem__thumb">x' + p.unidades + '</div>' +
        '<div>' +
          '<p class="citem__name">' + p.nombre + '</p>' +
          '<p class="citem__meta">' + p.unidades + ' esponja' + (p.unidades > 1 ? 's' : '') +
            ' · ' + money(p.precio) + ' el pack</p>' +
        '</div>' +
        '<div class="citem__right">' +
          '<span class="citem__price">' + money(p.precio * q) + '</span>' +
          '<span class="qty">' +
            '<button data-dec="' + id + '" aria-label="Quitar uno de ' + p.nombre + '">−</button>' +
            '<span aria-live="polite">' + q + '</span>' +
            '<button data-inc="' + id + '" aria-label="Agregar uno de ' + p.nombre + '">+</button>' +
          '</span>' +
        '</div>';
      body.appendChild(row);
    });

    $('#cartTotal').textContent = money(t.sum);

    // el pedido viaja en el href del enlace, así el clic navega sin JS de por medio
    $('#checkoutBtn').href = waLink(checkoutText());

    // barra de envío gratis
    if (CFG.envioGratisDesde) {
      ship.hidden = false;
      var falta = CFG.envioGratisDesde - t.sum;
      var pct = Math.min(100, (t.sum / CFG.envioGratisDesde) * 100);
      $('#shipFill').style.width = pct + '%';
      $('#shipMsg').innerHTML = falta > 0
        ? 'Te faltan <strong>' + money(falta) + '</strong> para el envío sin cargo'
        : '🎉 <strong>¡Tenés envío sin cargo!</strong>';
    } else {
      ship.hidden = true;
    }
  }

  function checkoutText() {
    var t = totals();
    var lines = ['¡Hola Spongic! Quiero hacer este pedido:', ''];
    Object.keys(cart).forEach(function (id) {
      var p = packById(id);
      if (!p) return;
      lines.push('• ' + cart[id] + 'x ' + p.nombre +
                 ' (' + p.unidades + ' u.) — ' + money(p.precio * cart[id]));
    });
    lines.push('');
    lines.push('Total: ' + money(t.sum));
    lines.push('');
    lines.push('¿Cómo seguimos con el envío y el pago?');
    return lines.join('\n');
  }

  /* -------------------------------------------------------------- drawer */

  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    // el toast taparía el botón de checkout en pantallas chicas
    clearTimeout(toastTimer);
    $('#toast').classList.remove('is-on');
    var d = $('#drawer'), b = $('#drawerBackdrop');
    b.hidden = false;
    requestAnimationFrame(function () { b.classList.add('is-open'); });
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#drawerClose').focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeDrawer() {
    var d = $('#drawer'), b = $('#drawerBackdrop');
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    b.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    setTimeout(function () { b.hidden = true; }, 380);
    if (lastFocus) lastFocus.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    // trap de foco
    var d = $('#drawer');
    var f = $$('button, [href], input, select, textarea', d)
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function wireDrawer() {
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawerBackdrop').addEventListener('click', closeDrawer);

    $('#emptyCta').addEventListener('click', function () {
      closeDrawer();
      document.getElementById('packs').scrollIntoView({ behavior: 'smooth' });
    });

    $('#cartItems').addEventListener('click', function (e) {
      var inc = e.target.closest('[data-inc]');
      var dec = e.target.closest('[data-dec]');
      if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
      if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
    });

    // el href se rearma en cada cambio del carrito, dentro de renderCart()
  }

  /* ------------------------------------------------------- espina térmica
     Riesgo estético: el eje frío→caliente deja de vivir solo en el demo de
     "Cómo funciona" y pasa a ser el hilo de TODA la navegación. Una barra
     fija a la izquierda se llena con el scroll, del navy frío al naranja
     caliente — la misma idea del producto, a escala de sitio entero. */
  function thermoSpine() {
    if (window.matchMedia('(max-width: 760px)').matches) return; // se guarda espacio en mobile
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var el = document.createElement('div');
    el.className = 'thermo-spine';
    el.innerHTML =
      '<span class="thermo-spine__label thermo-spine__label--top">Fría</span>' +
      '<span class="thermo-spine__track">' +
        '<span class="thermo-spine__fill" id="thermoFill"></span>' +
        '<span class="thermo-spine__dot" id="thermoDot"></span>' +
      '</span>' +
      '<span class="thermo-spine__label thermo-spine__label--bottom">Caliente</span>';
    document.body.appendChild(el);

    var fill = $('#thermoFill', el);
    var dot  = $('#thermoDot', el);
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty('--temp', t.toFixed(3));
      fill.style.height = (t * 100) + '%';
      dot.style.top = (t * 100) + '%';
      ticking = false;
    }

    update();
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
  }

  /* --------------------------------------------------------- split-words
     Envuelve cada palabra de un elemento en spans para poder animarlas
     de a una. Recorre nodos de texto y respeta tags como <strong> que
     ya estén adentro (no rompe el énfasis del copy). */
  function wrapWords(node) {
    if (node.nodeType === 3) {
      var parts = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (part.trim() === '') {
          frag.appendChild(document.createTextNode(part));
        } else {
          var outer = document.createElement('span');
          outer.className = 'word';
          var inner = document.createElement('span');
          inner.className = 'word__inner';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1) {
      Array.prototype.slice.call(node.childNodes).forEach(wrapWords);
    }
  }

  function heroWords() {
    var el = $('.split-target');
    if (!el) return;
    wrapWords(el);
    $$('.word', el).forEach(function (w, i) { w.style.setProperty('--wi', i); });
    el.classList.add('split-ready');
  }

  /* ------------------------------------------------------- loader intro */
  function loaderIntro() {
    var lead = $('.split-target');
    var loader = $('#loader');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!loader || reduced) {
      if (lead) lead.classList.add('is-in');
      return;
    }
    setTimeout(function () {
      if (lead) lead.classList.add('is-in');
    }, 2900);
  }

  /* ------------------------------------------------------- flip de letras
     Cada letra del nav tiene dos caras superpuestas: la de relleno sólido
     (visible) y una de solo contorno (rotada 90° hacia atrás). En hover,
     la de relleno gira hacia arriba y sale, la de contorno gira y entra —
     con un delay creciente por letra para que sea una ola, no un click. */
  function letterFlip(selector) {
    $$(selector).forEach(function (a) {
      var text = a.textContent;
      a.textContent = '';
      var wrap = document.createElement('span');
      wrap.className = 'flip-letters';
      Array.prototype.forEach.call(text, function (ch, i) {
        var letter = document.createElement('span');
        letter.className = 'flip-letter';
        letter.style.setProperty('--li', i);
        var glyph = ch === ' ' ? '\u00A0' : ch;

        var front = document.createElement('span');
        front.className = 'flip-letter__face flip-letter__face--front';
        front.textContent = glyph;

        var back = document.createElement('span');
        back.className = 'flip-letter__face flip-letter__face--back';
        back.textContent = glyph;

        letter.appendChild(front);
        letter.appendChild(back);
        wrap.appendChild(letter);
      });
      a.appendChild(wrap);
      a.classList.add('flip-ready');
    });
  }

  /* ------------------------------------------------------- vidrio + paralaje
     Sigue el mouse dentro del elemento e inclina la tarjeta en 3D (--tx/--ty).
     Sin brillo que persiga el cursor: solo la inclinación. */
  function glassTilt(selector) {
    $$(selector).forEach(function (el) {
      el.classList.add('glass-tilt');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var tx = (0.5 - py) * 8;
        var ty = (px - 0.5) * 8;
        el.style.setProperty('--tx', tx.toFixed(2) + 'deg');
        el.style.setProperty('--ty', ty.toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--tx', '0deg');
        el.style.setProperty('--ty', '0deg');
      });
    });
  }

  /* ------------------------------------------- split-words disparado por scroll
     Igual que heroWords, pero para títulos que aparecen más abajo: se arma
     una vez y se dispara con IntersectionObserver, no con un timeout fijo. */
  function splitOnScroll(selector) {
    var els = $$(selector);
    if (!els.length) return;

    els.forEach(function (el) {
      wrapWords(el);
      $$('.word', el).forEach(function (w, i) { w.style.setProperty('--wi', i); });
      el.classList.add('split-ready');
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .4 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- cursor propio
     Círculo naranja que sigue el mouse con un pelín de lag (lerp), y al
     hacer click se achata como si se aplastara + una salpicadura orgánica
     que crece y se disuelve en el punto del click. */
  function customCursor() {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cur = $('#cursor');
    if (!cur) return;

    var x = -50, y = -50, cx = -50, cy = -50;

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      cur.classList.add('is-active');
    });
    document.addEventListener('mouseleave', function () { cur.classList.remove('is-active'); });

    function loop() {
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('mousedown', function (e) {
      cur.classList.add('is-down');
      var s = document.createElement('span');
      s.className = 'cursor-splash';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      document.body.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
    });
    document.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });
  }

  /* ----------------------------------------------------------------- init */

  function init() {
    wireConfigLinks();
    heroBlobs();
    packsBlobs();
    nav();
    porosEsponja();
    demo();
    renderPacks();
    glassTilt('.pack');
    wireDrawer();
    renderCart();
    thermoSpine();
    heroWords();
    loaderIntro();
    letterFlip('.nav__links a');
    glassTilt('.hero__cta .btn, .cta-final__actions .btn');
    splitOnScroll('.h2, .cta-final h2');
    customCursor();
    reveals(); // después de renderPacks para observar las cards nuevas
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
