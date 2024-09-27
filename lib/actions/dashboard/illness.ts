'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createIllnessSchema } from '@/lib/schemas/dashboard'
import { Doctor, Illness, Specialization } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'
import sharp from 'sharp'
interface CreateIllnessFormState {
  // success?: string
  errors: {
    name?: string[]
    description?: string[]
    specializationId?: string[]
    doctorId?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function createIllness(
  formData: FormData,

  path: string
): Promise<CreateIllnessFormState> {
  const result = createIllnessSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    specializationId: formData.getAll('specializationId'),
    images: formData.getAll('images'),
    doctorId: formData.getAll('doctorId'),
  })

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log(result?.data)

  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  // console.log(result)

  let illness: Illness
  try {
    const isExisting = await prisma.illness.findFirst({
      where: {
        name: result.data.name,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['بیماری با این نام موجود است!'],
        },
      }
    }

    let imageIds: string[] = []
    for (let img of result.data?.images || []) {
      const buffer = Buffer.from(await img.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(convertedBuffer, img.name)

      if (res?.imageId && typeof res.imageId === 'string') {
        imageIds.push(res.imageId)
      }
    }

    illness = await prisma.illness.create({
      data: {
        name: result.data.name,
        description: result?.data.description,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },

        Specialization: {
          connect: result.data?.specializationId?.map((id: string) => ({
            id: id,
          })),
        },
        Doctor: {
          connect: result.data?.doctorId?.map((id: string) => ({
            id: id,
          })),
        },
      },
    })

    // console.log(res?.imageUrl)
    // console.log(illness)
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
  redirect(`/dashboard/illness`)
}
interface CreateIllnessFormState {
  // success?: string
  errors: {
    name?: string[]
    description?: string[]

    specializationId?: string[]
    doctorId?: string[]

    images?: string[]
    _form?: string[]
  }
}
export async function editIllness(
  formData: FormData,
  illnessId: string,
  path: string
): Promise<CreateIllnessFormState> {
  const result = createIllnessSchema.safeParse({
    name: formData.get('name'),

    description: formData.get('description'),
    images: formData.getAll('images'),

    specializationId: formData.getAll('specializationId'),
    doctorId: formData.getAll('doctorId'),
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
    let illness: Doctor
    const isExisting:
      | (Illness & {
          images: { id: string; key: string }[] | null
        } & { Specialization: Specialization[] } & { Doctor: Doctor[] })
      | null = await prisma.illness.findFirst({
      where: { id: illnessId },
      include: {
        images: { select: { id: true, key: true } },
        Specialization: true,
        Doctor: true,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['بیماری حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.illness.findFirst({
      where: {
        name: result.data.name,

        NOT: { id: illnessId },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['دکتر با این نام موجود است!'],
        },
      }
    }

    await prisma.illness.update({
      where: {
        id: illnessId,
      },
      data: {
        Specialization: {
          disconnect: isExisting.Specialization?.map((specialization) => ({
            id: specialization.id,
          })),
        },

        Doctor: {
          disconnect: isExisting.Doctor?.map((doctor) => ({
            id: doctor.id,
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
      await prisma.illness.update({
        where: {
          id: illnessId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      await prisma.illness.update({
        where: {
          id: illnessId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,

          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
          Specialization: {
            connect: result.data.specializationId?.map((id) => ({
              id: id,
            })),
          },
          Doctor: {
            connect: result.data.specializationId?.map((id) => ({
              id: id,
            })),
          },
        },
      })
    } else {
      await prisma.illness.update({
        where: {
          id: illnessId,
        },
        data: {
          name: result.data.name,
          description: result.data?.description,

          Specialization: {
            connect: result.data.specializationId?.map((id) => ({
              id: id,
            })),
          },
          Doctor: {
            connect: result.data.doctorId?.map((id) => ({
              id: id,
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
  redirect(`/dashboard/illness`)
}

//////////////////////

interface DeleteIllnessFormState {
  errors: {
    _form?: string[]
  }
}

export async function deleteIllness(
  path: string,
  illnessId: string,
  formState: DeleteIllnessFormState,
  formData: FormData
): Promise<DeleteIllnessFormState> {
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
  if (!illnessId) {
    return {
      errors: {
        _form: ['بیماری موجود نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Illness & { images: { id: string; key: string }[] | null })
      | null = await prisma.illness.findFirst({
      where: { id: illnessId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['تخصص حذف شده است!'],
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
    await prisma.illness.delete({
      where: {
        id: illnessId,
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
  redirect(`/dashboard/illness`)
}
