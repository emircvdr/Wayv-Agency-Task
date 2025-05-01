import { z } from "zod";
import { publicProcedure, router } from "../server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schemas/campaigns";

const campaignSchema = z.object({
  campaign_title: z.string().min(1, { message: "Title is required" }),
  brand_name: z.string().min(1, { message: "Brand name is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  budget: z.number().positive({ message: "Budget must be a positive number" }),
  campaign_description: z.string().nullable().optional(),
  image_id: z.string().nullable().optional(),
});

const formatDate = (date: Date): string => {
  if (!date) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const campaignRouter = router({
  // Get all campaigns
  getAll: publicProcedure.query(async () => {
    const campaignsData = await db
      .select()
      .from(campaigns)
      .orderBy(campaigns.created_at);

    return campaignsData.map((campaign) => ({
      ...campaign,
      start_date: campaign.start_date
        ? formatDate(campaign.start_date as Date)
        : "-",
      end_date: campaign.end_date ? formatDate(campaign.end_date as Date) : "-",
      budget: `$${Number(campaign.budget).toLocaleString()}`,
    }));
  }),

  // Get a single campaign by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, input.id));
      return result[0];
    }),

  // Create a new campaign
  create: publicProcedure.input(campaignSchema).mutation(async ({ input }) => {
    const result = await db
      .insert(campaigns)
      .values({
        ...input,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
        budget: input.budget.toString(),
      })
      .returning();
    return result[0];
  }),

  // Update an existing campaign
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: campaignSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData = { ...input.data, updated_at: new Date() };

      if (updateData.start_date) {
        updateData.start_date = new Date(updateData.start_date) as any;
      }
      if (updateData.end_date) {
        updateData.end_date = new Date(updateData.end_date) as any;
      }

      if (updateData.budget) {
        updateData.budget = updateData.budget;
      }

      const result = await db
        .update(campaigns)
        .set(updateData as any)
        .where(eq(campaigns.id, input.id))
        .returning();
      return result[0];
    }),

  // Delete a campaign
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(campaigns).where(eq(campaigns.id, input.id));
      return { success: true };
    }),
});
