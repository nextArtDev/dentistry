'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns-jalali'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn, getDayNameFromIndex } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { motion } from 'framer-motion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Availability, BookedDay, TimeSlot } from '@prisma/client'
import { FC, useEffect, useState, useTransition } from 'react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { disableSpecialDay } from '@/lib/actions/booking/availability'
import { toast } from 'sonner'

interface DisableSpecialDayProps {
  availabilities?:
    | (Availability & {
        times: (TimeSlot & { bookedDays: (BookedDay | null)[] })[] | null
      })[]
    | null
}
const DisableSpecialDay: FC<DisableSpecialDayProps> = ({}) => {
  const [isPending, startTransition] = useTransition()

  const formSchema = z.object({
    dob: z.date({
      required_error: 'وارد کردن روز الزامی است.',
    }),
    doctorId: z.string(),
  })

  const [modal, setModal] = useState('')
  console.log(modal)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(() => {
      disableSpecialDay({
        doctorId: data.doctorId,
        date: format(data.dob, 'yyyy/MM/dd'),
        day: getDayNameFromIndex(data.dob.getDay()),
      })
        .then((res) => {
          toast.success('روز با موفقیت غیرفعال شد.')
        })
        .catch((error) => console.log(error))
    })
    console.log(format(data.dob, 'yyyy/MM/dd'))
    console.log(data.doctorId)
    console.log(getDayNameFromIndex(data.dob.getDay()))
    // console.log(jalaali.toJalaali(data.dob))
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-12 space-y-16 mb-36 flex flex-col items-center justify-between  "
      >
        {!form.watch('dob') ? (
          <div className="">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col mx-auto max-w-sm w-fit">
                  <FormLabel>غیرفعال کردن نوبتهای روز</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            // format(field.value, '')
                            new Intl.DateTimeFormat('fa-IR').format(field.value)
                          ) : (
                            <span>انتخاب روز</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 " align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        onDayClick={(date: any) =>
                          setModal(format(date, 'yyyy/MM/dd'))
                        }
                        disabled={(date: any) =>
                          date <= new Date() || date < new Date('1900-01-01')
                        }
                        dir="rtl"
                        // locale={faIR}
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <article className=" flex flex-col  items-center justify-between font-semibold">
            <Card className="flex flex-col items-center justify-center">
              <CardContent className="flex h-auto  ">
                <p className="text-sm pt-8 text-right ">
                  {' '}
                  {`نوبتهای روز ${format(
                    form.watch('dob'),
                    'yyyy/MM/dd'
                  )} را کنسل می‌کنید؟`}
                </p>
              </CardContent>
              <CardFooter className="max-w-sm mx-auto">
                <Button disabled={isPending} type="submit">
                  تایید{' '}
                </Button>
              </CardFooter>
            </Card>
          </article>
        )}
      </form>
    </Form>
  )
}

export default DisableSpecialDay
