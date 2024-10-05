'use client'
import CountAnimation from './count-animation'
import { easeIn, motion } from 'framer-motion'

const textVariants = {
  initial: {
    x: -500,
    // scale: 0.03,
    opacity: 0,
  },
  animate: {
    x: 0,
    scale: 1,

    opacity: 1,
    transition: {
      duration: 1,
      easeIn,
      staggerChildren: 0.3,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

function Works() {
  //   useEffect(() => {}, [])
  return (
    <motion.article
      variants={textVariants}
      initial="initial"
      animate="animate"
      className="text-[rebeccapurple] font-semibold text-xl absolute z-[2]   px-2 place-content-center place-items-center py-1 rounded-md bottom-0 w-full h-1/4 grid grid-cols-3 grid-rows-1 gap-0.5"
    >
      {/* <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col">
        <p>دندان مصنوعی</p>
      </div>
      <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col">
        روکش دندان
      </div>
      <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col">
        ارتودنسی
      </div> */}
      <motion.div
        variants={textVariants}
        className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col"
      >
        <CountAnimation number={24} className="" duration={2} />
        سال سابقه
      </motion.div>
      <motion.div
        variants={textVariants}
        className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col"
      >
        <CountAnimation number={2500} className="" duration={3} />
        ترمیم دندان
      </motion.div>
      <motion.div
        variants={textVariants}
        className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full flex items-center justify-center flex-col"
      >
        <CountAnimation number={4500} className="" duration={4} />
        ایمپلنت
      </motion.div>
    </motion.article>
  )
}

export default Works
