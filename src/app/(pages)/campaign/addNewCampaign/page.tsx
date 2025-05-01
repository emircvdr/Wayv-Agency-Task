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
import { trpc } from "@/lib/trpc/client";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";

export default function NewCampaignPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const createCampaign = trpc.campaigns.create.useMutation();
    const supabase = createClient();

    const [campaign, setCampaign] = useState({
        campaign_title: "",
        brand_name: "",
        budget: "",
        campaign_description: "",
        start_date: undefined as Date | undefined,
        end_date: undefined as Date | undefined,
        image: null as File | null,
        image_id: null as string | null,
    });
    const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let imageId = campaign.image_id;
            if (campaign.image && !campaign.image_id) {
                const fileName = `${uuidv4()}.jpg`;

                // Upload the image to Supabase
                const { data, error } = await supabase.storage.from("campaign-images")
                    .upload(
                        "4ea27eae-961f-42a1-b799-3f269cb4f102" //userId test (it going to be changed to the user id)
                        +
                        "/"
                        +
                        uuidv4(),
                        campaign.image,
                        {
                            contentType: "image/jpeg",
                            upsert: true,
                        }
                    );

                if (error) {
                    throw new Error(`Upload failed: ${error.message}`);
                }

                imageId = data.id;
            }
            await createCampaign.mutateAsync({
                campaign_title: campaign.campaign_title,
                brand_name: campaign.brand_name,
                budget: Number(campaign.budget),
                campaign_description: campaign.campaign_description,
                start_date: campaign.start_date?.toISOString() || "",
                end_date: campaign.end_date?.toISOString() || "",
                image_id: imageId,
            });
            router.push('/campaign');
        } catch (error) {
            setError("Failed to create campaign. Please try again.");
            console.error("Error creating campaign:", error);
        } finally {
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCampaign({
            ...campaign,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCampaign({
                ...campaign,
                image: file,
            });
        }
    };

    const getDuration = () => {
        if (!campaign.start_date || !campaign.end_date) return "Set dates to see duration";

        const start = new Date(campaign.start_date);
        const end = new Date(campaign.end_date);
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
                            <form className="space-y-4" onSubmit={handleCreateCampaign}>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Campaign Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                                            {campaign.image ? (
                                                <div className="relative w-full h-full overflow-hidden rounded-lg">
                                                    <Image
                                                        src={URL.createObjectURL(campaign.image)}
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
                                            id="campaign_title"
                                            name="campaign_title"
                                            placeholder="Summer Collection 2025"
                                            value={campaign.campaign_title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Brand Name</Label>
                                        <Input
                                            id="brand_name"
                                            name="brand_name"
                                            placeholder="Your Brand"
                                            value={campaign.brand_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Campaign Description</Label>
                                    <Textarea
                                        id="campaign_description"
                                        name="campaign_description"
                                        placeholder="Describe your campaign..."
                                        rows={3}
                                        value={campaign.campaign_description}
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
                                                        !campaign.start_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {campaign.start_date ? format(campaign.start_date, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={campaign.start_date}
                                                    onSelect={(date) => setCampaign({ ...campaign, start_date: date })}
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
                                                        !campaign.end_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {campaign.end_date ? format(campaign.end_date, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={campaign.end_date}
                                                    onSelect={(date) => setCampaign({ ...campaign, end_date: date })}
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
                                            src={URL.createObjectURL(campaign.image)}
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
                                                {campaign.campaign_title || "Campaign Title"}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {campaign.brand_name || "Brand Name"}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-0">
                                            Draft
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px]">
                                        {campaign.campaign_description || "Campaign description will appear here..."}
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
                                                {campaign.start_date ? format(campaign.start_date, "MMM d, yyyy") : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">End Date:</span>
                                            <span className="text-sm font-medium">
                                                {campaign.end_date ? format(campaign.end_date, "MMM d, yyyy") : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Duration:</span>
                                            <span className="text-sm font-medium">{getDuration()}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
}