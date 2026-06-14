'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { urlFor } from '../lib/supabase'
import { stockInfo } from '../lib/stockInfo'
import { useCart } from '../context/CartContext'

const CATEGORY_LABELS = {
  mantas:         'Mantas',
  accesorios:     'Accesorios',
  personalizados: 'Personalizados',
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] bg-white/80 p-3 shadow-sm">
      <div className="aspect-[3/4] rounded-[1.25rem] mb-4"
        style={{ background: 'linear-gradient(90deg,#F5EBE6 25%,#EAD8D8 50%,#F5EBE6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div className="h-2.5 bg-rose-cool rounded w-1/3 mb-2" />
      <div className="h-4 bg-rose-cool rounded w-2/3 mb-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-rose-cool rounded w-1/4" />
        <div className="h-3 bg-rose-cool rounded w-1/5" />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}

export function StockBadge({ product, className = '' }) {
  const { show, label, level } = stockInfo(product)
  if (!show) return null

  const colors = level === 'critical'
    ? { background: '#6B1E2A', color: '#F5EBE6' }
    : { background: 'rgba(197,160,89,0.90)', color: '#3D2E23' }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold rounded-full shadow-sm backdrop-blur-sm ${className}`} style={colors}>
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
          style={{ background: level === 'critical' ? '#F5EBE6' : '#3D2E23' }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5"
          style={{ background: level === 'critical' ? '#F5EBE6' : '#3D2E23' }} />
      </span>
      {label}
    </span>
  )
}

function GoldenCorners() {
  return (
    <>
      <svg className="absolute top-2.5 left-2.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1 10 L1 1 L10 1" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="1" cy="1" r="1" fill="#C5A059" opacity="0.5"/>
      </svg>
      <svg className="absolute top-2.5 right-2.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1 L19 1 L19 10" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="19" cy="1" r="1" fill="#C5A059" opacity="0.5"/>
      </svg>
      <svg className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1 10 L1 19 L10 19" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="1" cy="19" r="1" fill="#C5A059" opacity="0.5"/>
      </svg>
      <svg className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 19 L19 19 L19 10" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="19" cy="19" r="1" fill="#C5A059" opacity="0.5"/>
      </svg>
    </>
  )
}

export default function ProductCard({ product, index, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [added,   setAdded]   = useState(false)
  const { add, isInCart, open: openCart } = useCart()

  const imageUrl = product.image ? urlFor(product.image) : null
  const isOut    = product.status === 'out'
  const isNew    = product.status === 'new'
  const inCart   = isInCart(product.id)

  const handleAdd = e => {
    e.stopPropagation()
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleCartClick = e => {
    e.stopPropagation()
    openCart()
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      aria-label={`Ver detalles de ${product.name}`}
      className="cursor-pointer group relative rounded-[1.75rem] p-3 transition-all duration-500"
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(91,14,27,0.10)',
        boxShadow: hovered
          ? '0 16px 40px rgba(91,14,27,0.16), 0 4px 12px rgba(91,14,27,0.09)'
          : '0 2px 12px rgba(91,14,27,0.06)',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
      }}
    >
      {/* Resplandor dorado en hover */}
      <div className="absolute inset-0 rounded-[1.75rem] pointer-events-none transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.06), transparent, rgba(91,14,27,0.03))', opacity: hovered ? 1 : 0 }} />

      {/* Imagen */}
      <div className="relative overflow-hidden aspect-[3/4] rounded-[1.25rem] mb-4" style={{ background: '#F8F0F0' }}>
        <GoldenCorners />

        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif text-5xl transition-transform duration-700"
            style={{ color: 'rgba(107,30,42,0.20)', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}>
            🧶
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'rgba(91,14,27,0.05)', opacity: hovered ? 1 : 0 }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {isNew && !isOut && (
            <span className="text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold rounded-full shadow-sm"
              style={{ background: '#5B0E1B', color: '#F5EBE6' }}>Nuevo</span>
          )}
          {isOut && (
            <span className="text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold rounded-full shadow-sm"
              style={{ background: 'rgba(61,46,35,0.65)', color: '#F5EBE6' }}>Agotado</span>
          )}
          {!isOut && <StockBadge product={product} />}
        </div>

        {/* Ver detalles */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 z-20 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(12px)' }}>
          <span className="text-[0.57rem] tracking-[0.18em] uppercase font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#6B1E2A', border: '1px solid rgba(197,160,89,0.50)', boxShadow: '0 2px 12px rgba(91,14,27,0.12)' }}>
            Ver detalles
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <p className="text-[0.55rem] md:text-[0.58rem] tracking-[0.14em] uppercase mb-1" style={{ color: 'rgba(61,46,35,0.45)' }}>
          {CATEGORY_LABELS[product.category] || product.category}
        </p>
        <p className="font-serif text-[0.94rem] md:text-[1.05rem] mb-2.5 leading-snug" style={{ color: '#3D2E23' }}>
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-serif text-[1rem] md:text-[1.1rem] font-medium" style={{ color: '#5B0E1B' }}>
            {product.price}
          </span>
          <span className="text-[0.53rem] md:text-[0.57rem] tracking-[0.1em] uppercase border-b pb-px flex-shrink-0 transition-colors duration-300"
            style={{ color: isOut ? 'rgba(61,46,35,0.35)' : '#C5A059', borderColor: isOut ? 'rgba(61,46,35,0.18)' : '#C5A059' }}>
            {isOut ? 'Avisar' : 'Ver más →'}
          </span>
        </div>
      </div>

      {/* Botón carrito */}
      {!isOut && (
        <button
          onClick={inCart ? handleCartClick : handleAdd}
          className="mt-3 w-full text-[0.59rem] tracking-[0.16em] uppercase font-medium py-2.5 rounded-xl border transition-all duration-300"
          style={added
            ? { background: 'rgba(197,160,89,0.15)', borderColor: '#C5A059', color: '#C5A059' }
            : inCart
              ? { background: 'rgba(91,14,27,0.07)', borderColor: 'rgba(91,14,27,0.38)', color: '#5B0E1B' }
              : { background: 'transparent', borderColor: 'rgba(61,46,35,0.18)', color: 'rgba(61,46,35,0.50)' }
          }
        >
          {added ? '✓ Agregado' : inCart ? 'Ver selección' : '+ Agregar'}
        </button>
      )}
    </motion.article>
  )
}
