
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DataTableList } from "@/components/list/datatable-list";
import FormEditTodo from "@/components/todolist/form-edit";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
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
                    
                    </div>
                    <FormEditTodo id={id}/>
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
