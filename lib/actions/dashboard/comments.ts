'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createIllnessSchema } from '@/lib/schemas/dashboard'
import { Doctor, Illness, Review, Specialization } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteFileFromS3, uploadFileToS3 } from '../s3Upload'
import sharp from 'sharp'

interface DeleteCommentFormState {
  errors: {
    commentId?: string[]
    _form?: string[]
  }
}

export async function deleteComment(
  path: string,
  commentId: string,
  formState: DeleteCommentFormState,
  formData: FormData
): Promise<DeleteCommentFormState> {
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
  if (!commentId) {
    return {
      errors: {
        _form: ['کامنت موجود نیست!'],
      },
    }
  }

  try {
    const isExisting: Review | null = await prisma.review.findFirst({
      where: { id: commentId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کامنت حذف شده است!'],
        },
      }
    }

    await prisma.review.delete({
      where: {
        id: commentId,
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
  redirect(`/dashboard/comments`)
}
