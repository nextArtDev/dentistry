import HorizontalScroll from '@/components/horizontal-scroll/HorizontalScroll'
import HorizontalScrollCarousel from '@/components/horizontal-scroll/Hscroll'
import StickyScroll from '@/components/horizontal-scroll/StickyScroll'
import React from 'react'

function page() {
  return (
    <div className="  ">
      {/* <StickyScroll /> */}
      {/* <HorizontalScroll /> */}
      <HorizontalScrollCarousel rtl={true} className="overflow-x-hidden " />
    </div>
  )
}

export default page
