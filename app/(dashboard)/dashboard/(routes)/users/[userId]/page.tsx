import React from 'react'

import { prisma } from '@/lib/prisma'
import DoctorForm from './components/UserForm'
import UserForm from './components/UserForm'
import { notFound } from 'next/navigation'

const UserPage = async ({ params }: { params: { doctorId: string } }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params.doctorId,
    },
    //Because array of images is separate model we have to include it, because we want row of url's not array of id's
    include: {
      // images: true,
      // bookings: true,
      // specialization: true,
      // open_time: true,
    },
  })
  if (!user) return notFound()
  // const specialization = await prisma.specialization.findMany({
  //   // where: {
  //   //   doctors: { some: { id: params.doctorId } },
  //   // },
  // })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserForm initialData={user} />
      </div>
    </div>
  )
}

export default UserPage
