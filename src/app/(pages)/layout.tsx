"use client"

import { AppSidebar } from "@/components/_components/app-sidebar";
import { SiteHeader } from "@/components/_components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface MainLayoutProps {
    children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    const supabase = createClient();

    const { data: userData, error, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    });

    useEffect(() => {
        if (error) {
            redirect("/login");
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <SidebarProvider className="bg-white dark:bg-gray-950">
            <AppSidebar userData={userData} />
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error.message}
                </div>
            )}
            <SidebarInset className="border-b border-gray-100 dark:border-gray-800">
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </SidebarInset>


        </SidebarProvider>
    );
}

export default MainLayout;