"use client";
import React, { useEffect, useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import { set } from "zod";
import { SkeletonCard } from "../ui/skeleton-card";
// import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EyeIcon, MoreVertical, PencilIcon, Trash2Icon, TrashIcon, UserRound } from "lucide-react";
import { IconUsersGroup } from "@tabler/icons-react";

interface Todo {
    id: string,
    todo: {
        id: string,
        title: string,
        description: string
    },
    // description: string,
}

export default function CardDataShare() {
    const [data, setData] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token")?.replace(/^"|"$/g, '');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/collabolator`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                 console.log("status:", res.status);
                if (!res.ok) throw new Error("Failed to fetch data");

                const json = await res.json();
                setData(json.data ?? []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([])
            } finally{
                setLoading(false);
            }
            
        }
        fetchData();
    }, [token, apiUrl]);
    

    const handleDelete = async (id: string) => {
        toast("Hapus Todo", {
            description: "Apakah anda yakin ingin menghapus todo ini?",
            action: {
                label: "Ya",
                onClick: async () => {
                try {
                    const res = await fetch(`${apiUrl}/todo/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    });

                    if (!res.ok) throw new Error("Gagal menghapus todo");

                    // update state tanpa fetch ulang
                    setData((prev) => prev.filter((item) => item.id !== id));

                    toast.success("Todo berhasil dihapus", {
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

    
    
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            
            {loading && <SkeletonCard/>}
            {data.map((item) => (
                <Card key={item.id} className="shadow-lg hover:shadow-xl transition-all border-0 shadow-gray-900">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {item.todo.title ?? "Untitled Task"}
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            {item.todo.description ?? "No description available."}
                        </CardDescription>
                        <CardAction>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <MoreVertical/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                                        <a href={`/dashboard/shared/todo/list/${item.todo.id}`}>
                                            <DropdownMenuItem>
                                                <EyeIcon className="text-green-500"/>
                                                Show List
                                            </DropdownMenuItem>
                                        </a>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardAction>
                    </CardHeader>
                </Card>
            ))}
        </div>  
    );
}