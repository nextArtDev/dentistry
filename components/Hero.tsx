'use client'
import { motion } from 'framer-motion'
import HeroImage from '../public/images/doctor.png'
import Image from 'next/image'

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
      className="hero relative"
      style={{
        // height: 'calc(100vh - 100px)',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0c0c1d, #111132)',
      }}
    >
      <div
        className="wrapper  "
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
          <motion.h2
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
          </motion.h1>
          <motion.div variants={textVariants} className="buttons">
            <motion.button
              style={{
                padding: '20px',
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
              See the Latest Works
            </motion.button>
            <motion.button
              style={{
                padding: '20px',
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
              Contact Me
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
      <div
        className="imageContainer"
        style={{ height: '100%', position: 'absolute', top: 0, right: 0 }}
      >
        <Image
          width={HeroImage.width}
          height={HeroImage.height}
          src={HeroImage.src}
          alt=""
          className="object-cover"
        />
      </div>
    </div>
  )
}

export default Hero
