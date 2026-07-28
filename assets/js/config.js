/* ==========================================================================
   SPONGIC — Configuración editable
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás tocar para cambiar precios,
   contacto y textos comerciales. No hace falta saber programar:
   cambiá lo que está entre comillas y guardá.
   ========================================================================== */

window.SPONGIC_CONFIG = {

  /* ---- CONTACTO ----------------------------------------------------------
     Número de WhatsApp en formato internacional, SIN el "+", sin espacios
     ni guiones. Argentina: 54 + 9 + código de área sin el 0 + número sin 15.
     Ej: (11) 5555-4444  ->  "5491155554444"
     ⚠️ REEMPLAZAR por el número real antes de publicar.
  ------------------------------------------------------------------------ */
  whatsapp: '5491100000000',

  instagram: 'https://www.instagram.com/spongic.arg',
  email: 'hola@spongic.com.ar',

  /* ---- ENVÍOS ------------------------------------------------------------
     `envioGratisDesde`: monto a partir del cual el envío es sin cargo.
     Poné null si no querés mostrar la barra de envío gratis.
  ------------------------------------------------------------------------ */
  envioGratisDesde: 25000,
  zonaEnvio: 'AMBA y envíos a todo el país',

  /* ---- PACKS -------------------------------------------------------------
     ⚠️ PRECIOS DE EJEMPLO — reemplazá por los tuyos.
     precio        : lo que se cobra hoy
     precioAnterior: precio tachado (poné null para no mostrarlo)
     destacado     : true en UNO solo, es el que se resalta
  ------------------------------------------------------------------------ */
  packs: [
    {
      id: 'pack-1',
      nombre: 'Unidad',
      unidades: 1,
      bajada: 'Para probarla y enamorarte',
      precio: 3500,
      precioAnterior: null,
      destacado: false,
      beneficios: ['1 esponja Spongic', 'Ideal para probar']
    },
    {
      id: 'pack-3',
      nombre: 'Pack x3',
      unidades: 3,
      bajada: 'El favorito de las cocinas',
      precio: 9000,
      precioAnterior: 10500,
      destacado: true,
      beneficios: ['3 esponjas Spongic', 'Ahorrás un 14%', 'Cocina, baño y repuesto']
    },
    {
      id: 'pack-6',
      nombre: 'Pack x6',
      unidades: 6,
      bajada: 'Stock para todo el año',
      precio: 16800,
      precioAnterior: 21000,
      destacado: false,
      beneficios: ['6 esponjas Spongic', 'Ahorrás un 20%', 'El mejor precio por unidad']
    }
  ],

  /* ---- MONEDA ------------------------------------------------------------ */
  moneda: { simbolo: '$', codigo: 'ARS', locale: 'es-AR' }
};
