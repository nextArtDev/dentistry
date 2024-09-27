'use client'

import { FC, useTransition } from 'react'
import React from 'react'

import { TimerIcon } from 'lucide-react'

import { Time } from '@internationalized/date'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn, translateDays } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TimeValue } from 'react-aria'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
import { createAvailability } from '@/lib/actions/booking/availability'
import { TimeField } from './data-bable/time-picker/time-field'
import { availabilityFormSchema } from '@/lib/schemas/booking'
import { toast } from 'sonner'

import { Checkbox } from '@/components/ui/CheckBox'
import { Switch } from '@/components/ui/switch'

type DayData = {
  dayName: string
  selected: boolean
  startTime?: TimeValue | null // adjust according to your needs
  endTime?: TimeValue | null // adjust according to your needs
}

const slices = [2, 5, 7, 10, 15, 30]

interface AvailabilityTableProps {}
const AvailabilityTable: FC<AvailabilityTableProps> = ({}) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof availabilityFormSchema>>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      days: {
        monday: { selected: false, startTime: undefined, endTime: undefined },
        tuesday: { selected: false, startTime: undefined, endTime: undefined },
        wednesday: {
          selected: false,
          startTime: undefined,
          endTime: undefined,
        },
        thursday: { selected: false, startTime: undefined, endTime: undefined },
        friday: { selected: false, startTime: undefined, endTime: undefined },
        saturday: { selected: false, startTime: undefined, endTime: undefined },
        sunday: { selected: false, startTime: undefined, endTime: undefined },
      },
    },
  })
  function onSubmit(data: z.infer<typeof availabilityFormSchema>) {
    const days: any = []

    for (const [day, dayData] of Object.entries(data.days)) {
      if (dayData.selected && dayData.endTime && dayData.startTime) {
        days.push({
          dayName: day,
          selected: dayData?.selected,
          startTime: `${dayData?.startTime?.hour}:${dayData?.startTime?.minute}`,

          endTime: `${dayData?.endTime?.hour}:${dayData?.endTime?.minute}`,
        })
      }
    }
    startTransition(() => {
      createAvailability({
        days,
        slicer: data.slicer,
      })
        .then((res) => {
          toast.success('تعیین نوبت با موفقیت انجام شد.')
        })
        .catch(() => console.log('مشکلی پیش آمده.'))
    })

    // console.log(days)
  }

  const isAnyDaySelected = (days: any) => {
    return Object.values(days).some((day: any) => day.selected)
  }

  // Inside your component
  const selectedDays = form.watch('days')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <section className=" rounded-lg py-6 px-2  max-w-md mx-auto">
          <h1 className="text-center font-semibold text-base md:text-lg ">
            فرم نوبت دهی
          </h1>
          <div className="grid grid-cols-6 gap-2 my-4 pb-4 ">
            <FormField
              control={form.control}
              name="slicer"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>بازه زمانی</FormLabel>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue className="" placeholder="بازه (دقیقه)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {slices.map((slice, index) => (
                        <SelectItem key={index} value={String(slice)}>
                          {slice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ul className="flex flex-col gap-4 ">
            {Object.keys(availabilityFormSchema.shape.days.shape).map(
              (day, i) => (
                <article
                  key={day}
                  className={cn(
                    'grid grid-cols-6 h-16   ',
                    'border rounded-md px-2'
                  )}
                >
                  <div className="col-span-2 ml-auto flex justify-center items-center gap-1 ">
                    <FormField
                      control={form.control}
                      name={
                        `days.${day}.selected` as keyof z.infer<
                          typeof availabilityFormSchema
                        >
                      }
                      render={({ field }) => (
                        <FormItem className=" ">
                          <FormControl>
                            <Switch
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                            {/* 
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(d) => {
                                field.onChange(d)
             
                              }}
                            /> */}
                          </FormControl>
                          <FormLabel className="pr-1">
                            {translateDays(
                              day.charAt(0).toUpperCase() + day.slice(1)
                            )}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4 grid grid-cols-2 gap-5 ">
                    <div
                      dir="ltr"
                      className="flex items-center justify-center gap-1 order-first"
                    >
                      <FormField
                        control={form.control}
                        name={
                          `days.${day}.startTime` as keyof z.infer<
                            typeof availabilityFormSchema
                          >
                        }
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center justify-center ">
                            <FormControl>
                              <TimeField
                                defaultValue={new Time(0, 0)}
                                suffix={<TimerIcon />}
                                hourCycle={24}
                                size="sm"
                                isDisabled={
                                  // !form.watch(
                                  //   `days.${day}.selected` as keyof z.infer<
                                  //     typeof availabilityFormSchema
                                  //   >
                                  // )
                                  !form.watch(`days.${day}.selected` as any)
                                }
                                //@ts-ignore
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>از</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div
                      dir="ltr"
                      className="order-last  flex items-center justify-center gap-1"
                    >
                      <FormField
                        control={form.control}
                        name={
                          `days.${day}.endTime` as keyof z.infer<
                            typeof availabilityFormSchema
                          >
                        }
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center justify-center ">
                            <FormControl>
                              <TimeField
                                isDisabled={
                                  // !form.watch(
                                  //   `days.${day}.selected` as keyof z.infer<
                                  //     typeof availabilityFormSchema
                                  //   >
                                  // )
                                  !form.watch(`days.${day}.selected` as any)
                                }
                                defaultValue={new Time(0, 0)}
                                hourCycle={24}
                                suffix={<TimerIcon />}
                                size="sm"
                                //@ts-ignore
                                value={field.value!}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>تا</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* <div className="col-span-1">
                  <Button size={'sm'} className="p-0.5 px-1 flex gap-1">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div> */}
                </article>
              )
            )}
          </ul>
          <Button
            disabled={!isAnyDaySelected(selectedDays) || isPending}
            className="w-full my-4"
            type="submit"
          >
            تایید
          </Button>
        </section>
      </form>
    </Form>
  )
}

export default AvailabilityTable
