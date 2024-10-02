'use client'
import Image from 'next/image'
import React, { ReactNode, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { X } from 'lucide-react'

interface ExpandableCardProps {
  card: {
    title: string
    src: string
    description: string
    ctaText: string
    ctaLink: string
    content: ReactNode
  }
}
export function ExpandableCardDemo({ card }: ExpandableCardProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(false))

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" fixed inset-0 bg-transparent h-full w-full  "
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0  grid place-items-center  ">
            <motion.button
              key={`button-${card.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex p-0.5 absolute top-3 right-3 lg:hidden items-center justify-center bg-transparent rounded-full h-6 w-6"
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              ref={ref}
              className="  glass  w-fit max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col   sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={card.src}
                  alt={card.title}
                  className="w-fit h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-bold text-[rebeccapurple]"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-[rebeccapurple]/70"
                    >
                      {card.description}
                    </motion.p>
                  </div>

                  {/* <motion.a
                    layoutId={`button-${card.title}-${id}`}
                    href={card.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {card.ctaText}
                  </motion.a> */}
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {/* {typeof card.content === 'function'
                      ? card.content()
                      : card.content} */}
                    {card.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${card.title}-${id}`}
        onClick={() => setActive(true)}
        className="bg-transparent w-fit flex flex-col justify-between items-center   rounded-xl cursor-pointer"
      >
        <div className="flex gap-3 flex-col items-center justify-center">
          <motion.div layoutId={`image-${card.title}-${id}`}>
            <Image
              width={100}
              height={100}
              src={card.src}
              alt={card.title}
              className="h-24 w-24 md:h-14 md:w-14 rounded-full object-cover object-top"
            />
          </motion.div>
          <div className="">
            <motion.h3
              layoutId={`title-${card.title}-${id}`}
              className="font-medium   text-center md:text-left text-[rebeccapurple]"
            >
              {card.title}
            </motion.h3>
            <motion.p
              layoutId={`description-${card.description}-${id}`}
              className=" text-center md:text-left text-[rebeccapurple]/70"
            >
              {card.description}
            </motion.p>
          </div>
        </div>
        {/* <motion.button
          layoutId={`button-${card.title}-${id}`}
          className="  px-2 py-1 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
        >
          {card.ctaText}
        </motion.button> */}
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
      className="z-40 h-8 w-8 flex items-center justify-center text-black/20"
    >
      <X className="text-red-500" />
      {/* <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" /> */}
    </motion.span>
  )
}
