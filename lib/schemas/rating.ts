import { z } from 'zod'

export const createReviewSchema = z.object({
  comment: z
    .string()
    .max(512, { message: 'دیدگاه نمی‌تواند بیش از 512 حرف باشد.' }),
  rating: z.number().default(5),
})
export const createReviewActionSchema = z.object({
  comment: z
    .string()
    .min(3, {
      message: 'قسمت درج دیدگاه نباید خالی باشد',
    })
    .max(512, { message: 'دیدگاه نمی‌تواند بیش از 512 حرف باشد.' }),
  rating: z.string(),
})
