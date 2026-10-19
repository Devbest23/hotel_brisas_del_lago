// Preguntas frecuentes (contenido mock editable — ver docs/contenido.md).
// Se muestran en la landing y alimentan el JSON-LD de tipo FAQPage.

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    id: 'faq-checkin',
    question: '¿Cuáles son los horarios de check-in y check-out?',
    answer:
      'El check-in es a partir de las 3:00 p.m. y el check-out hasta las 12:00 p.m. (mediodía). Si llegas antes, podemos guardar tu equipaje sin costo mientras disfrutas de la terraza.',
  },
  {
    id: 'faq-pago',
    question: '¿Qué formas de pago aceptan?',
    answer:
      'Aceptamos efectivo (USD), transferencia bancaria, pago móvil y Zelle. La tarifa se paga al confirmar la reserva o al llegar al hotel; nunca te pediremos datos de tarjeta por este sitio web.',
  },
  {
    id: 'faq-cargo',
    question: '¿Me cobran ahora al enviar la solicitud?',
    answer:
      'No. Enviar la solicitud no tiene ningún cargo. Primero verificamos disponibilidad y te contactamos por WhatsApp o correo (en horario hábil) para confirmar fechas y tarifa final.',
  },
  {
    id: 'faq-cancelacion',
    question: '¿Puedo cancelar mi reserva?',
    answer:
      'Sí, sin penalidad hasta 48 horas antes del check-in. Solo escríbenos por WhatsApp o correo y liberamos las fechas de inmediato.',
  },
  {
    id: 'faq-mascotas',
    question: '¿Aceptan mascotas?',
    answer:
      'Aceptamos mascotas pequeñas (hasta 10 kg) bajo consulta previa, en habitaciones de planta baja. Escríbenos antes de reservar para preparar todo para tu compañero.',
  },
  {
    id: 'faq-ninos',
    question: '¿Los niños pagan estadía?',
    answer:
      'Los menores de 6 años se alojan gratis compartiendo con sus padres. Contamos con cunas disponibles sin costo (sujetas a disponibilidad) y menú infantil en el restaurante.',
  },
]
