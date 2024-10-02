'use client'

import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Facebook, Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import Balancer from 'react-wrap-balancer'
// import Logo from '@/public/logo.svg'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { createReview } from '@/lib/actions/rating'
import { createReviewSchema } from '@/lib/schemas/rating'
import { ExtendedUserWithoutEmail } from '@/types/next-auth'
import { usePathname } from 'next/navigation'
import { startTransition } from 'react'
import { toast } from 'sonner'
import { BorderBeam } from '../BorderBeam'
import { Button } from '../ui/button'
import { Container } from './Craft'
import { StarRating } from './StarRating'

interface FooterProps {
  // user?: ExtendedUserWithoutEmail
}

// export default function Footer({ user }: FooterProps) {
export default function Footer() {
  const path = usePathname()

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: '',
      rating: 5,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof createReviewSchema>) {
    console.log(data)
    const formData = new FormData()
    formData.append('comment', data.comment)
    formData.append('rating', String(data.rating))
    try {
      // startTransition(() => {
      //   createReview(formData, path, user?.id as string)
      //     .then((res) => {
      //       if (res?.errors?.comment) {
      //         form.setError('comment', {
      //           type: 'custom',
      //           message: res?.errors.comment?.join(' و '),
      //         })
      //       } else if (res?.errors?.rating) {
      //         form.setError('rating', {
      //           type: 'custom',
      //           message: res?.errors.rating?.join(' و '),
      //         })
      //       } else if (res?.errors?._form) {
      //         toast.error(res?.errors._form?.join(' و '))
      //         form.setError('root', {
      //           type: 'custom',
      //           message: res?.errors?._form?.join(' و '),
      //         })
      //       }
      //       // if (res?.success) {
      //       //    toast.success(toastMessage)
      //       // }
      //     })
      //     .catch(() => toast.error('مشکلی پیش آمده.'))
      // })
    } catch (error) {}
  }
  return (
    <footer className="border-t border-white/40 bg-white text-black">
      <section>
        <Container className="grid gap-6">
          <div className="not-prose flex flex-col">
            <h3 className="text-xl font-semibold ">آدرس مطب:</h3>
            <br />
            {/* <Link href="/">
              <Image
                src={'/images/1.jpg'}
                alt="Logo"
                width={120}
                height={27.27}
                className="transition-all hover:opacity-75 dark:invert"
              ></Image>
            </Link> */}
            <p>
              <Balancer>اصفهان، خیابان رودکی</Balancer>
            </p>
            <div className="flex gap-2 pt-8">
              <Button variant="outline" size="icon">
                <Github />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter />
              </Button>
              <Button variant="outline" size="icon">
                <Facebook />
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="not-prose space-y-12 text-center "
            >
              <h1 className="text-center text-green-600 text-xl font-semibold sm:text-lg">
                درج نظر و دیدگاه درباره دکتر کلانتری
              </h1>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="mx-auto">
                    <FormControl className="h-36">
                      <TextareaAutosize
                        placeholder="درج دیدگاه..."
                        className="w-full md:w-[70%] text-blue-200 resize-none appearance-none overflow-hidden bg-black/70 p-2 border rounded-lg text-xl font-bold focus:outline-none"
                        {...field}
                        // {...rest}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-200/60">
                      دیدگاه شما در صفحه عمومی دکتر نمایش داده خواهد شد.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl className="w-full  !text-center  ">
                      <StarRating
                        wrapperProps={{
                          className:
                            'pb-2 flex !items-center !justify-center  w-full text-center',
                        }}
                        value={field.value}
                        setValue={(d) => field.onChange(d)}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-200/60">
                      از یک تا پنج ستاره بدهید.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="relative border border-white/50  "
                type="submit"
              >
                ارسال دیدگاه
                <BorderBeam size={150} duration={7} delay={3} />
              </Button>
            </form>
          </Form>
        </Container>
        <Container className="not-prose items-center justify-between border-t text-sm md:flex">
          <div className="mb-6 flex flex-col gap-4 underline decoration-muted underline-offset-4 md:mb-0 md:flex-row">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
          <p dir="ltr" className="text-muted-foreground">
            ©<a href="https://github.com/brijr/components">Saeid Mehmanparst</a>
            . All rights reserved. 2024-present.
          </p>
        </Container>
      </section>
    </footer>
  )
}
