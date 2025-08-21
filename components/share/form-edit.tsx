"use client"
import React, { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Toaster } from "../ui/sonner"
import Link from "next/link"

export default function FormEditShareList({id}:{id: string}){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [todoId, setTodoId] = useState("")
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get("token")?.replace(/^"|"$/g, '');
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiURL}/lists/${id}`, {
                    method:"GET",
                    credentials: "include",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                })
                if (!res.status) throw new Error("Failed Fetch Data");
                const json = await res.json();
                const data = json.data;
                setTitle(data.title)
                setDescription(data.description ?? "")
                setStatus(data.status ?? "")
                setTodoId(data.todo_id)
            } catch (error: any) {
                setError(error.message || "An error occurred while retrieving data.")
            }
        }
        fetchData()
    }, [id])
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${apiURL}/lists/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                },
                body: JSON.stringify({title, description, status})
            })
            if (!res.ok) throw new Error("Failed Update Todo");
            toast.success("Edit Successfully",{
                description: "Data berhasil telah berhasil di rubah",
                position: "top-right",
                duration: 1200,
            });
            setTitle("")
            setDescription("")
            setTimeout(()=>{
                router.push(`/dashboard/shared/todo/list/${todoId}`)
            }, 1500)
        } catch (error: any) {
            setError(error.message || "An error occurred during login.")
            setLoading(false)
        } finally{
            setLoading(false)
        }
    }

    return(
        <form onSubmit={handleSubmit}  className="grid gap-4">
                <div className="gap-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Pekerjaan 1"
                                required
                                autoFocus
                                value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[170px]">
                                    <SelectValue placeholder="Pilih status list"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not started">Not Started</SelectItem>
                                    <SelectItem value="proses">Proses</SelectItem>
                                    <SelectItem value="finished">Finished</SelectItem>
                                    <SelectItem value="hold">Hold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-3 mt-4">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Textarea placeholder="Type description todo" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </div>
                </div>
                <div className="grid lg:grid-cols-10 md:grid-cols-5 sm gap-5">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading?"Loading...":"Save"}
                    </Button>
                    <Link href={`/dashboard/todo/list/${todoId}`}>
                        <Button type="button" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
                                Cancel
                        </Button>
                    </Link>
                </div>
        </form>
    )
}
