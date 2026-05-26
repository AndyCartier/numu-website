import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — NUMU',
  description: 'Terms governing use of the NUMU website and contact surfaces.',
}

const sectionTitleStyle = {
  fontSize: '0.78rem',
  letterSpacing: '0.18em',
  opacity: 0.48,
  textTransform: 'uppercase' as const,
}

const bodyStyle = {
  fontSize: '1rem',
  lineHeight: 1.85,
  opacity: 0.72,
}

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f1e8', color: '#1a1714' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
        <a
          href="/"
          style={{
            ...sectionTitleStyle,
            display: 'inline-block',
            marginBottom: '2.5rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          NUMU / Back Home
        </a>

        <p style={sectionTitleStyle}>Terms of Use</p>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
            margin: '1rem 0 1.5rem',
          }}
        >
          Terms for using the NUMU website.
        </h1>
        <p style={{ ...bodyStyle, maxWidth: 680, marginBottom: '3rem' }}>
          Effective May 24, 2026. By using this website, you agree to these terms. If you do not agree, please do not use the site or its contact forms.
        </p>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Website Content</p>
          <p style={bodyStyle}>
            This site is provided for general informational, commercial, and relationship-building purposes. We may update, remove, or revise site content at any time without notice.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>No Offer or Commitment</p>
          <p style={bodyStyle}>
            Public website content does not constitute a binding commercial offer, technical guarantee, financing commitment, or securities offering. Investor materials, where access is granted, are confidential and are shared for discussion purposes only.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Acceptable Use</p>
          <p style={bodyStyle}>
            You agree not to misuse the website, attempt unauthorized access, interfere with the site or its forms, scrape protected materials, submit spam, or use the site in any way that could damage NUMU or other users.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Intellectual Property</p>
          <p style={bodyStyle}>
            Unless otherwise stated, the site design, text, visuals, trademarks, product names, and associated materials belong to NUMU or are used with permission. You may not reuse them beyond normal viewing and evaluation without written consent.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>External Services</p>
          <p style={bodyStyle}>
            This site may rely on third-party infrastructure and service providers to operate. We are not responsible for outages, delays, or failures caused by those providers beyond our reasonable control.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Contact</p>
          <p style={bodyStyle}>
            Questions about these terms can be sent to <a href="mailto:andy@numu.bio" style={{ color: 'inherit' }}>andy@numu.bio</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
