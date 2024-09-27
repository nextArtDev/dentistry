'use client'
import { FC, useState } from 'react'
import { Review } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'

import { AlertModal } from './AlertModal'
import { toast } from 'sonner'

interface ReviewCardProps {
  review: Review
  isAdmin?: boolean
}

const ReviewCard: FC<ReviewCardProps> = ({ review, isAdmin }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      // await axios.delete(`/api/comments`, { data: review.id })
      router.refresh()
      toast.success('کامنت حذف شد.')
      // router.push(`/doctors`)
    } catch (error: any) {
      toast.error('مشکلی پیش آمده.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative border-b pb-7 mb-7">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isPending={loading}
      />
      <div className="flex">
        {/* <div className="w-1/6 flex flex-col items-center">
          <div className="rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center">
            <h2 className="text-white text-center text-2xl uppercase flex items-center justify-center ">
              <span className="flex items-center justify-center">
                {review.name }
              </span>
            </h2>
          </div>
          <p className="text-center py-2 opacity-60 font-semibold ">
            {review?.name}
          </p>
        </div> */}
        <div className="mr-10 w-5/6">
          <div className="flex items-center  ">
            {/* <div className="flex mr-5">*****</div> */}
            {/* <Stars rating={review?.rating} reviews={[]} /> */}
          </div>
          <div className="mt-5">
            <p className="text-lg font-light">{review?.comment}</p>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="z-10 absolute top-2 left-10">
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReviewCard
