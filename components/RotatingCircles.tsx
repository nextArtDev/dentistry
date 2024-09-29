import { Circle } from './beam/AnimatedBeamDemo'
import { BorderBeam } from './BorderBeam'
import MorphingCard from './morphing-card'
import OrbitingCircles from './OrbittingCircles'
import { ReactNode } from 'react'

// دندان مصنوعی، ایمپلنت، روکش دندان، ارتودنسی، ترمیم دندان، جراحی لثه، دندانپزشکی زیبایی
export default function RotatingCircles() {
  return (
    <div className="relative group flex h-full w-full flex-col items-center justify-center overflow-hidden md:shadow-xl ">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        <MorphingCard
          width="200px"
          height="200px"
          contents={[
            {
              shape: 'circle',
              title: 'ساعات پذیرش',
              description: 'شنبه 12 تا 13',
            },
            {
              shape: 'rectangle',
              title: 'آدرس',
              description: 'خیابان رودکی',
            },
            {
              shape: 'hexagon',
              title: 'تلفن',
              description: '0935121212',
            },
          ]}
          colorScheme={{ from: '#4F46E5', to: '#7C3AED' }}
          autoPlay={true}
          interval={4000}
        />
      </span>

      <OrbitingCircles
        path={false}
        className="text-white  group-hover:pause z-[2] size-[30px] border-none bg-transparent"
        duration={40}
        delay={0}
        radius={150}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ترمیم</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="text-white group-hover:pause z-[2] size-[30px] border-none bg-transparent"
        duration={40}
        delay={5}
        radius={150}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>لمینت</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="text-white group-hover:pause z-[2] size-[30px] border-none bg-transparent"
        duration={40}
        delay={10}
        radius={150}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ایمپلنت</h2>
          </Circle>
        </Content>
      </OrbitingCircles>

      <OrbitingCircles
        path={false}
        className="text-white group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={15}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2> روکش دندان</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="text-white group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={20}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>دندان مصنوعی</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={25}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>جراحی لثه</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={30}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ارتودنسی</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={35}
        reverse
      >
        <Content>
          <Circle className="bg-transparent border-none">
            <h2>ارتودنسی</h2>
          </Circle>
        </Content>
      </OrbitingCircles>
      <OrbitingCircles
        path={false}
        className="group-hover:pause z-[2] size-[50px] border-none bg-transparent"
        radius={150}
        duration={40}
        delay={40}
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
