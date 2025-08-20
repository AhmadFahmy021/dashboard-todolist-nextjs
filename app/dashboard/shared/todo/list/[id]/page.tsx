
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DataTableList } from "@/components/list/datatable-list";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import React from "react";
import { DataTableShareList } from "@/components/share/datatable-list";

interface TodoDetailPageProps  {
  params: { id: string };
}

export default function TodoDetailPage({ params }: TodoDetailPageProps ) {
    const { id } = params;
    
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
                    <a href={`/dashboard/shared/todo/list/create/${id}`} className="flex items-center gap-1">
                        <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Tambah List Todo
                        </Button>
                    </a>
                    </div>
                    <DataTableShareList id={id}/>
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
