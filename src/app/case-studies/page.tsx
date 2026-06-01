import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'

const page = requireSeoPage('case-studies')

export const metadata = buildSeoMetadata(page)

export default function CaseStudiesPage() {
  return <SeoLandingPage page={page} />
}
