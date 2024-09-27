'use client'

// import bg from '@/public/background/home-bg.webp'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import RotatingNavigation from './rotating-nav'
import RenderModel from './render-model'

const Model = dynamic(() => import('@/components/Model'), {
  ssr: false,
})

export default function Rotating() {
  return (
    <section className="mx-auto  flex w-full     relative">
      {/* <Image
        priority
        sizes="100vw"
        src={bg}
        alt="background-image"
        fill
        className="-z-50 w-full h-full object-cover object-center opacity-50"
      /> */}

      <RotatingNavigation />

      {/* <RenderModel className=" ">
        <Model />
      </RenderModel> */}
    </section>
  )
}
