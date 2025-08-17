"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface DataCount{
  countTodo: number,
  countList: number,
}

export function SectionCards() {
  const [data, setData] = useState<DataCount | null>(null);
  const [loading, setLoading] = useState(false)
  const urlAPI = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("token")?.replace(/^"|"$/g, '')
  useEffect(()=>{
    const fetchDataCount = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${urlAPI}/dashboard/datacount`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error("Failed fetch data ")
        const json = await res.json()
        setData(json ?? [])
        setLoading(false)
      } catch (error: any) {
        toast.error(`${error.message}`)
      } finally {
        setLoading(false)
      }
      
    }
    fetchDataCount()
  }, [urlAPI])
  console.log(data);
  
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Todo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "Loading..." : data?.countTodo}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total List</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "Loading..." : data?.countList}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
