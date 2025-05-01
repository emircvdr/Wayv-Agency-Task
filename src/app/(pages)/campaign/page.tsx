"use client"
import { DataTable } from "@/components/_components/DataTable";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Search, Trash, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
    DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const campaignData = [
    {
        id: "1",
        campaign_title: "Summer Promotion 2025",
        budget: "$2,500",
        start_date: "May 15, 2025",
        end_date: "Jun 30, 2025",
    },
    {
        id: "2",
        campaign_title: "Product Launch - Mobile App",
        budget: "$5,000",
        start_date: "Jun 1, 2025",
        end_date: "Jul 15, 2025",
    },
    {
        id: "3",
        campaign_title: "Holiday Season Special",
        budget: "$3,200",
        start_date: "-",
        end_date: "-",
    },
    {
        id: "4",
        campaign_title: "Black Friday Sales",
        budget: "$1,800",
        start_date: "Apr 1, 2025",
        end_date: "Apr 30, 2025",
    },
];



export default function CampaignPage() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Filter data based on search and tab
    const filteredData = campaignData.filter(campaign => {
        const matchesSearch = campaign.campaign_title.toLowerCase().includes(searchValue.toLowerCase());
        return matchesSearch
    });

    const columns = [
        {
            header: "Campaign",
            accessorKey: "campaign_title",
            cell: ({ row }: { row: any }) => {
                const campaign = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{campaign.campaign_title}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">Budget: {campaign.budget}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{campaign.start_date !== "-" ? `${campaign.start_date} - ${campaign.end_date}` : "No dates set"}</span>
                        </div>
                    </div>
                );
            }
        },

        {
            header: "",
            id: "actions",
            cell: ({ row }: { row: any }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[180px]">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500">
                                <Trash className="h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    return (
        <div className="w-full h-full space-y-6">
            <div className="bg-white dark:bg-gray-950 border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search campaigns..."
                                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button className="bg-[#034752] hover:bg-[#034752]/90 text-[#f9eef8] gap-2" onClick={() => router.push("/campaign/addNewCampaign")}>
                                <Plus className="h-4 w-4" />
                                <span>New Campaign</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <DataTable columns={columns} data={filteredData} searchValue={searchValue} />


            </div>
        </div>
    );
}