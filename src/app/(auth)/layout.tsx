"use client"

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const supabase = createClient();

    const { data: userData, isLoading } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                return null;
            }
            return data;
        }
    });

    useEffect(() => {
        // If we have a user, redirect to the dashboard
        if (userData?.user) {
            redirect("/");
        }
    }, [userData]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Only render login page if there's no user
    return <>{children}</>;
} 