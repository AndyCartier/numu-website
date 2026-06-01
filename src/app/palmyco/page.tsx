import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'

const page = requireSeoPage('palmyco')

export const metadata = buildSeoMetadata(page)

export default function PalmycoPage() {
  return <SeoLandingPage page={page} />
}
