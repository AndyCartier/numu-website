import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'
import { BuiltWorkDetail } from '@/app/PageClient'
import ChapterNav from '@/components/ChapterNav'

const page = requireSeoPage('case-studies')

export const metadata = buildSeoMetadata(page)

export default function CaseStudiesPage() {
  return (
    <SeoLandingPage page={page}>
      <BuiltWorkDetail />
      <ChapterNav current="projects" />
    </SeoLandingPage>
  )
}
