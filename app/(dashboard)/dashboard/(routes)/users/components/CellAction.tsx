'use client'

// import axios from 'axios'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { AlertModal } from '@/components/dashboard/AlertModal'
import { deleteDoctor } from '@/lib/actions/dashboard/doctor'
import { useFormState } from 'react-dom'
import { UserColumn } from './columns'

interface CellActionProps {
  data: UserColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const path = usePathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [deleteState, deleteAction] = useFormState(
    deleteDoctor.bind(null, path, data?.id as string),
    {
      errors: {},
    }
  )

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteAction}
        isPending={isPending}
      />
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">بازکردن منو</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/doctors/${data.id}`)}
          >
            <Edit className="ml-2 h-4 w-4" /> آپدیت
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="ml-2 h-4 w-4" /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
