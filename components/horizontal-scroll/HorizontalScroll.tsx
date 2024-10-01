'use client'
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'
import { animate, scroll, spring } from 'motion'
import { ReactLenis } from 'lenis/react'
import {
  MotionProps,
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from 'framer-motion'
import BOrtodensi from '../../public/images/b-a/beefore-ortodensi.webp'
import AOrtodensi from '../../public/images/b-a/after-ortodensi.webp'
import BJermgiri from '../../public/images/b-a/before-jermgiri.webp'
import AJermgiri from '../../public/images/b-a/after-jermgiri.webp'
import BMasnoei from '../../public/images/b-a/before-masnooei.webp'
import AMasnoei from '../../public/images/b-a/after-masnooei.webp'
import BTarmim from '../../public/images/b-a/before-tarmim.webp'
import ATarmim from '../../public/images/b-a/after-tarmim.webp'
import CompareSlider from '../CompareSlider'

export function throttle(fn: (...args: any[]) => any, wait: number) {
  let shouldWait = false

  return function throttledFunction(this: any, ...args: any[]) {
    if (!shouldWait) {
      fn.apply(this, args)
      shouldWait = true
      setTimeout(() => (shouldWait = false), wait)
    }
  }
}
function useElementViewportPosition(ref: React.RefObject<HTMLElement>) {
  const [position, setPosition] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (!ref || !ref.current) return

    const pageHeight = document.body.scrollHeight
    const start = ref.current.offsetTop
    const end = start + ref.current.offsetHeight

    setPosition([start / pageHeight, end / pageHeight])
  }, [])

  return { position }
}

const slideAnimation: MotionProps = {
  variants: {
    full: { backgroundColor: '#008299' },
    partial: { backgroundColor: '#ffffff' },
  },
  initial: 'partial',
  whileInView: 'full',
  viewport: { amount: 1, once: false },
}

export default function HorizontalScroll(): JSX.Element {
  const mainRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { position } = useElementViewportPosition(mainRef)
  //   const { ref, start, end } = useRefScrollProgress(mainRef)
  const [carouselEndPosition, setCarouselEndPosition] = useState(0)
  const { scrollYProgress, scrollY } = useScroll()
  const x = useTransform(scrollYProgress, position, [0, carouselEndPosition])

  console.log(carouselEndPosition)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log('Page scroll: ', latest)
  })
  useEffect(() => {
    window.addEventListener('scroll', () => console.log(carouselEndPosition))
  }, [])

  useEffect(() => {
    if (!carouselRef || !carouselRef.current) return
    const parent = carouselRef.current.parentElement
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    const resetCarouselEndPosition = () => {
      if (carouselRef && carouselRef.current) {
        const newPosition =
          carouselRef.current.clientWidth -
          window.innerWidth +
          scrollbarWidth +
          (parent as HTMLElement).offsetLeft * 2

        setCarouselEndPosition(-newPosition)
      }
    }

    resetCarouselEndPosition()
    const handleResize = throttle(resetCarouselEndPosition, 10)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <section dir="ltr" ref={mainRef}>
      <div className="w-full mx-auto" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen w-full flex flex-col items-start justify-center overflow-hidden">
          <motion.div ref={carouselRef} className="flex gap-10" style={{ x }}>
            <motion.div
              {...slideAnimation}
              className="group relative h-[300px] w-[300px] overflow-hidden bg-neutral-200"
            >
              <CompareSlider
                disableHandle={true}
                before={BOrtodensi}
                after={AOrtodensi}
                disease="ارتودنسی"
                index={0}
              />
            </motion.div>

            <motion.div
              {...slideAnimation}
              className="group relative h-[300px] w-[300px] overflow-hidden bg-neutral-200"
            >
              <CompareSlider
                disableHandle={true}
                before={BTarmim}
                after={ATarmim}
                disease="ترمیم"
                index={1}
              />
            </motion.div>

            <motion.div
              {...slideAnimation}
              className="group relative h-[300px] w-[300px] overflow-hidden bg-neutral-200"
            >
              <CompareSlider
                disableHandle={true}
                before={BJermgiri}
                after={AJermgiri}
                disease="جرمگیری"
                index={0}
              />
            </motion.div>

            <motion.div
              {...slideAnimation}
              className="group relative h-[300px] w-[300px] overflow-hidden bg-neutral-200"
            >
              <CompareSlider
                disableHandle={true}
                before={BMasnoei}
                after={AMasnoei}
                disease="دندان مصنوعی"
                index={1}
              />
            </motion.div>

            <motion.div
              {...slideAnimation}
              className="group relative h-[300px] w-[300px] overflow-hidden bg-neutral-200"
            >
              <Image
                src="https://res.cloudinary.com/dzl9yxixg/image/upload/v1713532202/ui-layout/team_gsu8ej.png"
                className="w-full flex-shrink-0 h-full object-cover"
                width={500}
                height={500}
                alt="image"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <footer className="group">
        <h1 className="text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear">
          ui-layout
        </h1>
        <section className="bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full">
          Thanks for Scrolling
        </section>
      </footer>
    </section>
  )
}

// https://mye-commerce.storage.iran.liara.space/after-implant.webp.2d385c2e-41a5-4c81-8957-af452ab30016
