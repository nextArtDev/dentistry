'use client'
import {
  Github,
  Home,
  Linkedin,
  NotebookText,
  Palette,
  Phone,
  Twitter,
  User,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
// import ResponsiveComponent from '../ResponsiveComponent'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useWindowSize } from '@react-hook/window-size'

const getIcon = (icon: string) => {
  switch (icon) {
    case 'home':
      return <Home className="w-full h-auto" strokeWidth={1.5} />
    case 'about':
      return <User className="w-full h-auto" strokeWidth={1.5} />
    case 'projects':
      return <Palette className="w-full h-auto" strokeWidth={1.5} />
    case 'contact':
      return <Phone className="w-full h-auto" strokeWidth={1.5} />
    case 'github':
      return <Github className="w-full h-auto" strokeWidth={1.5} />
    case 'linkedin':
      return <Linkedin className="w-full h-auto" strokeWidth={1.5} />
    case 'twitter':
      return <Twitter className="w-full h-auto" strokeWidth={1.5} />
    case 'resume':
      return <NotebookText className="w-full h-auto" strokeWidth={1.5} />

    default:
      return <Home className="w-full h-auto" strokeWidth={1.5} />
  }
}

const item = {
  hidden: { scale: 0 },
  show: { scale: 1 },
}

const NavLink = motion(Link)

const NavButton = ({
  x,
  y,
  label,
  link,
  icon,
  newTab,
  labelDirection = 'right',
}: {
  x: string | number
  y: string | number
  label: string
  link: string
  icon: string
  newTab: boolean
  labelDirection?: unknown
}) => {
  return (
    <div>
      <div
        className="absolute cursor-pointer z-50"
        style={{
          transform: `translate(-50%, -50%) translate(${x}, ${y})`,
          transformOrigin: 'center',
        }}
      >
        <NavLink
          variants={item}
          href={link}
          target={newTab ? '_blank' : '_self'}
          className="text-foreground  rounded-full flex items-center justify-center
        custom-bg
        "
          aria-label={label}
          id={label}
          prefetch={false}
          scroll={false}
        >
          <span className="relative  w-14 h-14 p-4 animate-spin-slow-reverse group-hover:pause hover:text-accent">
            {getIcon(icon)}

            <span className="peer bg-transparent absolute top-0 left-0 w-full h-full" />

            <span className="absolute hidden peer-hover:block px-2 py-1 left-full mx-2 top-1/2 -translate-y-1/2 bg-background  origin-center text-foreground text-sm rounded-md shadow-lg whitespace-nowrap">
              {label}
            </span>
          </span>
        </NavLink>
      </div>
    </div>
  )
}

export default NavButton
