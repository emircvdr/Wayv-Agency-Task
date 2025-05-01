import { Inbox, ChevronUp, LogOut, Home } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "../ui/separator"
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu } from "../ui/dropdown-menu"
import { Logout } from "@/app/api/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Menu items with more detailed structure
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,

    },
    {
        title: "Campaign",
        url: "/campaign",
        icon: Inbox,

    },
]

export function AppSidebar({ userData }: { userData: any }) {
    const handleLogout = async () => {
        await Logout();
        redirect("/login");
    }

    // Extract first letter of name for avatar fallback
    const getInitials = () => {
        if (userData?.user.user_metadata.firstName) {
            return userData.user.user_metadata.firstName.charAt(0);
        } else if (userData?.user.user_metadata.full_name) {
            return userData.user.user_metadata.full_name.charAt(0);
        }
        return "A";
    }

    // Get full name based on auth provider
    const getFullName = () => {
        if (userData?.user.user_metadata.firstName) {
            return userData?.user.user_metadata.firstName;
        } else {
            return `Admin`;
        }
    }

    return (
        <Sidebar collapsible="offcanvas" className="border-r border-gray-100  overflow-hidden">
            <SidebarHeader className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#034752] to-[#e2bfdf] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">W</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#034752] to-[#e2bfdf] bg-clip-text text-transparent">Wayv</h1>
                </div>
            </SidebarHeader>

            <Separator className="opacity-50" />

            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="mb-1">
                                    <SidebarMenuButton asChild
                                        className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors py-2 px-3">
                                        <Link href={item.url} className="flex items-center w-full">
                                            <item.icon className="h-4 w-4 text-gray-500" />
                                            <span className="ml-3 text-sm font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="flex-1"></div>

            <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 pb-4 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors py-2 px-3">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src={userData?.user.user_metadata.avatar_url} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#034752] to-[#e2bfdf] text-white">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 flex flex-col items-start">
                                        <span className="text-sm font-medium truncate max-w-[120px]">
                                            {getFullName()}
                                        </span>
                                        <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
                                            {userData?.user.email}
                                        </span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4 text-gray-400" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[250px] p-2"
                                align="end"
                            >
                                <div className="flex flex-row items-center justify-start gap-3 p-3 mb-1 bg-gray-50 dark:bg-gray-900 rounded-md">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={userData?.user.user_metadata.avatar_url} />
                                        <AvatarFallback className="bg-gradient-to-br from-[#034752] to-[#e2bfdf] text-white">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start justify-start">
                                        <span className="text-sm font-medium">
                                            {getFullName()}
                                        </span>
                                        <span className="text-xs text-gray-500">{userData?.user.email}</span>
                                    </div>
                                </div>

                                <Separator className="my-2" />

                                <DropdownMenuItem
                                    className="rounded-md flex items-center gap-2 py-2 px-3 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
