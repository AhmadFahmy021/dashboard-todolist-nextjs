import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "../data.json"
import SiteCard from "@/components/todolist/site-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CardData from "@/components/todolist/card-data"
import Cookies from "js-cookie"

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
                        <a href="/dashboard/todo/create" className="flex items-center gap-1">
                            <Button size="sm" className="gap-2 ">
                                    <Plus className="h-4 w-4" /> Tambah Todo
                            </Button>
                        </a>
                    </div>
                    <CardData  />
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    )
}
