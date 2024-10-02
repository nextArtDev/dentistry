'use client'

import React, { forwardRef, useRef } from 'react'

import { cn } from '@/lib/utils'
import { AnimatedBeam } from './AnimatedBeam'
// import TeamProfile from '../team-profile'
// import Image from 'next/image'
import { ExpandableCardDemo } from '../Expandable-card'
import Image from 'next/image'
import tooth from '../../public/images/tooth.png'
const Profile = forwardRef<
  HTMLDivElement,
  {
    className?: string

    avatar: string
    name: string
    title: string
  }
>(({ className, avatar, name, title }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // '  z-10 bg-transparent flex flex-col gap-0.5 items-center justify-center   p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        '   bg-transparent flex flex-col gap-0.5 items-center justify-center   p-3 shadow-[0_0_20px_-12px_rgba(0, 0, 0, 0.158)]',
        className
      )}
    >
      <ExpandableCardDemo
        card={{
          src: avatar,
          description: title,
          title: name,
          content: 'توضیحات',
          ctaText: 'بیشتر',
          ctaLink: 'کمتر',
        }}
      />
      {/* <figure className="relative size-16 md:size-24">
        <Image
          fill
          src={avatar}
          className="w-full h-full rounded-full object-cover"
          alt=""
        />
      </figure>
      <h2 className="text-sm md:text-base lg:text-lg">{name}</h2>
      <h3 className="text-xs md:text-sm lg:text-base opacity-75">{title}</h3> */}
    </div>
  )
})

Profile.displayName = 'Profile'

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        '  flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = 'Circle'

const TeamAnimatedBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="  relative flex h-auto w-full items-center justify-center overflow-hidden   bg-white text-[rebeccapurple] p-4 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex size-full flex-col max-w-lg  items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Profile
            ref={div1Ref}
            avatar="/images/doctors/1.jpeg"
            name="دکتر علی حسینی"
            title="دستیار"
          />
          <Profile
            ref={div5Ref}
            avatar="/images/doctors/5.jpeg"
            name="دکتر علی جزینی"
            title="دستیار"
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <Profile
            ref={div2Ref}
            avatar="/images/doctors/2.jpeg"
            name="دکتر علی جزینی"
            title="دستیار"
          />
          <Circle
            ref={div4Ref}
            className="size-16 !border-opacity-30 bg-opacity-30 !glass"
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
          <Profile
            ref={div6Ref}
            avatar="/images/doctors/1.jpeg"
            name="دکتر علی جزینی"
            title="دستیار"
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <Profile
            ref={div3Ref}
            avatar="/images/doctors/3.jpg"
            name="دکتر علی جزینی"
            title="دستیار"
          />
          <Profile
            ref={div7Ref}
            avatar="/images/doctors/1.jpeg"
            name="دکتر علی جزینی"
            title="دستیار"
          />
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  )
}
export default TeamAnimatedBeam
