import pptxgen from 'pptxgenjs'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SLIDES_DIR = resolve(ROOT, 'exports', 'woodshow', 'slides')
const OUTPUT = resolve(ROOT, 'NUMU_WoodShow_2026.pptx')
const WOODSHOW_VIDEO_SLIDE = 7
const TIMELAPSE_VIDEO = resolve(ROOT, 'public', 'videos', 'numu_timelapse.mp4')
const TIMELAPSE_POSTER = resolve(ROOT, 'exports', 'woodshow', 'timelapse_poster.jpg')
// Video native dimensions: 720×960 (portrait 3:4)
const TIMELAPSE_ASPECT = 720 / 960
const VIDEO_TARGETS = new Map([
  [WOODSHOW_VIDEO_SLIDE, TIMELAPSE_VIDEO],
])

const SLIDE_W = 13.333333
const SLIDE_H = 7.5

function requireFile(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing required file: ${path}`)
  }
  return path
}

function asDataUri(path) {
  const ext = path.toLowerCase().endsWith('.png') ? 'png' : 'jpeg'
  const body = readFileSync(path).toString('base64')
  return `data:image/${ext};base64,${body}`
}

async function main() {
  requireFile(TIMELAPSE_VIDEO)

  const slidePaths = readdirSync(SLIDES_DIR)
    .filter((file) => /^slide-\d+\.png$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => resolve(SLIDES_DIR, file))

  if (slidePaths.length < 1) {
    throw new Error(`No rendered slide PNGs found in ${SLIDES_DIR}`)
  }

  slidePaths.forEach(requireFile)

  const deck = new pptxgen()
  deck.layout = 'LAYOUT_WIDE'
  deck.author = 'Andy Cartier'
  deck.company = 'NUMU'
  deck.subject = 'NUMU Dubai WoodShow 2026 talk deck'
  deck.title = 'NUMU_WoodShow_2026'
  deck.lang = 'en-US'

  for (const [index, slidePath] of slidePaths.entries()) {
    const slideNumber = index + 1
    const slide = deck.addSlide()

    slide.addImage({
      path: slidePath,
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: SLIDE_H,
    })

    const videoPath = VIDEO_TARGETS.get(slideNumber)
    if (videoPath) {
      // Portrait video (720×960): center within landscape slide with correct ratio
      const vidH = SLIDE_H
      const vidW = vidH * TIMELAPSE_ASPECT
      const vidX = (SLIDE_W - vidW) / 2
      slide.addMedia({
        type: 'video',
        path: videoPath,
        cover: existsSync(TIMELAPSE_POSTER) ? asDataUri(TIMELAPSE_POSTER) : asDataUri(slidePath),
        x: vidX,
        y: 0,
        w: vidW,
        h: vidH,
      })
    }
  }

  await deck.writeFile({ fileName: OUTPUT })
  console.log(`WoodShow deck written to ${OUTPUT}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
