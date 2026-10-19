// Testimonios de huéspedes (contenido mock editable — ver docs/contenido.md).

export interface Testimonial {
  id: string
  name: string
  origin: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't-01',
    name: 'María Fernanda R.',
    origin: 'Caracas, Venezuela',
    rating: 5,
    quote:
      'La habitación Vista Lago vale cada dólar: el atardecer desde el balcón es de postal. El desayuno, servido en la terraza, fue el detalle que nos enamoró.',
  },
  {
    id: 't-02',
    name: 'José Luis M.',
    origin: 'Maracaibo, Venezuela',
    rating: 5,
    quote:
      'Reservamos por WhatsApp un viernes y en dos horas ya teníamos todo confirmado. El bungalow sobre el agua es una experiencia que hay que vivir al menos una vez.',
  },
  {
    id: 't-03',
    name: 'Anna P.',
    origin: 'Bogotá, Colombia',
    rating: 4,
    quote:
      'Un hotel pequeño pero impecable. Nos encantó el paseo en kayak al amanecer y la atención del personal, siempre pendiente sin invadir.',
  },
]
