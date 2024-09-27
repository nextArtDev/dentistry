'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createSpecializationSchema } from '@/lib/schemas/dashboard'
import { Specialization } from '@prisma/client'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
interface CreateSpecializationFormState {
  // success?: string
  errors: {
    name?: string[]
    description?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function createSpecialization(
  formData: FormData,

  path: string
): Promise<CreateSpecializationFormState> {
  const result = createSpecializationSchema.safeParse({
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

  let specialization: Specialization
  try {
    const isExisting = await prisma.specialization.findFirst({
      where: {
        name: result.data.name,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['تخصص با این نام موجود است!'],
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
    specialization = await prisma.specialization.create({
      data: {
        name: result.data.name,
        description: result?.data.description,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        imageId: imageIds.length > 0 ? imageIds[0] : '',
      },
    })
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
  redirect(`/dashboard/specialization`)
}
interface EditCategoryFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}
export async function editSpecialization(
  formData: FormData,
  specializationId: string,
  path: string
): Promise<EditCategoryFormState> {
  const result = createSpecializationSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    images: formData.getAll('images'),
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
    let specialization: Specialization
    const isExisting:
      | (Specialization & {
          images: { id: string; key: string }[] | null
        })
      | null = await prisma.specialization.findFirst({
      where: { id: specializationId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.specialization.findFirst({
      where: {
        name: result.data.name,

        NOT: { id: specializationId },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['تخصص با این نام موجود است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)
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
      await prisma.specialization.update({
        where: {
          id: specializationId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
          // billboard: {
          //   disconnect: { id: isExisting.billboard.id },
          // },
        },
      })
      specialization = await prisma.specialization.update({
        where: {
          id: specializationId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,
          //   billboardId: result.data.billboardId,
          images: {
            // connect: { id: res?.imageId },
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
        },
      })
    } else {
      await prisma.specialization.update({
        where: {
          id: specializationId,
        },
        data: {
          name: result.data.name,
          description: result.data.description,
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
  redirect(`/dashboard/specialization`)
}

//////////////////////

interface DeleteSpecializationFormState {
  errors: {
    name?: string[]
    description?: string[]

    images?: string[]
    _form?: string[]
  }
}

export async function deleteSpecialization(
  path: string,
  specializationId: string,
  formState: DeleteSpecializationFormState,
  formData: FormData
): Promise<DeleteSpecializationFormState> {
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
  if (!specializationId) {
    return {
      errors: {
        _form: ['تخصص موجود نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Specialization & { images: { id: string; key: string }[] | null })
      | null = await prisma.specialization.findFirst({
      where: { id: specializationId },
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
    await prisma.specialization.delete({
      where: {
        id: specializationId,
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
  redirect(`/dashboard/specialization`)
}
