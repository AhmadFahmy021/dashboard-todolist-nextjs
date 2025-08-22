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


interface List {
    id: string,
    user: {
        id: string,
        name: string,
        email: string
    },
}


let handleDelete:(id: string) => Promise<void>;


export const columns: ColumnDef<List>[] = [
  {
    accessorFn: (row) => row.user.name, // ganti accessorKey -> accessorFn
    id: "name", // kasih id = "name" biar bisa dipakai di filter
    header: ({ column }) => (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Name
        <ArrowUpDown />
        </Button>
    ),
    cell: ({ row }) => {
        const name = row.original.user.name
        return <div className="font-bold">{name}</div>
    },
  },
  {
    accessorFn: (row) => row.user.email,
    id: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
        const email = row.original.user.email;
        return <div>{email || "Email not available"}</div>
    },
  },
  {
    id: "action",
    accessorKey: "action",
    header: () => <div>Action</div>,
    cell: ({ row }) => {
        const id = row.original.id; 
        
        return (
          <div className="">
              <Button size="sm" onClick={() => handleDelete(id)} className="bg-red-500 hover:bg-red-600">
                  <Trash2Icon/>
                  Delete
              </Button>
          </div>
        )
    },
  },

]

export function DataTableCollab({id}:{id:string | any}) {
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
                    const res = await fetch(`${apiUrl}/collabolator/${id}`, {
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
                    todo_id: id
                })
                const res = await fetch(`${apiUrl}/collab/todo?${query}`, {
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
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
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
