'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { PRIMARY_NAV_LINKS } from '@/lib/navigation'
export default function MobileNav({ dark = false }: { dark?: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null)
  // Close when tapping anywhere outside the open menu.
  useEffect(() => {
    const close = (event: PointerEvent) => {
      const el = menu.current
      if (el?.open && !el.contains(event.target as Node)) el.open = false
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  return <details ref={menu} className={`mobile-navigation${dark ? ' mobile-navigation-dark' : ''}`} onKeyDown={event => { if (event.key === 'Escape' && menu.current) { menu.current.open = false; menu.current.querySelector('summary')?.focus() } }}>
    <summary aria-label="Open navigation menu">Menu <span aria-hidden>☰</span></summary>
    <nav aria-label="Mobile navigation">
      {[{href:'/',label:'Home'},...PRIMARY_NAV_LINKS,{href:'/#contact',label:'Contact'}].map(link => <Link key={link.href} href={link.href} onClick={() => { if(menu.current) menu.current.open=false }}>{link.label}<span aria-hidden>↗</span></Link>)}
    </nav>
  </details>
}
