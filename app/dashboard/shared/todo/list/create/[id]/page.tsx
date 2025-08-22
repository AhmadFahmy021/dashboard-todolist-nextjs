"use client"
import { AppSidebar } from "@/components/app-sidebar";
import FormCreateList from "@/components/list/form-create";
import FormCreateShareList from "@/components/share/form-create";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import React from "react";


export default function page() {
    const params = useParams();
    const id = params?.id 

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
                    <FormCreateShareList id={id}/>
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
