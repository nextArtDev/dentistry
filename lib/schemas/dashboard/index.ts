import { Prisma } from '@prisma/client'
import * as z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),
  phone: z
    .string()
    // .regex(new RegExp('^(09|۰۹)\\d{9}$'), {
    //   message: 'شماره موبایل معتبر نیست.',
    // })
    // .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
    //   message: 'شماره موبایل معتبر نیست.',
    // })
    .optional(),
  password: z.string(),
  // .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
  // .optional(),
  gender: z.string().optional(),
  bio: z.string().optional(),
  // open_time: z.array(
  //   z
  //     .string()
  //     .min(1, {
  //       message: 'تگ باید حداقل 1 حرف باشد.',
  //     })
  //     .max(35, {
  //       message: 'تگ نمی‌تواند بیش از 35 حرف باشد.',
  //     })
  // ),
  //   main_image: z
  //     .string()
  //     .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
  //     .url()
  // .optional(),
  profileImage: z.any().optional(),
  beforeImage: z.any().optional(),
  afterImage: z.any().optional(),

  // .array()  satisfies Prisma.ImagesUncheckedCreateNestedManyWithoutDoctorInput,
  // booking: z.object({ booking_time: z.date() }).array().optional(),
  //Because we're working with Decimal, we should add "coerce"
  // price: z.coerce.number().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),
  // specializationId: z
  //   .array(z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }))
  //   .optional(),
  // }) satisfies z.Schema<Prisma.DoctorUncheckedCreateInput>
})
export const createPersonnelSchema = z.object({
  name: z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),

  description: z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),

  images: z.any().optional(),
})

export const createTimelineSchema = z.object({
  date: z.date({
    required_error: 'وارد کردن روز الزامی است.',
  }),

  description: z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),
  images: z.any().optional(),

  specializationTag: z.array(
    z
      .string()
      .min(1, {
        message: 'تگ باید حداقل 1 حرف باشد.',
      })
      .max(35, {
        message: 'تگ نمی‌تواند بیش از 35 حرف باشد.',
      })
  ),

  // .array()  satisfies Prisma.ImagesUncheckedCreateNestedManyWithoutDoctorInput,
  // booking: z.object({ booking_time: z.date() }).array().optional(),
  //Because we're working with Decimal, we should add "coerce"
}) satisfies z.Schema<Prisma.TimeLineUncheckedCreateInput>

export const createSpecializationSchema = z.object({
  name: z.string().min(1, { message: 'این قسمت نمی‌تواند خالی باشد' }),
  description: z.string().optional(),
  // open_time: z.string().optional(),
  // close_time: z.string().optional(),
  //   main_image: z
  //     .string()
  //     .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
  //     .url()
  //     .optional(),
  images: z.any().optional(),
  // .array()  satisfies Prisma.ImagesUncheckedCreateNestedManyWithoutDoctorInput,
  // booking: z.object({ booking_time: z.date() }).array().optional(),
  //Because we're working with Decimal, we should add "coerce"
  // illnessId: z.coerce
  //   .number()
  //   .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
  //   .optional(),
  // doctorId: z
  //   .string()
  //   .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
  //   .optional(),
})
