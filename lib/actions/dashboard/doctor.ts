'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/lib/schemas/dashboard'
import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'

interface CreateUserFormState {
  // success?: string
  errors: {
    // name?: string[]
    // description?: string[]
    // phone?: string[]
    // // price?: string[]
    // website?: string[]

    // open_time?: string[]
    // specializationId?: string[]

    // images?: string[]
    name?: string[]
    phone?: string[]
    password?: string[]
    bio?: string[]
    gender?: string[]
    profileImage?: string[]
    beforeImage?: string[]
    afterImage?: string[]
    _form?: string[]
  }
}

export async function createUser(
  formData: FormData,
  path: string
): Promise<CreateUserFormState> {
  const result = createUserSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    bio: formData.get('bio'),
    gender: formData.get('gender'),
    profileImage: formData.get('profileImage'),
    beforeImage: formData.get('beforeImage'),
    afterImage: formData.get('afterImage'),
  })
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log(result?.data.description)

  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  // console.log(result)
  const gender = result.data?.gender === '2' ? 'زن' : 'مرد'
  // console.log('result.data', result.data)

  try {
    const isExisting = await prisma.user.findFirst({
      where: {
        OR: [
          {
            phone: result.data.phone,
          },
          { password: result.data.password },
        ],
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['کاربر با این کدملی موجود است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log(billboard)

    const buffer = Buffer.from(await result.data?.profileImage?.arrayBuffer())
    const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
    const res = await uploadFileToS3(
      convertedBuffer,
      result.data?.profileImage?.name
    )
    const beforeImageBuffer = Buffer.from(
      await result.data?.beforeImage?.arrayBuffer()
    )
    const convertedBeforeImageBuffer = await sharp(beforeImageBuffer)
      .webp({ effort: 6 })
      .toBuffer()
    const beforeImageRes = await uploadFileToS3(
      convertedBeforeImageBuffer,
      result.data?.beforeImage?.name
    )
    const afterImageBuffer = Buffer.from(
      await result.data?.afterImage?.arrayBuffer()
    )
    const convertedAfterImageBuffer = await sharp(afterImageBuffer)
      .webp({ effort: 6 })
      .toBuffer()
    const afterImageRef = await uploadFileToS3(
      convertedAfterImageBuffer,
      result.data?.profileImage?.name
    )

    // let imageIds: string[] = []
    // for (let img of result.data?.images || []) {
    //   const buffer = Buffer.from(await img.arrayBuffer())
    //   const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
    //   const res = await uploadFileToS3(convertedBuffer, img.name)
    //   if (res?.imageId && typeof res.imageId === 'string') {
    //     imageIds.push(res.imageId)
    //   }
    // }

    await prisma.user.create({
      data: {
        name: result.data.name,
        phone: result.data.phone!,
        password: result.data.password,
        bio: result?.data.bio,
        gender: gender,
        profileImageId: res?.imageId,
        beforeImageId: beforeImageRes?.imageId,
        afterImageId: afterImageRef?.imageId,

        // specialization: {
        //   connect: result.data?.specializationId?.map((id: string) => ({
        //     id: id,
        //   })),
        // },
      },
    })
    // if (result.data.) {
    //   const timeData = []
    //   for (const time of result.data.open_time) {
    //     const newTimeData = await prisma.dateTag.create({
    //       data: {
    //         time,
    //         userId: doctor.id,
    //       },
    //     })
    //     timeData.push(newTimeData.id)
    //   }
    //   await prisma.doctor.update({
    //     where: {
    //       id: doctor.id,
    //     },
    //     data: {
    //       open_time: {
    //         connect: timeData.map((id: string) => ({
    //           id,
    //         })),
    //       },
    //     },
    //   })
    // }
    // console.log(res?.imageUrl)
    // console.log(category)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }

  revalidatePath(path)
  redirect(`/dashboard/users`)
}
interface EditUserFormState {
  errors: {
    name?: string[]
    phone?: string[]
    password?: string[]
    bio?: string[]
    gender?: string[]
    profileImage?: string[]
    beforeImage?: string[]
    afterImage?: string[]
    _form?: string[]
  }
}

export async function editUser(
  formData: FormData,
  userId: string,
  path: string
): Promise<EditUserFormState> {
  const result = createUserSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    // price: formData.get('price'),
    password: formData.get('password'),
    bio: formData.get('bio'),
    gender: formData.get('gender'),
    profileImage: formData.get('profileImage'),
    beforeImage: formData.get('beforeImage'),
    afterImage: formData.get('afterImage'),
  })

  // console.log(result)
  // console.log(formData.getAll('images'))

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  const gender = result.data?.gender === '2' ? 'زن' : 'مرد'

  try {
    const isExisting:
      | (User & {
          profileImage: { id: string; key: string } | null
          beforeImage: { id: string; key: string } | null
          afterImage: { id: string; key: string } | null
        })
      | null = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        profileImage: { select: { id: true, key: true } },
        beforeImage: { select: { id: true, key: true } },
        afterImage: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کاربر حذف شده است!'],
        },
      }
    }
    const isPhoneExisting = await prisma.user.findFirst({
      where: {
        OR: [
          {
            phone: result.data.phone,
          },
          { password: result.data.password },
        ],

        NOT: { id: userId },
      },
    })

    if (isPhoneExisting) {
      return {
        errors: {
          _form: ['کاربر با این نام یا شماره موجود است!'],
        },
      }
    }

    if (
      typeof result.data.profileImage === 'object' &&
      result.data.profileImage instanceof File
    ) {
      const buffer = Buffer.from(await result.data?.profileImage?.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(
        convertedBuffer,
        result.data?.profileImage?.name
      )

      // console.log(res)
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profileImage: {
            disconnect: { id: isExisting.profileImage?.id },
          },
        },
      })
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profileImageId: res?.imageId,
        },
      })
    }
    if (
      typeof result.data.beforeImage === 'object' &&
      result.data.beforeImage instanceof File
    ) {
      const buffer = Buffer.from(await result.data?.beforeImage?.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(
        convertedBuffer,
        result.data?.beforeImage?.name
      )

      // console.log(res)
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          beforeImage: {
            disconnect: { id: isExisting.beforeImage?.id },
          },
        },
      })
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          beforeImageId: res?.imageId,
        },
      })
    }
    if (
      typeof result.data.afterImage === 'object' &&
      result.data.afterImage instanceof File
    ) {
      const buffer = Buffer.from(await result.data?.afterImage?.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(
        convertedBuffer,
        result.data?.afterImage?.name
      )

      // console.log(res)
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          afterImage: {
            disconnect: { id: isExisting.afterImage?.id },
          },
        },
      })
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          afterImageId: res?.imageId,
        },
      })
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: result.data.name,
        phone: result.data.phone!,
        password: result.data.password,
        bio: result?.data.bio,
        gender: gender,
      },
    })
    // imageId: res?.imageId,
    // console.log(billboard)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }

  revalidatePath(path)
  redirect(`/dashboard/users`)
}

//////////////////////

interface DeleteUserFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function deleteUser(
  path: string,
  userId: string,
  formState: DeleteUserFormState,
  formData: FormData
): Promise<DeleteUserFormState> {
  // console.log({ path, storeId, categoryId })
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  // console.log(result)
  if (!userId) {
    return {
      errors: {
        _form: ['کاربر موجود نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (User & {
          profileImage: {
            id: string
            key: string
          } | null
        } & {
          beforeImage: {
            id: string
            key: string
          } | null
        } & {
          afterImage: {
            id: string
            key: string
          } | null
        })
      | null = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        profileImage: { select: { id: true, key: true } },
        beforeImage: { select: { id: true, key: true } },
        afterImage: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کاربر حذف شده است!'],
        },
      }
    }

    if (isExisting.profileImage) {
      await deleteFileFromS3(isExisting.profileImage.key)
    }
    if (isExisting.afterImage) {
      await deleteFileFromS3(isExisting.afterImage.key)
    }
    if (isExisting.beforeImage) {
      await deleteFileFromS3(isExisting.beforeImage.key)
    }
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }

  revalidatePath(path)
  redirect(`/dashboard/users`)
}
