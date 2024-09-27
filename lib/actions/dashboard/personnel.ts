'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createPersonnelSchema } from '@/lib/schemas/dashboard'
import { Personnel, Specialization } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'

interface CreatePersonnelFormState {
  // success?: string
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function createPersonnel(
  formData: FormData,
  path: string
): Promise<CreatePersonnelFormState> {
  const result = createPersonnelSchema.safeParse({
    name: formData.get('name'),

    description: formData.get('description'),
    images: formData.getAll('images'),
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

  let personnel: Personnel
  try {
    let imageIds: string[] = []
    for (let img of result.data?.images || []) {
      const buffer = Buffer.from(await img.arrayBuffer())
      const convertedBuffer = await sharp(buffer).webp({ effort: 6 }).toBuffer()
      const res = await uploadFileToS3(convertedBuffer, img.name)
      if (res?.imageId && typeof res.imageId === 'string') {
        imageIds.push(res.imageId)
      }
    }

    personnel = await prisma.personnel.create({
      data: {
        name: result.data.name,

        description: result.data.description,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
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
  redirect(`/dashboard/personnels`)
}
interface EditPersonnelFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}
export async function editPersonnel(
  formData: FormData,
  personnelId: string,
  path: string
): Promise<EditPersonnelFormState> {
  const result = createPersonnelSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),

    description: formData.get('description'),
    images: formData.getAll('images'),
  })

  if (!result.success) {
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
    let personnel: Personnel
    const isExisting:
      | (Personnel & {
          images: { id: string; key: string }[] | null
        })
      | null = await prisma.personnel.findFirst({
      where: { id: personnelId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['پرسنل حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.personnel.findFirst({
      where: {
        name: result.data.name,

        NOT: { id: personnelId },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['پرسنل با این نام موجود است!'],
        },
      }
    }

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
      await prisma.personnel.update({
        where: {
          id: personnelId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      personnel = await prisma.personnel.update({
        where: {
          id: personnelId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,

          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
        },
      })
    } else {
      personnel = await prisma.personnel.update({
        where: {
          id: personnelId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,
        },
      })
    }
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
  redirect(`/dashboard/personnels`)
}

//////////////////////

interface DeletePersonnelFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function deletePersonnel(
  path: string,
  PersonnelId: string,
  formState: DeletePersonnelFormState,
  formData: FormData
): Promise<DeletePersonnelFormState> {
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
  if (!PersonnelId) {
    return {
      errors: {
        _form: ['پرسنل موجود نیست!'],
      },
    }
  }

  try {
    // @ts-ignore
    const isExisting:
      | (Personnel & {
          images:
            | {
                id: string
                key: string
              }[]
            | null
        })
      | null = await prisma.personnel.findFirst({
      where: { id: PersonnelId },
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
    await prisma.personnel.delete({
      where: {
        id: PersonnelId,
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
  redirect(`/dashboard/personnels`)
}
