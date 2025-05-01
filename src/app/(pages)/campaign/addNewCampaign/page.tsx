"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { Calendar as CalendarIcon, DollarSign, Upload, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
    const router = useRouter();

    const [campaign, setCampaign] = useState({
        title: "",
        brand: "",
        budget: "",
        description: "",
        startDate: undefined as Date | undefined,
        endDate: undefined as Date | undefined,
        image: null as string | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCampaign({
            ...campaign,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setCampaign({
                        ...campaign,
                        image: e.target.result as string,
                    });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const getDuration = () => {
        if (!campaign.startDate || !campaign.endDate) return "Set dates to see duration";

        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return `${diffDays} days`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to campaigns</span>
                </Button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Campaign Details</CardTitle>
                            <CardDescription>Fill in the information below to create your campaign</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Campaign Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                                            {campaign.image ? (
                                                <div className="relative w-full h-full overflow-hidden rounded-lg">
                                                    <Image
                                                        src={campaign.image}
                                                        alt="Campaign preview"
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        className="transition-opacity"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-medium">Change Image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-medium">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                                </div>
                                            )}
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Campaign Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Summer Collection 2025"
                                            value={campaign.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Brand Name</Label>
                                        <Input
                                            id="brand"
                                            name="brand"
                                            placeholder="Your Brand"
                                            value={campaign.brand}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Campaign Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your campaign..."
                                        rows={3}
                                        value={campaign.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="budget"
                                            name="budget"
                                            placeholder="1,000.00"
                                            className="pl-9"
                                            value={campaign.budget}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !campaign.startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {campaign.startDate ? format(campaign.startDate, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={campaign.startDate}
                                                    onSelect={(date) => setCampaign({ ...campaign, startDate: date })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !campaign.endDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {campaign.endDate ? format(campaign.endDate, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={campaign.endDate}
                                                    onSelect={(date) => setCampaign({ ...campaign, endDate: date })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-[#034752] hover:bg-[#034752]/90 text-[#f9eef8] px-6"
                                    >
                                        Create Campaign
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="shadow-sm sticky top-4">
                        <CardHeader>
                            <CardTitle>Campaign Preview</CardTitle>
                            <CardDescription>See how your campaign will look</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                                    {campaign.image ? (
                                        <Image
                                            src={campaign.image}
                                            alt="Campaign"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-gray-400 dark:text-gray-500">Upload campaign image</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-medium text-lg">
                                                {campaign.title || "Campaign Title"}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {campaign.brand || "Brand Name"}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-0">
                                            Draft
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px]">
                                        {campaign.description || "Campaign description will appear here..."}
                                    </p>

                                    <Separator className="my-4" />

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Budget:</span>
                                            <span className="text-sm font-medium">
                                                {campaign.budget ? `$${campaign.budget}` : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Start Date:</span>
                                            <span className="text-sm font-medium">
                                                {campaign.startDate ? format(campaign.startDate, "MMM d, yyyy") : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">End Date:</span>
                                            <span className="text-sm font-medium">
                                                {campaign.endDate ? format(campaign.endDate, "MMM d, yyyy") : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Duration:</span>
                                            <span className="text-sm font-medium">{getDuration()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 rounded-full w-0"></div>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-xs text-gray-500">Not started</span>
                                            <span className="text-xs text-gray-500">0%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}