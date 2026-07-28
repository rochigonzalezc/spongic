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

El logotipo, el personaje y el sello son los **archivos originales de la marca**.

| Archivo | Qué es | Dónde aparece |
|---|---|---|
| `logo.png` | Logotipo solo | Nav, tabla comparativa, envase, footer |
| `logo-lockup.png` | Logotipo + "Esponja Inteligente" | Hero |
| `mascota.png` | El personaje | Hero y envase |
| `sello.png` | "Apretá y probá" | Hero |
| `moldeable.png` · `duradera.png` · `termosensible.png` | Las tres esponjas | Una en cada tarjeta de "Top 3 razones" |
| `favicon-32.png` / `favicon-180.png` | Ícono de pestaña y de iOS | Recortados del personaje |

Los archivos tal como se subieron quedaron en `assets/img/originales/`, en
resolución completa. Los que usa la página están recortados al contenido y
reducidos a tamaño de uso — si necesitás regenerarlos, salen de ahí.

Las tres esponjas venían sobre fondo azul y con la palabra abajo. Se les quitó
el fondo, se recortó el texto y se redujo la paleta: pasaron de 4,1 MB entre las
tres a 83 KB, sin diferencia visible al tamaño en que se muestran. Si querés
cambiarlas, subí las nuevas y avisá — el recorte no es manual, sale de un script.

Las tres tienen proporciones distintas, así que en las tarjetas se igualan por
altura (`--alto` en `.card__icon`) para que se vean del mismo tamaño.

**Sobre el halo blanco:** el logotipo tiene contorno azul, así que sobre los
fondos azules del sitio necesita despegarse. La clase `.sticker` le agrega un
contorno blanco nítido, el mismo recurso que usa la marca en sus stickers. Si
alguna vez ponés el logo sobre fondo claro, sacale esa clase.

**Lo único que sigue siendo una recreación es el envase**: el componente
`.packshot` está dibujado con CSS. Cuando tengas una foto del producto sobre
fondo claro, reemplazá todo el bloque `<figure class="packshot">` de
`index.html` por `<img src="assets/img/pack.jpg" alt="Pack de Spongic">`. Una
foto real es la mejor inversión que le queda a esta página.

---

## Detalles técnicos

- Sin dependencias, sin build. Una sola fuente externa (Google Fonts).
- Responsive de 320px para arriba, verificado sin scroll horizontal.
- Navegable por teclado: el carrito atrapa el foco y cierra con `Escape`.
- Respeta `prefers-reduced-motion`: quien tenga animaciones reducidas en su
  sistema no ve burbujas ni movimiento.
