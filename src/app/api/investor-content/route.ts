import { NextRequest, NextResponse } from 'next/server'
import { hasValidInvestorAccessToken, investorPrivateHeaders, INVESTOR_ACCESS_COOKIE } from '@/lib/investorAccess'
import { loadInvestorStory } from '@/lib/loadInvestorStory'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!hasValidInvestorAccessToken(request.cookies.get(INVESTOR_ACCESS_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: investorPrivateHeaders })
  }

  const story = await loadInvestorStory()
  return NextResponse.json(story ?? { error: 'The investor overview is temporarily unavailable.' }, {
    status: story ? 200 : 503,
    headers: investorPrivateHeaders,
  })
}

export function DELETE() {
  const response = new NextResponse(null, { status: 204, headers: investorPrivateHeaders })
  response.cookies.set({
    name: INVESTOR_ACCESS_COOKIE,
    value: '',
    path: '/api/investor-content',
    maxAge: 0,
  })
  return response
}
