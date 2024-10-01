import HorizontalScroll from '@/components/horizontal-scroll/HorizontalScroll'
import StickyScroll from '@/components/horizontal-scroll/StickyScroll'
import React from 'react'

function page() {
  return (
    <div dir="ltr" className="relative ">
      <StickyScroll />
      {/* <HorizontalScroll /> */}
    </div>
  )
}

export default page
