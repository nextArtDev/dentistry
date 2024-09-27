'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import RouteSwitcher from './StoreMenu'
import StoreMenu from './StoreMenu'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  // we can use `/${params.storeId}` because we use it inside <Navbar> component which is inside dynamic routes!
  const routes = [
    {
      href: `/`,
      label: 'خانه',
      active: pathname === `/`,
    },
    {
      href: `/dashboard`,
      label: 'وضعیت',
      active: pathname === `/dashboard`,
    },
    {
      href: `/dashboard/specialization`,
      label: 'تخصص‌ها',
      active: pathname === `/dashboard/specialization`,
    },
    {
      href: `/dashboard/doctors`,
      label: 'دکترها',
      active: pathname === `/dashboard/doctors`,
    },
    {
      href: `/dashboard/illness`,
      label: 'بیماری',
      active: pathname === `/dashboard/illness`,
    },
    {
      href: `/dashboard/booking`,
      label: 'نوبت‌دهی',
      active: pathname === `/dashboard/booking`,
    },
    {
      href: `/dashboard/comments`,
      label: 'کامنت‌ها',
      active: pathname === `/dashboard/comments`,
    },
  ]

  return (
    <nav
      className={cn('flex items-center gap-4 lg:gap-6  ', className)}
      {...props}
    >
      <div className="md:hidden">
        <StoreMenu routes={routes} />
      </div>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            buttonVariants({ variant: route.active ? 'link' : 'ghost' }),
            'hidden  md:flex md:items-center w-full text-sm font-medium transition-colors hover:text-primary'
            // route.active
            //   ? 'text-secondary underline underline-offset-8 '
            //   : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
