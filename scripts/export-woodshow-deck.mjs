import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, rmSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const WOODSHOW_SLIDE_WIDTH = 1920
const WOODSHOW_SLIDE_HEIGHT = 1080
const WOODSHOW_VIDEO_SLIDE = 7
const TALK_URL = `${BASE_URL}/talk/woodshow`
const OUT_DIR = resolve(ROOT, 'exports', 'woodshow')
const SLIDES_DIR = resolve(OUT_DIR, 'slides')
const PPTX_SCRIPT = resolve(ROOT, 'scripts', 'build-woodshow-pptx.mjs')

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

function cleanDir(path) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true })
  mkdirSync(path, { recursive: true })
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise()
        return
      }
      rejectPromise(new Error(`${command} exited with code ${code}`))
    })
  })
}

async function captureSlides(page, slideCount) {
  console.log(`→ Capturing ${slideCount} slide PNGs`)
  cleanDir(SLIDES_DIR)

  for (let slide = 1; slide <= slideCount; slide += 1) {
    const url = `${TALK_URL}?slide=${slide}&snapshot=1`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await page.evaluate(() => document.fonts.ready)
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 900))
    const output = resolve(SLIDES_DIR, `slide-${String(slide).padStart(2, '0')}.png`)
    await page.screenshot({ path: output })
  }
}

async function buildDeck() {
  console.log('→ Assembling PPTX')
  await run('node', [PPTX_SCRIPT])
}

async function main() {
  console.log('\nNUMU WoodShow Export')
  console.log('──────────────────────────────────────────')
  console.log(`Source : ${TALK_URL}`)
  console.log(`Slides : ${WOODSHOW_SLIDE_WIDTH} × ${WOODSHOW_SLIDE_HEIGHT}`)
  console.log(`Output : ${resolve(ROOT, 'NUMU_WoodShow_2026.pptx')}\n`)

  ensureDir(OUT_DIR)

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--disable-lcd-text',
    ],
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: WOODSHOW_SLIDE_WIDTH,
    height: WOODSHOW_SLIDE_HEIGHT,
    deviceScaleFactor: 1,
  })

  await page.goto(`${TALK_URL}?snapshot=1`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 900))
  const slideCount = await page.evaluate(() => document.querySelectorAll('.woodshow-frame').length)

  if (slideCount < 1) {
    throw new Error('No WoodShow slides found to export.')
  }

  await captureSlides(page, slideCount)
  await page.goto(`${TALK_URL}?slide=${WOODSHOW_VIDEO_SLIDE}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 1200))
  await browser.close()
  await buildDeck()

  console.log('\n✓ WoodShow export complete\n')
}

main().catch((error) => {
  console.error('\n✗ WoodShow export failed\n', error)
  process.exit(1)
})
