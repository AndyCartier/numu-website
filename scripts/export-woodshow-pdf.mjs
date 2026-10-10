import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const DECK_URL = `${BASE_URL}/talk/woodshow?snapshot=1`
const OUT_DIR = resolve(ROOT, 'exports', 'woodshow')
const OUT_FILE = resolve(OUT_DIR, 'NUMU_WoodShow_2026_FINAL.pdf')
const TEMP_DIR = resolve(OUT_DIR, '.tmp-woodshow-pdf')
const SLIDE_W = 1920
const SLIDE_H = 1080

function slideUrl(slideNumber) {
  return `${BASE_URL}/talk/woodshow?slide=${slideNumber}&snapshot=1`
}

function slidePdfPath(slideNumber) {
  return resolve(TEMP_DIR, `slide-${String(slideNumber).padStart(2, '0')}.pdf`)
}

async function waitForFonts(page) {
  await page.evaluate(() => document.fonts.ready)
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 800))
}

async function captureSlidePdf({ deckPage, pdfPage, slideNumber }) {
  await deckPage.goto(slideUrl(slideNumber), {
    waitUntil: 'networkidle0',
    timeout: 90_000,
  })

  await waitForFonts(deckPage)

  const frameCount = await deckPage.evaluate(() => document.querySelectorAll('.woodshow-frame').length)
  if (frameCount !== 1) {
    throw new Error(`Slide ${slideNumber} rendered ${frameCount} frames instead of 1.`)
  }

  const imageBuffer = await deckPage.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: SLIDE_W, height: SLIDE_H },
  })

  const imageData = imageBuffer.toString('base64')
  await pdfPage.setContent(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>NUMU WoodShow Talk</title>
        <style>
          @page {
            size: 1920px 1080px;
            margin: 0;
          }

          html,
          body {
            width: 1920px;
            height: 1080px;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #1b1714;
          }

          img {
            display: block;
            width: 1920px;
            height: 1080px;
          }
        </style>
      </head>
      <body>
        <img src="data:image/png;base64,${imageData}" alt="NUMU WoodShow slide ${slideNumber}" />
      </body>
    </html>`,
    { waitUntil: 'load' }
  )

  await waitForFonts(pdfPage)
  await pdfPage.pdf({
    path: slidePdfPath(slideNumber),
    printBackground: true,
    preferCSSPageSize: true,
    pageRanges: '1',
  })
}

function mergeSlidePdfs(slideCount) {
  const slidePdfs = Array.from({ length: slideCount }, (_, index) => slidePdfPath(index + 1))

  execFileSync('pdfunite', [...slidePdfs, OUT_FILE], {
    stdio: 'inherit',
  })
}

function readPdfPageCount(pdfPath) {
  const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' })
  const match = info.match(/Pages:\s+(\d+)/)
  if (!match) {
    throw new Error('Could not read PDF page count from pdfinfo output.')
  }

  return Number(match[1])
}

async function main() {
  console.log('\n  NUMU WoodShow PDF Export')
  console.log('  ──────────────────────────────────────────')
  console.log(`  Source : ${DECK_URL}`)
  console.log(`  Output : ${OUT_FILE}`)
  console.log(`  Size   : ${SLIDE_W} × ${SLIDE_H}  (16:9)\n`)

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true })
  }

  rmSync(TEMP_DIR, { recursive: true, force: true })
  mkdirSync(TEMP_DIR, { recursive: true })

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--disable-lcd-text',
    ],
  })

  const deckPage = await browser.newPage()
  const pdfPage = await browser.newPage()

  await deckPage.setViewport({ width: SLIDE_W, height: SLIDE_H, deviceScaleFactor: 1 })
  await pdfPage.setViewport({ width: SLIDE_W, height: SLIDE_H, deviceScaleFactor: 1 })

  console.log('  → Validating deck…')
  await deckPage.goto(DECK_URL, {
    waitUntil: 'networkidle0',
    timeout: 90_000,
  })
  await waitForFonts(deckPage)

  const slideCount = await deckPage.evaluate(() =>
    document.querySelectorAll('.woodshow-frame').length
  )
  console.log(`  → Found ${slideCount} slides`)

  if (slideCount === 0) {
    throw new Error(
      'No .woodshow-frame elements found. Is the dev server running?\n' +
      `  Try: npm run dev\n  URL: ${DECK_URL}`
    )
  }

  if (slideCount < 1) {
    throw new Error('Expected at least one slide, found none.')
  }

  console.log('  → Capturing slides…')
  for (let slideNumber = 1; slideNumber <= slideCount; slideNumber += 1) {
    console.log(`    Slide ${String(slideNumber).padStart(2, '0')} / ${slideCount}`)
    await captureSlidePdf({ deckPage, pdfPage, slideNumber })
  }

  await browser.close()

  console.log('  → Merging slide PDFs…')
  mergeSlidePdfs(slideCount)

  const pageCount = readPdfPageCount(OUT_FILE)
  if (pageCount !== slideCount) {
    throw new Error(`Merged PDF has ${pageCount} pages. Expected ${slideCount}.`)
  }

  rmSync(TEMP_DIR, { recursive: true, force: true })

  console.log(`\n  ✓ PDF written to:\n    ${OUT_FILE}`)
  console.log(`  ✓ Pages: ${pageCount}\n`)
}

main().catch((err) => {
  console.error('\n  ✗ Export failed:\n ', err.message)
  process.exit(1)
})
