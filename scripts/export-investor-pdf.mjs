import puppeteer from 'puppeteer'
import { resolve } from 'path'
import { createHmac } from 'crypto'
import { homedir } from 'os'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const DECK_URL = `${BASE_URL}/investor-deck?snapshot=1`

const today = new Date().toISOString().slice(0, 10)
const OUT_FILE = resolve(homedir(), 'Downloads', `NUMU_Investor_Deck_${today}.pdf`)

const INVESTOR_SECRET = process.env.NEXT_PUBLIC_INVESTOR_PASSWORD ?? 'NUMU2026'
const ACCESS_TOKEN = createHmac('sha256', INVESTOR_SECRET)
  .update('numu-investor-access:v1')
  .digest('hex')

async function main() {
  console.log('\n  NUMU Investor Deck — PDF Export')
  console.log('  ──────────────────────────────────────────')
  console.log(`  Source : ${DECK_URL}`)
  console.log(`  Output : ${OUT_FILE}\n`)

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

  // Set auth cookie
  await page.setCookie({
    name: 'numu_investor_access',
    value: ACCESS_TOKEN,
    domain: 'localhost',
    path: '/',
  })

  console.log('  → Loading deck…')
  await page.goto(DECK_URL, { waitUntil: 'networkidle0', timeout: 90_000 })
  await page.evaluate(() => document.fonts.ready)
  await new Promise(r => setTimeout(r, 1200))

  const slideCount = await page.evaluate(
    () => document.querySelectorAll('.deck-screen-frame').length
  )

  if (slideCount === 0) {
    throw new Error('No .deck-screen-frame elements found. Is the dev server running?')
  }

  console.log(`  → Found ${slideCount} slides`)
  console.log('  → Generating PDF (using print stylesheet)…')

  await page.pdf({
    path: OUT_FILE,
    printBackground: true,
    preferCSSPageSize: true,
  })

  await browser.close()

  console.log(`\n  ✓ Saved to:\n    ${OUT_FILE}`)
  console.log(`  ✓ Pages: ${slideCount}\n`)
}

main().catch(err => {
  console.error('\n  ✗ Export failed:\n ', err.message)
  process.exit(1)
})
