'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateTag, Doctor, Image, Specialization, User } from '@prisma/client'
import { usePathname } from 'next/navigation'

import { FC, KeyboardEvent, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertModal } from '../../../../../../../components/dashboard/AlertModal'
import { Button, buttonVariants } from '@/components/ui/button'
import { Trash } from 'lucide-react'
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

import { createDoctorSchema } from '@/lib/schemas/dashboard'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ImageSlider from '@/components/dashboard/ImageSlider'
import { cn } from '@/lib/utils'
import { MultiSelect } from '@/components/multi-select'
import NextImage from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  createDoctor,
  deleteDoctor,
  editDoctor,
} from '@/lib/actions/dashboard/doctor'
import { useFormState } from 'react-dom'
// import { MultiSelect } from '@/components/dashboard/MultiSelect'

type UserFormValues = z.infer<typeof createUserSchema>

interface UserFormProps {
  initialData: User
  //   | (User &
  //     {
  //       images: Image[]
  //     } & { specialization: Specialization[] } & { open_time: DateTag[] })
  //   | null
  // specialization: Specialization[]
}

const UserForm: FC<UserFormProps> = ({ initialData }) => {
  const [files, setFiles] = useState<File[]>([])

  const path = usePathname()

  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش ' : 'ایجاد دکتر جدید'
  const description = initialData
    ? 'ویرایش اطلاعات دکتر'
    : 'اضافه کردن دکتر جدید'
  const toastMessage = initialData ? 'اطلاعات دکتر آپدیت شد.' : 'دکتر ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const defaultValues = initialData
    ? {
        ...initialData,
        //In prisma mysql price is Decimal but here it has to be a float
        // price: parseFloat(String(initialData?.price)),
        phone: initialData.phone || '',
        website: initialData.website || '',
        open_time:
          initialData.open_time.map((w: { time: string }) => w.time) || [],
        // main_image: initialData.main_image || '',
        description: initialData.description || '',
        specializationId:
          initialData.specialization.map((w: { id: string }) => w.id) || [],
      }
    : {
        name: '',
        phone: '',
        website: '',
        description: '',
        // main_image: undefined,
        // images: [],
        // booking: [],
        open_time: [],
        // close_time: [],
        // price: 0,
        specializationId: [],
      }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('phone', data.phone || '')
    formData.append('website', data.website || '')
    formData.append('description', data.description || '')

    // formData.append('price', String(data.price))
    if (data.specializationId && data.specializationId.length > 0) {
      for (let i = 0; i < data.specializationId.length; i++) {
        formData.append('specializationId', data.specializationId[i])
      }
    }
    if (data.open_time && data.open_time.length > 0) {
      for (let i = 0; i < data.open_time.length; i++) {
        formData.append('open_time', data.open_time[i])
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
          editDoctor(formData, initialData.id as string, path)
            .then((res) => {
              if (res?.errors?.name) {
                form.setError('name', {
                  type: 'custom',
                  message: res?.errors.name?.join(' و '),
                })
              } else if (res.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res.errors?.open_time) {
                form.setError('open_time', {
                  type: 'custom',
                  message: res?.errors.open_time?.join(' و '),
                })
              } else if (res.errors?.phone) {
                form.setError('phone', {
                  type: 'custom',
                  message: res?.errors.phone?.join(' و '),
                })
              } else if (res.errors?.website) {
                form.setError('website', {
                  type: 'custom',
                  message: res?.errors.website?.join(' و '),
                })
              } else if (res.errors?.specializationId) {
                form.setError('specializationId', {
                  type: 'custom',
                  message: res?.errors.specializationId?.join(' و '),
                })
              } else if (res?.errors?.images) {
                form.setError('images', {
                  type: 'custom',
                  message: res?.errors.images?.join(' و '),
                })
              } else if (res?.errors?._form) {
                toast.error(res?.errors._form?.join(' و '))
              }
              // if (res?.success) {
              //    toast.success(toastMessage)
              // }
            })
            // TODO: fixing Through Error when its ok
            // .catch(() => toast.error('مشکلی پیش آمده.'))
            .catch(() => console.log('مشکلی پیش آمده.'))
        })
      } else {
        startTransition(() => {
          createDoctor(formData, path)
            .then((res) => {
              if (res?.errors?.name) {
                form.setError('name', {
                  type: 'custom',
                  message: res?.errors.name?.join(' و '),
                })
              } else if (res.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res.errors?.open_time) {
                form.setError('open_time', {
                  type: 'custom',
                  message: res?.errors.open_time?.join(' و '),
                })
              } else if (res.errors?.phone) {
                form.setError('phone', {
                  type: 'custom',
                  message: res?.errors.phone?.join(' و '),
                })
              } else if (res.errors?.website) {
                form.setError('website', {
                  type: 'custom',
                  message: res?.errors.website?.join(' و '),
                })
              } else if (res.errors?.specializationId) {
                form.setError('specializationId', {
                  type: 'custom',
                  message: res?.errors.specializationId?.join(' و '),
                })
              } else if (res?.errors?.images) {
                form.setError('images', {
                  type: 'custom',
                  message: res?.errors.images?.join(' و '),
                })
              } else if (res?.errors?._form) {
                toast.error(res?.errors._form?.join(' و '))
                form.setError('root', {
                  type: 'custom',
                  message: res?.errors?._form?.join(' و '),
                })
              }
            })
            .catch(() => console.log('مشکلی پیش آمده.'))
        })
      }
    } catch {
      toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
    }
  }

  const validUrls =
    initialData && initialData.images
      ? (initialData.images.map((img) => img.url).filter(Boolean) as string[])
      : (files
          .map((file) => URL.createObjectURL(file))
          .filter(Boolean) as string[])

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'open_time') {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement

      if (tagInput.value !== '') {
        if (!field.value?.includes(tagInput.value as never)) {
          form.setValue('open_time', [...field.value, tagInput.value])
          tagInput.value = ''
          form.clearErrors('open_time')
        }
      } else {
        form.trigger()
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value?.filter((t: string) => t !== tag)

    form.setValue('open_time', newTags)
  }
  const [deleteState, deleteAction] = useFormState(
    deleteDoctor.bind(null, path, initialData?.id as string),
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
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
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
                      {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {form.getFieldState('images')?.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    نام و نام خانوادگی دکتر{' '}
                    <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="نام و نام خانوادگی "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تماس</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="شماره تماس"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس وبسایت</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="آدرس وبسایت"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {/* <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قیمت ویزیت</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="specializationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    تخصص <span className="text-rose-500">*</span>
                  </FormLabel>
                  {/* <MultiSelect
                    selected={field.value!}
                    options={specialization.map((specialization) => {
                      return {
                        value: specialization.id,
                        label: specialization.name,
                      }
                    })}
                    // onChange={console.log(form.getValues('specializationId'))}

                    {...field}
                    // className="sm:w-[510px]"
                  /> */}
                  <MultiSelect
                    options={specialization.map((special) => ({
                      value: special.id,
                      label: special.name,
                    }))}
                    onValueChange={(data) => field.onChange(data)}
                    defaultValue={
                      initialData ? defaultValues.specializationId : []
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
          <FormField
            control={form.control}
            name="open_time"
            render={({ field }) => (
              <FormItem className="flex w-fit flex-col">
                <FormLabel>روز و ساعت حضور</FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="min-h-[56px] "
                      // {...field}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      placeholder="اضافه کردن روز و ساعت..."
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value?.map((tag: any) => (
                          <Badge
                            key={tag}
                            className=" flex items-center justify-center gap-2 rounded-md border-none bg-slate-400 px-4 py-2 capitalize hover:bg-slate-600 "
                            onClick={() => handleTagRemove(tag, field)}
                          >
                            {tag}

                            <NextImage
                              src={'/icons/close.svg'}
                              alt="Close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 "
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5">
                  بعد از وارد کردن هر زمان مثلا به صورت «سه‌شنبه 12 تا 14» اینتر
                  بزنید.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default UserForm
