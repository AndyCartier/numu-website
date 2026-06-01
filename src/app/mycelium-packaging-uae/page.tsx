import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'

const page = requireSeoPage('mycelium-packaging-uae')

export const metadata = buildSeoMetadata(page)

export default function MyceliumPackagingUaePage() {
  return <SeoLandingPage page={page} />
}
