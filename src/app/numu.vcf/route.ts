import { NUMU_NAP } from '@/lib/siteFacts'

export const dynamic = 'force-static'

// "Save contact" for visitors at the stand: a vCard that iPhone and Android import directly.
export function GET() {
  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Cartier;Andy;;;',
    'FN:Andy Cartier',
    `ORG:${NUMU_NAP.legalName}`,
    'TITLE:Founder & CEO',
    `EMAIL;TYPE=INTERNET,WORK:${NUMU_NAP.email}`,
    'TEL;TYPE=CELL,VOICE:+971505384166',
    'URL:https://www.numu.bio',
    'ADR;TYPE=WORK:;;IFZA Business Park\\, Building A1\\, Dubai Digital Park;Dubai Silicon Oasis\\, Dubai;;;United Arab Emirates',
    'NOTE:NUMU — grown materials\\, surfaces and objects from PALMYCO™\\, made in Dubai. Mycelium Hotline: www.cal.eu/andycartier/hotline',
    'END:VCARD',
    '',
  ].join('\r\n')
  return new Response(card, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="NUMU-Andy-Cartier.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
