'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

function LogoutForm({ children }: Props) {
  const router = useRouter()
  return (
    <form
      action={async () => {
        // const logoutVal = await logout()
        // console.log('lg', logoutVal)
        router.refresh()
      }}
    >
      <Button type="submit">{children}</Button>
    </form>
  )
}

export default LogoutForm
