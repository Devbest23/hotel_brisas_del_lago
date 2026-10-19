// ============================================================================
// Catálogo de habitaciones (contenido mock realista — ver docs/contenido.md).
// Reemplazar textos, precios y fotos por los reales del hotel antes de publicar.
// Las fotografías son placeholders de Unsplash descargados en public/images.
// ============================================================================

export interface RoomImage {
  src: string
  alt: string
}

export interface Room {
  id: string
  slug: string
  name: string
  /** Texto corto para tarjetas (1–2 líneas). */
  description: string
  /** Texto largo para la página de detalle. */
  longDescription: string
  capacity: number
  sizeM2: number
  beds: string
  view: 'lago' | 'jardín' | 'piscina'
  /** Tarifa por noche en USD (enteros). */
  pricePerNight: number
  rating: number
  reviewCount: number
  featured: boolean
  amenities: string[]
  images: RoomImage[]
}

export const rooms: Room[] = [
  {
    id: 'bdl-01',
    slug: 'vista-jardin',
    name: 'Habitación Vista Jardín',
    description:
      'Luz natural, tonos cálidos y acceso directo a los jardines interiores del hotel.',
    longDescription:
      'Una habitación serena pensada para descansar: cama queen con ropa de algodón, escritorio de madera clara y ventanal hacia los jardines tropicales. Perfecta para viajes de trabajo o escapadas cortas.',
    capacity: 2,
    sizeM2: 22,
    beds: '1 cama queen',
    view: 'jardín',
    pricePerNight: 65,
    rating: 4.6,
    reviewCount: 48,
    featured: false,
    amenities: ['WiFi 300 Mbps', 'Aire acondicionado', 'TV 43"', 'Baño privado', 'Desayuno incluido'],
    images: [
      { src: '/images/rooms/vista-jardin.jpg', alt: 'Habitación Vista Jardín con cama queen y ventanal a los jardines' },
      { src: '/images/rooms/detalle-cama.jpg', alt: 'Detalle de la ropa de cama de algodón de la habitación Vista Jardín' },
    ],
  },
  {
    id: 'bdl-02',
    slug: 'vista-lago',
    name: 'Habitación Vista Lago',
    description:
      'Despierta con el lago de frente: ventanal panorámico y balcón privado con hamaca.',
    longDescription:
      'Nuestra habitación más pedida. Ventanal de piso a techo con vista abierta al Lago de Maracaibo, balcón privado con hamaca y sillones de madera. El atardecer, desde aquí, es el mejor del hotel.',
    capacity: 2,
    sizeM2: 26,
    beds: '1 cama king',
    view: 'lago',
    pricePerNight: 85,
    rating: 4.9,
    reviewCount: 121,
    featured: true,
    amenities: ['Vista al lago', 'Balcón privado', 'WiFi 300 Mbps', 'Aire acondicionado', 'TV 50"', 'Desayuno incluido'],
    images: [
      { src: '/images/rooms/vista-lago.jpg', alt: 'Habitación Vista Lago con cama king y ventanal panorámico al lago' },
      { src: '/images/hotel/terraza.jpg', alt: 'Balcón privado de la habitación Vista Lago con hamaca frente al agua' },
    ],
  },
  {
    id: 'bdl-03',
    slug: 'suite-brisa',
    name: 'Suite Brisa',
    description:
      'Suite amplia con sala de estar, tina y vista privilegiada al muelle del hotel.',
    longDescription:
      'Una suite de esquina con sala de estar independiente, tina de inmersión y vista directa al muelle. Incluye amenities de cortesía, cafetera de especialidad y servicio de habitación hasta las 10 p.m.',
    capacity: 3,
    sizeM2: 38,
    beds: '1 cama king + sofá cama',
    view: 'lago',
    pricePerNight: 120,
    rating: 4.8,
    reviewCount: 76,
    featured: true,
    amenities: ['Vista al muelle', 'Sala de estar', 'Tina de inmersión', 'Cafetera de especialidad', 'WiFi 300 Mbps', 'Desayuno incluido'],
    images: [
      { src: '/images/rooms/suite-brisa.jpg', alt: 'Suite Brisa con cama king, sala de estar y vista al muelle' },
      { src: '/images/hotel/muelle-atardecer.jpg', alt: 'Vista al muelle del hotel que se disfruta desde la Suite Brisa' },
    ],
  },
  {
    id: 'bdl-04',
    slug: 'suite-familiar',
    name: 'Suite Familiar',
    description:
      'Dos habitaciones conectadas, ideal para familias o grupos de hasta 4 personas.',
    longDescription:
      'Dos dormitorios conectados por una sala común: cama king en la principal y dos camas individuales en la segunda. Incluye frigobar, microondas y mesa de juegos para los más pequeños.',
    capacity: 4,
    sizeM2: 46,
    beds: '1 cama king + 2 individuales',
    view: 'lago',
    pricePerNight: 150,
    rating: 4.7,
    reviewCount: 54,
    featured: false,
    amenities: ['2 habitaciones', 'Frigobar y microondas', 'WiFi 300 Mbps', 'Aire acondicionado', 'TV 50"', 'Desayuno incluido'],
    images: [
      { src: '/images/rooms/suite-familiar.jpg', alt: 'Suite Familiar con dos habitaciones conectadas por una sala común' },
      { src: '/images/rooms/detalle-cama.jpg', alt: 'Detalle de una de las camas de la Suite Familiar' },
    ],
  },
  {
    id: 'bdl-05',
    slug: 'doble-estandar',
    name: 'Doble Estándar',
    description:
      'Dos camas full, escritorio compartido y la mejor relación precio-comodidad.',
    longDescription:
      'Pensada para amigos o colegas de viaje: dos camas full con ropa de algodón, escritorio doble y baño privado con ducha de lluvia. Sin ruido y con luz natural durante la mañana.',
    capacity: 3,
    sizeM2: 28,
    beds: '2 camas full',
    view: 'jardín',
    pricePerNight: 75,
    rating: 4.5,
    reviewCount: 39,
    featured: false,
    amenities: ['Escritorio doble', 'WiFi 300 Mbps', 'Aire acondicionado', 'Baño privado', 'Desayuno incluido'],
    images: [
      { src: '/images/rooms/doble-estandar.jpg', alt: 'Habitación Doble Estándar con dos camas full y escritorio' },
      { src: '/images/hotel/lago-cabanas.jpg', alt: 'Vista de los jardines y el lago desde la zona de habitaciones estándar' },
    ],
  },
  {
    id: 'bdl-06',
    slug: 'bungalow-muelle',
    name: 'Bungalow del Muelle',
    description:
      'Bungalow independiente sobre el agua, con terraza privada y jacuzzi exterior.',
    longDescription:
      'La experiencia más exclusiva del hotel: un bungalow de madera sobre el agua, con terraza privada, jacuzzi exterior y desayuno servido en tu puerta. Sonido de olas como única banda sonora.',
    capacity: 2,
    sizeM2: 40,
    beds: '1 cama king',
    view: 'lago',
    pricePerNight: 180,
    rating: 5,
    reviewCount: 63,
    featured: true,
    amenities: ['Sobre el agua', 'Jacuzzi privado', 'Terraza privada', 'Minibar de cortesía', 'WiFi 300 Mbps', 'Desayuno en la terraza'],
    images: [
      { src: '/images/rooms/bungalow-muelle.jpg', alt: 'Bungalow del Muelle, cabaña de madera sobre el agua con terraza privada' },
      { src: '/images/hotel/muelle-atardecer.jpg', alt: 'Atardecer visto desde la terraza del Bungalow del Muelle' },
    ],
  },
]

/** Vistas disponibles para los filtros del catálogo. */
export const roomViews = [
  { value: 'lago', label: 'Vista lago' },
  { value: 'jardín', label: 'Vista jardín' },
  { value: 'piscina', label: 'Vista piscina' },
] as const
