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
import { trpc } from "@/lib/trpc/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function CampaignPage() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

    const campaignsQuery = trpc.campaigns.getAll.useQuery();
    const deleteCampaign = trpc.campaigns.delete.useMutation({
        onSuccess: () => {
            campaignsQuery.refetch();
            setDeleteDialogOpen(false);
        }
    });

    const campaigns = campaignsQuery.data;

    const filteredData = campaigns?.filter(campaign => {
        const matchesSearch = campaign.campaign_title.toLowerCase().includes(searchValue.toLowerCase());
        return matchesSearch
    });

    const handleEditCampaign = (id: string) => {
        router.push(`/campaign/${id}`);
    };

    const handleDeleteCampaign = async () => {
        if (campaignToDelete) {
            try {
                await deleteCampaign.mutateAsync({ id: campaignToDelete });
            } catch (error) {
                console.error("Error deleting campaign:", error);
            }
        }
    };

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
                const campaign = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[180px]">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleEditCampaign(campaign.id)}
                            >
                                <Pencil className="h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
                                onClick={() => {
                                    setCampaignToDelete(campaign.id);
                                    setDeleteDialogOpen(true);
                                }}
                            >
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

                <DataTable columns={columns} data={filteredData || []} searchValue={searchValue} />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Campaign</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this campaign? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCampaign}
                            disabled={deleteCampaign.isPending}
                        >
                            {deleteCampaign.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}