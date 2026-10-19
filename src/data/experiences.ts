// Experiencias del hotel (contenido mock editable — ver docs/contenido.md).
// `icon` es una clave que las secciones mapean a un icono de Lucide.

export interface Experience {
  id: string
  title: string
  description: string
  priceNote: string
  icon: 'kayak' | 'sunset' | 'boat' | 'food'
  image: { src: string; alt: string }
}

export const experiences: Experience[] = [
  {
    id: 'exp-kayak',
    title: 'Kayak al amanecer',
    description:
      'Salida guiada en kayak por la bahía cuando el lago todavía está en calma. Incluye chaleco y guía local.',
    priceNote: 'Desde $15 por persona',
    icon: 'kayak',
    image: { src: '/images/experiences/kayak.jpg', alt: 'Kayak deslizándose sobre aguas tranquilas al amanecer' },
  },
  {
    id: 'exp-atardecer',
    title: 'Atardecer en el muelle',
    description:
      'La tradición del hotel: cocteles de la casa en el muelle mientras el sol cae sobre el lago. Incluido en tu estadía.',
    priceNote: 'Incluido',
    icon: 'sunset',
    image: { src: '/images/experiences/atardecer-muelle.jpg', alt: 'Atardecer dorado sobre el agua visto desde el muelle' },
  },
  {
    id: 'exp-tour',
    title: 'Paseo por el lago',
    description:
      'Recorrido en lancha por las orillas y palafitos cercanos, con paradas para nadar en aguas abiertas.',
    priceNote: 'Desde $25 por persona',
    icon: 'boat',
    image: { src: '/images/experiences/tour-lago.jpg', alt: 'Lancha navegando las aguas del lago durante el tour guiado' },
  },
  {
    id: 'exp-gastronomia',
    title: 'Ruta gastronómica zuliana',
    description:
      'Cena degustación con platos regionales: patacones, mojito en coco y pescado fresco del día.',
    priceNote: 'Desde $20 por persona',
    icon: 'food',
    image: { src: '/images/experiences/gastronomia.jpg', alt: 'Plato de comida marina fresco servido en la terraza del restaurante' },
  },
]
