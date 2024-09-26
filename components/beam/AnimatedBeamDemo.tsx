'use client'

import React, { forwardRef, useRef } from 'react'

import { cn } from '@/lib/utils'
import { AnimatedBeam } from './AnimatedBeam'
// import GradientFlow from './GradientFlow'
import { SparklingGrid } from './SparklingGrid'
import Image from 'next/image'

import tooth from '../../public/images/tooth.png'

export const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = 'Circle'

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  //   const div5Ref = useRef<HTMLDivElement>(null)
  //   const div6Ref = useRef<HTMLDivElement>(null)
  //   const div7Ref = useRef<HTMLDivElement>(null)

  return (
    // <GradientFlow
    //   duration={20}
    //   colors={['#6366f135', '#2563eb35', '#7c3aed35', '#db277735']}
    //   fullWidth={true}
    //   radialOverlay={true}
    //   blurAmount="10px"
    // >
    <div
      className=" relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg  p-10 md:shadow-xl text-primary font-semibold"
      ref={containerRef}
    >
      <SparklingGrid theme={'dark'} />
      <div className="  flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            {/* <Icons.googleDrive /> */}
            ایمپلنت
          </Circle>
          {/* <Circle ref={div5Ref}>
              <Icons.googleDocs />
            </Circle> */}
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            {/* <Icons.notion /> */}
            ترمیم
          </Circle>
          <Circle
            ref={div4Ref}
            className="size-24  bg-transparent border-none backdrop-blur-lg"
          >
            {/* <Icons.openai /> */}
            <Image
              width={64}
              height={64}
              src={tooth.src}
              alt=""
              className="z-[3] object-contain py-8  "
            />
          </Circle>
          {/* <Circle ref={div6Ref}>
              <Icons.zapier />
            </Circle> */}
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            {/* <Icons.whatsapp /> */}
            روکش
          </Circle>
          {/* <Circle ref={div7Ref}>
              <Icons.messenger />
            </Circle> */}
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={45}
        endYOffset={-10}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        duration={3}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={-45}
        endYOffset={10}
        duration={3}
      />
      {/* <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={div4Ref}
          curvature={-75}
          endYOffset={-10}
          duration={3}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={div4Ref}
          duration={3}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div7Ref}
          toRef={div4Ref}
          curvature={75}
          endYOffset={10}
          duration={3}
          reverse
        /> */}
    </div>
    // </GradientFlow>
  )
}
