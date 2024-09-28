import { prisma } from '@/lib/prisma'
import { UserColumn } from './components/columns'
import { UsersClient } from './components/UserClient'

const DoctorPage = async () => {
  const users = await prisma.user.findMany({
    where: {},
    //we include them to access them like individual objects and for example we can show them in table
    include: {
      // reviews: true,
      // bookings: true,
      profileImage: true,
    },
    // orderBy: {
    //   createdAt: 'desc',
    // },
  })

  const formattedUsers: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.name,
    // phone: item?.phone,
    // website: item?.website,
    // main_image: item?.main_image,
    // open_time: item?.open_time,
    // close_time: item?.close_time,
    phone: item?.phone,
    // specialization: item.specialization.id,
    // images: item.images.url.map((ur) => ur),
    //Because its Decimal in prisma model, we have to convert it to number by "toNumber"
    // price: +formatter.format(item.price),
    // booking: item.bookings.booking_time,
    // reviews: {item.reviews.name ,item.reviews.text , item.reviews.rating },
    // createdAt: format(item.created_at, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  )
}

export default DoctorPage
