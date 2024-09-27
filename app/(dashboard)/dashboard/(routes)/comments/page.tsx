import ReviewCard from '@/components/dashboard/ReviewCard'
import { prisma } from '@/lib/prisma'

const page = async () => {
  const reviews = await prisma.review.findMany({})
  //   console.log(reviews)

  return (
    <div>
      <h1 className="font-bold text-2xl mt-10 mb-7 border-b pb-5">
        {reviews?.length} نظر
      </h1>
      <div>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} isAdmin={true} />
        ))}
      </div>
    </div>
  )
}

export default page
