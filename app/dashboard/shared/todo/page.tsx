import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CardData from "@/components/todolist/card-data"
import CardDataShare from "@/components/share/card-data"
import Link from "next/link"

export default async function Page() {
    return (
        <SidebarProvider
        style={
            {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
        >
        <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader title="Todo List" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2 m-5">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                        Todo List
                        </h1>
                        <p className="text-muted-foreground text-base">
                        Kelola daftar pekerjaan kamu di satu tempat
                        </p>
                    </div>
                        <Link href="/dashboard/todo/create" className="flex items-center gap-1">
                            <Button size="sm" className="gap-2 ">
                                    <Plus className="h-4 w-4" /> Tambah Todo
                            </Button>
                        </Link>
                    </div>
                    <CardDataShare />
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    )
}
