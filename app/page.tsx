import CompareSlider from '@/components/CompareSlider'
import Hero from '@/components/Hero'
// import BImplant from '../public/images/b-a/before-implant.webp'
// import AImplant from '../public/images/b-a/after-implant.webp'
import BOrtodensi from '../public/images/b-a/beefore-ortodensi.webp'
import AOrtodensi from '../public/images/b-a/after-ortodensi.webp'
import BJermgiri from '../public/images/b-a/before-jermgiri.webp'
import AJermgiri from '../public/images/b-a/after-jermgiri.webp'
import BMasnoei from '../public/images/b-a/before-masnooei.webp'
import AMasnoei from '../public/images/b-a/after-masnooei.webp'
import BTarmim from '../public/images/b-a/before-tarmim.webp'
import ATarmim from '../public/images/b-a/after-tarmim.webp'

import Highlights from '@/components/Highlights'
import { ImageCarousel } from '@/components/image-carousel/image-carousel'
import { AnimatedBeamDemo } from '@/components/beam/AnimatedBeamDemo'
import Team from '@/components/team'
export default function Home() {
  return (
    <section className="relative max-w-screen   h-full min-h-screen ">
      <Hero />
      <AnimatedBeamDemo />
      <Team />
      <Highlights />

      <section className="relative my-20 !pt-[100vh]">
        <ImageCarousel />
      </section>
      <section className="w-full mb-[50vh] overflow-x-hidden bg-white">
        {/* <CompareSlider
          before={BImplant}
          after={AImplant}
          disease="ایمپلنت"
          index={1}
        /> */}
        <CompareSlider
          before={BOrtodensi}
          after={AOrtodensi}
          disease="ارتودنسی"
          index={0}
        />
        <CompareSlider
          before={BTarmim}
          after={ATarmim}
          disease="ترمیم"
          index={1}
        />
        <CompareSlider
          before={BJermgiri}
          after={AJermgiri}
          disease="جرمگیری"
          index={0}
        />
        <CompareSlider
          before={BMasnoei}
          after={AMasnoei}
          disease="دندان مصنوعی"
          index={1}
        />
      </section>

      {/* <Highlights /> */}
      {/* <CompareSlider before={} after={} disease="" index={} /> */}
    </section>
  )
}
