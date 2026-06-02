import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Connect with NUMU',
  description: 'Quick links to the NUMU website, email, WhatsApp, and Studio Cartier Instagram.',
  alternates: {
    canonical: '/connect',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const CONTACTS = [
  {
    label: 'Website',
    value: 'numu.bio',
    href: 'https://www.numu.bio',
    note: 'Explore the material platform',
    action: 'Open site',
  },
  {
    label: 'Email',
    value: 'andy@numu.bio',
    href: 'mailto:andy@numu.bio?subject=NUMU%20inquiry',
    note: 'Project, sample, or investor inquiry',
    action: 'Email Andy',
  },
  {
    label: 'WhatsApp',
    value: '+971 50 538 4166',
    href: 'https://wa.me/971505384166',
    note: 'Fast direct contact',
    action: 'Message on WhatsApp',
  },
  {
    label: 'Instagram',
    value: '@studiocartier',
    href: 'https://www.instagram.com/studiocartier/',
    note: 'See Studio Cartier works',
    action: 'View works',
  },
]

const linkStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '1rem',
  alignItems: 'center',
  padding: '1.1rem 1rem',
  border: '1px solid rgba(198,106,63,0.42)',
  color: 'inherit',
  textDecoration: 'none',
  backgroundColor: 'rgba(198,106,63,0.11)',
}

export default function ConnectPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#1A1612', color: '#EFEAD8' }}>
      <section
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem 1.25rem',
          background:
            'radial-gradient(circle at 50% 15%, rgba(198,106,63,0.16), transparent 34%), linear-gradient(180deg, #1A1612 0%, #110f0d 100%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 680 }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginBottom: '2rem',
              color: '#807B70',
              textDecoration: 'none',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            NUMU / Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Image
              src="/branding/logo-numu.png"
              alt="NUMU"
              width={132}
              height={52}
              style={{
                width: 132,
                height: 'auto',
                filter: 'brightness(0) invert(1) sepia(1) saturate(0) brightness(0.86)',
                opacity: 0.72,
              }}
              priority
            />
          </div>

          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              marginBottom: '2rem',
              padding: '1.25rem',
              border: '1px solid rgba(239,234,216,0.12)',
              backgroundColor: 'rgba(239,234,216,0.035)',
            }}
          >
            <Image
              src="/qr/numu-connect-texture-qr.svg"
              alt="NUMU QR code over a mycelium texture background"
              width={360}
              height={360}
              unoptimized
              style={{ width: 'min(100%, 360px)', height: 'auto' }}
              priority
            />
          </div>

          <p
            style={{
              color: '#C66A3F',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            Direct contact
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: '3.4rem',
              lineHeight: 0.96,
              letterSpacing: 0,
              marginBottom: '1.2rem',
            }}
          >
            Reach NUMU.
          </h1>
          <p style={{ color: '#D9D3BF', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Bio-composite materials grown in Dubai. Use the links below for the website,
            email, direct WhatsApp contact, or Studio Cartier works.
          </p>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {CONTACTS.map((contact) => (
              <a key={contact.label} href={contact.href} style={linkStyle}>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      color: '#C66A3F',
                      fontSize: '0.65rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {contact.label}
                  </span>
                  <span
                    className="font-display"
                    style={{ display: 'block', fontSize: '1.48rem', lineHeight: 1.12, wordBreak: 'break-word' }}
                  >
                    {contact.value}
                  </span>
                  <span style={{ display: 'block', color: '#D9D3BF', fontSize: '0.86rem', marginTop: '0.35rem' }}>
                    {contact.note}
                  </span>
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#EFEAD8',
                    border: '1px solid rgba(239,234,216,0.24)',
                    padding: '0.65rem 0.75rem',
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {contact.action} <span aria-hidden="true">-&gt;</span>
                </span>
              </a>
            ))}
          </div>

          <p style={{ color: '#807B70', fontSize: '0.72rem', lineHeight: 1.7, marginTop: '2rem' }}>
            QR destination: https://www.numu.bio/connect
          </p>
        </div>
      </section>
    </main>
  )
}
