'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Image,
  Specialization,
  SpecializationId,
  TimeLine,
  User,
} from '@prisma/client'
import { usePathname } from 'next/navigation'

import { FC, KeyboardEvent, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { date, z } from 'zod'
import { AlertModal } from '../../../../../../../../../components/dashboard/AlertModal'
import { Button, buttonVariants } from '@/components/ui/button'
import { CalendarIcon, Plus, Trash, UploadCloud } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { createTimelineSchema, createUserSchema } from '@/lib/schemas/dashboard'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ImageSlider from '@/components/dashboard/ImageSlider'
import { cn } from '@/lib/utils'

import { useFormState } from 'react-dom'
import { MultiSelect } from '@/components/dashboard/multi-select'

import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, parse } from 'date-fns-jalali'
import {
  createTimeline,
  deleteTimeline,
  editTimeline,
} from '@/lib/actions/dashboard/timeline'
import { deleteUser } from '@/lib/actions/dashboard/doctor'
// import { specializations } from '@/constants'
// import { MultiSelect } from '@/components/dashboard/MultiSelect'

type TimelineFormValues = z.infer<typeof createTimelineSchema>

interface TimelineFormProps {
  initialData:
    | (TimeLine & {
        images: { url: string }[] | null
      } & { specialization: Specialization[] })
    | null
  userId: string
  specialization: Specialization[]
}

const TimelineForm: FC<TimelineFormProps> = ({
  initialData,
  userId,
  specialization,
}) => {
  const [files, setFiles] = useState<File[]>([])

  // const [modal, setModal] = useState('')
  const path = usePathname()

  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش ' : 'ایجاد کاربر جدید'
  const description = initialData
    ? 'ویرایش اطلاعات کاربر'
    : 'اضافه کردن کاربر جدید'
  const toastMessage = initialData
    ? 'اطلاعات کاربر آپدیت شد.'
    : 'کاربر ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const defaultValues = initialData
    ? {
        ...initialData,
        //In prisma mysql price is Decimal but here it has to be a float
        // price: parseFloat(String(initialData?.price)),
        // date: new Intl.DateTimeFormat('fa-IR').format(initialData.date),

        description: initialData.description || '',

        specializationId:
          initialData.specialization.map((w: { id: string }) => w.id) || [],
      }
    : {
        // name: '',
        // phone: '',
        // password: '',
        // gender: '',
        // bio: '',
        description: '',
        // main_image: undefined,
        // images: [],
        // booking: [],
        // open_time: [],
        // close_time: [],
        // price: 0,
        specializationId: [],
      }

  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(createTimelineSchema),
    defaultValues,
  })

  const onSubmit = async (data: TimelineFormValues) => {
    const formData = new FormData()

    // formData.append('date', data.date)
    formData.append('date', format(data.date, 'yyyy/MM/dd'))
    formData.append('description', data.description || '')

    // formData.append('price', String(data.price))
    // if (data.specializationId && data.specializationId.length > 0) {
    //   for (let i = 0; i < data.specializationId.length; i++) {
    //     formData.append('specializationId', data.specializationId[i])
    //   }
    // }
    if (data.specializationId && data.specializationId.length > 0) {
      for (let i = 0; i < data.specializationId.length; i++) {
        formData.append('specializationId', data.specializationId[i])
      }
    }
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
    }

    try {
      if (initialData) {
        // console.log({ data, initialData })
        startTransition(() => {
          editTimeline(
            formData,
            initialData.id as string,
            userId as string,
            path
          )
            .then((res) => {
              if (res?.errors?.date) {
                form.setError('date', {
                  type: 'custom',
                  message: res?.errors.date?.join(' و '),
                })
              } else if (res.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res.errors?.images) {
                form.setError('images', {
                  type: 'custom',
                  message: res?.errors.images?.join(' و '),
                })
              } else if (res.errors?.specializationId) {
                form.setError('specializationId', {
                  type: 'custom',
                  message: res?.errors.specializationId?.join(' و '),
                })
              } else if (res?.errors?._form) {
                toast.error(res?.errors._form?.join(' و '))
              }
              // if (res?.success) {
              //    toast.success(toastMessage)
              // }
            })
            .catch(() => console.log('مشکلی پیش آمده.'))
        })
      } else {
        startTransition(() => {
          createTimeline(formData, path, userId as string)
            .then((res) => {
              if (res?.errors?.date) {
                form.setError('date', {
                  type: 'custom',
                  message: res?.errors.date?.join(' و '),
                })
              } else if (res.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res.errors?.images) {
                form.setError('images', {
                  type: 'custom',
                  message: res?.errors.images?.join(' و '),
                })
              } else if (res.errors?.specializationId) {
                form.setError('specializationId', {
                  type: 'custom',
                  message: res?.errors.specializationId?.join(' و '),
                })
              } else if (res?.errors?._form) {
                toast.error(res?.errors._form?.join(' و '))
              }
              // if (res?.success) {
              //    toast.success(toastMessage)
              // }
            })
            .catch(() => console.log('مشکلی پیش آمده.'))
        })
      }
    } catch {
      toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
    }
  }

  // const handleInputKeyDown = (
  //   e: KeyboardEvent<HTMLInputElement>,
  //   field: any
  // ) => {
  //   if (e.key === 'Enter' && field.name === 'specializationId') {
  //     e.preventDefault()

  //     const tagInput = e.target as HTMLInputElement

  //     if (tagInput.value !== '') {
  //       if (!field.value?.includes(tagInput.value as never)) {
  //         form.setValue('specializationId', [...field.value, tagInput.value])
  //         tagInput.value = ''
  //         form.clearErrors('specializationId')
  //       }
  //     } else {
  //       form.trigger()
  //     }
  //   }
  // }

  // const handleTagRemove = (tag: string, field: any) => {
  //   const newTags = field.value?.filter((t: string) => t !== tag)

  //   form.setValue('specializationId', newTags)
  // }
  const validUrls =
    initialData && initialData.images
      ? (initialData.images.map((img) => img.url).filter(Boolean) as string[])
      : (files
          .map((file) => URL.createObjectURL(file))
          .filter(Boolean) as string[])

  const [deleteState, deleteAction] = useFormState(
    deleteTimeline.bind(null, path, initialData?.id as string),
    {
      errors: {},
    }
  )
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        // onConfirm={onDelete}
        onConfirm={deleteAction}
        isPending={isPending}
      />
      <div className="flex items-center justify-between">
        {initialData && (
          <>
            <Button
              disabled={isPending}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Link
              href={`/dashboard/users/${userId}/new`}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'flex items-center justify-center gap-1'
              )}
            >
              <Plus className="h-4 w-4" />
              <p className="">افزودن ویزیت</p>
            </Link>
          </>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 space-y-8  w-full"
        >
          <div className="col-span-2 lg:col-span-4 max-w-md ">
            {files.length > 0 ? (
              <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                <AspectRatio ratio={1 / 1} className="relative h-full">
                  <ImageSlider urls={validUrls} />
                </AspectRatio>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="images"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2   border-dashed w-full h-24 shadow  ">
                      {/* <FileUp size={42} className=" " /> */}
                      <span className={cn(buttonVariants())}>انتخاب عکس</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={true}
                        disabled={form.formState.isSubmitting}
                        {...field}
                        onChange={async (event) => {
                          // Triggered when user uploaded a new file
                          // FileList is immutable, so we need to create a new one
                          const dataTransfer = new DataTransfer()

                          // Add old images
                          if (files) {
                            Array.from(files).forEach((image) =>
                              dataTransfer.items.add(image)
                            )
                          }

                          // Add newly uploaded images
                          Array.from(event.target.files!).forEach((image) =>
                            dataTransfer.items.add(image)
                          )

                          // Validate and update uploaded file
                          const newFiles = dataTransfer.files

                          setFiles(Array.from(newFiles))

                          onChange(newFiles)
                        }}
                      />
                    </FormControl>

                    {/* <FormMessage className="dark:text-rose-400" /> */}
                    <FormMessage>
                      {form.getFieldState('images')?.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex flex-col gap-8 md:grid md:grid-cols-3  ">
            {!initialData && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col mx-auto max-w-sm w-fit">
                    <FormLabel> تاریخ</FormLabel>
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
                              new Intl.DateTimeFormat('fa-IR').format(
                                field.value
                              )
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
                          // onDayClick={(date) =>
                          //   setModal(format(date, 'yyyy/MM/dd'))
                          // }
                          disabled={(date) =>
                            date < new Date() || date < new Date('1900-01-01')
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
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="توضیحات"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specializationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    تخصص <span className="text-rose-500">*</span>
                  </FormLabel>
                  <MultiSelect
                    options={specialization.map((special) => ({
                      value: special.id,
                      label: special.name,
                    }))}
                    onValueChange={(data) => field.onChange(data)}
                    defaultValue={
                      // initialData ? defaultValues.specializationId : []
                      []
                    }
                    placeholder="انتخاب تخصص"
                    variant="inverted"
                    animation={2}
                    maxCount={3}
                  />

                  <FormMessage>
                    {form.getFieldState('specializationId')?.error?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <Button
            variant={'secondary'}
            disabled={isPending}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default TimelineForm
