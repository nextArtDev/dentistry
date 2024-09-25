'use client'

import { ExitIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { LogoutButton } from '@/components/auth/logout-button'
import { User } from 'lucide-react'

import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import { signOut } from 'next-auth/react'

export const UserButton = () => {
  const user = useCurrentUser()

  // console.log(user?.id)
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger className="mx-4 text-primary">
        {/* <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className="bg-neutral-500"> */}
        <User className="text-white ml-4" />
        {/* </AvatarFallback>
        </Avatar> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-40 cursor-pointer bg-transparent"
        align="center"
      >
        {!user?.id ? (
          <DropdownMenuItem className="bg-transparent flex items-center justify-center gap-0.5">
            <Link
              href={'/login'}
              className={cn(
                'w-full bg-transparent',
                buttonVariants({ variant: 'ghost' })
              )}
            >
              ورود
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="bg-transparent flex items-center justify-center gap-0.5">
            <Link
              href={'/logout'}
              // onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            >
              {/* <LogoutButton>
                </LogoutButton> */}
              <ExitIcon className="h-4 w-4 " />
              خروج
              <p className=" text-2xl">{user?.name}</p>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
