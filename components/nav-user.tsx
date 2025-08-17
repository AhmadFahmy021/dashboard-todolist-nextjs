"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  // const dataUser = Cookies.get("user") ? JSON.parse(Cookies.get("user") as string) : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get("token")?.replace(/^"|"$/g, '');
  const [dataUser, setDataUser] = useState<any>(null);

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      setDataUser(JSON.parse(cookieUser));
    }
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiUrl}/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Logout failed")

      // Hapus cookie setelah logout
      Cookies.remove("token")
      Cookies.remove("user")

      toast.success("Berhasil logout")
      setTimeout(() => {
        location.reload()
      }, 2500);
      location.reload()
    } catch (error: any) {
      toast.error("Gagal Logout")
      console.error(error.message);
    }
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{dataUser?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {dataUser?.email }
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={dataUser?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{dataUser?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {dataUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <IconLogout />
                  Log out
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
