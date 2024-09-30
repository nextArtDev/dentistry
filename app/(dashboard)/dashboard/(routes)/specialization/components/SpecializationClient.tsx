'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { SpecializationColumn, columns } from './columns'
import { Heading } from '@/components/dashboard/Heading'
import { DataTable } from '@/components/dashboard/DataTable'
import Link from 'next/link'
import { cn } from '@/lib/utils'
// import { ApiList } from '@/components/dashboard/ApiList'

interface SpecializationClientProps {
  data: SpecializationColumn[]
}

export const SpecializationClient: React.FC<SpecializationClientProps> = ({
  data,
}) => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`تخصص (${data.length})`}
          description="اطلاعات تخصصها را مدیریت کنید."
        />
        <Link
          href={`/dashboard/specialization/new`}
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
