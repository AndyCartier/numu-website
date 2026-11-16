import { loadVisitorContent } from '@/lib/content'
import PageClient from './PageClient'
import { videoJsonLd } from '@/lib/videoMetadata'

export default function Page() {
  const visitor = loadVisitorContent()

  return <>{videoJsonLd.map(item => <script key={item.contentUrl} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}<PageClient visitor={visitor} /></>
}
