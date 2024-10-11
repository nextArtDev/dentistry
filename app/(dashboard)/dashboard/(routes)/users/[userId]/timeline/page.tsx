import { prisma } from '@/lib/prisma'
import { TimelineClient } from './components/TimelineClient'
import { TimelineColumn } from './components/columns'

const TimelinePage = async ({ params }: { params: { userId: string } }) => {
  const timeline = await prisma.timeLine.findMany({
    where: {
      userId: params.userId,
    },
    //we include them to access them like individual objects and for example we can show them in table
    include: {
      user: {
        select: {
          id: true,
        },
      },
      specialization: {
        select: {
          name: true,
        },
      },
    },
    // orderBy: {
    //   createdAt: 'desc',
    // },
  })
  //   console.log({ timeline })
  const formattedTimeline: TimelineColumn[] = timeline.map((item) => ({
    id: item.id,
    date: item.date,
    description: item.description,
    name:
      item.specialization.length > 1
        ? item.specialization.map((sp) => sp.name)[0] + '، ...'
        : item.specialization.map((sp) => sp.name)[0],

    // description: item?.description,
    // specialization: item.specialization.id,
    // images: item.images.url.map((ur) => ur),
    //Because its Decimal in prisma model, we have to convert it to number by "toNumber"
    // booking: item.bookings.booking_time,
    // reviews: {item.reviews.name ,item.reviews.text , item.reviews.rating },
    //   createdAt: format(item.created_at, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TimelineClient data={formattedTimeline} />
      </div>
    </div>
  )
}

export default TimelinePage
