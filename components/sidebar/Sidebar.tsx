'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

import Links from './Links'
import ToggleButton from './ToggleButton'

const variants = {
  open: {
    clipPath: 'circle(1200px at 50px 50px)',
    transition: {
      type: 'spring',
      stiffness: 20,
    },
  },
  closed: {
    clipPath: 'circle(25px at 50px 50px)',
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
}
const Sidebar = () => {
  const [open, setOpen] = useState(false)

  // className =
  //   'sidebar flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm text-black'
  // className = 'z-50 fixed top-0 left-0 bg-white backdrop-blur-sm w-[400px]'
  return (
    <motion.div
      dir="ltr"
      className=""
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',

        color: 'black',
      }}
      //   className="sidebar"
      // It will apply this to children
      animate={open ? 'open' : 'closed'}
    >
      <motion.div
        //   className={stylex(s.bg)}
        style={{
          zIndex: '999',
          position: 'fixed',
          top: '0',
          left: '0',
          bottom: '0',
          background: '#ffffff97',

          // backdropFilter: '12px',
          backdropFilter: '50px',
          width: '400px',
        }}
        variants={variants}
      >
        <Links />
      </motion.div>
      <ToggleButton setOpen={setOpen} />
    </motion.div>
  )
}

export default Sidebar

//Coffee style
// style={{
//   zIndex: '999',
//   position: 'fixed',
//   top: '0',
//   left: '0',
//   bottom: '0',
//   background: '#ffffff',

//   backdropFilter: '12px',

//   // width: '400px',
//   width: '40%',
//   height: '30%',
//   borderTopRightRadius: '999px',
//   borderBottomRightRadius: '999px',
//   outline: '8px dotted white',
//   outlineOffset: '-4px',
// }}

// const variants = {
//   open: {
//     clipPath: 'circle(300px at 50px 300px)',
//     transition: {
//       type: 'spring',
//       stiffness: 20,
//     },
//   },
