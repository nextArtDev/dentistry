import { signOut } from '@/auth'

// or we can use import {signOut} from 'next-auth/react'
interface LogoutButtonProps {
  children?: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    // <span onClick={onClick} className="cursor-pointer">
    //   {children}
    // </span>
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <button
        type="submit"
        className="cursor-pointer bg-transparent border-none outline-none"
      >
        {children}
      </button>
    </form>
  )
}
