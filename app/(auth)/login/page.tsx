import { auth } from '@/auth'
import { LoginForm } from '@/components/auth/login-form'
import { redirect } from 'next/navigation'

import React from 'react'
import { toast } from 'sonner'

async function page() {
  const session = await auth()
  if (session?.user.id) {
    toast.success('شما قبلا وارد حساب کاربری خود شده‌اید.')
    redirect('/user')
  }

  return <LoginForm />
}

export default page
