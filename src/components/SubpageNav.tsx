import Image from '@/components/SafariSafeImage'
import Link from 'next/link'
import { PRIMARY_NAV_LINKS } from '@/lib/navigation'
import MobileNav from '@/components/MobileNav'

const BORDER = '1px solid rgba(128,128,128,0.15)'

function isActive(href: string, currentPath: string) {
  if (href === '/') return currentPath === '/'
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SubpageNav({ currentPath }: { currentPath: string }) {
  return (
    <nav aria-label="Primary navigation" className="px-6 md:px-12 h-16 md:h-20 flex items-center justify-between" style={{ borderBottom: BORDER }}>
      <Link href="/" aria-label="Back to NUMU homepage" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Image
          src="/branding/logo-black-numu.png"
          alt="NUMU"
          width={156}
          height={62}
          className="h-12 md:h-14 w-auto object-contain"
          priority
        />
      </Link>
      <div className="flex items-center gap-3 md:gap-5">
        <MobileNav />
        <div className="hidden xl:flex items-center gap-5">
          {PRIMARY_NAV_LINKS.map((link) => {
            const active = isActive(link.href, currentPath)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans uppercase tracking-[0.14em]"
                style={{
                  fontSize: '0.6875rem',
                  color: 'inherit',
                  opacity: active ? 0.92 : 0.58,
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
        <Link
          href="/#contact"
          className="font-sans uppercase tracking-[0.14em]"
          style={{ fontSize: '0.6875rem', color: 'inherit', opacity: 0.72, textDecoration: 'none' }}
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}
