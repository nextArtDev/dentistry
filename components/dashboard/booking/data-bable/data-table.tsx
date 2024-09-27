'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormControl } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { faIR } from 'date-fns-jalali/locale'
import { format } from 'date-fns-jalali'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [date, setDate] = React.useState<Date>()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border max-w-[96vw] mx-auto overflow-hidden">
      <div className="flex items-center gap-4 justify-evenly py-4 px-4 md:px-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              {date ? (
                // format(field.value, '')
                new Intl.DateTimeFormat('fa-IR').format(date)
              ) : (
                <span>انتخاب تاریخ</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={() => {
                table.getColumn('date')?.getFilterValue() ?? undefined
              }}
              selected={date}
              onDayClick={(d: any) => {
                table.getColumn('date')?.setFilterValue(format(d, 'yyyy/MM/dd'))
                setDate(d)
                // console.log(format(d, 'yyyy/MM/dd'))
              }}
              locale={faIR}
              // initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          placeholder="فیلتر با نام دکتر"
          value={
            (table.getColumn('doctorName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('doctorName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="فیلتر با نام بیمار"
          value={
            (table.getColumn('userName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('userName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Table className="w-full overflow-x-auto min-w-[500px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="scroll-auto">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="!text-right ">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="overflow-x-auto"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                بدون نتیجه
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
