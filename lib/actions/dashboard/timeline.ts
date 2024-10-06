'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createDoctorSchema,
  createServerTimelineSchema,
  createSpecializationSchema,
  createTimelineSchema,
  createUserSchema,
} from '@/lib/schemas/dashboard'
import { DateTag, Doctor, Specialization, TimeLine, User } from '@prisma/client'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'

interface CreateTimelineFormState {
  // success?: string
  errors: {
    date?: string[]
    description?: string[]
    images?: string[]
    specializationId?: string[]

    _form?: string[]
  }
}

export async function createTimeline(
  formData: FormData,
  path: string,
  userId: string
): Promise<CreateTimelineFormState> {
  const result = createServerTimelineSchema.safeParse({
    date: formData.get('date'),
    description: formData.get('description'),
    userId: formData.get('userId'),

    images: formData.getAll('images'),
    specializationId: formData.getAll('specializationId'),
  })
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  //   console.log('userId', userId)
  //   console.log('result?.data', result?.data)

  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  // console.log(result)

  let timeLine: TimeLine
  try {
    const isExisting = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کاربر حذف شده است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log('result.data', result.data)

    const imageIds: string[] = []
    for (const img of result.data?.images || []) {
      const buffer = Buffer.from(await img.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(convertedBuffer, img.name)
      if (res?.imageId && typeof res.imageId === 'string') {
        imageIds.push(res.imageId)
      }
    }

    timeLine = await prisma.timeLine.create({
      data: {
        date: result.data.date,
        description: result.data.description,

        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        userId,
        specialization: {
          connect: result.data?.specializationId?.map((id: string) => ({
            id: id,
          })),
        },
      },
    })
    // if (result.data.open_time) {
    //   const timeData = []
    //   for (const time of result.data.open_time) {
    //     const newTimeData = await prisma.dateTag.create({
    //       data: {
    //         time,
    //         doctorId: doctor.id,
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
interface EditTimelineFormState {
  errors: {
    date?: string[]
    description?: string[]
    images?: string[]
    specializationId?: string[]

    _form?: string[]
  }
}
export async function editTimeline(
  formData: FormData,
  timelineId: string,
  path: string,
  userId: string
): Promise<EditTimelineFormState> {
  const result = createTimelineSchema.safeParse({
    date: formData.get('date'),
    description: formData.get('description'),

    images: formData.getAll('images'),
    specializationId: formData.getAll('specializationId'),
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

  try {
    let doctor: Doctor
    const isExisting:
      | (Doctor & {
          images: { id: string; key: string }[] | null
        } & { specialization: Specialization[] } & { open_time: DateTag[] })
      | null = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        images: { select: { id: true, key: true } },
        specialization: true,
        open_time: true,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دکتر حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.user.findFirst({
      where: {
        name: result.data.name,

        NOT: { id: userId },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['دکتر با این نام موجود است!'],
        },
      }
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        specialization: {
          disconnect: isExisting.specialization?.map((specialization) => ({
            id: specialization.id,
          })),
        },
        open_time: {
          disconnect: isExisting.open_time?.map((open) => ({
            id: open.id,
          })),
        },
      },
    })
    if (
      typeof result.data.images[0] === 'object' &&
      result.data.images[0] instanceof File
    ) {
      let imageIds: string[] = []
      for (let img of result.data.images) {
        const buffer = Buffer.from(await img.arrayBuffer())
        const res = await uploadFileToS3(buffer, img.name)

        if (res?.imageId && typeof res.imageId === 'string') {
          imageIds.push(res.imageId)
        }
      }
      // console.log(res)
      await prisma.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      doctor = await prisma.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,

          phone: result.data.phone,
          // price: +result.data.price,
          website: result.data.website,

          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
          specialization: {
            connect: result.data.specializationId?.map((id) => ({
              id: id,
            })),
          },
        },
      })
      if (result.data.open_time) {
        const timeData = []
        for (const time of result.data.open_time) {
          const newTimeData = await prisma.dateTag.create({
            data: {
              time,
              doctorId: doctor.id,
            },
          })
          timeData.push(newTimeData.id)
        }
        await prisma.doctor.update({
          where: {
            id: doctor.id,
          },
          data: {
            open_time: {
              connect: timeData.map((id: string) => ({
                id,
              })),
            },
          },
        })
      }
    } else {
      doctor = await prisma.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,
          phone: result.data.phone,
          // price: +result.data.price,
          website: result.data.website,

          specialization: {
            connect: result.data.specializationId?.map((id) => ({
              id: id,
            })),
          },
        },
      })
    }
    if (result.data.open_time) {
      const timeData = []
      for (const time of result.data.open_time) {
        const newTimeData = await prisma.dateTag.create({
          data: {
            time,
            doctorId: doctor.id,
          },
        })
        timeData.push(newTimeData.id)
      }
      await prisma.doctor.update({
        where: {
          id: doctor.id,
        },
        data: {
          open_time: {
            connect: timeData.map((id: string) => ({
              id,
            })),
          },
        },
      })
    }
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
  redirect(`/dashboard/doctors`)
}

//////////////////////

interface DeleteTimelineFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function deleteDoctor(
  path: string,
  timelineId: string,
  formState: DeleteTimelineFormState,
  formData: FormData
): Promise<DeleteTimelineFormState> {
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
  if (!timelineId) {
    return {
      errors: {
        _form: ['دکتر موجود نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (TimeLine & {
          images:
            | {
                id: string
                key: string
              }[]
            | null
        })
      | null = await prisma.timeLine.findFirst({
      where: { id: timelineId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دکتر حذف شده است!'],
        },
      }
    }

    if (isExisting.images) {
      for (const image of isExisting.images) {
        if (image.key) {
          await deleteFileFromS3(image.key)
        }
      }
    }
    await prisma.timeLine.delete({
      where: {
        id: timelineId,
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
  redirect(`/dashboard/doctors`)
}
