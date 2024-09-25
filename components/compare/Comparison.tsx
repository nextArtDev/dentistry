import { FC } from 'react'
import { Compare } from './Compare'
import BMasnoei from '../../public/images/b-a/before-masnooei.webp'
import AMasnoei from '../../public/images/b-a/after-masnooei.webp'
// import BTarmim from '../../public/images/b-a/before-tarmim.webp'
// import ATarmim from '../../public/images/b-a/after-tarmim.webp'
interface ComparisonProps {}

const Comparison: FC<ComparisonProps> = ({}) => {
  return (
    <div className="p-4 w-full h-full   rounded-3xl   px-4">
      <Compare
        firstImage={BMasnoei.src}
        secondImage={AMasnoei.src}
        firstImageClassName="object-contain  "
        secondImageClassname="object-contain  "
        // className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        className="rounded-2xl "
        slideMode="hover"
        showHandlebar={false}
        autoplayDuration={8000}
        autoplay
      />
    </div>
  )
}

export default Comparison
