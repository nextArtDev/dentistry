'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image, User } from '@prisma/client'
import { usePathname } from 'next/navigation'

import { FC, KeyboardEvent, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertModal } from '../../../../../../../components/dashboard/AlertModal'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus, Trash, UploadCloud } from 'lucide-react'
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

import { createUserSchema } from '@/lib/schemas/dashboard'
import { toast } from 'sonner'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ImageSlider from '@/components/dashboard/ImageSlider'
import { cn } from '@/lib/utils'

import NextImage from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  createDoctor,
  createUser,
  deleteDoctor,
  editDoctor,
  editUser,
} from '@/lib/actions/dashboard/doctor'
import { useFormState } from 'react-dom'
import { MultiSelect } from '@/components/dashboard/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import React from 'react'

// import { MultiSelect } from '@/components/dashboard/MultiSelect'

type UserFormValues = z.infer<typeof createUserSchema>

interface UserFormProps {
  initialData: User & { profileImag: { url: string } | null } & {
    beforeImage: { url: string } | null
  } & {
    afterImag: { url: string } | null
  }
  //   | (User &
  //     {
  //       images: Image[]
  //     } & { specialization: Specialization[] } & { open_time: DateTag[] })
  //   | null
  // specialization: Specialization[]
}

const UserForm: FC<UserFormProps> = ({ initialData }) => {
  const [file, setFile] = useState<File | null>(null)
  const [beforeFiles, setBeforeFiles] = useState<File | null>(null)
  const [afterFiles, setAfterFiles] = useState<File | null>(null)

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

        gender: initialData.gender || '',
        // open_time:
        //   initialData.open_time.map((w: { time: string }) => w.time) || [],
        // main_image: initialData.main_image || '',
        bio: initialData.bio || '',
      }
    : {
        name: '',
        phone: '',
        password: '',
        gender: '',
        bio: '',
        // main_image: undefined,
        // images: [],
        // booking: [],
        // open_time: [],
        // close_time: [],
        // price: 0,
        // specializationId: [],
      }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('phone', data.phone || '')
    formData.append('bio', data.bio || '')
    formData.append('password', data.password)
    formData.append('gender', data.gender || '1')
    formData.append('profileImage', data.profileImage)
    formData.append('beforeImage', data.beforeImage)
    formData.append('afterImage', data.afterImage)

    // formData.append('price', String(data.price))
    // if (data.specializationId && data.specializationId.length > 0) {
    //   for (let i = 0; i < data.specializationId.length; i++) {
    //     formData.append('specializationId', data.specializationId[i])
    //   }
    // }
    // if (data.open_time && data.open_time.length > 0) {
    //   for (let i = 0; i < data.open_time.length; i++) {
    //     formData.append('open_time', data.open_time[i])
    //   }
    // }
    // if (data.afterImage && data.afterImage.length > 0) {
    //   for (let i = 0; i < data.afterImage.length; i++) {
    //     formData.append('afterImage', data.afterImage[i])
    //   }
    // }
    // if (data.beforeImage && data.beforeImage.length > 0) {
    //   for (let i = 0; i < data.beforeImage.length; i++) {
    //     formData.append('beforeImage', data.beforeImage[i])
    //   }
    // }

    try {
      if (initialData) {
        // console.log({ data, initialData })
        startTransition(() => {
          editUser(formData, initialData.id as string, path)
            .then((res) => {
              if (res?.errors?.name) {
                form.setError('name', {
                  type: 'custom',
                  message: res?.errors.name?.join(' و '),
                })
              } else if (res.errors?.phone) {
                form.setError('phone', {
                  type: 'custom',
                  message: res?.errors.phone?.join(' و '),
                })
              } else if (res.errors?.password) {
                form.setError('password', {
                  type: 'custom',
                  message: res?.errors.password?.join(' و '),
                })
              } else if (res.errors?.bio) {
                form.setError('bio', {
                  type: 'custom',
                  message: res?.errors.bio?.join(' و '),
                })
              } else if (res.errors?.gender) {
                form.setError('gender', {
                  type: 'custom',
                  message: res?.errors.gender?.join(' و '),
                })
              } else if (res.errors?.profileImage) {
                form.setError('profileImage', {
                  type: 'custom',
                  message: res?.errors.profileImage?.join(' و '),
                })
              } else if (res?.errors?.beforeImage) {
                form.setError('beforeImage', {
                  type: 'custom',
                  message: res?.errors.beforeImage?.join(' و '),
                })
              } else if (res?.errors?.afterImage) {
                form.setError('afterImage', {
                  type: 'custom',
                  message: res?.errors.afterImage?.join(' و '),
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
          createUser(formData, path)
            .then((res) => {
              if (res?.errors?.name) {
                form.setError('name', {
                  type: 'custom',
                  message: res?.errors.name?.join(' و '),
                })
              } else if (res.errors?.phone) {
                form.setError('phone', {
                  type: 'custom',
                  message: res?.errors.phone?.join(' و '),
                })
              } else if (res.errors?.password) {
                form.setError('password', {
                  type: 'custom',
                  message: res?.errors.password?.join(' و '),
                })
              } else if (res.errors?.bio) {
                form.setError('bio', {
                  type: 'custom',
                  message: res?.errors.bio?.join(' و '),
                })
              } else if (res.errors?.gender) {
                form.setError('gender', {
                  type: 'custom',
                  message: res?.errors.gender?.join(' و '),
                })
              } else if (res.errors?.profileImage) {
                form.setError('profileImage', {
                  type: 'custom',
                  message: res?.errors.profileImage?.join(' و '),
                })
              } else if (res?.errors?.beforeImage) {
                form.setError('beforeImage', {
                  type: 'custom',
                  message: res?.errors.beforeImage?.join(' و '),
                })
              } else if (res?.errors?.afterImage) {
                form.setError('afterImage', {
                  type: 'custom',
                  message: res?.errors.afterImage?.join(' و '),
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

  // const beforeValidUrls =
  //   initialData && initialData.beforeImage
  //     ? (initialData.beforeImage
  //         .map((img) => img.url)
  //         .filter(Boolean) as string[])
  //     : (files
  //         .map((file) => URL.createObjectURL(file))
  //         .filter(Boolean) as string[])
  const beforeValidUrls =
    initialData && initialData.beforeImage
      ? initialData.beforeImage.url
      : beforeFiles
      ? URL.createObjectURL(beforeFiles)
      : null
  const afterValidUrls =
    initialData && initialData.afterImag
      ? initialData.afterImag.url
      : afterFiles
      ? URL.createObjectURL(afterFiles)
      : null

  const validUrl =
    initialData && initialData.profileImag
      ? initialData.profileImag.url
      : file
      ? URL.createObjectURL(file)
      : null

  // const handleInputKeyDown = (
  //   e: KeyboardEvent<HTMLInputElement>,
  //   field: any
  // ) => {
  //   if (e.key === 'Enter' && field.name === 'open_time') {
  //     e.preventDefault()

  //     const tagInput = e.target as HTMLInputElement

  //     if (tagInput.value !== '') {
  //       if (!field.value?.includes(tagInput.value as never)) {
  //         form.setValue('open_time', [...field.value, tagInput.value])
  //         tagInput.value = ''
  //         form.clearErrors('open_time')
  //       }
  //     } else {
  //       form.trigger()
  //     }
  //   }
  // }

  // const handleTagRemove = (tag: string, field: any) => {
  //   const newTags = field.value?.filter((t: string) => t !== tag)

  //   form.setValue('open_time', newTags)
  // }
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
              href={`/dashboard/users/${initialData.id}/new`}
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
          {/* <div className="col-span-2 lg:col-span-4 max-w-md ">
            {!!files && (
              <div
                // ratio={}
                className="relative mx-auto rounded-lg  h-96 w-[95%] max-w-xl "
              >
                <NextImage
                  alt="billboard-pic"
                  // src={initialData?.image ? initialData?.image?.url : files}
                  src={files}
                  // src={URL.createObjectURL(files)}
                  fill
                  className="object-cover rounded-lg"
                />
                <Trash
                  className={cn(
                    buttonVariants({ variant: 'destructive', size: 'sm' }),
                    'absolute -top-1 -left-1 w-10 h-10 cursor-pointer '
                  )}
                  onClick={() => {
                    form.reset({ ...form.getValues(), profileImage: null })
                    setFiles('')
                  }}
                />
              </div>
            )}

            <label
              htmlFor="profileImage"
              className={cn(
                'max-w-md mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-secondary/20 border-dashed w-full h-24 shadow ',
                files.length > 0 ? 'hidden' : ''
              )}
            >
              <span
                className={cn(
                  buttonVariants({ variant: 'ghost' }),

                  'flex flex-col items-center justify-center gap-2 h-64 w-full'
                )}
              >
                <UploadCloud />
                عکس پروفایل
              </span>
            </label>
            <input
              name="profileImage"
              id="profileImage"
              className="hidden"
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null
                if (file) {
                  form.setValue('profileImage', URL.createObjectURL(file))
                  setFiles(URL.createObjectURL(file))
                }
              }}
            />
          </div> */}
          <div className="col-span-2 lg:col-span-4 max-w-md ">
            {file ? (
              <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                <AspectRatio ratio={1 / 1} className="relative h-full">
                  <NextImage
                    fill
                    src={validUrl || ''}
                    alt="Uploaded image"
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-dashed w-full h-24 shadow">
                      <span className={cn(buttonVariants())}> عکس پروفایل</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={form.formState.isSubmitting}
                        {...field}
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0]
                          if (selectedFile) {
                            setFile(selectedFile)
                            onChange(selectedFile)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.getFieldState('profileImage')?.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex flex-col gap-8 md:grid md:grid-cols-3  ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    نام و نام خانوادگی کاربر{' '}
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
                  <FormLabel>
                    شماره تماس
                    <span className="text-rose-500">*</span>
                  </FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {' '}
                    کد ملی
                    <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="کد ملی"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>بیوگرافی بیمار</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="بیوگرافی بیمار"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="max-w-md">
                  <FormLabel>جنسیت</FormLabel>
                  <Select
                    dir="rtl"
                    disabled={isPending}
                    onValueChange={field.onChange}
                    // value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          // defaultValue={field.value}
                          placeholder="جنسیت بیمار را انتخاب کنید."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {[
                        { id: '1', label: 'مرد' },
                        { id: '2', label: 'زن' },
                      ].map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))} */}
                      <SelectItem value="1">مرد</SelectItem>
                      <SelectItem value="2">زن</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5 ">
            <div className="col-span-2 lg:col-span-4 max-w-md ">
              {!!beforeFiles ? (
                <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    <NextImage
                      fill
                      src={beforeValidUrls || ''}
                      alt="Uploaded image"
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="beforeImage"
                  render={({ field: { onChange }, ...field }) => (
                    <FormItem>
                      <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-dashed w-full h-24 shadow">
                        <span className={cn(buttonVariants())}>
                          {' '}
                          عکس پیش از درمان
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={form.formState.isSubmitting}
                          {...field}
                          onChange={(event) => {
                            const selectedFile = event.target.files?.[0]
                            if (selectedFile) {
                              setBeforeFiles(selectedFile)
                              onChange(selectedFile)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.getFieldState('beforeImage')?.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="col-span-2 lg:col-span-4 max-w-md ">
              {!!afterFiles ? (
                <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    <NextImage
                      fill
                      src={afterValidUrls || ''}
                      alt="Uploaded image"
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="afterImage"
                  render={({ field: { onChange }, ...field }) => (
                    <FormItem>
                      <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-dashed w-full h-24 shadow">
                        <span className={cn(buttonVariants())}>
                          عکس بعد از درمان
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={form.formState.isSubmitting}
                          {...field}
                          onChange={(event) => {
                            const selectedFile = event.target.files?.[0]
                            if (selectedFile) {
                              setAfterFiles(selectedFile)
                              onChange(selectedFile)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.getFieldState('afterImage')?.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}
            </div>
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

export default UserForm
