'use server'

import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { PhoneSchema } from '@/lib/schemas/auth'
import { getUserById } from '@/lib/queries/auth/user'
import { MelipayamakApi } from '@mfrtn/melipayamak-api'

export const sendSms = async (values: z.infer<typeof PhoneSchema>) => {
  const verificationCode = crypto.randomInt(100123, 999879)

  const validatedFields = PhoneSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'شماره نامعتبر است.' }
  }

  const { phone } = validatedFields.data

  const api = new MelipayamakApi({
    username: process.env.SMS_USERNAME!,
    password: process.env.SMS_PASSWORD!,
  })

  try {
    // console.log({ phone, verificationCode })
    await api.send({
      from: '50002710056401',
      to: phone,
      text: `کد تایید شما: ${
        verificationCode as number
      } \n مدت اعتبار این کد ۲ دقیقه می‌باشد
       \n https://shafagh.iran.liara.run`,
    })

    return { success: 'کد تایید به شماره شما ارسال شد.', verificationCode }
  } catch (error) {
    console.log(error)
  }
}

interface VerifySmsType {
  id: string
  verificationCode: string
}

export const verifySms = async (values: VerifySmsType) => {
  const { id, verificationCode } = values

  // console.log(verificationCode)

  if (
    verificationCode.length > 6 ||
    !verificationCode ||
    verificationCode.length < 6
  ) {
    return { error: 'کد نامعتبر است.' }
  }

  try {
    const user = await getUserById(id)
    if (!user) {
      return { error: 'شما هنوز ثبت نام نکرده‌اید.' }
    }

    if (user.verificationCode !== +verificationCode) {
      return { error: 'کد تایید اشتباه است.' }
    }
    if (!user.verificationDate) {
      return { error: 'کد ارسالی معتبر نیست.' }
    }
    const verificationDate = new Date(
      user.verificationDate.getTime() + 120 * 1000
    )
    if (verificationDate < new Date()) {
      user.verificationCode = null
      user.verificationDate = null
      return {
        error: 'کد تایید منقضی شده است.',
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationCode: +verificationCode,
        verificationDate: new Date(),
      },
    })
    return { success: 'حساب کاربری شما با موفقیت فعال شد.' }
  } catch (error) {
    console.log(error)
  }
}

interface SendBookingSms {
  values: z.infer<typeof PhoneSchema>
  dayTime: string
  doctorName: string
  name: string
}

export const sendBookingSms = async ({
  values,
  dayTime,
  doctorName,
  name,
}: SendBookingSms) => {
  const validatedFields = PhoneSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'شماره نامعتبر است.' }
  }

  const { phone } = validatedFields.data

  const api = new MelipayamakApi({
    username: process.env.SMS_USERNAME!,
    password: process.env.SMS_PASSWORD!,
  })

  try {
    await api.send({
      from: '50002710056401',
      to: phone,
      text: `${name}\n نوبت ${dayTime} شما  \n با دکتر ${doctorName} رزرو شد.
      \n https://shafagh.iran.liara.run`,
    })

    return { success: 'پیام رزرو ارسال شد.' }
  } catch (error) {
    console.log(error)
  }
}

export const sendCancelBookingSms = async ({
  values,
  dayTime,
  doctorName,
  name,
}: SendBookingSms) => {
  const validatedFields = PhoneSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'شماره نامعتبر است.' }
  }

  const { phone } = validatedFields.data

  try {
    const api = new MelipayamakApi({
      username: process.env.SMS_USERNAME!,
      password: process.env.SMS_PASSWORD!,
    })
    // const asm = await api.send({
    await api.send({
      from: '50002710056401',
      to: phone,
      text: `${name}\nنوبت ${dayTime} شما  \n با دکتر ${doctorName} کنسل شده است.
      \n https://shafagh.iran.liara.run`,
      // text: `${name}\nنوبت ${dayTime} شما  \n با دکتر ${doctorName} کنسل شده است. \n کلینیک آیین شفق`,
    })
    // console.log(asm)
    return { success: 'پیام کنسلی ارسال شد.' }
  } catch (error) {
    console.log(error)
  }
}
