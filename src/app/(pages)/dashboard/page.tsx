"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, DollarSign, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { trpc } from "@/lib/trpc/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


export default function DashboardPage() {
    const router = useRouter();
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });
    const [budgetRange, setBudgetRange] = useState<{
        min: string;
        max: string;
    }>({
        min: "",
        max: "",
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);

    const { data: campaigns, isLoading } = trpc.campaigns.getAll.useQuery();
    const [images, setImages] = useState<any[]>([]);
    const supabase = createClient();

    async function getImage() {
        const { data, error } = await supabase.storage.from("campaign-images").list(
            "4ea27eae-961f-42a1-b799-3f269cb4f102" //userId test (it going to be changed to the user id)
            +
            "/"

        );
        if (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
        return data;
    }

    useEffect(() => {
        getImage().then((images) => {
            setImages(images);
        });
    }, []);

    // Filter campaigns whenever filters change
    useEffect(() => {
        if (!campaigns) return;

        let filtered = [...campaigns];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(campaign =>
                campaign.campaign_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (campaign.campaign_description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
            );
        }

        // Apply budget filter
        if (budgetRange.min) {
            filtered = filtered.filter(campaign => {
                const budget = parseFloat(campaign.budget.replace(/[^0-9.-]+/g, ""));
                return budget >= parseFloat(budgetRange.min);
            });
        }

        if (budgetRange.max) {
            filtered = filtered.filter(campaign => {
                const budget = parseFloat(campaign.budget.replace(/[^0-9.-]+/g, ""));
                return budget <= parseFloat(budgetRange.max);
            });
        }

        // Apply date filter
        if (dateRange.from && dateRange.to) {
            filtered = filtered.filter(campaign => {
                const startDate = new Date(campaign.start_date);
                const endDate = new Date(campaign.end_date);

                // Check if campaign date range overlaps with filter date range
                return (
                    (startDate <= dateRange.to! && endDate >= dateRange.from!)
                );
            });
        }

        setFilteredCampaigns(filtered);
    }, [campaigns, searchQuery, budgetRange, dateRange]);

    const addFilter = (filter: string) => {
        if (!activeFilters.includes(filter)) {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const removeFilter = (filter: string) => {
        setActiveFilters(activeFilters.filter(f => f !== filter));

        // Remove the specific filter
        if (filter.includes('$')) {
            // It's a budget filter
            setBudgetRange({ min: "", max: "" });
        } else if (filter.includes('-')) {
            // It's a date filter
            setDateRange({ from: undefined, to: undefined });
        } else {
            // It might be a search query
            setSearchQuery("");
        }
    };

    const handleCampaignClick = (id: string) => {
        router.push(`/campaign/${id}`);
    };

    const handleApplyBudgetFilter = () => {
        if (budgetRange.min || budgetRange.max) {
            const filterText = `$${budgetRange.min || '0'} - $${budgetRange.max || 'Max'}`;
            addFilter(filterText);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Add/remove search filter badge
        if (query) {
            const existingSearchFilter = activeFilters.find(f => !f.includes('$') && !f.includes('/'));
            if (existingSearchFilter) {
                setActiveFilters([
                    ...activeFilters.filter(f => f !== existingSearchFilter),
                    `Search: ${query}`
                ]);
            } else {
                addFilter(`Search: ${query}`);
            }
        } else {
            setActiveFilters(activeFilters.filter(f => !f.startsWith('Search:')));
        }
    };

    return (
        <div className="w-full h-full space-y-6">
            <div className="bg-white  border rounded-xl shadow-sm p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search campaigns"
                                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Filter Campaigns</h4>
                                    <Separator />

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Budget Range</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Min"
                                                    className="pl-7"
                                                    value={budgetRange.min}
                                                    onChange={(e) => setBudgetRange({ ...budgetRange, min: e.target.value })}
                                                    type="number"
                                                />
                                            </div>
                                            <span className="text-gray-400">-</span>
                                            <div className="relative flex-1">
                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Max"
                                                    className="pl-7"
                                                    value={budgetRange.max}
                                                    onChange={(e) => setBudgetRange({ ...budgetRange, max: e.target.value })}
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date Range</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between text-left font-normal"
                                                >
                                                    {dateRange.from ? (
                                                        dateRange.to ? (
                                                            <>
                                                                {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                                                            </>
                                                        ) : (
                                                            dateRange.from.toLocaleDateString()
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground">Select date range</span>
                                                    )}
                                                    <Calendar className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="center">
                                                <CalendarComponent
                                                    mode="range"
                                                    selected={{
                                                        from: dateRange.from,
                                                        to: dateRange.to,
                                                    }}
                                                    onSelect={(range) => {
                                                        setDateRange(range ? {
                                                            from: range.from,
                                                            to: range.to || undefined
                                                        } : {
                                                            from: undefined,
                                                            to: undefined
                                                        });
                                                        if (range?.from && range?.to) {
                                                            const fromDate = range.from.toLocaleDateString();
                                                            const toDate = range.to.toLocaleDateString();
                                                            addFilter(`${fromDate} - ${toDate}`);
                                                        }
                                                    }}
                                                    numberOfMonths={2}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="pt-1 flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setActiveFilters([]);
                                                setDateRange({ from: undefined, to: undefined });
                                                setBudgetRange({ min: "", max: "" });
                                                setSearchQuery("");
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button onClick={handleApplyBudgetFilter}>Apply</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            {activeFilters.map(filter => (
                                <Badge
                                    key={filter}
                                    variant="secondary"
                                    className="flex items-center gap-1 pl-2 pr-1 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                >
                                    {filter}
                                    <button
                                        className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => removeFilter(filter)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            <Button
                                variant="link"
                                className="text-xs h-auto p-0 text-gray-500"
                                onClick={() => {
                                    setActiveFilters([]);
                                    setDateRange({ from: undefined, to: undefined });
                                    setBudgetRange({ min: "", max: "" });
                                    setSearchQuery("");
                                }}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border rounded-xl bg-white dark:bg-gray-900 p-4 h-40 shadow-sm">
                            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3"></div>
                            <div className="w-5/6 h-2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
                            <div className="w-4/6 h-2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
                            <div className="flex justify-between items-center">
                                <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                                <div className="w-1/4 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : activeFilters.length > 0 && filteredCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-white dark:bg-gray-900 shadow-sm text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <Filter className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Matching Campaigns</h3>
                    <p className="text-gray-500 mb-6 max-w-md">No campaigns match your current filters. Try adjusting your filters to see more results.</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setActiveFilters([]);
                            setDateRange({ from: undefined, to: undefined });
                            setBudgetRange({ min: "", max: "" });
                            setSearchQuery("");
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(activeFilters.length > 0 ? filteredCampaigns : campaigns).map((campaign) => (
                        <div
                            key={campaign.id}
                            className="border rounded-xl bg-white dark:bg-gray-900 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleCampaignClick(campaign.id)}
                        >
                            <div className="relative w-full h-32 bg-gray-200 dark:bg-gray-800">
                                {campaign.image_id ? (
                                    <Image
                                        src={`https://hpyytbglpqsaxlnxgijh.supabase.co/storage/v1/object/public/campaign-images/4ea27eae-961f-42a1-b799-3f269cb4f102/${images.find((img) => img.id == campaign.image_id)?.name}`}
                                        alt={campaign.campaign_title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-gray-400 dark:text-gray-500">No image</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-base">{campaign.campaign_title}</h3>
                                        <p className="text-gray-500 text-sm">{campaign.brand_name}</p>
                                    </div>
                                    <Badge variant="outline" className="bg-green-100 text-green-700 border-0">
                                        Active
                                    </Badge>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Budget:</span>
                                        <span className="text-sm font-medium">{campaign.budget}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-500">Dates:</span>
                                        <span className="text-sm">{campaign.start_date} - {campaign.end_date}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-500">Campaign Description:</span>
                                        <span className="text-sm">{campaign.campaign_description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-white dark:bg-gray-900 shadow-sm text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <Calendar className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Campaigns Found</h3>
                    <p className="text-gray-500 mb-6 max-w-md">You haven&apos;t created any campaigns yet. Create your first campaign to get started.</p>
                    <Button
                        className="bg-[#034752] hover:bg-[#034752]/90 text-[#f9eef8]"
                        onClick={() => router.push("/campaign/addNewCampaign")}
                    >
                        Create Campaign
                    </Button>
                </div>
            )}
        </div>
    );
}