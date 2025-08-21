"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ListTodoIcon } from "lucide-react"
import Link from "next/link"

const data = {
  user: {
    name: "Ahmad",
    email: "ahmadfahym219@example.com",
    // avatar: "/avatars/shadcn.jpg",
    avatar: "data:image/jpeg;base64,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",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Todo List",
      url: "/dashboard/todo",
      icon: IconListDetails,
    },
    {
      title: "Todo List Share With Me",
      url: "/dashboard/shared/todo",
      icon: IconUsersGroup,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <ListTodoIcon className="!size-5" />
                <span className="text-base font-semibold">TODO LIST</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
