'use client'
import { motion, useTransform, useScroll } from 'framer-motion'
import { useRef } from 'react'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import BOrtodensi from '../../public/images/b-a/beefore-ortodensi.webp'
import AOrtodensi from '../../public/images/b-a/after-ortodensi.webp'
import BJermgiri from '../../public/images/b-a/before-jermgiri.webp'
import AJermgiri from '../../public/images/b-a/after-jermgiri.webp'
import BMasnoei from '../../public/images/b-a/before-masnooei.webp'
import AMasnoei from '../../public/images/b-a/after-masnooei.webp'
import BTarmim from '../../public/images/b-a/before-tarmim.webp'
import ATarmim from '../../public/images/b-a/after-tarmim.webp'
import CompareSlider from '../CompareSlider'

type CardType = {
  url: string
  title: string
  id: string
  cover?: string | null
}

interface HorizontalScrollCarouselProps {
  rtl?: boolean
  className?: string
}
const HorizontalScrollCarousel = ({
  rtl,

  className,
}: HorizontalScrollCarouselProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })
  const xTransform: string = rtl ? '75%' : '-75%'
  const x = useTransform(scrollYProgress, [0, 1], ['1%', xTransform])

  //   for rtl
  //   const x = useTransform(scrollYProgress, [0, 1], ['1%', '75%'])

  return (
    <section
      dir={rtl ? 'rtl' : 'ltr'}
      ref={targetRef}
      className={cn('relative h-[300vh] bg-transparent')}
    >
      <div className="!sticky top-0 flex h-[75vh] items-center overflow-hidden  ">
        <motion.div style={{ x }} className="flex gap-4">
          <Link
            href={`/products`}
            className=" bg-transparent flex items-center justify-center group relative h-fit w-fit md:w-fit overflow-hidden  "
          >
            <CompareSlider
              disableHandle={true}
              before={BOrtodensi}
              after={AOrtodensi}
              disease="ارتودنسی"
              index={0}
            />
          </Link>
          <CompareSlider
            disableHandle={true}
            before={BTarmim}
            after={ATarmim}
            disease="ترمیم"
            index={1}
          />
          <CompareSlider
            disableHandle={true}
            before={BJermgiri}
            after={AJermgiri}
            disease="جرمگیری"
            index={0}
          />
          <CompareSlider
            disableHandle={true}
            before={BMasnoei}
            after={AMasnoei}
            disease="دندان مصنوعی"
            index={1}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default HorizontalScrollCarousel
