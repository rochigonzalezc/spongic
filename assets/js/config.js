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
  whatsapp: '5491156451945',

  instagram: 'https://www.instagram.com/spongic.arg',
  email: 'hola@spongic.com.ar',

  /* ---- ENVÍOS ------------------------------------------------------------
     `envioGratisDesde`: monto a partir del cual el envío es sin cargo.
     En null porque hoy el envío es gratis en CABA y GBA sin monto mínimo:
     una barra de progreso hacia un mínimo que no existe sólo confunde.
  ------------------------------------------------------------------------ */
  envioGratisDesde: null,
  zonaEnvio: 'Envío gratis en CABA y GBA. Al resto del país lo coordinamos por WhatsApp.',

  /* ---- PACKS -------------------------------------------------------------
     precio        : lo que se cobra hoy
     precioAnterior: precio tachado — acá es lo que saldría comprando sueltas
                     a $1.800 la unidad, así el ahorro se ve solo
     destacado     : true en UNO solo, es el que se resalta
  ------------------------------------------------------------------------ */
  packs: [
    {
      id: 'pack-3',
      nombre: 'Pack x3',
      unidades: 3,
      bajada: 'Para arrancar',
      precio: 4800,
      precioAnterior: 5400,
      destacado: false,
      beneficios: ['3 esponjas Spongic', 'Ahorrás $600']
    },
    {
      id: 'pack-6',
      nombre: 'Pack x6',
      unidades: 6,
      bajada: 'El más elegido',
      precio: 8400,
      precioAnterior: 10800,
      destacado: true,
      beneficios: ['6 esponjas Spongic', 'Ahorrás $2.400']
    },
    {
      id: 'pack-12',
      nombre: 'Pack x12',
      unidades: 12,
      bajada: 'Stock para todo el año',
      precio: 15000,
      precioAnterior: 21600,
      destacado: false,
      beneficios: ['12 esponjas Spongic', 'Ahorrás $6.600']
    }
  ],

  /* ---- MONEDA ------------------------------------------------------------ */
  moneda: { simbolo: '$', codigo: 'ARS', locale: 'es-AR' }
};
