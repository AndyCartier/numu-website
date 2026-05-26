import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — NUMU',
  description: 'How NUMU collects, uses, stores, and protects website inquiry data.',
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

export default function PrivacyPage() {
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

        <p style={sectionTitleStyle}>Privacy Policy</p>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
            margin: '1rem 0 1.5rem',
          }}
        >
          Privacy for inquiry and investor requests.
        </h1>
        <p style={{ ...bodyStyle, maxWidth: 680, marginBottom: '3rem' }}>
          Effective May 24, 2026. This site is operated by NUMU in Dubai, UAE. If you contact us through this website, we collect only the information needed to respond to your request and manage the relationship that follows.
        </p>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>What We Collect</p>
          <p style={bodyStyle}>
            We collect the email address you submit through our website contact forms, along with the request type you chose and the page or source that triggered the inquiry. We also collect limited technical information needed to protect the form, such as request headers, approximate network origin, and anti-spam signals.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>How We Use It</p>
          <p style={bodyStyle}>
            We use submitted information to reply to project inquiries, sample requests, and investor deck requests, to prevent spam or abusive traffic, and to maintain basic operational records for business follow-up.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>How It Is Processed</p>
          <p style={bodyStyle}>
            Website requests are processed through our website infrastructure and email service providers. At the time of writing, this site is hosted on Vercel and contact-form notifications are delivered through Resend. We do not sell personal information or use submitted inquiry emails for unrelated advertising lists without further permission.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Retention</p>
          <p style={bodyStyle}>
            We keep inquiry records only for as long as reasonably necessary to manage conversations, evaluate business opportunities, keep internal correspondence, and meet legal or accounting obligations.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Your Choices</p>
          <p style={bodyStyle}>
            You may ask us to update or delete inquiry information you previously submitted, subject to any legal obligations that require retention. You can also choose not to use the website forms and contact us through other public NUMU channels instead.
          </p>
        </section>

        <section style={{ borderTop: '1px solid rgba(26,23,20,0.12)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={sectionTitleStyle}>Contact</p>
          <p style={bodyStyle}>
            For privacy requests or questions about this policy, contact NUMU at <a href="mailto:andy@numu.bio" style={{ color: 'inherit' }}>andy@numu.bio</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
