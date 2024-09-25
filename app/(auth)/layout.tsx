import { Home } from 'lucide-react'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-full gradient-base h-screen flex flex-col items-center justify-center    ">
      <Link href="/" className="absolute top-12 right-8">
        <Home className="text-primary" />
      </Link>

      {children}
    </div>
  )
}

export default AuthLayout

// text: bg-clip-text bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-300 via-yellow-100 to-orange-900
