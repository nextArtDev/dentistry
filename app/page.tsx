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
// import { AnimatedBeamDemo } from '@/components/beam/AnimatedBeamDemo'
// import Team from '@/components/team'
import TeamAnimatedBeam from '@/components/beam/TeamAnimatedBeam'
import RotatingNavigation from '@/components/rotaing-ill/rotating-nav'
import RenderModel from '@/components/rotaing-ill/render-model'
import Model from '@/components/Model'
import Rotating from '@/components/rotaing-ill/rotating'
import HorizontalScroll from '@/components/horizontal-scroll/HorizontalScroll'
import StickyScrollVideo from '@/components/horizontal-scroll/StickyScrollVideo'
import { MarqueeDemoVertical } from '@/components/marquee/MarqueeVertical'
import Footer from '@/components/footer/Footer'
import RippleBg from '@/components/RippleBg'

// const cardData = {
//   title: 'Amazing Product',
//   description: 'This is a fantastic.',
//   src: '/images/doctors/1.jpeg',
//   ctaText: 'Learn More',
//   ctaLink: 'https://example.com/product',
//   content: (
//     <div className="ltr">
//       <p>Heres some detailed information about our Amazing Product:</p>
//       <ul>
//         <li>Feature 1: Incredible performance</li>
//         <li>Feature 2: Easy to use</li>
//         <li>Feature 3: Affordable price</li>
//       </ul>
//       <p>Dont miss out on this opportunity to improve your life!</p>
//     </div>
//   ),
// }
// import Comparison from '@/components/compare/Comparison'
export default function Home() {
  return (
    <section className="relative max-w-screen   h-full min-h-screen ">
      <section className="overflow-x-hidden">
        <Hero />
      </section>
      <section className="relative overflow-x-hidden">
        <TeamAnimatedBeam />
      </section>
      {/* <ExpandableCardDemo card={cardData} /> */}
      {/* <Comparison /> */}
      {/* <AnimatedBeamDemo /> */}
      {/* <section>
        <Team />
      </section> */}
      <section className="relative min-h-[70vh] overflow-hidden flex items-center justify-center">
        {/* <RotatingNavigation /> */}
        <Rotating />
        {/* <RenderModel className="w-32">
          <Model />
          </RenderModel> */}
      </section>
      <Highlights />
      <section dir="ltr" className="relative  ">
        <ImageCarousel />
      </section>
      {/* <section className=" relative overflow-hidden ">
        <HorizontalScroll />
      </section> */}
      <StickyScrollVideo />
      <section className="w-full  overflow-x-hidden bg-white">
        {/* <CompareSlider
          before={BImplant}
          after={AImplant}
          disease="ایمپلنت"
          index={1}
        /> */}
        <CompareSlider
          disableHandle={true}
          before={BOrtodensi}
          after={AOrtodensi}
          disease="ارتودنسی"
          index={0}
        />
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
      </section>
      {/* <Highlights /> */}
      {/* <CompareSlider before={} after={} disease="" index={} /> */}
      <section className="flex gap-2">
        <MarqueeDemoVertical />

        {/* <MarqueeDemoVertical /> */}
      </section>
      <Footer />
    </section>
  )
}
