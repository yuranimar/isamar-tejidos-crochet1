'use client'

import IsamarLogo from './IsamarLogo'
import { buildGeneralWA } from '../lib/whatsapp'

const WA_URL = buildGeneralWA(
  'Hola Isamar 👋 Me interesa una pieza de tu colección de tejidos y crochet 🧶'
)

// ⚠️ Reemplaza estas URLs con las reales de Isamar
const SOCIAL = [
  {
    label: 'Instagram',
    href:  'https://instagram.com/isamar.tejidos', // ← cambiar
    color: '#E1306C',
    icon:  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />,
  },
  {
    label: 'Facebook',
    href:  'https://facebook.com/isamar.tejidos', // ← cambiar
    color: '#4267B2',
    icon:  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />,
  },
  {
    label: 'TikTok',
    href:  'https://tiktok.com/@isamar.tejidos', // ← cambiar
    color: '#000000',
    icon:  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 3 3 0 0 1 1.04.17V7.1a5.94 5.94 0 0 0-2.41-.5 6 6 0 1 0 5.48 8.56V9.06a8.42 8.42 0 0 0 4.09 1.09V6.69z" />,
  },
]

export default function Footer() {
  return (
    <footer id="contact"
      className="pt-20 pb-10 rounded-t-[2rem] border-t-4"
      style={{ background: '#8B3A45', color: '#F5EBE6', borderColor: 'rgba(245,235,230,0.20)', boxShadow: '0 -10px 30px rgba(139,58,69,0.3)' }}>

      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <span className="text-[0.6rem] tracking-[0.3em] uppercase opacity-70 mb-4 block">
          ¿Lista para tu pieza artesanal?
        </span>
        <h2 className="font-serif text-3xl md:text-4xl mb-8 font-light">
          Hablemos sobre tu <em className="italic opacity-80">pedido personalizado</em>
        </h2>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className="inline-block px-10 py-4 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-[0.7rem] font-bold shadow-lg"
          style={{ background: '#F5EBE6', color: '#8B3A45' }}
          onMouseEnter={e => e.currentTarget.style.background = '#EAD8D8'}
          onMouseLeave={e => e.currentTarget.style.background = '#F5EBE6'}
        >
          Escribir por WhatsApp
        </a>
      </div>

      <div className="px-6 md:px-16 flex flex-col items-center gap-8 pt-8"
        style={{ borderTop: '1px solid rgba(245,235,230,0.10)' }}>
        <div className="flex items-center gap-3 opacity-90">
          <IsamarLogo size={24} variant="light" />
          <span className="font-serif text-lg tracking-[0.15em]">ISAMAR • TEJIDOS Y CROCHET</span>
        </div>

        <div className="flex gap-6">
          {SOCIAL.map(social => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
              aria-label={social.label} title={social.label}
              className="group w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ border: '1px solid rgba(245,235,230,0.30)', '--hover-color': social.color }}
              onMouseEnter={e => { e.currentTarget.style.background = social.color; e.currentTarget.style.borderColor = 'transparent' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,235,230,0.30)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>

        <p className="text-[0.55rem] tracking-[0.25em] uppercase opacity-50 text-center">
          © {new Date().getFullYear()} Isamar • Tejidos y Crochet • Hecho a mano
          <br />
          <span className="opacity-70 mt-1 block">Desarrollado por: Yurani Martinez</span>
        </p>
      </div>
    </footer>
  )
}
