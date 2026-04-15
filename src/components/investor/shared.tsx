export const iBorder     = '1px solid rgba(245,241,232,0.1)'
export const iBorderSoft = '1px solid rgba(245,241,232,0.06)'

export function IS({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-28 md:py-40" style={{ borderTop: iBorder }}>
      <div className="max-w-[1440px] mx-auto">{children}</div>
    </section>
  )
}

export function IL({ text }: { text: string }) {
  return (
    <p className="font-sans text-label uppercase tracking-[0.2em] mb-6" style={{ opacity: 0.35 }}>
      {text}
    </p>
  )
}

export function IH2({ text, className = '' }: { text: string; className?: string }) {
  return (
    <h2 className={`font-display text-headline mb-10 max-w-3xl ${className}`} style={{ textWrap: 'balance' }}>{text}</h2>
  )
}

export function IBody({ text }: { text: string }) {
  return (
    <p className="font-sans text-base md:text-[1.0625rem] leading-[1.75] mb-10 max-w-2xl" style={{ opacity: 0.55 }}>
      {text}
    </p>
  )
}
