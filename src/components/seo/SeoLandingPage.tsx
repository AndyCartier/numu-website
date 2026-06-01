import Image from 'next/image'
import Link from 'next/link'
import { buildSeoJsonLd, type SeoPageData } from '@/lib/seo'

const sectionLabelStyle = {
  fontSize: '0.72rem',
  letterSpacing: '0.18em',
  opacity: 0.52,
  textTransform: 'uppercase' as const,
}

export function SeoLandingPage({ page }: { page: SeoPageData }) {
  const jsonLd = buildSeoJsonLd(page)

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(198,106,63,0.12), transparent 32%), linear-gradient(180deg, #f5f1e8 0%, #efe8dc 100%)',
        color: '#1a1714',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
        <Link
          href="/"
          style={{
            ...sectionLabelStyle,
            display: 'inline-block',
            marginBottom: '2.25rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          NUMU / Back Home
        </Link>

        <section
          style={{
            display: 'grid',
            gap: '2.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={sectionLabelStyle}>{page.kicker}</p>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                lineHeight: 0.94,
                letterSpacing: '-0.045em',
                margin: '1rem 0 1.25rem',
                maxWidth: 720,
              }}
            >
              {page.heading}
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.9,
                opacity: 0.76,
                maxWidth: 690,
                marginBottom: '2rem',
              }}
            >
              {page.intro}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                href="/#contact"
                style={{
                  padding: '0.95rem 1.2rem',
                  border: '1px solid rgba(26,23,20,0.7)',
                  backgroundColor: 'rgba(26,23,20,0.08)',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                }}
              >
                Contact NUMU
              </Link>
              <Link
                href="/#material"
                style={{
                  padding: '0.95rem 1.2rem',
                  border: '1px solid rgba(26,23,20,0.18)',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                }}
              >
                Explore the material system
              </Link>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              minHeight: 420,
              border: '1px solid rgba(26,23,20,0.1)',
              overflow: 'hidden',
              backgroundColor: 'rgba(26,23,20,0.06)',
            }}
          >
            <Image
              src={page.image.src}
              alt={page.image.alt}
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(26,23,20,0.58) 0%, rgba(26,23,20,0.08) 55%, rgba(26,23,20,0) 100%)',
              }}
            />
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22, color: '#f4efe8' }}>
              <p
                style={{
                  fontSize: '0.62rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  opacity: 0.64,
                  marginBottom: 6,
                }}
              >
                Search-ready landing page
              </p>
              <p
                className="font-display"
                style={{ fontSize: '1.4rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}
              >
                Built to rank for product intent, not just brand awareness.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 1,
            backgroundColor: 'rgba(26,23,20,0.12)',
            margin: '4rem 0',
          }}
        >
          {page.highlights.map((item) => (
            <div key={item.label} style={{ backgroundColor: 'rgba(255,255,255,0.42)', padding: '1.15rem 1rem' }}>
              <p style={{ ...sectionLabelStyle, fontSize: '0.62rem', marginBottom: 8 }}>{item.label}</p>
              <p className="font-display" style={{ fontSize: '1.35rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <p style={{ ...sectionLabelStyle, marginBottom: '1.2rem' }}>Applications</p>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {page.applications.map((application, index) => (
              <article
                key={application.title}
                style={{
                  padding: '1.4rem',
                  border: '1px solid rgba(26,23,20,0.1)',
                  backgroundColor: index === 0 ? 'rgba(198,106,63,0.07)' : 'rgba(255,255,255,0.42)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    opacity: 0.5,
                    marginBottom: 10,
                  }}
                >
                  Use case {index + 1}
                </p>
                <h2
                  className="font-display"
                  style={{ fontSize: '1.55rem', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 12 }}
                >
                  {application.title}
                </h2>
                <p style={{ fontSize: '0.98rem', lineHeight: 1.85, opacity: 0.74 }}>
                  {application.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            marginBottom: '4rem',
          }}
        >
          {page.sections.map((section) => (
            <article
              key={section.title}
              style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(26,23,20,0.14)',
              }}
            >
              <h2
                className="font-display"
                style={{ fontSize: '1.9rem', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1rem' }}
              >
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{ fontSize: '1rem', lineHeight: 1.9, opacity: 0.72, marginBottom: '0.95rem' }}
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <p style={{ ...sectionLabelStyle, marginBottom: '1rem' }}>Frequently searched questions</p>
          <div style={{ borderTop: '1px solid rgba(26,23,20,0.14)' }}>
            {page.faq.map((item) => (
              <article
                key={item.question}
                style={{
                  display: 'grid',
                  gap: '0.9rem',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  padding: '1.2rem 0',
                  borderBottom: '1px solid rgba(26,23,20,0.12)',
                }}
              >
                <h2
                  className="font-display"
                  style={{ fontSize: '1.3rem', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}
                >
                  {item.question}
                </h2>
                <p style={{ fontSize: '0.98rem', lineHeight: 1.85, opacity: 0.74, margin: 0 }}>
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            paddingTop: '1.6rem',
            borderTop: '1px solid rgba(26,23,20,0.14)',
          }}
        >
          <p style={{ ...sectionLabelStyle, marginBottom: '1rem' }}>Related search paths</p>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {page.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '1.2rem',
                  border: '1px solid rgba(26,23,20,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <p
                  className="font-display"
                  style={{ fontSize: '1.35rem', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 8 }}
                >
                  {link.title}
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.7 }}>{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {jsonLd.map((item, index) => (
        <script
          key={`${page.slug}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </main>
  )
}
