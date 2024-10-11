'use client'

import { Plus } from 'lucide-react'
// import { useRouter } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { DataTable } from '@/components/dashboard/DataTable'
import { Heading } from '@/components/dashboard/Heading'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { TimelineColumn, columns } from './columns'
import { useParams } from 'next/navigation'
// import { ApiList } from '@/components/dashboard/ApiList'

interface TimelineClientProps {
  data: TimelineColumn[]
}

export const TimelineClient: React.FC<TimelineClientProps> = ({ data }) => {
  const params = useParams()
  // console.log('ppppp', params.userId)
  // const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`ویزیت (${data.length})`}
          description="اطلاعات ویزیتها را مدیریت کنید."
        />
        <Link
          href={`/dashboard/users/${params.userId}/timeline/new`}
          className={cn(buttonVariants())}
        >
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Separator />
      {/* <ApiList entityName="specializations" entityIdName="specializationId" /> */}
    </>
  )
}
