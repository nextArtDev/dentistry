import { Circle } from './beam/AnimatedBeamDemo'
import OrbitingCircles from './OrbittingCircles'
import { ReactNode } from 'react'

// دندان مصنوعی، ایمپلنت، روکش دندان، ارتودنسی، ترمیم دندان، جراحی لثه، دندانپزشکی زیبایی
export default function Orbiting() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden md:shadow-xl">
      {/* <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        Circles
      </span> */}

      {/* Inner Circles */}
      <OrbitingCircles
        className="z-[2] size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={50}
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ترمیم</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        className="z-[2] size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={50}
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ایمپلنت</h2>
          </Circle>
        </Content>
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="z-[2] size-[50px] border-none bg-transparent"
        radius={130}
        duration={28}
        delay={28}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2> روکش دندان</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        className="z-[2] size-[50px] border-none bg-transparent"
        radius={130}
        duration={28}
        delay={14}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>دندان مصنوعی</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        className="z-[2] size-[50px] border-none bg-transparent"
        radius={130}
        duration={28}
        delay={7}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>جراحی لثه</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        className="z-[2] size-[50px] border-none bg-transparent"
        radius={130}
        duration={28}
        delay={21}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ارتودنسی</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
    </div>
  )
}

const Content = ({ children }: { children: ReactNode }) => {
  return (
    <article
      style={{ borderRadius: '999' }}
      className="!p-2 border w-44 h-auto flex items-center justify-center text-center text-[rebeccapurple]/80 bg-white/10 backdrop-blur-sm rounded-full font-semibold "
    >
      {children}
    </article>
  )
}
// const Icons = {
//   whatsapp: () => (
//     <svg
//       width="100"
//       height="100"
//       viewBox="0 0 175.216 175.552"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <linearGradient
//           id="b"
//           x1="85.915"
//           x2="86.535"
//           y1="32.567"
//           y2="137.092"
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop offset="0" stopColor="#57d163" />
//           <stop offset="1" stopColor="#23b33a" />
//         </linearGradient>
//         <filter
//           id="a"
//           width="1.115"
//           height="1.114"
//           x="-.057"
//           y="-.057"
//           colorInterpolationFilters="sRGB"
//         >
//           <feGaussianBlur stdDeviation="3.531" />
//         </filter>
//       </defs>
//       <path
//         d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
//         fill="#b3b3b3"
//         filter="url(#a)"
//       />
//       <path
//         d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
//         fill="#ffffff"
//       />
//       <path
//         d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
//         fill="url(#linearGradient1780)"
//       />
//       <path
//         d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
//         fill="url(#b)"
//       />
//       <path
//         d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
//         fill="#ffffff"
//         fillRule="evenodd"
//       />
//     </svg>
//   ),
// }
