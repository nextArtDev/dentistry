'use server'

import { signOut } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// export const logout = async () => {
//   // some server stuff
//   try {
//     await signOut()
//   } catch (error) {
//     console.log(error)
//   }
//   revalidatePath('/')
//   redirect('/')
// }

interface LogoutFormState {
  errors: {
    _form?: string[]
  }
}
export async function logout(
  path: string,
  formState: LogoutFormState,
  formData: FormData
): Promise<LogoutFormState> {
  try {
    await signOut()
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }

  revalidatePath(path)
  redirect(`/`)
}
