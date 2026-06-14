'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import WovenText from './StitchedText'
import StitchedButton from './StitchedButton'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.16 } } }

const HERO_IMAGES = ['/hero/hero1.jpg', '/hero/hero2.jpg', '/hero/hero3.jpg']

function useValidImages(paths) {
  const [valid, setValid] = useState([])
  useEffect(() => {
    Promise.all(
      paths.map(src => new Promise(resolve => {
        const img = new Image()
        img.onload  = () => resolve(src)
        img.onerror = () => resolve(null)
        img.src = src
      }))
    ).then(results => setValid(results.filter(Boolean)))
  }, [paths])
  return valid
}

export default function Hero() {
  const images   = useValidImages(HERO_IMAGES)
  const hasImages = images.length > 0
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  useEffect(() => {
    if (!hasImages || paused || images.length < 2) return
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(id)
  }, [hasImages, paused, images.length])

  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      style={{ background: '#F3E7D3' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Filtro crochet */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="crochet-roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="3" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Imágenes de fondo */}
      <div className="absolute inset-0">
        {hasImages && images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: current === i ? 1 : 0, scale: current === i ? 1.05 : 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* Overlay crema cálido */}
      <div className="absolute inset-0" style={{ background: 'rgba(243,231,211,0.70)' }} />

      {/* Contenido */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.div variants={fadeUp}>
          <span className="inline-block text-[0.7rem] tracking-[0.35em] uppercase border px-6 py-2 mb-10"
            style={{ color: '#8B3A45', borderColor: '#8B3A45' }}>
            Creado puntada a puntada
          </span>
        </motion.div>

        <h1 className="leading-[1.05] tracking-tight" style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(3.4rem, 8vw, 6.5rem)', color: '#3E141B' }}>
          <WovenText text="Cada hilo," delay={0.3} />
          <br />
          <span className="italic" style={{ color: '#7A2E38' }}>
            <WovenText text="una historia" delay={1.4} />
          </span>
        </h1>

        <motion.div initial={{ width: 0 }} animate={{ width: 180 }} transition={{ duration: 1.5, delay: 0.5 }}
          className="h-px mx-auto my-8" style={{ background: '#CBB38B' }} />

        <motion.div variants={fadeUp} className="flex gap-5 justify-center">
          <StitchedButton href="#catalog" className="bg-[#8B3A45] text-white">Ver Colección</StitchedButton>
          <StitchedButton href="#about"   className="bg-[#F3E7D3] text-[#8B3A45]">Nuestra Historia</StitchedButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
