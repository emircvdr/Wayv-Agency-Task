import { campaignRouter } from "./routers/campaigns";
import { router } from "./server";

export const appRouter = router({
  campaigns: campaignRouter,
});

export type AppRouter = typeof appRouter;
