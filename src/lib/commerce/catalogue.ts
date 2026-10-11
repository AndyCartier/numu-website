export type TransactionMode = 'purchase' | 'made_to_order' | 'inquiry' | 'booking'
export type ProductStatus = 'available' | 'made_to_order' | 'coming_soon' | 'sold' | 'draft' | 'archived'
// Families used by the catalogue filter. Experiences are paid services (Cal.com) kept beside the objects.
export type ProductCategory = 'Acoustic & Architectural Surfaces' | 'Lighting' | 'Furniture & Objects' | 'Fungal Art' | 'Bespoke Commissions' | 'Experiences'
export type ShippingClass = 'small_parcel' | 'medium_parcel' | 'large_parcel' | 'oversize' | 'oversize_fragile' | 'artwork' | 'project_freight' | 'digital_or_service'

import { type DevelopmentStage, type SpecEvidence } from './labels'
export { STAGE_LABEL, EVIDENCE_LABEL, type DevelopmentStage, type SpecEvidence } from './labels'

export type ProductSpec = { label: string; value: string; evidence?: SpecEvidence }
export type ImageKind = 'photograph' | 'visualisation' | 'design_study'
export type ProductImage = { src: string; alt: string; kind?: ImageKind; caption?: string }
export type ProductVariant = { id: string; name: string; description?: string; priceAdjustmentAed?: number; available?: boolean }
export type ProductInquiry = { cta: string; projectFields?: boolean; quantityLabel?: string }

export type Product = {
  id: string; slug: string; name: string; subtitle: string; category: ProductCategory
  transactionMode: TransactionMode; status: ProductStatus; description: string; story: string
  stage?: DevelopmentStage; stageNote?: string; storyParagraphs?: string[]; specs?: ProductSpec[]
  applications?: { title: string; text: string }[]; related?: string[]; inquiry?: ProductInquiry
  detailLink?: { href: string; label: string }
  priceAed?: number; priceType: 'fixed' | 'from' | 'on_request'; priceUnit?: string
  stripePriceId?: string; stripePaymentLink?: string; leadTime?: string; dimensions?: string; weight?: string; material?: string
  finish?: string; origin?: string; edition?: string; unique?: boolean; images: ProductImage[]
  variants?: ProductVariant[]; shippingClass?: ShippingClass; pickupEligible?: boolean
  gccShippingEligible?: boolean; internationalInquiryEligible?: boolean; bookingProvider?: 'cal.com'; bookingUrl?: string
  seo: { title: string; description: string }
}

// Physical products are inquiry-only and always shown as "Price on request" (see money.ts).
// Prices use AED fils (minor units) and are only used by the dormant checkout path; never add one
// to a physical product without a business decision to reopen online sales.
// Specifications come from the NUMU Architect Catalog v4 evidence table and the Art Portfolio 2026.
// Do not add dimensions, ratings or lead times that are not documented there.
export const PRODUCTS: Product[] = [
  {
    id: 'fold', slug: 'fold', name: 'FOLD', subtitle: 'Grown acoustic panel system', category: 'Acoustic & Architectural Surfaces',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'prototype',
    stageNote: 'Full-scale panels are grown in the Dubai lab. Acoustic and fire testing is in progress; ratings below are design targets until reports are issued.',
    description: 'A modular wall and ceiling relief grown from PALMYCO™, designed for interiors that need softer sound and a warmer surface.',
    story: 'A topography grown into the material, not cut from it.',
    storyParagraphs: [
      'FOLD is NUMU’s first product: a 400 × 400 mm acoustic module grown from PALMYCO™, the NUMU mycelium composite cultivated on regional date-palm fibre. Each panel is formed in a mould over a controlled growth cycle, then heat-stabilised and finished by hand.',
      'The surface takes its name from the forces that shape it: the movement of fabric, the softness of drapery, the way wind carves dunes. The relief is co-developed with NYXO Design Studio; the material, mould and process engineering are NUMU’s.',
      'Modules can be laid aligned or alternating to build a continuous wall, a ceiling field or separate compositions. Layout, fixing and finish are agreed with the project team after a sample review.',
    ],
    specs: [
      { label: 'Module', value: '400 × 400 mm', evidence: 'internal' },
      { label: 'Nominal thickness', value: '60 mm (provisional)', evidence: 'internal' },
      { label: 'Material', value: 'PALMYCO™ grown mycelium composite on UAE date-palm fibre', evidence: 'confirmed' },
      { label: 'Acoustic objective', value: 'NRC 0.72–0.80', evidence: 'target' },
      { label: 'Fire objective', value: 'ASTM E84 Class B', evidence: 'target' },
      { label: 'Density / panel weight', value: 'Provided with samples', evidence: 'on_request' },
      { label: 'Finish', value: 'Natural grown surface, raw or sealed', evidence: 'confirmed' },
      { label: 'Fixing', value: 'Adhesive or mechanical; project-specific detail agreed with the installer', evidence: 'on_request' },
      { label: 'Use', value: 'Interior walls and ceilings', evidence: 'confirmed' },
      { label: 'Lead time', value: 'Quoted per project after quantity and finish are agreed', evidence: 'on_request' },
      { label: 'Made in', value: 'Dubai, UAE', evidence: 'confirmed' },
    ],
    variants: [
      { id: 'aligned', name: 'Aligned layout', description: 'Every module turned the same way, reading as a continuous rhythm.' },
      { id: 'alternating', name: 'Alternating layout', description: 'Modules rotated in turn, breaking the surface into a woven field.' },
      { id: 'undecided', name: 'Not decided yet', description: 'We will propose layouts with the sample.' },
    ],
    applications: [
      { title: 'Hospitality', text: 'Restaurant ceilings, lounge walls and guest corridors where reverberation and atmosphere both matter.' },
      { title: 'Workplace', text: 'Meeting rooms, feature walls and linear ceiling bays in open-plan offices.' },
      { title: 'Cultural and retail', text: 'Gallery walls, reception backdrops and brand spaces that benefit from a tactile, natural surface.' },
    ],
    images: [
      { src: '/images/user/fold-panel-studio.jpg', alt: 'A grown FOLD acoustic panel prototype standing in the NUMU studio', kind: 'photograph', caption: 'FOLD prototype panel in the NUMU studio, Dubai.' },
      { src: '/images/user/fold-panel-hand.jpg', alt: 'A FOLD panel prototype held in direct sunlight, showing the grown relief', kind: 'photograph', caption: 'Grown relief in raking sunlight. Prototype.' },
      { src: '/images/products/fold_solo_panel.png', alt: 'Single FOLD module on a wall, studio render', kind: 'visualisation' },
      { src: '/images/projects/acoustic_render_07.jpg', alt: 'Close view of FOLD modules forming a continuous wall surface', kind: 'visualisation' },
      { src: '/images/moodboards/hospitality-fold-wall-wash.webp', alt: 'FOLD wall with grazing light in a hospitality interior', kind: 'visualisation' },
      { src: '/images/moodboards/workplace-fold-feature-wall.webp', alt: 'FOLD feature wall in an office reception', kind: 'visualisation' },
      { src: '/images/products/fold_hero_interior.png', alt: 'FOLD acoustic wall in a residential lounge', kind: 'visualisation' },
    ],
    detailLink: { href: '/fold', label: 'Read the full FOLD product page' },
    related: ['architectural-surfaces', 'mushroomiya', 'bespoke-commissions'],
    inquiry: { cta: 'Request a quote', projectFields: true, quantityLabel: 'Approximate area (m²) or module count' },
    origin: 'Dubai, UAE', material: 'PALMYCO™ mycelium composite', dimensions: '400 × 400 mm module',
    shippingClass: 'project_freight', internationalInquiryEligible: true,
    seo: { title: 'FOLD Grown Acoustic Panels | NUMU Objects & Surfaces', description: 'FOLD is a 400 × 400 mm acoustic panel grown from PALMYCO™ mycelium on UAE date-palm fibre. Prototype stage, made in Dubai. Price on request.' },
  },
  {
    id: 'architectural-surfaces', slug: 'architectural-surfaces', name: 'Grown Veneer Cladding', subtitle: 'Interior wall surfaces between wood and marble', category: 'Acoustic & Architectural Surfaces',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'commission',
    stageNote: 'Exclusive collection, developed to each project brief. Interior use only: exterior and façade applications are future research, not an available product.',
    description: 'A grown surface with the warmth of wood and the veining of marble, for walls at the scale of a room: continuous plates, 20 × 20 cm tiles, or sizes cut to the elevation.',
    story: 'The warmth of wood, the veining of marble, grown.',
    storyParagraphs: [
      'Grown veneer is a technique developed in house at NUMU. The surface is grown rather than cut or printed, so its veining, colour and texture are produced by the organism itself, and no two pieces repeat.',
      'At room scale it can run as continuous plates, carrying the veining across a whole wall like book-matched stone, or as a 20 × 20 cm modular grid where each tile carries its own pattern and the wall reads with the rhythm of a grid. Plates and tiles can also be cut to the drawing and worked like wood, and combined with oak, walnut and other refined timbers.',
      'The pieces shown are a demonstrator of the technique; each cladding project is developed to its own brief and sample. Surfaces are offered for interior use. They have not yet been tested for fire classification, weather resistance or façade use, and each project receives a written statement of what has and has not been tested before specification.',
    ],
    specs: [
      { label: 'Plate', value: 'Large sheets for continuous surfaces, sized to the project', evidence: 'on_request' },
      { label: '20 × 20 cm tile', value: 'Standard module for grids, gradients and repeats', evidence: 'confirmed' },
      { label: 'Any size', value: 'Cut to the drawing, worked like wood', evidence: 'confirmed' },
      { label: 'With wood', value: 'Combined with oak, walnut and other refined woods', evidence: 'confirmed' },
      { label: 'Surface', value: 'Grown veining and texture; no two pieces repeat', evidence: 'confirmed' },
      { label: 'Use', value: 'Interior walls, feature walls, headboard walls, stair halls', evidence: 'confirmed' },
      { label: 'Fire classification', value: 'Not yet classified; scope stated per project', evidence: 'on_request' },
      { label: 'Exterior / façade', value: 'Not offered. Future research direction only', evidence: 'confirmed' },
      { label: 'Made in', value: 'Dubai, UAE', evidence: 'confirmed' },
    ],
    variants: [
      { id: 'plate', name: 'Plate', description: 'Continuous sheets that carry the veining across a whole wall, like book-matched stone.' },
      { id: 'tile', name: '20 × 20 cm tile', description: 'A modular grid: each tile its own pattern, together one surface.' },
      { id: 'bespoke', name: 'Cut to size', description: 'Sizes and shapes cut to the elevation drawing.' },
      { id: 'undecided', name: 'Not decided yet', description: 'We will propose a format with the sample.' },
    ],
    applications: [
      { title: 'Hotel suites and residences', text: 'Headboard walls and bedroom feature walls in continuous plates.' },
      { title: 'Stair halls and lobbies', text: 'Full-height tiled walls where the grid catches raking light.' },
      { title: 'Boutiques and hospitality', text: 'A signature wall surface with the presence of stone and the warmth of timber.' },
    ],
    images: [
      { src: '/images/catalogue/veneer/veneer-material-01.jpg', alt: 'Four grown veneer plates with grey, cream and rust veining, laid edge to edge', kind: 'photograph', caption: 'Grown veneer plates. Real material.' },
      { src: '/images/catalogue/veneer/veneer-cladding-bedroom.jpg', alt: 'Grown veneer plates cladding the full wall behind a bed in a hotel suite', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-material-03.jpg', alt: 'Close view of grown veneer: a cream field breaking into grey textured areas', kind: 'photograph' },
      { src: '/images/catalogue/veneer/veneer-cladding-stair.jpg', alt: 'A double-height stair wall clad in 20 × 20 cm grown veneer tiles', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-material-02.jpg', alt: 'Grown veneer surface with dark linear veins through a pale ground', kind: 'photograph' },
    ],
    related: ['grown-veneer-furniture', 'fold', 'bespoke-commissions'],
    inquiry: { cta: 'Request samples and a quote', projectFields: true, quantityLabel: 'Approximate wall area (m²)' },
    origin: 'Dubai, UAE', material: 'Grown mycelium veneer',
    shippingClass: 'project_freight', internationalInquiryEligible: true,
    seo: { title: 'Grown Veneer Wall Cladding | Mycelium Surfaces between Wood and Marble | NUMU', description: 'Grown veneer cladding by NUMU: interior wall surfaces with the warmth of wood and the veining of marble, in plates, 20 × 20 cm tiles or cut to size. Made in Dubai to the brief. Price on request.' },
  },
  {
    id: 'mushroomiya', slug: 'mushroomiya', name: 'Mushroomiya', subtitle: 'Grown pendant dome', category: 'Lighting',
    transactionMode: 'inquiry', status: 'made_to_order', priceType: 'on_request', stage: 'made_to_order',
    stageNote: 'Made to order by commission. The production mould is being fabricated; images on this page are visualisations.',
    description: 'A large open-cell pendant that reinterprets the mashrabiya through grown matter. BASE39 Creative Accelerator 2026, winning finalist.',
    story: 'The mashrabiya, grown rather than carved.',
    storyParagraphs: [
      'Mushroomiya translates the screened light of the mashrabiya into a half-sphere lattice grown from mycelium on palm-derived fibre. Its open cells hold light and shadow in equal measure, so the lamp works as much on the room as on the table beneath it.',
      'The form was developed during the BASE39 Creative Accelerator in 2026, where it was a winning finalist. Commissioned domes are grown as a single shell in a mould, stabilised, and fitted with their light source in Dubai.',
      'The dome measures 1200 mm across. Light source and suspension are confirmed for each commission, so the lamp can be specified for a residence, a lobby or a restaurant.',
    ],
    specs: [
      { label: 'Form', value: 'Half-sphere open-cell dome, single grown shell', evidence: 'confirmed' },
      { label: 'Diameter', value: 'Ø 1200 mm', evidence: 'confirmed' },
      { label: 'Light', value: 'Warm white (2700K), dimmable; electrical specification per project', evidence: 'on_request' },
      { label: 'Material', value: 'PALMYCO™ grown on date-palm fibre', evidence: 'confirmed' },
      { label: 'Mounting', value: 'Ceiling pendant; suspension detail agreed for each site', evidence: 'on_request' },
      { label: 'Recognition', value: 'BASE39 Creative Accelerator 2026, winning finalist', evidence: 'confirmed' },
      { label: 'Made in', value: 'Dubai, UAE', evidence: 'confirmed' },
    ],
    applications: [
      { title: 'Lobbies and atriums', text: 'A single dome as a landmark over a reception or double-height space.' },
      { title: 'Restaurants and lounges', text: 'Groups of domes over tables, casting a cellular pattern across the room.' },
      { title: 'Residences', text: 'A statement pendant over a dining table or stair void.' },
    ],
    images: [
      { src: '/images/mushroomiya/base39-lamp-01.jpg', alt: 'Mushroomiya open-cell dome suspended in an atrium', kind: 'visualisation' },
      { src: '/images/mushroomiya/close-up-01.jpg', alt: 'Close view of the grown Mushroomiya lattice around the bulb', kind: 'visualisation' },
      { src: '/images/mushroomiya/material-01.jpg', alt: 'Mushroomiya shell beside palm fibre and inoculated substrate', kind: 'visualisation' },
      { src: '/images/mushroomiya/base39-lamp-03.jpg', alt: 'Mushroomiya dome lighting a hotel reception', kind: 'visualisation' },
      { src: '/images/mushroomiya/base39-lamp-05.jpg', alt: 'Mushroomiya lit at night above a lounge with a city view', kind: 'visualisation' },
      { src: '/images/moodboards/workplace-mushroomiya-pendants.webp', alt: 'A row of Mushroomiya pendants above office work tables', kind: 'visualisation' },
      { src: '/collections/lighting/Design studies and drawings/BASE39_sketch01.png', alt: 'Hand sketch of the Mushroomiya dome from the BASE39 design process', kind: 'design_study' },
    ],
    detailLink: { href: '/mushroomiya', label: 'Read the Mushroomiya story' },
    related: ['fold', 'bespoke-commissions', 'architectural-surfaces'],
    inquiry: { cta: 'Enquire about Mushroomiya', projectFields: true, quantityLabel: 'Number of pendants' },
    origin: 'Dubai, UAE', material: 'PALMYCO™ mycelium composite', dimensions: 'Ø 1200 mm',
    shippingClass: 'oversize_fragile', internationalInquiryEligible: true,
    seo: { title: 'Mushroomiya Grown Mycelium Pendant Light | NUMU', description: 'Mushroomiya is a mycelium-grown open-cell pendant dome inspired by the mashrabiya, Ø 1200 mm, made to order in Dubai. BASE39 Creative Accelerator 2026 winning finalist. Price on request.' },
  },
  {
    id: 'fungal-art-series', slug: 'fungal-art-series', name: 'Fungal Art Series®', subtitle: 'Original grown works by Andy Cartier', category: 'Fungal Art',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'unique_works', unique: true,
    stageNote: 'Each work is unique, hand-finished and individually numbered. Available works are shared on request.',
    description: 'Wall works grown from living mycelium on natural fibres, then finished by hand. No pigment does the work the organism did.',
    story: '“I don’t paint. I give a medium to nature to express its beauty.”',
    storyParagraphs: [
      'The Fungal Art Series® is the result of more than five years of material exploration and artistic research by Andy Cartier, a French designer and material artist who founded Studio Cartier in the Netherlands and NUMU in Dubai. Each work starts with natural fibres such as hemp, palm or plant residue, which a living fungal network colonises under controlled light, humidity and time.',
      'Every piece grows over about 14 days before it is stabilised, hand-finished and numbered. The surface records what happened during growth: ridges, voids, rust tones and silvery skins that cannot be repeated. Each work is an artefact of a living process, shaped through light, humidity and time rather than painted.',
      'Works have been exhibited at World Art Dubai (2022), the Los Angeles Parallax Fair (2023), Material District Utrecht (2023), The Design Show Egypt in Cairo (2023) and Cloud Amsterdam (2024). Collected works include Fungal Art serie #1 (80 × 40 cm, Detroit, USA), the first work of the series to be sold; #9 (200 × 100 cm, Nice, France); and #11 (100 × 50 cm, Lyon, France).',
    ],
    specs: [
      { label: 'Edition', value: 'Unique, individually numbered', evidence: 'confirmed' },
      { label: 'Growth', value: 'Approx. 14 days per work, then hand-finished', evidence: 'confirmed' },
      { label: 'Material', value: 'Mycelium grown on natural fibres (hemp, palm or plant residue)', evidence: 'confirmed' },
      { label: 'Sizes', value: 'Previous works range from 80 × 40 cm to 200 × 100 cm', evidence: 'confirmed' },
      { label: 'Exhibited', value: 'World Art Dubai, LA Parallax Fair, Material District Utrecht, The Design Show Egypt, Cloud Amsterdam', evidence: 'confirmed' },
      { label: 'Collected', value: 'Private collections in Detroit (USA), Nice and Lyon (France)', evidence: 'confirmed' },
      { label: 'Framing', value: 'Unframed, timber or metal frame, per work', evidence: 'on_request' },
      { label: 'Availability', value: 'Current works and dimensions shared on request', evidence: 'on_request' },
    ],
    applications: [
      { title: 'Private collections', text: 'Single works for residences, offices and collectors of material art.' },
      { title: 'Hospitality', text: 'Lobby and suite walls where an original work anchors the interior.' },
      { title: 'Commissions', text: 'Works grown to a specific size, palette or series for a project.' },
    ],
    images: [
      { src: '/images/catalogue/fungal-art/fas-artwork-01.jpg', alt: 'Vertical Fungal Art Series work with ochre streaks across a pale grown surface', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-surface-detail.jpg', alt: 'Detail of a Fungal Art Series surface with rust-toned veins through a silvery skin', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-artwork-02.jpg', alt: 'Pale Fungal Art Series work with fine brown relief lines', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-studio-wall.jpg', alt: 'Three Fungal Art Series works shown together in the studio', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-framed-study.jpg', alt: 'Framed Fungal Art Series study in black, with gold and rust grown texture', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-viewing.jpg', alt: 'Andy Cartier seated in front of three Fungal Art Series works', kind: 'photograph' },
      { src: '/images/moodboards/hospitality-fungal-art-lounge.webp', alt: 'Fungal Art Series works in a hotel lounge', kind: 'visualisation' },
    ],
    related: ['aurum', 'collaboration-series', 'bespoke-commissions'],
    inquiry: { cta: 'Enquire about available works', quantityLabel: 'Preferred size or wall dimensions' },
    origin: 'Grown in Dubai, UAE', material: 'Mycelium on natural fibres', edition: 'Unique works',
    shippingClass: 'artwork', internationalInquiryEligible: true,
    seo: { title: 'Fungal Art Series® | Original Mycelium Artworks | NUMU', description: 'Original wall works grown from living mycelium by Andy Cartier, hand-finished and individually numbered. Exhibited in Dubai, Los Angeles, Utrecht, Cairo and Amsterdam. Price on request.' },
  },
  {
    id: 'aurum', slug: 'aurum', name: 'Aurum', subtitle: 'Gold-enhanced grown work, Fungal Art Series®', category: 'Fungal Art',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'unique_works', unique: true,
    stageNote: 'Aurum 01/01 (November 2025) is a unique work. Further pieces in the series can be discussed as commissions.',
    description: 'Gold traced into the relief of a grown mycelium surface, following the patterns the organism left behind.',
    story: 'Gold does not cover the material. It traces it.',
    storyParagraphs: [
      'Aurum is a body of work born from the encounter between an underground living material and gold. Parts of the mycelium’s organic pattern are filled with gold, revealing what is usually overlooked: the quiet complexity and sensuality of fungal growth.',
      'The gold follows the natural relief like light on a landscape. The first work, Aurum 01/01, was completed in November 2025 and photographed in the desert at sunset.',
    ],
    specs: [
      { label: 'Edition', value: 'Aurum 01/01, unique', evidence: 'confirmed' },
      { label: 'Completed', value: 'November 2025', evidence: 'confirmed' },
      { label: 'Material', value: 'Grown mycelium surface with applied gold', evidence: 'confirmed' },
      { label: 'Dimensions', value: 'Shared on request', evidence: 'on_request' },
      { label: 'Series', value: 'Fungal Art Series®', evidence: 'confirmed' },
    ],
    images: [
      { src: '/images/catalogue/aurum/aurum-gold-detail.jpg', alt: 'Gold leaf traced through the grey and white relief of a grown surface', kind: 'photograph' },
      { src: '/images/catalogue/aurum/aurum-work.jpg', alt: 'Full view of an Aurum work with gold areas across the grown surface', kind: 'photograph' },
      { src: '/images/catalogue/aurum/aurum-artist-studio.jpg', alt: 'Andy Cartier touching the gold surface of an Aurum work', kind: 'photograph' },
      { src: '/images/catalogue/aurum/aurum-desert.jpg', alt: 'Aurum standing on a desert dune at sunset beside the artist', kind: 'photograph' },
    ],
    related: ['fungal-art-series', 'collaboration-series', 'bespoke-commissions'],
    inquiry: { cta: 'Enquire about Aurum' },
    origin: 'Dubai, UAE', material: 'Mycelium and gold', edition: '01/01',
    shippingClass: 'artwork', internationalInquiryEligible: true,
    seo: { title: 'Aurum | Gold and Mycelium Artwork | NUMU', description: 'Aurum traces gold through the relief of a grown mycelium surface. A unique Fungal Art Series® work by Andy Cartier, 2025. Price on request.' },
  },
  {
    id: 'collaboration-series', slug: 'collaboration-series', name: 'Collaboration Series', subtitle: 'With Belgian painter Steven De Blieck', category: 'Fungal Art',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'unique_works', unique: true,
    stageNote: 'A limited series. Availability of individual works is confirmed on request.',
    description: 'Grown mycelium surfaces reinterpreted in colour by the Belgian painter Steven De Blieck.',
    story: 'Biological growth, then a painter’s answer to it.',
    storyParagraphs: [
      'This limited series pairs two kinds of making. Each surface was first grown by Andy Cartier from mycelium and natural fibre, then reinterpreted by the Belgian painter Steven De Blieck, who worked colour into and around the grown texture.',
      'The result is a dialogue between colour, texture and living matter: deep blues and turquoise held in the relief that the fungus produced.',
    ],
    specs: [
      { label: 'Edition', value: 'Limited series, unique works', evidence: 'confirmed' },
      { label: 'Artists', value: 'Andy Cartier (grown surface) and Steven De Blieck (painting)', evidence: 'confirmed' },
      { label: 'Material', value: 'Grown mycelium surface, paint', evidence: 'confirmed' },
      { label: 'Dimensions and availability', value: 'Shared on request', evidence: 'on_request' },
    ],
    images: [
      { src: '/images/catalogue/collaboration/collab-blue.jpg', alt: 'Collaboration Series work in deep blue over a grown mycelium relief', kind: 'photograph' },
      { src: '/images/catalogue/collaboration/collab-turquoise.jpg', alt: 'Collaboration Series work in turquoise and rust tones', kind: 'photograph' },
      { src: '/images/catalogue/collaboration/collab-interior.jpg', alt: 'Collaboration Series work leaning on a dark console in an interior', kind: 'photograph' },
    ],
    related: ['fungal-art-series', 'aurum'],
    inquiry: { cta: 'Enquire about the series' },
    material: 'Mycelium, paint', edition: 'Limited series',
    shippingClass: 'artwork', internationalInquiryEligible: true,
    seo: { title: 'Collaboration Series with Steven De Blieck | NUMU Fungal Art', description: 'Grown mycelium surfaces by Andy Cartier, reinterpreted in colour by Belgian painter Steven De Blieck. A limited series. Price on request.' },
  },
  {
    id: 'grown-veneer-furniture', slug: 'grown-veneer-furniture', name: 'Grown Veneer Furniture', subtitle: 'Sideboards, cabinets and tables in walnut and grown veneer', category: 'Furniture & Objects',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'commission',
    stageNote: 'Exclusive collection. The pieces shown are visualisation studies of the technique; every piece is developed to the client’s brief and dimensions.',
    description: 'Furniture faced with a grown surface between wood and marble: tile and plate compositions set into walnut and oak frames.',
    story: 'Every surface is grown, so no two pieces repeat.',
    storyParagraphs: [
      'Grown veneer is a technique developed in house at NUMU. Faced onto furniture, it gives a sideboard door or a table top the warmth of wood and the veining of marble, with a pattern that belongs to that piece alone.',
      'Three compositions show the range. In a tile composition, 20 × 20 cm modules are set into a walnut frame; each tile carries its own pattern, and together they read as one surface. In a plate composition, continuous plates framed in oak or walnut carry the veining across a whole door, like book-matched stone. In tile to timber, mycelium tiles dissolve into walnut across a single front.',
      'The collection is a demonstrator of the technique. Proportions, joinery, timber and finish are developed with each client, from a single cabinet to a run of pieces for a hotel or residence.',
    ],
    specs: [
      { label: 'Pieces', value: 'Sideboards, cabinets, low tables, doors and tops', evidence: 'confirmed' },
      { label: 'Surface formats', value: '20 × 20 cm tiles, continuous plates, or cut to the drawing', evidence: 'confirmed' },
      { label: 'Frames', value: 'Walnut or oak; bronze plinth option', evidence: 'confirmed' },
      { label: 'Surface', value: 'Grown veining and texture; no two pieces repeat', evidence: 'confirmed' },
      { label: 'Dimensions', value: 'Developed to the brief', evidence: 'on_request' },
      { label: 'Finish and care', value: 'Confirmed with the sample', evidence: 'on_request' },
      { label: 'Made in', value: 'Dubai, UAE', evidence: 'confirmed' },
    ],
    variants: [
      { id: 'tile-composition', name: 'Tile composition', description: '20 × 20 cm modules set into a walnut frame, read as one surface with the rhythm of a grid.' },
      { id: 'plate-composition', name: 'Plate composition', description: 'Continuous plates framed in oak or walnut, carrying the veining across a whole door.' },
      { id: 'tile-to-timber', name: 'Tile to timber', description: 'Mycelium tiles dissolving into walnut across one front.' },
      { id: 'undecided', name: 'Not decided yet', description: 'We will propose a composition with the sample.' },
    ],
    applications: [
      { title: 'Residences', text: 'A sideboard, bar cabinet or low table as the piece a room is built around.' },
      { title: 'Hotels and members’ clubs', text: 'Suites, lounges and bars where furniture carries the material story.' },
      { title: 'Collectors and galleries', text: 'One-off pieces developed with the studio to a brief.' },
    ],
    images: [
      { src: '/images/catalogue/veneer/veneer-tile-sideboard.jpg', alt: 'Long walnut sideboard with a front of 20 × 20 cm grown veneer tiles on a bronze plinth', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-material-02.jpg', alt: 'Grown veneer surface with dark linear veins through a pale ground', kind: 'photograph', caption: 'The grown veneer surface. Real material.' },
      { src: '/images/catalogue/veneer/veneer-plate-cabinet.jpg', alt: 'Tall cabinet with two grown veneer plate doors open onto a lit bar', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-tile-low-table.jpg', alt: 'Low table clad in grown veneer tiles on all faces', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-plate-sideboard.jpg', alt: 'Sideboard with four continuous grown veneer plate doors in a garden room', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-tile-to-timber.jpg', alt: 'Sideboard front where grown veneer tiles dissolve into walnut panels', kind: 'visualisation' },
      { src: '/images/catalogue/veneer/veneer-tile-sideboard-interior.jpg', alt: 'Grown veneer tile sideboard in a sunlit living room', kind: 'visualisation' },
    ],
    related: ['architectural-surfaces', 'grown-lounge-chair', 'bespoke-commissions'],
    inquiry: { cta: 'Commission a piece', projectFields: true, quantityLabel: 'Pieces and approximate dimensions' },
    origin: 'Dubai, UAE', material: 'Grown mycelium veneer, walnut or oak',
    shippingClass: 'oversize', internationalInquiryEligible: true,
    seo: { title: 'Grown Veneer Furniture | Bespoke Mycelium Sideboards & Cabinets | NUMU', description: 'Bespoke sideboards, cabinets and tables faced with NUMU grown veneer, a mycelium surface between wood and marble, in walnut and oak. Made in Dubai to the brief. Price on request.' },
  },
  {
    id: 'grown-lounge-chair', slug: 'grown-lounge-chair', name: 'Grown Lounge Chair', subtitle: 'Full-scale PALMYCO™ seating prototype', category: 'Furniture & Objects',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'prototype',
    stageNote: 'A working prototype, not a production piece. Available as a development commission for projects and collectors.',
    description: 'A low lounge chair grown in one piece around a mould, showing how far the material can carry form.',
    story: 'Seating grown as a single volume.',
    storyParagraphs: [
      'The lounge chair is a full-scale study of PALMYCO™ as a furniture material. The seat, back and legs grow as one volume in a mould, so there are no joints, only the continuous texture of the fibre and the mycelium that binds it.',
      'It is presented as a prototype. Structural testing and finish options for daily use are part of a development commission, scoped with each client.',
    ],
    specs: [
      { label: 'Stage', value: 'Full-scale prototype', evidence: 'confirmed' },
      { label: 'Construction', value: 'Single grown volume, moulded', evidence: 'confirmed' },
      { label: 'Material', value: 'PALMYCO™ grown mycelium composite', evidence: 'confirmed' },
      { label: 'Dimensions, load and finish', value: 'Defined in the development brief', evidence: 'on_request' },
    ],
    images: [
      { src: '/images/user/palmyco-chair.jpg', alt: 'A full-scale grown PALMYCO™ lounge chair prototype against a dark background', kind: 'photograph' },
      { src: '/images/catalogue/furniture/grown-chair-outdoor.jpg', alt: 'An earlier grown chair prototype outdoors in low evening sun', kind: 'photograph', caption: 'Earlier grown chair prototype, outdoor study.' },
    ],
    related: ['grown-veneer-furniture', 'objects-editions', 'bespoke-commissions'],
    inquiry: { cta: 'Discuss a development commission', projectFields: true, quantityLabel: 'Number of pieces' },
    material: 'PALMYCO™ mycelium composite', origin: 'Dubai, UAE',
    shippingClass: 'oversize', internationalInquiryEligible: true,
    seo: { title: 'Grown Mycelium Lounge Chair Prototype | NUMU Furniture', description: 'A full-scale lounge chair grown in one piece from PALMYCO™ mycelium composite. Prototype, available as a development commission. Price on request.' },
  },
  {
    id: 'objects-editions', slug: 'objects-editions', name: 'Objects & Editions', subtitle: 'Awards, desk pieces and event collateral', category: 'Furniture & Objects',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'concept',
    stageNote: 'Designs in development, shown as visualisations. Produced in batches for confirmed orders.',
    description: 'Board gifts, delegate mementos, awards and milestone pieces grown in repeat batches, with engraving and presentation boxes.',
    story: 'Small enough for a desk. Made to start a conversation.',
    storyParagraphs: [
      'Objects & Editions bring the material to the scale of the hand: triangular milestone pieces, ring and aperture awards, medals and display objects for events. Each is grown from PALMYCO™ in repeat moulds, so a batch keeps one form while every surface stays individual.',
      'Forms, engraving plates and boxes are developed for each order. The designs on this page are visualisations; we produce samples once quantity and date are known.',
    ],
    specs: [
      { label: 'Formats', value: 'Desk pieces, awards, medals, display objects', evidence: 'confirmed' },
      { label: 'Production', value: 'Repeat-mould batches in Dubai', evidence: 'confirmed' },
      { label: 'Personalisation', value: 'Engraved metal plates and presentation boxes', evidence: 'on_request' },
      { label: 'Minimum quantity and lead time', value: 'Confirmed with the brief', evidence: 'on_request' },
    ],
    images: [
      { src: '/collections/objects/13 - Triangular Milestone Desk Gifts.png', alt: 'Triangular grown milestone pieces with engraved brass plates and a fitted box', kind: 'visualisation' },
      { src: '/collections/objects/01 - Aperture Award.png', alt: 'Aperture award, a grown ring on a dark base', kind: 'visualisation' },
      { src: '/collections/objects/02 - Centre Award.png', alt: 'Centre award, a grown upright form', kind: 'visualisation' },
      { src: '/collections/objects/04 - Facet Medal.png', alt: 'Faceted grown medal', kind: 'visualisation' },
    ],
    detailLink: { href: '/collections?category=Objects', label: 'See all object studies in the gallery' },
    related: ['grown-lounge-chair', 'bespoke-commissions', 'fungal-art-series'],
    inquiry: { cta: 'Request a quote', projectFields: true, quantityLabel: 'Quantity' },
    material: 'PALMYCO™ mycelium composite', origin: 'Dubai, UAE',
    shippingClass: 'medium_parcel', internationalInquiryEligible: true,
    seo: { title: 'Mycelium Awards, Desk Objects & Corporate Gifts | NUMU', description: 'Grown PALMYCO™ awards, milestone desk pieces and event collateral, produced in batches in Dubai with engraving and presentation boxes. Price on request.' },
  },
  {
    id: 'bespoke-commissions', slug: 'bespoke-commissions', name: 'Custom PALMYCO™ Commissions', subtitle: 'Material-led projects and installations', category: 'Bespoke Commissions',
    transactionMode: 'inquiry', status: 'available', priceType: 'on_request', stage: 'commission',
    stageNote: 'Every commission starts from a brief and a sample. Nothing is promised before the material has been tested for the use.',
    description: 'A grown form, surface or object developed for one project, from the first sample to installation.',
    story: 'One material, shaped to a brief.',
    storyParagraphs: [
      'NUMU develops site-specific pieces where an existing product is not the right answer: a sculptural wall composition, a run of custom lighting, a set of display plinths, a large artwork for a lobby. The same PALMYCO™ system, grown on regional palm fibre in Dubai, is shaped through custom moulds.',
      'The Fungal Art Series® can extend beyond single artworks: NUMU develops site-specific installations and wall compositions for hotels, interiors and cultural spaces using the same grown textures, from gallery pieces to immersive environments.',
      'Commissions follow the process used for architectural clients: brief, sample, review, approval and delivery. Evidence for any performance requirement is stated in writing, with a clear distinction between tested results and targets.',
    ],
    specs: [
      { label: '1 · Brief', value: 'Application, location, size and timeline', evidence: 'confirmed' },
      { label: '2 · Sample', value: 'Material character and finish direction', evidence: 'confirmed' },
      { label: '3 · Review', value: 'Evidence, dimensions and mounting', evidence: 'confirmed' },
      { label: '4 · Approval', value: 'Agreed appearance and project scope', evidence: 'confirmed' },
      { label: '5 · Delivery', value: 'Programme, inspection and handover', evidence: 'confirmed' },
      { label: 'Price and lead time', value: 'Quoted after the brief', evidence: 'on_request' },
    ],
    applications: [
      { title: 'Hospitality and culture', text: 'Feature walls, lighting groups and artworks for hotels, restaurants and galleries.' },
      { title: 'Events and retail', text: 'Display plinths, stands and brand objects with a low-waste material story.' },
      { title: 'Architects and designers', text: 'Custom modules developed with a design team for a specific space.' },
    ],
    images: [
      { src: '/images/catalogue/material/palmyco-panels-stacked.jpg', alt: 'Stacks of grown PALMYCO™ panels', kind: 'photograph' },
      { src: '/images/catalogue/material/palmyco-samples-in-hand.jpg', alt: 'Two PALMYCO™ grown samples held in hand, showing the section', kind: 'photograph' },
      { src: '/images/catalogue/fungal-art/fas-studio-wall.jpg', alt: 'Large grown works under development in the NUMU studio', kind: 'photograph' },
      { src: '/images/moodboards/events-display-plinths.png', alt: 'Grown display plinths for an exhibition', kind: 'visualisation' },
      { src: '/images/moodboards/events-pressed-board-booth.png', alt: 'Exhibition booth built from pressed mycelium board', kind: 'visualisation' },
    ],
    related: ['architectural-surfaces', 'fungal-art-series', 'mushroomiya'],
    inquiry: { cta: 'Start a commission', projectFields: true, quantityLabel: 'Scale (size, area or quantity)' },
    material: 'PALMYCO™ mycelium composite', origin: 'Dubai, UAE',
    shippingClass: 'project_freight', internationalInquiryEligible: true,
    seo: { title: 'Bespoke Mycelium Commissions in Dubai | NUMU', description: 'Custom PALMYCO™ mycelium pieces for hospitality, culture, events and architecture: walls, lighting, objects and artworks grown in Dubai to a brief. Price on request.' },
  },
  {
    id: 'mycelium-hotline', slug: 'mycelium-hotline', name: 'Mycelium Hotline', subtitle: 'A material conversation', category: 'Experiences', transactionMode: 'booking', status: 'available', priceType: 'on_request', stage: 'service',
    description: 'A focused conversation for material questions, project thinking, and early-stage collaboration.', story: 'Forty-five minutes with the people who grow the material.',
    storyParagraphs: [
      'The Mycelium Hotline is a one-to-one call with the NUMU team for designers, architects, makers and researchers working with mycelium: growing problems, material choices, feasibility of a project, or how to start.',
      'Sessions are booked and paid through Cal.com. If online booking is not open at the moment, send a request with your preferred times and we will reply with a booking link.',
    ],
    inquiry: { cta: 'Request a session', quantityLabel: 'Preferred dates and times (Dubai time)' },
    leadTime: '45 minutes', images: [{ src: '/images/projects/production_detail_03.jpg', alt: 'NUMU material production detail', kind: 'photograph' }], bookingProvider: 'cal.com', bookingUrl: process.env.NEXT_PUBLIC_CAL_HOTLINE_URL,
    seo: { title: 'Mycelium Hotline | NUMU', description: 'Book a NUMU material conversation.' },
  },
  {
    id: 'masterclass', slug: 'masterclass', name: 'Masterclass', subtitle: 'Future workshop', category: 'Experiences', transactionMode: 'booking', status: 'coming_soon', priceType: 'on_request', stage: 'service',
    description: 'A future NUMU workshop around materials, making, and biological systems.', story: 'Programme details will be announced when confirmed.',
    images: [{ src: '/images/projects/production_detail_02.jpg', alt: 'NUMU material process', kind: 'photograph' }], seo: { title: 'Masterclass | NUMU', description: 'Future NUMU materials workshop.' },
  },
  // Draft records prove the catalogue supports future objects without publishing commercial claims.
  { id: 'small-lamp-01', slug: 'small-lamp-01', name: 'Small Lamp 01', subtitle: 'Development object', category: 'Lighting', transactionMode: 'inquiry', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  { id: 'small-lamp-02', slug: 'small-lamp-02', name: 'Small Lamp 02', subtitle: 'Development object', category: 'Lighting', transactionMode: 'inquiry', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  // No photographs of the stool exist yet; publish only when real images are supplied.
  { id: 'mycelium-stool', slug: 'mycelium-stool', name: 'Mycelium Stool', subtitle: 'Development object', category: 'Furniture & Objects', transactionMode: 'inquiry', status: 'draft', priceType: 'on_request', description: '', story: '', images: [], seo: { title: '', description: '' } },
  ...(process.env.NODE_ENV === 'development' ? [{
    id: 'shop-review-object', slug: 'shop-review-object', name: 'Shop Review Object', subtitle: 'Development-only checkout fixture', category: 'Furniture & Objects' as const, transactionMode: 'purchase' as const, status: 'draft' as const, priceType: 'fixed' as const,
    // Local-only fixture for exercising the dormant cart and checkout routes. Kept as draft so it never
    // appears in the inquiry catalogue, even in development.
    priceAed: 100000, stripePriceId: process.env.STRIPE_DEV_REVIEW_PRICE_ID, leadTime: 'Development fixture', description: 'A local-only product for reviewing cart, pickup, delivery, and checkout states. It is never published in production.', story: 'This is not a NUMU object or commercial offer.', material: 'Development fixture', images: [{ src: '/images/products/pressed_detail.jpg', alt: 'NUMU material detail used only for local shop review' }], variants: [{ id: 'review-natural', name: 'Review configuration' }], shippingClass: 'small_parcel' as const, pickupEligible: true, gccShippingEligible: true, internationalInquiryEligible: true,
    seo: { title: 'Shop Review Object | Development only', description: 'Local checkout fixture; never published.' },
  } satisfies Product] : []),
]

export const publicProducts = PRODUCTS.filter((product) => product.status !== 'draft' && product.status !== 'archived')
export const getProduct = (slug: string) => PRODUCTS.find((product) => product.slug === slug)
export const isPhysical = (product: Pick<Product, 'category'>) => product.category !== 'Experiences'
export const relatedProducts = (product: Product) =>
  (product.related ?? []).map(getProduct).filter((item): item is Product => !!item && publicProducts.includes(item))
