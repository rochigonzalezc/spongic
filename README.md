# Spongic — Landing page

Landing única para la venta de esponjas Spongic. HTML, CSS y JavaScript sin
dependencias ni build: se publica subiendo la carpeta tal cual.

```
index.html
assets/
  css/styles.css
  js/config.js   ← lo único que necesitás editar
  js/main.js
  img/favicon.svg
```

---

## 1. Lo primero: configurar tu número de WhatsApp

Abrí `assets/js/config.js` y cambiá esta línea:

```js
whatsapp: '5491100000000',
```

Formato: código de país + 9 + código de área **sin el 0** + número **sin el 15**,
todo junto y sin el `+`.

> Ejemplo — (11) 5555-4444 en Buenos Aires → `'5491155554444'`

Mientras no lo cambies, el botón de compra abre un chat con un número inexistente.

## 2. Cargar tus precios

En el mismo archivo, la lista `packs`. **Los precios que están hoy son de ejemplo**
y hay que reemplazarlos:

```js
{
  id: 'pack-3',            // no lo cambies: identifica el pack en el carrito
  nombre: 'Pack x3',
  unidades: 3,             // cuántas esponjas trae
  bajada: 'El favorito de las cocinas',
  precio: 9000,            // sin puntos ni símbolos
  precioAnterior: 10500,   // precio tachado, o null para no mostrarlo
  destacado: true,         // resalta la card — dejá true en uno solo
  beneficios: ['3 esponjas Spongic', 'Ahorrás un 14%']
}
```

Podés agregar o quitar packs de la lista; la página se arma sola. Si sumás uno
nuevo, dale un `id` único.

Otros valores editables ahí mismo: `instagram`, `email`, `envioGratisDesde`
(poné `null` para ocultar la barra de envío gratis) y `zonaEnvio`.

## 3. Publicar

No hace falta compilar nada. Cualquiera de estas opciones:

- **Netlify / Vercel** — arrastrá la carpeta al panel, o conectá el repo.
- **GitHub Pages** — Settings → Pages → publicar desde la rama.

Para probarlo en tu compu:

```bash
python3 -m http.server 8000
# abrí http://localhost:8000
```

Abrir `index.html` con doble clic también funciona, aunque conviene el servidor
local para que se comporte igual que en producción.

---

## Cómo funciona la compra

El carrito es real: se agregan packs, se cambian cantidades y el total se
recalcula. Queda guardado en el navegador (`localStorage`), así que si la persona
cierra la pestaña y vuelve, su pedido sigue ahí.

Al tocar **Confirmar por WhatsApp** se abre un chat con el pedido ya escrito:

```
¡Hola Spongic! Quiero hacer este pedido:

• 1x Pack x3 (3 u.) — $ 9.000
• 2x Unidad (1 u.) — $ 7.000

Total: $ 16.000

¿Cómo seguimos con el envío y el pago?
```

Envío y pago se coordinan en la conversación.

### Si más adelante querés cobrar en la página

Hoy no hay pago online, y no puede haberlo en una página estática: Mercado Pago
necesita un servidor para crear la preferencia de pago, porque el access token es
secreto y no puede vivir en el HTML (cualquiera lo vería).

El carrito ya está preparado para ese salto. En `assets/js/main.js`, la función
`checkoutText()` arma el pedido y el listener de `#checkoutBtn` decide qué hacer
con él. Para migrar a Mercado Pago se reemplaza ese listener por un `fetch` a tu
backend con los items del carrito, y se redirige al `init_point` que devuelve.
El resto de la página no se toca.

---

## Contenido

Los textos salen del packaging: la historia de Valentina y Bautista, los tres
atributos (moldeable, más duradera, termosensible) y los claims. Están escritos
directo en `index.html`, así que se editan ahí.

### Imágenes

El logotipo y la mascota están **recreados en SVG y CSS**, no son los archivos
originales. Se ven nítidos en cualquier pantalla y no dependen de imágenes
externas, pero si querés usar los originales:

- **Logotipo**: es texto con la clase `.wordmark`. La tipografía es Fredoka
  (Google Fonts) con contorno blanco y sombra azul aplicados por CSS. Para usar
  el logo real, reemplazá el `<span class="wordmark">` por un `<img>`.
- **Mascota**: el SVG está inline en el hero de `index.html`, buscá
  `class="mascot"`.
- **Foto del producto**: la página todavía no muestra una. Vale la pena sumar
  fotos reales del packaging en la sección de packs — venden más que cualquier
  ilustración.

---

## Detalles técnicos

- Sin dependencias, sin build. Una sola fuente externa (Google Fonts).
- Responsive de 320px para arriba, verificado sin scroll horizontal.
- Navegable por teclado: el carrito atrapa el foco y cierra con `Escape`.
- Respeta `prefers-reduced-motion`: quien tenga animaciones reducidas en su
  sistema no ve burbujas ni movimiento.
