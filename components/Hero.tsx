'use client'
import { motion } from 'framer-motion'
import HeroImage from '../public/images/doctor.png'
import tooth from '../public/images/tooth.png'
import HeroBG from '../public/images/herobg.png'
import Image from 'next/image'
import Orbiting from './Orbitting'

const textVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
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
const sliderVariants = {
  initial: {
    x: '0px',
  },
  animate: {
    x: '-220%',
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 20,
    },
  },
}

const Hero = () => {
  return (
    <div
      className="  hero relative bg-opacity-35 "
      style={{
        // height: 'calc(100vh - 100px)',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        // background: 'linear-gradient(180deg, #FC898B, #F39C9D)',
      }}
    >
      <Image fill src={HeroBG} alt="hero" className="object-cover -z-[1] " />
      <section className="  grid grid-cols-1 grid-rows-8 md::grid-cols-2  w-full h-full mx-auto max-w-screen-xl  ">
        <article className="text-center row-span-2 flex flex-col  items-center justify-center w-full h-full  ">
          <motion.div
            className="textContainer"
            // style={{
            //   width: '50%',
            //   height: '100%',
            //   display: 'flex',
            //   flexDirection: 'column',
            //   justifyContent: 'center',
            //   gap: '40px',
            // }}
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              style={{
                // fontSize: '30px',
                color: 'rebeccapurple',
                // letterSpacing: '10px',
              }}
              className="text-3xl font-bold pt-8"
              variants={textVariants}
            >
              دکتر کتایون کلانترمعتمدی
            </motion.h2>
            <motion.h1
              variants={textVariants}
              className="text-xl font-semibold"
            >
              جراح و دندانپزشک
            </motion.h1>
          </motion.div>
        </article>
        <article className="relative  row-span-6">
          <figure className="relative flex flex-col w-full h-full">
            <Image
              fill
              src={HeroImage.src}
              alt=""
              className="z-[1]  object-contain w-fit px-10"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Image
              width={128}
              height={128}
              src={tooth.src}
              alt=""
              className="z-[3] absolute top-[10vh] right-[2vw] w-16 h-32       object-contain py-8 animate-bounce"
            />
            <Orbiting />
            <div className="absolute z-[2] bg-white/40 backdrop-blur-md px-2 place-content-center place-items-center py-1 rounded-md bottom-0 w-full h-1/4 grid grid-cols-3 grid-rows-2 gap-0.5">
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                1
              </div>
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                2
              </div>
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                3
              </div>
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                4
              </div>
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                5
              </div>
              <div className="bg-white/10 rounded-md backdrop-blur-sm w-full h-full ">
                6
              </div>
            </div>
          </figure>
        </article>
      </section>
      <div
        className="wrapper absolute inset-0 "
        style={{ maxWidth: '1366px', height: '100%', margin: 'auto' }}
      >
        <motion.div
          className="textContainer"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '40px',
          }}
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          {/* <motion.h2
            style={{
              fontSize: '30px',
              color: 'rebeccapurple',
              letterSpacing: '10px',
            }}
            variants={textVariants}
          >
            HARVEY TYLER
          </motion.h2>
          <motion.h1 variants={textVariants}>
            Web developer and UI designer
          </motion.h1> */}
          <motion.div variants={textVariants} className="buttons">
            <motion.button
              style={{
                // padding: '20px',
                border: '1px solid white',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: 'white',
                // marginRight: '20px',
                cursor: 'pointer',
                // fontWeight: '300',
              }}
              variants={textVariants}
            >
              {/* See the Latest Works */}1
            </motion.button>
            <motion.button
              style={{
                // padding: '20px',
                border: '1px solid white',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: 'white',
                marginRight: '20px',
                cursor: 'pointer',
                fontWeight: '300',
              }}
              variants={textVariants}
            >
              {/* Contact Me */}2
            </motion.button>
          </motion.div>
          <motion.img
            style={{ width: '50px' }}
            variants={textVariants}
            animate="scrollButton"
            src="/scroll.png"
            alt=""
          />
        </motion.div>
      </div>
      <motion.div
        className="slidingTextContainer"
        style={{
          position: 'absolute',
          fontSize: '50vh',
          bottom: '-120px',
          whiteSpace: 'nowrap',
          color: '#ffffff09',
          width: '50%',
          fontWeight: 'bold',
        }}
        variants={sliderVariants}
        initial="initial"
        animate="animate"
      >
        Writer Content Creator Influencer
      </motion.div>
    </div>
  )
}

export default Hero
