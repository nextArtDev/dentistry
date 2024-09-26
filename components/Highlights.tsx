'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
// import { rightImg, watchImg } from '../lib/utils'
// import RightImg from '../public/assets/images/right.svg'
// import WatchImg from '../public/assets/images/watch.svg'
import VideoCarousel from './VideoCarousel2'

const Highlights = () => {
  useGSAP(() => {
    gsap.to('#title', { opacity: 1, y: 0 })
    gsap.to('.link', { opacity: 1, y: 0, duration: 1, stagger: 0.25 })
  }, [])

  return (
    <section
      dir="ltr"
      id="highlights"
      className=" overflow-hidden h-full common-padding bg-white text-black  "
    >
      <div className="screen-max-width">
        <div
          dir="rtl"
          className="mb-12 w-full md:flex items-end justify-between"
        >
          <h1 id="title" className="">
            هایلایت‌ها
          </h1>

          {/* <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the film
              <img src={'/v1/images/watch.svg'} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              Watch the event
              <img src={'/v1/images/right.svg'} alt="right" className="ml-2" />
            </p>
          </div> */}
        </div>

        <VideoCarousel />
      </div>
    </section>
  )
}

export default Highlights
