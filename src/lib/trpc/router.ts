import { campaignRouter } from "./routers/campaigns";
import { router } from "./server";
// import { storageRouter } from "./routers/storage";

// Create the app router with all sub-routers
export const appRouter = router({
  // Add routers here
  campaigns: campaignRouter,
  //   storage: storageRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
