import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

interface HeaderProps {
  label: string
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex  flex-col gap-y-2 items-center justify-center">
      <h1 className={cn('text-3xl font-semibold', font.className)}>🔐 </h1>
      <p className="title-color text-xl md:text-3xl">{label}</p>
      <p className="text-red-800/70 text-center text-xs md:text-sm ">
        هنگام وارد کردن شماره موبایل و کدملی، زبان دستگاه خود را انگلیسی کنید.
      </p>
    </div>
  )
}
