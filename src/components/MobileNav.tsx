'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { PRIMARY_NAV_LINKS } from '@/lib/navigation'
export default function MobileNav({ dark = false }: { dark?: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null)
  return <details ref={menu} className={`mobile-navigation${dark ? ' mobile-navigation-dark' : ''}`} onKeyDown={event => { if (event.key === 'Escape' && menu.current) { menu.current.open = false; menu.current.querySelector('summary')?.focus() } }}>
    <summary aria-label="Open navigation menu">Menu <span aria-hidden>☰</span></summary>
    <nav aria-label="Mobile navigation">
      {[{href:'/',label:'Home'},...PRIMARY_NAV_LINKS,{href:'/#contact',label:'Contact'}].map(link => <Link key={link.href} href={link.href} onClick={() => { if(menu.current) menu.current.open=false }}>{link.label}<span aria-hidden>↗</span></Link>)}
    </nav>
  </details>
}
