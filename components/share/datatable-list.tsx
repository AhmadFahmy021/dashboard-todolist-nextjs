"use client"

import React, { useEffect, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, EyeIcon, MoreHorizontal, MoreVertical, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Cookies from "js-cookie"
import { toast } from "sonner"
import Link from "next/link"

// const data: Payment[] = [
//   {
//     id: "m5gr84i9",
//     amount: 316,
//     status: "success",
//     email: "ken99@example.com",
//   },
//   {
//     id: "3u1reuv4",
//     amount: 242,
//     status: "success",
//     email: "Abe45@example.com",
//   },
//   {
//     id: "derv1ws0",
//     amount: 837,
//     status: "processing",
//     email: "Monserrat44@example.com",
//   },
//   {
//     id: "5kma53ae",
//     amount: 874,
//     status: "success",
//     email: "Silas22@example.com",
//   },
//   {
//     id: "bhqecj4p",
//     amount: 721,
//     status: "failed",
//     email: "carmella@example.com",
//   },
//   {
//     id: "bhqecj4p",
//     amount: 721,
//     status: "failed",
//     email: "carmella@example.com",
//   },
//   {
//     id: "bhqecj4p",
//     amount: 721,
//     status: "failed",
//     email: "carmella@example.com",
//   },
// ]

// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

interface List {
    id: string,
    todo_id: string,
    title: string,
    description: string,
    status: string,
}


let handleDelete:(id: string) => Promise<void>;


export const columns: ColumnDef<List>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Title
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-bold">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("description") || "Description Not Availabel"}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => <div className="uppercase">{row.getValue("status")}</div>,
  },
  {
    id: "action",
    accessorKey: "action",
    header: () => <div>Action</div>,
    cell: ({ row }) => {
        const id = row.original.id; 
        
        return (
          <div className="">
              <Link href={`/dashboard/shared/todo/list/edit/${id}`} className="gap-2">
                  <Button size="sm" className="mr-2">
                      <PencilIcon/>
                      Edit
                  </Button>
              </Link>
              <Button size="sm" onClick={() => handleDelete(id)} className="bg-red-500 hover:bg-red-600">
                  <Trash2Icon/>
                  Delete
              </Button>
          </div>
        )
    },
  },

]

export function DataTableShareList({id}:{id:string}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5, // default awal
});
    const [data, setData] = useState<List[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const token = Cookies.get("token")?.replace(/^"|"$/g, '')

    handleDelete = async (id: string) => {
        toast("Hapus Todo", {
            description: "Apakah anda yakin ingin menghapus todo ini?",
            action: {
                label: "Ya",
                onClick: async () => {
                try {
                    const res = await fetch(`${apiUrl}/lists/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    });

                    if (!res.ok) throw new Error("Gagal menghapus list");

                    // update state tanpa fetch ulang
                    setData((prev) => prev.filter((item) => item.id !== id));

                    toast.success("List berhasil dihapus", {
                        description: "Data sudah dihapus dari server.",
                        position: "top-right",
                    });
                } catch (err: any) {
                    toast.error("Gagal menghapus", {
                        description: err.message || "Terjadi kesalahan",
                        position: "top-right"
                    });
                }
                },
            },
            duration: 2000,
            position: "top-right"
            
        });
    };
    useEffect(()=>{
        const fetcData = async () => {
            try {
                const query = new URLSearchParams({
                    id: id
                })
                const res = await fetch(`${apiUrl}/lists?${query}`, {
                    method: "GET",
                    headers:{
                        "Content-Type":"Application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    credentials: "include",
                })
                if(!res.ok) throw new Error("Failed fetch data");
                
                const json = await res.json();
                setData(json.data ?? []);
            } catch (error) {
                console.error(error);
                
            }
        }
        fetcData()
    }, [apiUrl])
    
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
           <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
            className="border rounded-md p-1 text-sm dark:bg-black"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
                table.setPageSize(Number(e.target.value))
            }}
            >
              {[5, 10, 25].map((pageSize, idx) => (
                <option key={`size-${idx}-${pageSize}`} value={pageSize}>
                  {pageSize}
                </option>
              ))}

              <option key="size-all" value={data.length}>
                All
              </option>
            </select>
        </div>
        {/* <div className="flex items-center space-x-2 ">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <select
            className="border rounded-md p-1 text-sm dark:bg-black"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
                table.setPageSize(Number(e.target.value))
            }}
            >
            {[5, 10, 25, data.length].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                {pageSize === data.length ? "All" : pageSize}
                </option>
            ))}
            </select>
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
