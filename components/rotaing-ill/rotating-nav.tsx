'use client'

import React from 'react'

import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
} from '@react-hook/window-size/throttled'
// import ResponsiveComponent from "../ResponsiveComponent";
import { motion } from 'framer-motion'

import { BtnList } from '@/constants'
import NavButton from './nav-btn'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const RotatingNavigation = () => {
  const angleIncrement = 360 / BtnList.length
  const [width, height] = useWindowSize()
  const size: number = width

  const isLarge = size >= 1024
  const isMedium = size >= 768

  return (
    <div className="w-full mx-auto absolute inset-0 h-full flex items-center justify-center">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        className="w-max flex items-center justify-center relative hover:pause animate-spin-slow group"
      >
        {BtnList.map((btn, index) => {
          const angleRad = (index * angleIncrement * Math.PI) / 180
          const radius = isLarge
            ? 'calc(20vw - 1rem)'
            : isMedium
            ? 'calc(30vw - 1rem)'
            : 'calc(40vw - 1.5rem)'
          const x = `calc(${radius}*${Math.cos(angleRad)})`
          const y = `calc(${radius}*${Math.sin(angleRad)})`

          return <NavButton key={btn.label} x={x} y={y} {...btn} />
        })}
      </motion.div>
    </div>
  )
}

export default RotatingNavigation
