import { NextRequest, NextResponse } from 'next/server'
import { loadInvestorContent } from '@/lib/content'
import { hasValidInvestorAccessToken, INVESTOR_ACCESS_COOKIE } from '@/lib/investorAccess'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(INVESTOR_ACCESS_COOKIE)?.value

  if (!hasValidInvestorAccessToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    )
  }

  return NextResponse.json(loadInvestorContent(), {
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
