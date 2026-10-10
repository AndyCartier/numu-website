'use client'

import { useEffect, useRef, useState } from 'react'
import Image from '@/components/SafariSafeImage'
import collection from '@/generated/visual-collection.json'

const categories = ['All', 'Objects', 'Lighting', 'Spaces', 'Material', 'Studies']
export default function CollectionGallery() {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<(typeof collection)[number] | null>(null)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const sync = () => {
      const value = new URLSearchParams(window.location.search).get('category')
      setCategory(categories.includes(value || '') ? value! : 'All')
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  useEffect(() => {
    if (!selected) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'Tab') { event.preventDefault(); close.current?.focus() }
    }
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', key); previous?.focus() }
  }, [selected])
  const items = category === 'All' ? collection : collection.filter(item => item.category === category)
  return <>
    <div className="collection-filters" role="group" aria-label="Filter the collection">
      {categories.map(value => <button key={value} aria-pressed={category === value} onClick={() => {
        setCategory(value)
        window.history.pushState(null, '', value === 'All' ? '/collections' : `/collections?category=${value}`)
      }}>{value}<span>{value === 'All' ? collection.length : collection.filter(item => item.category === value).length}</span></button>)}
    </div>
    <p className="collection-count" role="status">{items.length} images · Select an image to look closer</p>
    <div className="collection-grid">
      {items.map(item => <figure key={item.src}>
        <button className="collection-image" onClick={() => setSelected(item)} aria-label={`View ${item.title}`}>
          <Image src={item.src} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" className="object-contain" />
        </button>
        <figcaption><p className="review-eyebrow">{item.category}</p><h2>{item.title}</h2><p>{item.caption}</p></figcaption>
      </figure>)}
    </div>
    {selected && <div className="collection-dialog" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
      <div onClick={event => event.stopPropagation()}>
        <button ref={close} className="collection-close" onClick={() => setSelected(null)}>Close ×</button>
        <Image src={selected.src} alt={selected.title} data-lightbox="off" priority sizes="92vw" className="collection-expanded" />
        <p>{selected.title} · {selected.caption}</p>
      </div>
    </div>}
  </>
}
