'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createDoctorSchema,
  createSpecializationSchema,
  createUserSchema,
} from '@/lib/schemas/dashboard'
import { DateTag, Doctor, Specialization, User } from '@prisma/client'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'

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
    // price: formData.get('price'),
    password: formData.get('password'),
    bio: formData.get('bio'),
    gender: formData.getAll('gender'),
    profileImage: formData.getAll('profileImage'),
    beforeImage: formData.getAll('beforeImage'),
    afterImage: formData.getAll('afterImage'),
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

  let user: User
  try {
    const isExisting = await prisma.user.findFirst({
      where: {
        name: result.data.name,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['دکتر با این نام موجود است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log(billboard)

    let imageIds: string[] = []
    for (let img of result.data?.images || []) {
      const buffer = Buffer.from(await img.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(convertedBuffer, img.name)
      if (res?.imageId && typeof res.imageId === 'string') {
        imageIds.push(res.imageId)
      }
    }

    user = await prisma.user.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        // price: +result.data.price,
        website: result.data.website,
        description: result?.data.description,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        specialization: {
          connect: result.data?.specializationId?.map((id: string) => ({
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
  redirect(`/dashboard/doctors`)
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
    gender: formData.getAll('gender'),
    profileImage: formData.getAll('profileImage'),
    beforeImage: formData.getAll('beforeImage'),
    afterImage: formData.getAll('afterImage'),
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

interface DeleteDoctorFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function deleteDoctor(
  path: string,
  doctorId: string,
  formState: DeleteDoctorFormState,
  formData: FormData
): Promise<DeleteDoctorFormState> {
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
  if (!doctorId) {
    return {
      errors: {
        _form: ['دکتر موجود نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Doctor & {
          images:
            | {
                id: string
                key: string
              }[]
            | null
        })
      | null = await prisma.doctor.findFirst({
      where: { id: doctorId },
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
      for (let image of isExisting.images) {
        if (image.key) {
          await deleteFileFromS3(image.key)
        }
      }
    }
    await prisma.doctor.delete({
      where: {
        id: doctorId,
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
