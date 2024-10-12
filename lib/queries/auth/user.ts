'use server'

import { prisma } from '@/lib/prisma'

export const getUserByPhoneNumber = async (phone: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { phone } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: string | undefined) => {
  try {
    if (!id) return null
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profileImage: { select: { url: true } } },
    })

    return user
  } catch {
    return null
  }
}

interface GetUserTimelinesProps {
  id: string
  page?: number
  limit?: number
}
export const getUserTimelines = async ({
  id,
  page = 1,
  limit = 3,
}: GetUserTimelinesProps) => {
  const skip = (page - 1) * limit
  try {
    if (!id) return null
    const timeline = await prisma.timeLine.findMany({
      where: { userId: id },
      include: { images: { select: { url: true } } },
      take: limit,
      skip,
      orderBy: {
        created_at: 'desc',
      },
    })

    return timeline
  } catch {
    return null
  }
}
