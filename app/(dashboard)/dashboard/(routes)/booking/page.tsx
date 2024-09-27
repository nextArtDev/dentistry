import React from 'react'
import { prisma } from '@/lib/prisma'

import { format } from 'date-fns-jalali'

import AvailabilityTable from '@/components/dashboard/booking/AvailabilityTable'
import DisableSpecialDay from '@/components/dashboard/booking/DisableSpecialDay'
import { DataTable } from '@/components/dashboard/booking/data-bable/data-table'
import { columns } from '@/components/dashboard/booking/data-bable/columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getAllBookedDays,
  getAllCancelledBookedDays,
} from '@/lib/queries/booking'

type Props = {}

async function page({}: Props) {
  const doctors = await prisma.availability.findMany({
    include: {
      times: true,
    },
  })

  const bookedDays = await getAllBookedDays()
  const cancelledBookedDays = await getAllCancelledBookedDays()

  const formattedBookedDays = bookedDays?.map((item) => ({
    date: item.day,

    time: item.timeSlot?.slot,
    userName: item.user?.name,
    userPhone: item.user?.phone,
    createdAt: format(item.created_at, 'dd MMMM yyyy'),
  }))
  const formattedCancelledBookedDays = cancelledBookedDays?.map((item) => ({
    date: item.day,

    time: item.timeSlot?.slot,
    userName: item.user?.name,
    userPhone: item.user?.phone,
    createdAt: format(item.created_at, 'dd MMMM yyyy'),
  }))

  return (
    <section className="min-h-screen pt-12 ">
      <Tabs
        dir="rtl"
        defaultValue="table"
        className="max-w-[96vw] mx-auto py-8 "
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">وضعیت نوبت‌ها</TabsTrigger>
          <TabsTrigger value="availability">تنظیم نوبتها</TabsTrigger>
          <TabsTrigger value="disableEspecialDay">
            غیرفعال کردن روزانه
          </TabsTrigger>
          <TabsTrigger value="disabledBooks">نوبتهای غیرفعال شده</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          {bookedDays?.length && formattedBookedDays?.length && (
            <DataTable columns={columns} data={formattedBookedDays} />
          )}
        </TabsContent>
        <TabsContent value="availability">
          <AvailabilityTable />
        </TabsContent>
        <TabsContent value="disableEspecialDay">
          <DisableSpecialDay />
        </TabsContent>
        <TabsContent value="disabledBooks">
          {cancelledBookedDays?.length &&
            formattedCancelledBookedDays?.length && (
              <DataTable
                columns={columns}
                data={formattedCancelledBookedDays}
              />
            )}
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default page
