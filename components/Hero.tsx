'use client'
import { motion } from 'framer-motion'
import HeroImage from '../public/images/doctor.png'
import tooth from '../public/images/tooth.png'
import HeroBG from '../public/images/herobg.png'
import Image from 'next/image'
import Orbiting from './Orbitting'
import Works from './works'

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

const shapeVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
    y: -50, // Start offscreen above
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    y: 0, // Move to center
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
}
const Hero = () => {
  return (
    <div
      className="w-full overflow-x-hidden hero relative bg-opacity-35 "
      style={{
        // height: 'calc(100vh - 100px)',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        // background: 'linear-gradient(180deg, #FC898B, #F39C9D)',
      }}
    >
      <Image fill src={HeroBG} alt="hero" className="object-cover -z-[1] " />
      <section className="  grid grid-cols-1 grid-rows-9 md::grid-cols-2  w-full h-full mx-auto max-w-screen-xl  ">
        <article className="text-center row-span-2 flex flex-col pt-16 items-center justify-center w-full h-full  ">
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
              className="text-xl font-semibold text-[rebeccapurple]/70"
            >
              جراح و دندانپزشک
            </motion.h1>
          </motion.div>
        </article>
        <article className="relative  row-span-7">
          <figure className="relative flex flex-col w-full h-full">
            <Image
              fill
              src={HeroImage.src}
              alt=""
              className="z-[1]  object-contain w-fit px-10"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Image
              width={52}
              height={50}
              src={tooth.src}
              alt=""
              className="z-[3] absolute top-[5vh] left-[85%]         object-contain py-8 animate-bounce"
            />
            <Orbiting />
          </figure>
          {/* <div className=" absolute inset-0 -top-[2vh] right-4 w-[250px] h-[300px]">
              <div className="relative w-full min-h-full">
                <motion.svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 200 200"
                  variants={shapeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.path
                    d="M44.2,-12.8C48.1,-2.3,35.9,15.1,18,29.2C0.1,43.2,-23.5,53.9,-34.7,46.1C-46,38.3,-45,12,-37.2,-3.9C-29.4,-19.8,-14.7,-25.2,2.7,-26.1C20.1,-27,40.3,-23.3,44.2,-12.8Z"
                    transform="translate(100 100)"
                    fill="#ffffff88"
                    stroke="#FC898B33"
                    pathLength={1}
                  />
                </motion.svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold">
                  23 سال سابقه
                </span>
              </div>
            </div> */}

          <Works />
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
      {/* <motion.div
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
      </motion.div> */}
    </div>
  )
}

export default Hero
