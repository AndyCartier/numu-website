import { loadPublicTeamMembers, loadVisitorContent } from '@/lib/content'
import PageClient from './PageClient'

export default function Page() {
  const visitor = loadVisitorContent()
  const publicTeamMembers = loadPublicTeamMembers()

  return <PageClient visitor={visitor} publicTeamMembers={publicTeamMembers} />
}
