'use client'
import { FC } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RippleBgProps {
  className?: string
}

const RippleBg: FC<RippleBgProps> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 800 800"
      >
        <defs>
          <radialGradient id="cccircular-grad" r="50%" cx="50%" cy="50%">
            <stop offset="25%" stop-color="#cb839a" stop-opacity="0.5"></stop>
            <stop
              offset="85%"
              stop-color="hsl(341, 100%, 85%)"
              stop-opacity="1"
            ></stop>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5"></stop>
          </radialGradient>
        </defs>
        <motion.g
          initial={{}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            // type: 'spring',
            // bounce: 0.1,
            // repeat: Infinity,
            staggerChildren: 0.1,
            delayChildren: 0.1,
            repeatDelay: 0.1,
          }}
          fill="url(#cccircular-grad)"
        >
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="352"
            cx="400"
            cy="400"
            opacity="1.00"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="320"
            cx="400"
            cy="400"
            opacity="0.981"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="288"
            cx="400"
            cy="400"
            opacity="0.81"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="256"
            cx="400"
            cy="400"
            opacity="0.72"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="224"
            cx="400"
            cy="400"
            opacity="0.62"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="192"
            cx="400"
            cy="400"
            opacity="0.53"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="160"
            cx="400"
            cy="400"
            opacity="0.43"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="128"
            cx="400"
            cy="400"
            opacity="0.34"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="96"
            cx="400"
            cy="400"
            opacity="0.24"
          ></motion.circle>
          <motion.circle
            initial={{ scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.1,
              repeatType: 'mirror',
              repeat: Infinity,
            }}
            r="64"
            cx="400"
            cy="400"
            opacity="0.15"
          ></motion.circle>
        </motion.g>
      </svg>
    </div>
  )
}

export default RippleBg
