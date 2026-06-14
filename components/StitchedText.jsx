'use client'

// src/components/StitchedText.jsx

import { motion } from 'framer-motion'

function StitchedLetter({ char, delay }) {
  if (char === ' ') {
    return <span className="inline-block w-[0.3em]" />
  }

  return (
    <span className="relative inline-block">
      <motion.span
        initial={{
          opacity: 0,
          y: 8,
          filter: 'blur(3px)'
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)'
        }}
        transition={{
          delay,
          duration: 0.35
        }}
        className="inline-block"
      >
        {char}
      </motion.span>

      <motion.span
        initial={{
          scale: 0,
          opacity: 0
        }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          delay,
          duration: 0.4
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
      </motion.span>
    </span>
  )
}

export default function StitchedText({ text }) {
  return (
    <>
      {text.split('').map((char, index) => (
        <StitchedLetter
          key={index}
          char={char}
          delay={index * 0.06}
        />
      ))}
    </>
  )
}