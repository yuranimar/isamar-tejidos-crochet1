'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const VARIANTS = {
  primary: {
    bg: '#7A1E3A',
    text: '#FFFFFF',
    border: '#F8F4EF',

    hoverBg: '#F8F4EF',
    hoverText: '#7A1E3A',
    hoverBorder: '#7A1E3A'
  },

  secondary: {
    bg: '#D4A75D',
    text: '#3B2412',
    border: '#3B2412',

    hoverBg: '#3B2412',
    hoverText: '#D4A75D',
    hoverBorder: '#D4A75D'
  }
}

export default function StitchedButton({
  children,
  className = '',
  href,
  variant = 'primary'
}) {
  const btnRef = useRef(null)
  const svgRef = useRef(null)
  const rectRef = useRef(null)
  const needleRef = useRef(null)

  const perimeterRef = useRef(0)
  const timelineRef = useRef(null)

  const theme = VARIANTS[variant] || VARIANTS.primary

  useEffect(() => {
    const btn = btnRef.current
    const rect = rectRef.current
    const svg = svgRef.current

    if (!btn || !rect || !svg) return

    const updateDimensions = () => {
      const w = btn.offsetWidth
      const h = btn.offsetHeight

      svg.setAttribute('width', w)
      svg.setAttribute('height', h)

      rect.setAttribute('width', w - 2)
      rect.setAttribute('height', h - 2)

      const perimeter = 2 * ((w - 2) + (h - 2))

      perimeterRef.current = perimeter

      rect.setAttribute('stroke-dasharray', perimeter)
      rect.setAttribute('stroke-dashoffset', perimeter)
    }

    updateDimensions()

    const ro = new ResizeObserver(updateDimensions)
    ro.observe(btn)

    return () => ro.disconnect()
  }, [])

  const moveNeedle = (progress) => {
    const btn = btnRef.current
    const needle = needleRef.current

    if (!btn || !needle) return

    const w = btn.offsetWidth - 2
    const h = btn.offsetHeight - 2

    const perimeter = 2 * (w + h)

    let distance = perimeter * progress

    let x = 0
    let y = 0
    let rotation = 0

    if (distance <= w) {
      x = distance
      rotation = 0
    } else if (distance <= w + h) {
      x = w
      y = distance - w
      rotation = 90
    } else if (distance <= 2 * w + h) {
      x = w - (distance - (w + h))
      y = h
      rotation = 180
    } else {
      x = 0
      y = h - (distance - (2 * w + h))
      rotation = 270
    }

    gsap.set(needle, {
      x,
      y,
      rotation,
      transformOrigin: 'center center'
    })
  }

  const handleEnter = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    gsap.to(btnRef.current, {
      backgroundColor: theme.hoverBg,
      color: theme.hoverText,
      duration: 0.35
    })

    gsap.to(rectRef.current, {
      stroke: theme.hoverBorder,
      duration: 0.35
    })

    moveNeedle(0)

    const tl = gsap.timeline()

    tl.set(needleRef.current, {
      opacity: 1
    })

    tl.to(rectRef.current, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'none',
      onUpdate() {
        moveNeedle(this.progress())
      }
    })

    tl.to(
      btnRef.current,
      {
        scale: 1.05,
        duration: 0.25,
        ease: 'power2.out'
      },
      0
    )

    timelineRef.current = tl
  }

  const handleLeave = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    gsap.to(rectRef.current, {
      strokeDashoffset: perimeterRef.current,
      opacity: 0,
      stroke: theme.border,
      duration: 0.45
    })

    gsap.to(needleRef.current, {
      opacity: 0,
      duration: 0.2
    })

    gsap.to(btnRef.current, {
      backgroundColor: theme.bg,
      color: theme.text,
      scale: 1,
      duration: 0.35
    })
  }

  const handleClick = () => {
    if (!href) return

    const target = document.querySelector(href)

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`
        relative
        px-10
        py-4
        uppercase
        text-sm
        md:text-base
        font-semibold
        tracking-[0.2em]
        rounded-md
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        ${className}
      `}
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        border: `2px solid ${theme.border}`,
        overflow: 'visible'
      }}
    >
      <svg
        ref={svgRef}
        className="absolute pointer-events-none"
        style={{
          top: '-2px',
          left: '-2px',
          overflow: 'visible'
        }}
      >
        <rect
          ref={rectRef}
          x="1"
          y="1"
          fill="none"
          stroke={theme.border}
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeLinecap="round"
          opacity="0"
          rx="8"
        />

        <g ref={needleRef} opacity="0">
          <line
            x1="-8"
            y1="0"
            x2="8"
            y2="0"
            stroke={theme.border}
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle
            cx="-8"
            cy="0"
            r="1.5"
            fill={theme.border}
          />
        </g>
      </svg>

      <span className="relative z-10">
        {children}
      </span>
    </button>
  )
}