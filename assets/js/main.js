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
      faqEnvio.textContent = 'Sí, hacemos envíos: ' + CFG.zonaEnvio +
        '. Escribinos por WhatsApp y coordinamos la entrega según tu zona.';
    }
  }

  /* ------------------------------------------------------------- burbujas */

  function bubbles() {
    var host = $('.hero__bubbles');
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 16; i++) {
      var b = document.createElement('i');
      var size = 10 + Math.random() * 54;
      b.style.width = b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = (11 + Math.random() * 14) + 's';
      b.style.animationDelay = (-Math.random() * 20) + 's';
      frag.appendChild(b);
    }
    host.appendChild(frag);
  }

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

  /* --------------------------------------- esponja del hero: apretá y probá */

  function apretaEsponja() {
    var btn   = $('#apreta');
    var gotas = $('#apretaGotas');
    var pista = $('#apretaPista');
    if (!btn) return;

    var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tocada = false;
    var timer;

    function salpicar() {
      // ráfaga de gotas en abanico hacia arriba
      var n = 7 + Math.floor(Math.random() * 4);
      for (var i = 0; i < n; i++) {
        var g = document.createElement('i');
        var ang = (-160 + Math.random() * 140) * Math.PI / 180;
        var dist = 85 + Math.random() * 105;
        g.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
        g.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
        g.style.setProperty('--s', (11 + Math.random() * 11).toFixed(1) + 'px');
        g.style.setProperty('--t', (0.6 + Math.random() * 0.45).toFixed(2) + 's');
        gotas.appendChild(g);
        g.addEventListener('animationend', function () { this.remove(); });
      }
    }

    function apretar() {
      if (btn.classList.contains('is-on')) return;   // sin re-disparar a mitad
      btn.classList.add('is-on');
      if (!quieto) salpicar();
      setTimeout(function () { btn.classList.remove('is-on'); }, 680);
    }

    function usada() {
      if (tocada) return;
      tocada = true;
      clearTimeout(timer);
      if (pista) pista.classList.add('se-va');
    }

    btn.addEventListener('pointerdown', function () { usada(); apretar(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); usada(); apretar(); }
    });

    // si nadie la toca, se aprieta sola un par de veces para enseñar el gesto
    if (!quieto) {
      var demos = 0;
      (function autodemo() {
        timer = setTimeout(function () {
          if (tocada) return;
          apretar();
          if (++demos < 3) autodemo();
        }, demos === 0 ? 2600 : 5200);
      })();
    } else if (pista) {
      pista.classList.add('se-va');
    }
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

      // color: frío -> amarillo pálido/verdoso; caliente -> naranja cálido
      var a = 'hsl(' + (54 - 26 * p) + ' 100% ' + (66 - 6 * p) + '%)';
      var b = 'hsl(' + (46 - 30 * p) + ' 92% ' + (52 - 6 * p) + '%)';
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
        '<button class="btn ' + (p.destacado ? 'btn--primary' : '') + ' btn--block" data-add="' + p.id + '">' +
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

    $('#checkoutBtn').addEventListener('click', function () {
      if (totals().items === 0) return;
      window.open(waLink(checkoutText()), '_blank', 'noopener');
    });
  }

  /* ----------------------------------------------------------------- init */

  function init() {
    wireConfigLinks();
    bubbles();
    nav();
    apretaEsponja();
    demo();
    renderPacks();
    wireDrawer();
    renderCart();
    reveals(); // después de renderPacks para observar las cards nuevas
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
