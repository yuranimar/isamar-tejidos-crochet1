'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IsamarLogo from './IsamarLogo'
import { useCart } from '../context/CartContext'
import { buildGeneralWA } from '../lib/whatsapp'

const NAV_WA = buildGeneralWA('Hola Isamar! 👋 Me gustaría hacer un pedido 🧶')

const LINKS = [
  { label: 'Colección',    href: '#catalog' },
  { label: 'Sobre Isamar', href: '#about'   },
  { label: 'Contacto',     href: '#contact' },
]

function CartBag({ count, onClick }) {
  return (
    <button onClick={onClick}
      className="relative w-11 h-11 flex items-center justify-center rounded-full border shadow-md hover:shadow-lg hover:scale-[1.05] transition-all duration-300"
      style={{ background: '#F3E7D3', borderColor: '#CBB38B' }}
      aria-label="Ver carrito"
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
        <path d="M11 12 C11 7 13 5 16 5 C19 5 21 7 21 12" stroke="#6A1B2A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 12 L24 12 L22.5 27 C22.3 28.1 21.3 29 20.2 29 L11.8 29 C10.7 29 9.7 28.1 9.5 27 Z" fill="#6A1B2A" />
        <line x1="10"  y1="16.5" x2="22"   y2="16.5" stroke="#F3E7D3" strokeWidth="0.8" strokeDasharray="1.5 1.2"/>
        <line x1="9.6" y1="20"   x2="22.4" y2="20"   stroke="#F3E7D3" strokeWidth="0.8" strokeDasharray="1.5 1.2"/>
        <line x1="9.3" y1="23.5" x2="22.7" y2="23.5" stroke="#F3E7D3" strokeWidth="0.8" strokeDasharray="1.5 1.2"/>
        <line x1="13" y1="13"   x2="13" y2="28.2" stroke="#8B3A45" strokeWidth="0.5" strokeDasharray="1.2 2.2"/>
        <line x1="16" y1="12.5" x2="16" y2="28.8" stroke="#8B3A45" strokeWidth="0.5" strokeDasharray="1.2 2.2"/>
        <line x1="19" y1="13"   x2="19" y2="28.2" stroke="#8B3A45" strokeWidth="0.5" strokeDasharray="1.2 2.2"/>
        <rect x="7.5" y="11" width="17" height="2.5" rx="1.2" fill="#8B3A45"/>
        <circle cx="16" cy="12.2" r="1.2" fill="#CBB38B"/>
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border text-[0.6rem]"
            style={{ background: '#6A1B2A', color: '#F3E7D3', borderColor: 'rgba(203,179,139,0.4)' }}>
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { totalItems, open: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navBg = scrolled || menuOpen
    ? 'backdrop-blur-sm border-b shadow-sm'
    : 'bg-transparent'

  return (
    <>
      <motion.nav
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        style={scrolled || menuOpen ? { background: 'rgba(243,231,211,0.95)', borderColor: 'rgba(203,179,139,0.3)' } : {}}
      >
        <div className="flex items-center justify-between px-5 md:px-12 py-4">
          <a href="#" className="flex items-center gap-3">
            <IsamarLogo size={30} />
            <div className="leading-tight">
              <span className="block tracking-[0.22em]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 600, color: '#6A1B2A' }}>
                ISAMAR
              </span>
              <span className="hidden md:block tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: '8px', fontWeight: 400, color: '#CBB38B' }}>
                Tejidos &amp; Crochet
              </span>
            </div>
          </a>

          <ul className="hidden md:flex gap-10">
            {LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href}
                  className="relative pb-1 group transition-all duration-500 ease-out hover:tracking-[0.35em]"
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6A1B2A', fontWeight: 600 }}>
                  {link.label}
                  <span className="absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-in-out" style={{ background: '#8B3A45' }} />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <CartBag count={totalItems} onClick={openCart} />
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden text-xl" style={{ color: '#8B3A45' }} aria-label="Menú">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 pt-28 px-8 md:hidden"
            style={{ background: '#F3E7D3' }}
          >
            <nav className="flex flex-col gap-10">
              {LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="transition-all duration-300 ease-in-out hover:translate-x-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 600, color: '#4A121D', letterSpacing: '0.05em' }}>
                  {link.label}
                </a>
              ))}
              <a href={NAV_WA} target="_blank" rel="noopener noreferrer"
                className="mt-10 py-4 text-center transition-colors duration-300"
                style={{ background: '#6A1B2A', color: '#F3E7D3', fontFamily: "'Raleway', sans-serif", fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                🧶 Pedir por WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
