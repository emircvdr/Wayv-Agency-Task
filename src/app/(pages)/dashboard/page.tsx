"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, DollarSign, SlidersHorizontal, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function DashboardPage() {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    const addFilter = (filter: string) => {
        if (!activeFilters.includes(filter)) {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const removeFilter = (filter: string) => {
        setActiveFilters(activeFilters.filter(f => f !== filter));
    };

    return (
        <div className="w-full h-full space-y-6">
            <div className="bg-white  border rounded-xl shadow-sm p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search campaigns" className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800" />
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
                                                <Input placeholder="Min" className="pl-7" />
                                            </div>
                                            <span className="text-gray-400">-</span>
                                            <div className="relative flex-1">
                                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input placeholder="Max" className="pl-7" />
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
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button>Apply   </Button>
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
                                }}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </div>

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
        </div>
    );
}