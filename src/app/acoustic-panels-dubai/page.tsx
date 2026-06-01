import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'

const page = requireSeoPage('acoustic-panels-dubai')

export const metadata = buildSeoMetadata(page)

export default function AcousticPanelsDubaiPage() {
  return <SeoLandingPage page={page} />
}
