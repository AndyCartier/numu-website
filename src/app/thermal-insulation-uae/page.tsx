import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'

const page = requireSeoPage('thermal-insulation-uae')

export const metadata = buildSeoMetadata(page)

export default function ThermalInsulationUaePage() {
  return <SeoLandingPage page={page} />
}
