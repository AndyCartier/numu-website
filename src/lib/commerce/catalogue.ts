export type TransactionMode = 'purchase' | 'made_to_order' | 'inquiry' | 'booking'
export type ProductStatus = 'available' | 'made_to_order' | 'coming_soon' | 'sold' | 'draft' | 'archived'
export type ProductCategory = 'Objects' | 'Lighting' | 'Art' | 'Materials' | 'Experiences'
export type ShippingClass = 'small_parcel' | 'medium_parcel' | 'large_parcel' | 'oversize' | 'oversize_fragile' | 'artwork' | 'project_freight' | 'digital_or_service'

export type ProductVariant = { id: string; name: string; priceAdjustmentAed?: number; available?: boolean }
export type Product = {
  id: string; slug: string; name: string; subtitle: string; category: ProductCategory
  transactionMode: TransactionMode; status: ProductStatus; description: string; story: string
  priceAed?: number; priceType: 'fixed' | 'from' | 'on_request'; priceUnit?: string
  stripePriceId?: string; stripePaymentLink?: string; leadTime?: string; dimensions?: string; weight?: string; material?: string
  finish?: string; origin?: string; edition?: string; unique?: boolean; images: { src: string; alt: string }[]
  variants?: ProductVariant[]; shippingClass?: ShippingClass; pickupEligible?: boolean
  gccShippingEligible?: boolean; internationalInquiryEligible?: boolean; bookingProvider?: 'cal.com'; bookingUrl?: string
  seo: { title: string; description: string }
}

// Prices use AED fils (minor units). Add commercial data here as it is confirmed; no UI value is inferred.
export const PRODUCTS: Product[] = [
  {
    id: 'mushroomiya', slug: 'mushroomiya', name: 'Mushroomiya', subtitle: 'Grown light sculpture', category: 'Lighting', transactionMode: 'made_to_order', status: 'made_to_order', priceType: 'on_request',
    description: 'A monumental pendant dome that reinterprets the mashrabiya through living matter.',
    story: 'Mushroomiya is grown from mycelium on palm-derived fibre. Its open-cell shell gives light and shadow equal presence in the room.',
    leadTime: 'Made to order', dimensions: '1060 × 387 × 30 mm', material: 'PALMYCO™ mycelium composite', finish: 'Natural grown surface', origin: 'Dubai, UAE', images: [
      { src: '/images/mushroomiya/base39-lamp-01.jpg', alt: 'Mushroomiya lamp installed in an architectural interior' },
      { src: '/images/mushroomiya/material-02.jpg', alt: 'Mushroomiya in the making' },
      { src: '/images/mushroomiya/close-up-01.jpg', alt: 'Close detail of the Mushroomiya material' },
      { src: '/images/mushroomiya/base39-lamp-03.jpg', alt: 'Mushroomiya lamp installation detail' },
      { src: '/images/mushroomiya/base39-lamp-05.jpg', alt: 'Mushroomiya lamp shown in an interior setting' },
    ],
    variants: [{ id: 'standard', name: 'Standard configuration' }], shippingClass: 'oversize_fragile', pickupEligible: true, gccShippingEligible: false, internationalInquiryEligible: true,
    seo: { title: 'Mushroomiya | NUMU Shop', description: 'Mushroomiya is NUMU’s grown mycelium light sculpture, available to order by inquiry.' },
  },
  {
    id: 'fold', slug: 'fold', name: 'FOLD', subtitle: 'Architectural acoustic system', category: 'Materials', transactionMode: 'inquiry', status: 'available', priceType: 'on_request',
    description: 'A grown acoustic panel system for refined interiors.', story: 'FOLD turns PALMYCO™ into a tactile, performance-led interior surface for project-scale specification.',
    leadTime: '6–8 weeks', dimensions: '400 × 400 × 60 mm', material: 'PALMYCO™ mycelium composite', origin: 'Dubai, UAE', images: [
      { src: '/images/user/fold-panel-studio.jpg', alt: 'A real FOLD panel prototype standing in the NUMU studio' },
      { src: '/images/user/fold-panel-hand.jpg', alt: 'A real FOLD panel prototype held in direct sunlight' },
      { src: '/images/products/fold_hero_interior.png', alt: 'FOLD acoustic panels in an interior setting' }, { src: '/images/products/fold_solo_panel.png', alt: 'FOLD panel material detail' }, { src: '/images/products/fold_context_scale.png', alt: 'FOLD at architectural scale' },
      { src: '/images/projects/acoustic_render_07.jpg', alt: 'FOLD acoustic panel system visualisation' },
    ], shippingClass: 'project_freight', internationalInquiryEligible: true,
    seo: { title: 'FOLD | NUMU Shop', description: 'Request a project conversation for NUMU FOLD grown acoustic wall systems.' },
  },
  {
    id: 'fungal-art-series', slug: 'fungal-art-series', name: 'Fungal Art Series®', subtitle: 'Unique works', category: 'Art', transactionMode: 'inquiry', status: 'available', priceType: 'on_request',
    description: 'One-off material works shaped by growth, fibre, and time.', story: 'Each work is distinct. Available pieces, dimensions, and commission possibilities are shared through a direct conversation.',
    material: 'Grown bio-composite', finish: 'Each work is naturally variable', edition: 'Unique works and commissions', images: [{ src: '/images/projects/Pressed_samples.jpg', alt: 'NUMU material samples and art studies' }, { src: '/images/projects/production_detail_01.jpg', alt: 'NUMU production material detail' }, { src: '/images/projects/production_detail_04.jpg', alt: 'Grown composite surface detail' }, { src: '/images/projects/Kinoko.jpg', alt: 'NUMU grown material art study' }], internationalInquiryEligible: true,
    seo: { title: 'Fungal Art Series® | NUMU Shop', description: 'Unique NUMU material works and bespoke art commissions.' },
  },
  {
    id: 'mycelium-hotline', slug: 'mycelium-hotline', name: 'Mycelium Hotline', subtitle: 'A material conversation', category: 'Experiences', transactionMode: 'booking', status: 'available', priceType: 'on_request',
    description: 'A focused conversation for material questions, project thinking, and early-stage collaboration.', story: 'Booking is managed through NUMU’s existing scheduling and payment flow.',
    leadTime: '45 minutes', images: [{ src: '/images/projects/production_detail_03.jpg', alt: 'NUMU material production detail' }], bookingProvider: 'cal.com', bookingUrl: process.env.NEXT_PUBLIC_CAL_HOTLINE_URL,
    seo: { title: 'Mycelium Hotline | NUMU Shop', description: 'Book a NUMU material conversation.' },
  },
  {
    id: 'masterclass', slug: 'masterclass', name: 'Masterclass', subtitle: 'Future workshop', category: 'Experiences', transactionMode: 'booking', status: 'coming_soon', priceType: 'on_request',
    description: 'A future NUMU workshop around materials, making, and biological systems.', story: 'Programme details will be announced when confirmed.',
    images: [{ src: '/images/projects/production_detail_02.jpg', alt: 'NUMU material process' }], seo: { title: 'Masterclass | NUMU Shop', description: 'Future NUMU materials workshop.' },
  },
  // Draft records prove the catalogue supports future objects without publishing commercial claims.
  { id: 'small-lamp-01', slug: 'small-lamp-01', name: 'Small Lamp 01', subtitle: 'Development object', category: 'Lighting', transactionMode: 'made_to_order', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  { id: 'small-lamp-02', slug: 'small-lamp-02', name: 'Small Lamp 02', subtitle: 'Development object', category: 'Lighting', transactionMode: 'made_to_order', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  { id: 'mycelium-stool', slug: 'mycelium-stool', name: 'Mycelium Stool', subtitle: 'Development object', category: 'Objects', transactionMode: 'made_to_order', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  ...(process.env.NODE_ENV === 'development' ? [{
    id: 'shop-review-object', slug: 'shop-review-object', name: 'Shop Review Object', subtitle: 'Development-only checkout fixture', category: 'Objects' as const, transactionMode: 'purchase' as const, status: 'available' as const, priceType: 'fixed' as const,
    // This deliberately non-commercial record exists only in local development to exercise cart and shipping states.
    priceAed: 100000, stripePriceId: process.env.STRIPE_DEV_REVIEW_PRICE_ID, leadTime: 'Development fixture', description: 'A local-only product for reviewing cart, pickup, delivery, and checkout states. It is never published in production.', story: 'This is not a NUMU object or commercial offer. It exists solely to make the local review complete before final product data arrives.', material: 'Development fixture', images: [{ src: '/images/products/pressed_detail.jpg', alt: 'NUMU material detail used only for local shop review' }], variants: [{ id: 'review-natural', name: 'Review configuration' }], shippingClass: 'small_parcel' as const, pickupEligible: true, gccShippingEligible: true, internationalInquiryEligible: true,
    seo: { title: 'Shop Review Object | Development only', description: 'Local checkout fixture; never published.' },
  } satisfies Product] : []),
]

export const publicProducts = PRODUCTS.filter((product) => product.status !== 'draft' && product.status !== 'archived')
export const getProduct = (slug: string) => PRODUCTS.find((product) => product.slug === slug)
