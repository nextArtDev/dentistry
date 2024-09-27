import { MainNav } from './MainNav'
// import { ThemeToggle } from '../ui/theme-toggle'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
// import { ModeToggle } from '../theme-toggle'

// import StoreSwitcher from '@/components/store-switcher'
// import { MainNav } from '@/components/main-nav'
// import { ThemeToggle } from '@/components/theme-toggle'

const Navbar = () => {
  // const session = await getAuthSession()
  // const session = await auth()
  // const userId = session?.user.id

  // if (!userId || session.user.role !== 'ADMIN') {
  //   redirect('/')
  // }

  return (
    <div className="border-b">
      <ScrollArea dir="rtl">
        <div className="flex h-16 items-center px-4 ">
          {/* <StoreSwitcher items={stores} /> */}
          <MainNav className="px-8" />
          <ScrollBar orientation="horizontal" />
          {/* ml-auto push everything to the right */}
          <div className="mr-auto flex items-center text-right gap-4 space-x-4">
            {/* //Should be fixed */}
            {/* <UserButton /> */}

            {/* <div className="hidden sm:block">{session.user.name}</div> */}
            {/* <ModeToggle /> */}
            {/* <UserButton afterSignOutUrl="/" /> */}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Navbar
