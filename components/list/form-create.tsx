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

export default function FormCreateList({id}:{id: string}){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todoId, setTodoID] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get("token")?.replace(/^"|"$/g, '');
    const router = useRouter();

    useEffect(() => {
        if (id) setTodoID(id) // ✅ state di-set sekali pas id berubah
    }, [id])
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${apiURL}/lists`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                },
                body: JSON.stringify({todo_id: todoId,title: title, description: description})
            })
            if (!res.ok) throw new Error("Failed Create Todo");
            toast.success("Create Successfully",{
                description: "Todo berhasil dibuat.",
                position: "top-right",
                duration: 1200
            });
            setTitle("")
            setDescription("")
            setTimeout(()=>{
                router.push(`/dashboard/todo/list/${id}`)
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
                                placeholder="Type your title list"
                                required
                                autoFocus
                                value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">
                                Description
                            </Label>
                            <Textarea placeholder="Type your description list" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-10 md:grid-cols-5 sm gap-5">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading?"Loading...":"Save"}
                    </Button>
                    <Button type="button" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
                        <a href={`/dashboard/todo/list/${id}`}>
                            Cancel
                        </a>
                    </Button>
                </div>
        </form>
    )
}
