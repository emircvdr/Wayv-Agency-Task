import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation";
export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-[49px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <h1 className="text-base font-medium capitalize">
                    {pathname.split("/").pop()}
                </h1>
            </div>
        </header>
    )
}
