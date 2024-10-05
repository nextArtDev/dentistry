'use client'

import MorphingCard from '../morphing-card'
import RotatingCircles from '../RotatingCircles'
import { Vortex } from '../Wortex'
// import bg from '@/public/background/home-bg.webp'
// import dynamic from 'next/dynamic'
// import Image from 'next/image'
// import RenderModel from './render-model'
import RotatingNavigation from './rotating-nav'

// const Model = dynamic(() => import('@/components/Model'), {
//   ssr: false,
// })

export default function Rotating() {
  return (
    <section className="z-[2] mx-auto bg-white  flex w-full  h-[70vh] md:h-screen   relative">
      {/* <Image
        priority
        sizes="100vw"
        src={bg}
        alt="background-image"
        fill
        className="-z-50 w-full h-full object-cover object-center opacity-50"
      /> */}
      {/* <RotatingNavigation /> */}

      <RotatingCircles />

      {/* <section className="absolute   w-fit h-fit top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        
      </section> */}
      {/* <RenderModel className=" ">
        <Model />
      </RenderModel> */}
    </section>
  )
}
