import Link from 'next/link'
import Image from '@/components/SafariSafeImage'
import { CHAPTERS, neighbours } from '@/lib/chapters'

/**
 * The foot of every chapter page: where you are among the seven chapters, the next one with a glimpse
 * of it, the previous one, and the way back to the overview on the home page.
 */
export default function ChapterNav({ current }: { current: string }) {
  const { prev, next } = neighbours(current)
  return (
    <nav className="numu-chapters" aria-label="Chapters">
      <div className="numu-chapters-inner">
        <ol className="numu-chapters-track" aria-label="All chapters">
          {CHAPTERS.map(c => (
            <li key={c.id}>
              <Link href={c.href} aria-current={c.id === current ? 'page' : undefined}>{c.name}</Link>
            </li>
          ))}
        </ol>
        {next ? (
          <Link href={next.href} className="numu-chapters-next">
            <span className="numu-chapters-kicker">Next chapter</span>
            <span className="numu-chapters-name font-display">{next.name} <span aria-hidden="true">→</span></span>
            <span className="numu-chapters-glimpse">{next.glimpse}</span>
            <span className="numu-chapters-thumb" aria-hidden="true"><Image src={next.image} alt="" fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" /></span>
          </Link>
        ) : (
          <Link href="/#contact" className="numu-chapters-next">
            <span className="numu-chapters-kicker">That was the last chapter. Next step</span>
            <span className="numu-chapters-name font-display">Specify NUMU <span aria-hidden="true">→</span></span>
            <span className="numu-chapters-glimpse">Samples, project consultation and specification support, from Dubai.</span>
            <span className="numu-chapters-thumb" aria-hidden="true"><Image src={CHAPTERS[0].image} alt="" fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" /></span>
          </Link>
        )}
        <div className="numu-chapters-links">
          {prev && <Link href={prev.href}>← {prev.name}</Link>}
          <Link href="/#inside">All chapters, on the overview ↑</Link>
        </div>
      </div>
    </nav>
  )
}
