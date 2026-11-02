import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { buildSeoMetadata } from '@/lib/seo'
import { requireSeoPage } from '@/lib/seoPages'
import { MaterialDetail, ApplicationsDetail, ExploreCTA } from '@/app/PageClient'
import ChapterNav from '@/components/ChapterNav'

const page = requireSeoPage('palmyco')

export const metadata = buildSeoMetadata(page)

export default function PalmycoPage() {
  return (
    <SeoLandingPage page={page}>
      <MaterialDetail />
      <ApplicationsDetail />
      <ExploreCTA />
      <ChapterNav current="material" />
    </SeoLandingPage>
  )
}
