'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image, Personnel } from '@prisma/client'
import { usePathname } from 'next/navigation'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Trash } from 'lucide-react'
import { FC, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AlertModal } from '../../../../../../../components/dashboard/AlertModal'

import ImageSlider from '@/components/dashboard/ImageSlider'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  createPersonnel,
  deletePersonnel,
  editPersonnel,
} from '@/lib/actions/dashboard/personnel'
import { createPersonnelSchema } from '@/lib/schemas/dashboard'
import { cn } from '@/lib/utils'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

type PersonnelFormValues = z.infer<typeof createPersonnelSchema>

interface PersonnelFormProps {
  initialData:
    | (Personnel & {
        images: Image[]
      })
    | null
}

const PersonnelForm: FC<PersonnelFormProps> = ({ initialData }) => {
  const [files, setFiles] = useState<File[]>([])

  const path = usePathname()

  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش ' : 'ایجاد پرسنل جدید'
  const description = initialData
    ? 'ویرایش اطلاعات پرسنل'
    : 'اضافه کردن پرسنل جدید'
  const toastMessage = initialData
    ? 'اطلاعات پرسنل آپدیت شد.'
    : 'پرسنل ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        name: '',
        description: '',
      }

  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(createPersonnelSchema),
    defaultValues,
  })

  const onSubmit = async (data: PersonnelFormValues) => {
    const formData = new FormData()

    formData.append('name', data.name)

    formData.append('description', data.description)

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
    }

    try {
      if (initialData) {
        // console.log({ data, initialData })
        startTransition(() => {
          editPersonnel(formData, initialData.id as string, path)
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
          createPersonnel(formData, path)
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

  const [deleteState, deleteAction] = useFormState(
    deletePersonnel.bind(null, path, initialData?.id as string),
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
                      {/* @ts-ignore */}
                      {form.getFieldState('images')?.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    نام و نام خانوادگی پرسنل{' '}
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
          </div>

          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default PersonnelForm
