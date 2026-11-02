'use client'
import { useEffect, useState } from 'react'
import LeftToGrow from './LeftToGrow'

/** Every NUMU easter egg, mounted once in the root layout. Listed in docs/design-pass-2026-11.md. */
export default function Eggs() {
  return (
    <>
      <FieldNote />
      <SpecSheet />
      <SisterSpore />
      <LeftToGrow />
    </>
  )
}

/** A signed note in the browser console, once per session. Invisible to everyone else. */
function FieldNote() {
  useEffect(() => {
    try { if (sessionStorage.getItem('numu-field-note')) return; sessionStorage.setItem('numu-field-note', '1') } catch {}
    console.log(
      '%cNUMU  نُمُوّ%c\n\n' +
      'Grown, not manufactured: mycelium, regional palm fibre, a mould and 5–7 days.\n' +
      'Made in Dubai.\n\n' +
      'Questions about the material? The Mycelium Hotline is a 30-minute call every Wednesday:\n' +
      'https://www.cal.eu/andycartier/hotline\n\n' +
      'Two more things to find: press ? on any page, and type “grow”.',
      'font:500 18px/1.3 Georgia,serif;color:#1a1714',
      'font:12px/1.6 system-ui,sans-serif;color:#4a3f34',
    )
  }, [])
  return null
}

/**
 * Press ? (outside a field) for the specification sheet of the page itself: its grid, margins,
 * typefaces and colours, drawn over the page. ? or Esc closes. Keyboard curiosity; no touch trigger.
 */
function SpecSheet() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const t = event.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (event.key === '?') setOpen(o => !o)
      else if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <p className="sr-only" role="status">{open ? 'Specification sheet shown. Press question mark or Escape to close.' : ''}</p>
      {open && (
        <div className="numu-spec" aria-hidden="true">
          <div className="numu-spec-grid">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
          <div className="numu-spec-card">
            <p className="numu-spec-title">Specification, numu.bio</p>
            <dl>
              <dt>Grid</dt><dd>12 columns, 48 px margins (24 px on a phone)</dd>
              <dt>Display</dt><dd>Fraunces, optical size to 144</dd>
              <dt>Text</dt><dd>Inter, 16–17 px</dd>
              <dt>Colour</dt>
              <dd className="numu-spec-swatches">
                <span style={{ background: '#1a1714' }} />Substrate
                <span style={{ background: '#f5f1e8' }} />Canvas
                <span style={{ background: '#8a7256' }} />Clay
              </dd>
              <dt>Material</dt><dd>PALMYCO™, mycelium on regional palm fibre</dd>
              <dt>Growth</dt><dd>5–7 days in the mould</dd>
            </dl>
            <p className="numu-spec-foot">Press ? or Esc to close</p>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Visitors who arrive from studio-cartier.com bring a spore with them: Studio Cartier's orange dot
 * lands beside the wordmark for a few seconds. Once per session.
 */
function SisterSpore() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let from = ''
    try { from = new URL(document.referrer).hostname } catch {}
    const forced = new URLSearchParams(location.search).has('spore')
    if (!forced && !/(^|\.)studio-cartier\.com$/.test(from)) return
    try { if (!forced && sessionStorage.getItem('numu-sister-spore')) return; sessionStorage.setItem('numu-sister-spore', '1') } catch {}
    setShow(true)
    const t = setTimeout(() => setShow(false), 9000)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <button type="button" className="numu-sister-spore" onClick={() => setShow(false)}>
      <span className="numu-sister-dot" aria-hidden="true" />
      <span>A spore drifted over from Studio Cartier.</span>
    </button>
  )
}
