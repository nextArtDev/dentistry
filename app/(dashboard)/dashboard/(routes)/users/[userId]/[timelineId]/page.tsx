import React from 'react'

import { prisma } from '@/lib/prisma'
import DoctorForm from './components/TimelineForm'
import UserForm from './components/TimelineForm'
import { notFound } from 'next/navigation'
import TimelineForm from './components/TimelineForm'

const UserPage = async ({
  params,
}: {
  params: { userId: string; timelineId: string }
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    //Because array of images is separate model we have to include it, because we want row of url's not array of id's
    include: {
      // afterImage: { select: { url: true } },
      // beforeImage: { select: { url: true } },
      // profileImage: { select: { url: true } },
      // images: true,
      // bookings: true,
      // specialization: true,
      // open_time: true,
    },
  })
  if (!user) return notFound()
  const timelines = await prisma.timeLine.findMany({
    where: {
      id: params.timelineId,
      userId: params.userId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TimelineForm initialData={timelines} />
      </div>
    </div>
  )
}

export default UserPage
