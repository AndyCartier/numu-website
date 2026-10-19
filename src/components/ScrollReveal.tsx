'use client'

import { useEffect } from 'react'

// Editorial scroll reveal: elements marked data-reveal fade up as they enter the viewport.
// Progressive enhancement: nothing is hidden until this script runs (html.js-reveal), it is
// skipped entirely for prefers-reduced-motion, and anything already on screen shows at once.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return
    const root = document.documentElement
    root.classList.add('js-reveal')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        // Reveal on entry, and also anything a fast scroll or anchor jump carried past.
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) { entry.target.classList.add('is-in'); observer.unobserve(entry.target) }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    const watch = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => observer.observe(el))
    watch()
    // Safety net for very fast flicks between observer callbacks.
    const sweep = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in') })
    window.addEventListener('scroll', sweep, { passive: true })
    const mutations = new MutationObserver(watch)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); mutations.disconnect(); window.removeEventListener('scroll', sweep); root.classList.remove('js-reveal') }
  }, [])
  return null
}
