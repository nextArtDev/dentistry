'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  date: string
  doctorName?: string
  time?: string
  userName?: string
  userPhone?: string
  //   status: 'pending' | 'processing' | 'success' | 'failed'
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    // header: 'تاریخ',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          تاریخ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'doctorName',
    // header: 'نام دکتر',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          نام دکتر
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'time',
    // header: 'ساعت',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ساعت
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'userName',
    header: 'نام بیمار',
  },
  {
    accessorKey: 'userPhone',
    header: 'شماره بیمار',
  },
]
