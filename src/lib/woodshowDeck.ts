export const WOODSHOW_SLIDE_WIDTH = 1920
export const WOODSHOW_SLIDE_HEIGHT = 1080
export const WOODSHOW_VIDEO_SLIDE = 7

export const WOODSHOW_TIMELAPSE_VIDEO = '/videos/numu_timelapse.mp4'
export const WOODSHOW_TIMELAPSE_VIDEO_FILE = 'public/videos/numu_timelapse.mp4'
export const WOODSHOW_OPENING_MUSHROOM = '/images/talk/woodshow/opening-mushroom.jpg'
export const WOODSHOW_OPENING_MUSHROOM_MYCELIUM = '/images/talk/woodshow/opening-mushroom-mycelium.jpg'
export const WOODSHOW_THIRD_QUESTION_PRODUCT = '/images/talk/woodshow/third-question-product.jpg'
export const WOODSHOW_REROOT_MAIN = '/images/talk/woodshow/reroot-main.jpg'
export const WOODSHOW_ANDY_PORTRAIT = '/images/founder/processed/andy_public.png'
export const WOODSHOW_ANDY_IN_ACTION = '/images/founder/founder_in_action.jpg'
export const WOODSHOW_FEEDSTOCK_PHOTO = '/images/talk/woodshow/feedstock-sawdust-palm-waste.jpg'
export const WOODSHOW_MANUFACTURER_BOARD = '/images/talk/woodshow/pressed-board-from-manufacturer.jpg'
export const WOODSHOW_WASTE_PILE = '/images/talk/woodshow/waste-pile-palm-agricultural.jpg'
export const WOODSHOW_INSTALLATION_BLOCKS = '/images/talk/woodshow/installation-blocks-concrete-ground.jpg'
export const WOODSHOW_LIVING_SHELTER = '/images/talk/woodshow/living-shelter-project.jpg'
export const WOODSHOW_PRESSED_SAMPLES = '/images/projects/Pressed_samples.jpg'

export const SHOW_QR = true
export const SHOW_DESERTBOARD_LOGO = false

export const WOODSHOW_DESERTBOARD_COPY = 'a regional palm-board manufacturer'
export const WOODSHOW_DESERTBOARD_LOGO = '/images/talk/woodshow/desertboard-logo.png'
export const WOODSHOW_DESERTBOARD_PRODUCT_IMAGE = '/images/talk/woodshow/desertboard-product.jpg'

export const WOODSHOW_SURFBOARD_PLACEHOLDERS = [
  '/images/talk/woodshow/surfboard-core-01.jpg',
  '/images/talk/woodshow/surfboard-core-02.jpg',
] as const

export const WOODSHOW_UFO_PLACEHOLDERS = [
  '/images/talk/woodshow/ufo-skate-01.png',
  '/images/talk/woodshow/ufo-skate-02.jpg',
] as const

export const WOODSHOW_HEMP_SHIVS = '/images/materials/hemp_shivs.jpg'
export const WOODSHOW_PRODUCTION_DETAIL_04 = '/images/projects/production_detail_04.jpg'
export const WOODSHOW_TEXTURE_CLOSEUP_01 = '/images/textures/texture_closeup_01.jpg'
export const WOODSHOW_THERMAL_WALL = '/images/applications/thermal_panel_wall.png'
export const WOODSHOW_KINOKO = '/images/projects/Kinoko.jpg'
export const WOODSHOW_MYMO = '/images/projects/Mymo01.jpg'

export const WOODSHOW_THESIS_HOOK = 'Waste is just material in the wrong place.'

export type WoodshowSlideMeta = {
  id: number
  label: string
  title: string
}

export const woodshowSlides: WoodshowSlideMeta[] = [
  { id: 1,  label: 'Title',    title: 'NUMU' },
  { id: 2,  label: 'Opening',  title: 'Do you know mushrooms?' },
  { id: 3,  label: 'Opening',  title: 'Who knows they grow through a hidden root network?' },
  { id: 4,  label: 'Opening',  title: 'Who knows that network can become a material?' },
  { id: 5,  label: 'Thesis',   title: WOODSHOW_THESIS_HOOK },
  { id: 6,  label: 'Act 1',    title: 'What is mycelium?' },
  { id: 7,  label: 'Act 1',    title: 'It grows.' },
  { id: 8,  label: 'Act 1',    title: 'My path, from Europe to Dubai.' },
  { id: 9,  label: 'Act 2',    title: '1 billion tonnes.' },
  { id: 10, label: 'Act 2',    title: 'The feedstock is already here.' },
  { id: 11, label: 'Act 2',    title: 'The waste in this room.' },
  { id: 12, label: 'Act 2',    title: 'Seven days. In the dark.' },
  { id: 13, label: 'Act 2',    title: 'Objects grown from local waste.' },
  { id: 14, label: 'Act 3',    title: 'The field of use is much larger than one product.' },
  { id: 15, label: 'Act 3',    title: 'Material properties.' },
  { id: 16, label: 'Act 3',    title: '' },
  { id: 17, label: 'Act 3',    title: 'The same process. Applied to performance.' },
  { id: 18, label: 'Act 4',    title: 'Waste in. Material out. Back to earth.' },
  { id: 19, label: 'Projects', title: 'Kinoko.' },
  { id: 20, label: 'Projects', title: 'Mymo.' },
  { id: 21, label: 'Projects', title: 'Projects that prove the process.' },
  { id: 22, label: 'Projects', title: 'Every substrate, a different material.' },
  { id: 23, label: 'Projects', title: 'Reroot.' },
  { id: 24, label: 'Close',    title: 'The materials for the next chapter are already here.' },
  { id: 25, label: 'Close',    title: 'Come talk to me after.' },
]

export const WOODSHOW_SLIDE_COUNT = SHOW_QR ? woodshowSlides.length : woodshowSlides.length - 1
