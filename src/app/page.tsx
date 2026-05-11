import { loadVisitorContent, loadInvestorContent } from '@/lib/content'
import PageClient from './PageClient'

export default function Page() {
  const visitor  = loadVisitorContent()
  const investor = loadInvestorContent()
  return <PageClient visitor={visitor} investor={investor} />
}
