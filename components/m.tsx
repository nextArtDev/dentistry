'use client'
import Image from 'next/image'
import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { Expand, X } from 'lucide-react'

// • Colors: Mint green, soft coral, white, and a bold, modern font.
// • Example:
//   * Primary: #B2D7B0 (mint green)
//   * Secondary: #F8C6C7 (soft coral)
//   * Accent: #333333 (dark gray)
//   * Text: #333333 (dark gray)
// • Why it works: This palette is fresh and contemporary, appealing to a younger audience. The coral adds a touch of warmth and energy.

// 3. Natural and Earthy:

// • Colors: Sage green, warm beige, light brown, and cream.
// • Example:
//   * Primary: #99B99B (sage green)
//   * Secondary: #E7E1D9 (warm beige)
//   * Accent: #998B7D (light brown)
//   * Text: #333333 (dark gray)
// • Why it works: This palette evokes a sense of calm and nature, creating a relaxed atmosphere.

// 4. Luxurious and Sophisticated:

// • Colors: Deep jewel tones like sapphire blue, amethyst purple, and a touch of gold or silver.
// • Example:
//   * Primary: #496070 (deep sapphire)
//   * Secondary: #948DC1 (amethyst)
//   * Accent: #D4AC0D (gold)
//   * Text: #FFFFFF (white)
interface ExpandableCardProps {
  title: string
  src: string
  description: string
}
export function ExpandableCard({
  title,
  src,
  description,
}: ExpandableCardProps) {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  )
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={src}
                  alt={title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {description}
                    </motion.p>
                  </div>

                  {/* <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a> */}
                  {/* <motion.span
                    layoutId={`button-${active.title}-${id}`}
                    // href={active.ctaLink}
                    // target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.span> */}
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === 'function'
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${title}-${id}`}
        key={`card-${title}-${id}`}
        onClick={() => setActive(id)}
        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
      >
        <div className="flex gap-4 flex-col md:flex-row ">
          <motion.div layoutId={`image-${title}-${id}`}>
            <Image
              width={100}
              height={100}
              src={src}
              alt={title}
              className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
            />
          </motion.div>
          <div className="">
            <motion.h3
              layoutId={`title-${title}-${id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
            >
              {title}
            </motion.h3>
            <motion.p
              layoutId={`description-${description}-${id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
            >
              {description}
            </motion.p>
          </div>
        </div>
        <motion.button
          layoutId={`button-${title}-${id}`}
          className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100     text-black mt-4 md:mt-0"
        >
          {/* {card.ctaText} */}
          <Expand />
        </motion.button>
      </motion.div>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.span
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      //   xmlns="http://www.w3.org/2000/svg"
      //   width="24"
      //   height="24"
      //   viewBox="0 0 24 24"
      //   fill="none"
      //   stroke="currentColor"
      //   strokeWidth="2"
      //   strokeLinecap="round"
      //   strokeLinejoin="round"
      className="h-4 w-4 flex items-center justify-center text-black/20"
    >
      <X className="text-red-500" />
      {/* <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" /> */}
    </motion.span>
  )
}

// const cards = [
//   {
//     description: 'Lana Del Rey',
//     title: 'Summertime Sadness',
//     src: 'https://assets.aceternity.com/demos/lana-del-rey.jpeg',
//     ctaText: 'Play',
//     ctaLink: 'https://ui.aceternity.com/templates',
//     content: () => {
//       return (
//         <p>
//           Lana Del Rey, an iconic American singer-songwriter, is celebrated for
//           her melancholic and cinematic music style. Born Elizabeth Woolridge
//           Grant in New York City, she has captivated audiences worldwide with
//           her haunting voice and introspective lyrics. <br /> <br /> Her songs
//           often explore themes of tragic romance, glamour, and melancholia,
//           drawing inspiration from both contemporary and vintage pop culture.
//           With a career that has seen numerous critically acclaimed albums, Lana
//           Del Rey has established herself as a unique and influential figure in
//           the music industry, earning a dedicated fan base and numerous
//           accolades.
//         </p>
//       )
//     },
//   },
//   {
//     description: 'Babbu Maan',
//     title: 'Mitran Di Chhatri',
//     src: 'https://assets.aceternity.com/demos/babbu-maan.jpeg',
//     ctaText: 'Play',
//     ctaLink: 'https://ui.aceternity.com/templates',
//     content: () => {
//       return (
//         <p>
//           Babu Maan, a legendary Punjabi singer, is renowned for his soulful
//           voice and profound lyrics that resonate deeply with his audience. Born
//           in the village of Khant Maanpur in Punjab, India, he has become a
//           cultural icon in the Punjabi music industry. <br /> <br /> His songs
//           often reflect the struggles and triumphs of everyday life, capturing
//           the essence of Punjabi culture and traditions. With a career spanning
//           over two decades, Babu Maan has released numerous hit albums and
//           singles that have garnered him a massive fan following both in India
//           and abroad.
//         </p>
//       )
//     },
//   },

//   {
//     description: 'Metallica',
//     title: 'For Whom The Bell Tolls',
//     src: 'https://assets.aceternity.com/demos/metallica.jpeg',
//     ctaText: 'Play',
//     ctaLink: 'https://ui.aceternity.com/templates',
//     content: () => {
//       return (
//         <p>
//           Metallica, an iconic American heavy metal band, is renowned for their
//           powerful sound and intense performances that resonate deeply with
//           their audience. Formed in Los Angeles, California, they have become a
//           cultural icon in the heavy metal music industry. <br /> <br /> Their
//           songs often reflect themes of aggression, social issues, and personal
//           struggles, capturing the essence of the heavy metal genre. With a
//           career spanning over four decades, Metallica has released numerous hit
//           albums and singles that have garnered them a massive fan following
//           both in the United States and abroad.
//         </p>
//       )
//     },
//   },
//   {
//     description: 'Led Zeppelin',
//     title: 'Stairway To Heaven',
//     src: 'https://assets.aceternity.com/demos/led-zeppelin.jpeg',
//     ctaText: 'Play',
//     ctaLink: 'https://ui.aceternity.com/templates',
//     content: () => {
//       return (
//         <p>
//           Led Zeppelin, a legendary British rock band, is renowned for their
//           innovative sound and profound impact on the music industry. Formed in
//           London in 1968, they have become a cultural icon in the rock music
//           world. <br /> <br /> Their songs often reflect a blend of blues, hard
//           rock, and folk music, capturing the essence of the 1970s rock era.
//           With a career spanning over a decade, Led Zeppelin has released
//           numerous hit albums and singles that have garnered them a massive fan
//           following both in the United Kingdom and abroad.
//         </p>
//       )
//     },
//   },
//   {
//     description: 'Mustafa Zahid',
//     title: 'Toh Phir Aao',
//     src: 'https://assets.aceternity.com/demos/toh-phir-aao.jpeg',
//     ctaText: 'Play',
//     ctaLink: 'https://ui.aceternity.com/templates',
//     content: () => {
//       return (
//         <p>
//           &quot;Aawarapan&quot;, a Bollywood movie starring Emraan Hashmi, is
//           renowned for its intense storyline and powerful performances. Directed
//           by Mohit Suri, the film has become a significant work in the Indian
//           film industry. <br /> <br /> The movie explores themes of love,
//           redemption, and sacrifice, capturing the essence of human emotions and
//           relationships. With a gripping narrative and memorable music,
//           &quot;Aawarapan&quot; has garnered a massive fan following both in
//           India and abroad, solidifying Emraan Hashmi&apos;s status as a
//           versatile actor.
//         </p>
//       )
//     },
//   },
// ]

// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   version="1.1"
//   xmlns:xlink="http://www.w3.org/1999/xlink"
//   xmlns:svgjs="http://svgjs.dev/svgjs"
//   viewBox="0 0 800 800"
//   opacity="0.37"
// >
//   <defs>
//     <filter
//       id="bbblurry-filter"
//       x="-100%"
//       y="-100%"
//       width="400%"
//       height="400%"
//       filterUnits="objectBoundingBox"
//       primitiveUnits="userSpaceOnUse"
//       color-interpolation-filters="sRGB"
//     >
//       <feGaussianBlur
//         stdDeviation="58"
//         x="0%"
//         y="0%"
//         width="100%"
//         height="100%"
//         in="SourceGraphic"
//         edgeMode="none"
//         result="blur"
//       ></feGaussianBlur>
//     </filter>
//   </defs>
//   <g filter="url(#bbblurry-filter)">
//     <ellipse
//       rx="219"
//       ry="185.5"
//       cx="258.6440950563441"
//       cy="456.28119136151224"
//       fill="hsla(359, 78%, 78%, 1.00)"
//     ></ellipse>
//     <ellipse
//       rx="219"
//       ry="185.5"
//       cx="554.8919228758488"
//       cy="484.61252661899744"
//       fill="hsla(34, 23%, 88%, 1.00)"
//     ></ellipse>
//   </g>
// </svg>

// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   version="1.1"
//   xmlns:xlink="http://www.w3.org/1999/xlink"
//   xmlns:svgjs="http://svgjs.dev/svgjs"
//   viewBox="0 0 800 800"
// >
//   <defs>
//     <radialGradient id="cccircular-grad" r="50%" cx="50%" cy="50%">
//       <stop offset="25%" stop-color="#cb839a" stop-opacity="0.5"></stop>
//       <stop
//         offset="85%"
//         stop-color="hsl(341, 100%, 85%)"
//         stop-opacity="1"
//       ></stop>
//       <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5"></stop>
//     </radialGradient>
//   </defs>
//   <g fill="url(#cccircular-grad)">
//     <circle r="352" cx="400" cy="400" opacity="1.00"></circle>
//     <circle r="320" cx="400" cy="400" opacity="0.91"></circle>
//     <circle r="288" cx="400" cy="400" opacity="0.81"></circle>
//     <circle r="256" cx="400" cy="400" opacity="0.72"></circle>
//     <circle r="224" cx="400" cy="400" opacity="0.62"></circle>
//     <circle r="192" cx="400" cy="400" opacity="0.53"></circle>
//     <circle r="160" cx="400" cy="400" opacity="0.43"></circle>
//     <circle r="128" cx="400" cy="400" opacity="0.34"></circle>
//     <circle r="96" cx="400" cy="400" opacity="0.24"></circle>
//     <circle r="64" cx="400" cy="400" opacity="0.15"></circle>
//   </g>
// </svg>
