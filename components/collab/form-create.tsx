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

export default function FormCreateCollab({id}:{id: string}){
    const [todoId, setTodoID] = useState("");
    const [userId, setUserId] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const token = Cookies.get("token")?.replace(/^"|"$/g, '');
    const router = useRouter();

    useEffect(() => {
        if (id) setTodoID(id);
        
        const query = new URLSearchParams({
            todo_id: id
        })
        const fetchData = async () =>{
            try {
                const res = await fetch(`${apiURL}/users?${query}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if(!res.ok) throw new Error("Failed Fetch Data");

                const json = await res.json();
                setData(json.data ?? null)
            } catch (error: any) {
                console.error(error.message || "An occured during fetch data");
            }
        }
        fetchData() // ✅ state di-set sekali pas id berubah
    }, [id])
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${apiURL}/collabolator`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                },
                body: JSON.stringify({todo_id: todoId,user_id: userId})
            })
            if (!res.ok) throw new Error("Failed Create Todo");
            toast.success("Create Successfully",{
                description: "Collabolator berhasil dibuat.",
                position: "top-right",
                duration: 1200
            });
            setTimeout(()=>{
                router.push(`/dashboard/todo/collab/${id}`)
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
                    <div className="grid gap-3">
                        <Label htmlFor="user">User</Label>
                        <Select value={userId} onValueChange={setUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Users"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data && data.length > 0 ?  data.map((item: any) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                    )) : <SelectItem value="null" disabled>Belum ada user yang terdaftar</SelectItem>
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid lg:grid-cols-10 md:grid-cols-5 sm gap-5">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading?"Loading...":"Save"}
                    </Button>
                    <Button type="button" className="w-full !bg-red-500 hover:!bg-red-600" disabled={loading}>
                        <a href={`/dashboard/shared/todo/collab/${id}`}>
                            Cancel
                        </a>
                    </Button>
                </div>
        </form>
    )
}
