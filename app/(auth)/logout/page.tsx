import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

async function page() {
  const session = await auth()
  if (!session?.user.id) redirect('/')
  return (
    <section className="flex justify-center items-center w-full h-full">
      <article className="flex flex-col text-primary-foreground font-semibold bg-white/30 gap-4 justify-center items-center w-60 h-auto py-8 border custom-box-shadow rounded-md text-center shadow-2xl p-2">
        {/* <span></span> */}
        <h1>می‌خواهید از حساب کاربری {session?.user.name} خارج شوید؟</h1>
        <form
          action={async () => {
            'use server'
            await signOut({ redirect: true, redirectTo: '/' })

            // console.log(res)
            // redirect('/')
          }}
        >
          <div className="flex justify-around">
            <Button type="submit">تایید</Button>
            {/* <Button variant={'ghost'} onclick >انصراف</Button> */}
          </div>
        </form>
      </article>
    </section>
  )
}

export default page
