/**
 * NUMU Investor Deck — PDF Export
 *
 * Uses Puppeteer (already installed) to render /investor-deck at 1600×900
 * and export a 16:9 landscape PDF to exports/NUMU_Investor_Deck.pdf
 *
 * Usage:
 *   npm run export:deck
 *
 * Requirements:
 *   - Next.js dev server running at http://localhost:3000  (npm run dev)
 *     OR pass a custom base URL: BASE_URL=https://your-domain npm run export:deck
 *   - Investor access password available in INVESTOR_PASSWORD
 *     (falls back to NEXT_PUBLIC_INVESTOR_PASSWORD for older local setups)
 */

import puppeteer from 'puppeteer'
import { existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const BASE_URL  = process.env.BASE_URL ?? 'http://localhost:3000'
const DECK_URL  = `${BASE_URL}/investor-deck`
const OUT_DIR   = resolve(ROOT, 'exports')
const OUT_FILE  = resolve(OUT_DIR, 'NUMU_Investor_Deck.pdf')
const SLIDE_W   = 1600
const SLIDE_H   = 900
const INVESTOR_PASSWORD = process.env.INVESTOR_PASSWORD ?? process.env.NEXT_PUBLIC_INVESTOR_PASSWORD ?? ''

async function main() {
  console.log(`\n  NUMU — Investor Deck Export`)
  console.log(`  ──────────────────────────────────────────`)
  console.log(`  Source : ${DECK_URL}`)
  console.log(`  Output : ${OUT_FILE}`)
  console.log(`  Size   : ${SLIDE_W} × ${SLIDE_H}  (16:9)\n`)

  // Ensure output directory exists
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true })
  }

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

  // Match the slide viewport exactly
  await page.setViewport({ width: SLIDE_W, height: SLIDE_H, deviceScaleFactor: 2 })

  if (!INVESTOR_PASSWORD) {
    throw new Error(
      'Missing investor access password.\n' +
      '  Set INVESTOR_PASSWORD before running this export.'
    )
  }

  console.log('  → Unlocking investor access…')
  await page.goto(BASE_URL, {
    waitUntil: 'networkidle0',
    timeout: 60_000,
  })

  const unlocked = await page.evaluate(async (password) => {
    const res = await fetch('/api/investor-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: password }),
    })

    return res.ok
  }, INVESTOR_PASSWORD)

  if (!unlocked) {
    throw new Error(
      'Investor access unlock failed.\n' +
      '  Check that INVESTOR_PASSWORD matches the configured access code.'
    )
  }

  console.log('  → Navigating to deck…')
  await page.goto(DECK_URL, {
    waitUntil: 'networkidle0',
    timeout: 60_000,
  })

  // Wait for fonts and images to be fully painted
  await page.evaluate(() =>
    document.fonts.ready
  )

  // Allow lazy-loaded images a moment to settle
  await new Promise((r) => setTimeout(r, 1500))

  // Verify slide count
  const slideCount = await page.evaluate(() =>
    document.querySelectorAll('.slide').length
  )
  console.log(`  → Found ${slideCount} slides`)

  if (slideCount === 0) {
    throw new Error(
      'No .slide elements found. Is the dev server running?\n' +
      `  Try: npm run dev  (then re-run this script)\n` +
      `  URL: ${DECK_URL}`
    )
  }

  console.log('  → Generating PDF…')

  await page.pdf({
    path: OUT_FILE,
    width:  `${SLIDE_W}px`,
    height: `${SLIDE_H}px`,
    printBackground: true,
    pageRanges: '',
    // Chromium maps @page CSS to the PDF dimensions when we pass these
  })

  await browser.close()

  console.log(`\n  ✓ PDF written to:\n    ${OUT_FILE}`)
  console.log(`  ✓ Pages: ${slideCount}\n`)
}

main().catch((err) => {
  console.error('\n  ✗ Export failed:\n ', err.message)
  process.exit(1)
})
