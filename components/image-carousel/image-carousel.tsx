'use client'

import { Movie, movies, randomMoviesSet1, randomMoviesSet2 } from './video'

import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import Image from 'next/image'
// import { useWindowSize } from './useWindowSize'

import { Button } from '@/components/ui/button'

export const ImageCarousel = () => {
  const { width, height } = useWindowSize()
  const carouselWrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: carouselWrapperRef,
    offset: ['start start', 'end start'],
  })

  const maximumScale = useMemo(() => {
    const windowYRatio = height / width
    const xScale = 1.66667
    const yScale = xScale * (16 / 9) * windowYRatio
    return Math.max(xScale, yScale)
  }, [width, height])
  // console.log({ maximumScale })
  const scale = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.66],
    [maximumScale * 1.1, maximumScale, 1]
    // [1.8, 1.3, 1]
  )

  const postersOpacity = useTransform(scrollYProgress, [0.64, 0.66], [0, 1])
  const posterTranslateXLeft = useTransform(
    scrollYProgress,
    [0.64, 0.66],
    [-20, 0]
  )
  const posterTranslateXRight = useTransform(
    scrollYProgress,
    [0.64, 0.66],
    [20, 0]
  )

  const [carouselVariant, setCarouselVariant] = useState<'inactive' | 'active'>(
    'inactive'
  )
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (progress >= 0.67) {
      setCarouselVariant('active')
    } else {
      setCarouselVariant('inactive')
    }
  })

  return (
    <motion.div
      dir="ltr"
      animate={carouselVariant}
      className="bg-gradient-to-t from-orange-950/20 to-orange-500/20 pb-16 z-0 "
    >
      <div
        ref={carouselWrapperRef}
        className="mt-[-100vh] h-[300vh] overflow-clip"
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative left-1/2 mb-5 flex -translate-x-1/2 gap-5">
            <motion.div
              style={{ opacity: postersOpacity, x: posterTranslateXLeft }}
              className="relative aspect-[9/16] w-[300px] shrink-0 overflow-clip rounded-2xl md:aspect-video md:w-[60vw]"
            >
              <Image
                fill
                className="h-full w-full object-cover"
                src={movies[0].poster}
                alt={movies[0].name}
              />
            </motion.div>
            <motion.div
              style={{ scale }}
              className="relative aspect-[9/16] w-[300px] shrink-0 overflow-clip rounded-2xl md:aspect-video md:w-[60vw]"
            >
              <Image
                fill
                className="h-full w-full object-cover"
                src={movies[1].poster}
                alt={movies[1].name}
              />
              <motion.div
                variants={{
                  active: { opacity: 1 },
                  inactive: { opacity: 0 },
                }}
                className="absolute bottom-0 left-0 flex w-full flex-col items-center gap-4 p-5 text-lg text-white md:flex-row md:justify-between md:gap-0"
              >
                <p>بهترین خاطرات شما</p>
                <Button>دیدن</Button>
              </motion.div>
            </motion.div>
            <motion.div
              style={{ opacity: postersOpacity, x: posterTranslateXRight }}
              className="relative aspect-[9/16] w-[300px] shrink-0 overflow-clip rounded-2xl md:aspect-video md:w-[60vw]"
            >
              <Image
                fill
                className="h-full w-full object-cover"
                src={movies[2].poster}
                alt={movies[2].name}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        variants={{
          active: { opacity: 1, y: 0 },
          inactive: { opacity: 0, y: 20 },
        }}
        transition={{ duration: 0.4 }}
        className="-mt-[calc((100vh-(300px*(16/9)))/2)] space-y-3 pt-4 md:-mt-[calc((100vh-(60vw*(9/16)))/2)]"
      >
        <SmallImageCarousel movies={randomMoviesSet1} />
        <div className="[--carousel-offset:-32px] [--duration:60s]">
          <SmallImageCarousel movies={randomMoviesSet2} />
        </div>
      </motion.div>
    </motion.div>
  )
}

const SmallImageCarousel = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="overflow-clip">
      <div className="animate-carousel-move relative left-[var(--carousel-offset,0px)] flex gap-3">
        {movies.map((movie, index) => (
          <div
            className="relative aspect-video w-[40vw] shrink-0 md:w-[23vw]"
            key={`${movie.name}-${index}`}
          >
            <Image
              fill
              className="rounded-xl object-cover"
              src={movie.poster}
              alt={movie.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
