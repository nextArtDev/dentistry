'use client'

// import axios from 'axios'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
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
import { deleteSpecialization } from '@/lib/actions/dashboard/specialization'
import { useFormState } from 'react-dom'
import { TimelineColumn } from './columns'
import { deleteTimeline } from '@/lib/actions/dashboard/timeline'

interface CellActionProps {
  data: TimelineColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const path = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const onConfirm = async () => {
    // try {
    //   setLoading(true)
    //   await axios.delete(`/api/specializations/${data.id}`)
    //   toast({
    //     title: 'تخصص حذف شد.',
    //     variant: 'default',
    //   })
    //   router.refresh()
    // } catch (error) {
    //   toast({
    //     title: 'مشکلی پیش آمده.',
    //     variant: 'destructive',
    //   })
    // } finally {
    //   setLoading(false)
    //   setOpen(false)
    // }
  }
  const [deleteState, deleteAction] = useFormState(
    deleteTimeline.bind(null, path, data?.id as string),
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
          {/* <DropdownMenuItem onClick={() => onCopy(`${data.id}`)}>
            <Copy className="ml-2 h-4 w-4" /> کپی ID
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/dashboard/users/${params.userId}/timeline/${data.id}`
              )
            }
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
