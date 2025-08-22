"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormCreateCollab from "@/components/collab/form-create";
import Link from "next/link";
import { useParams } from "next/navigation";

export default async function page() {
    const params = useParams()
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Todo List
                            </h1>
                            <p className="text-muted-foreground text-base">
                                Kelola daftar pekerjaan kamu di satu tempat
                            </p>
                        </div>
                        <Link href="/dashboard/todo/collab" className="flex items-center gap-1">
                            <Button size="sm" className="gap-2 ">
                                    <Plus className="h-4 w-4" /> Tambah User Collab
                            </Button>
                        </Link>
                    </div>
                    <FormCreateCollab id={id}/>
                </div>
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
