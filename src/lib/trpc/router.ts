import { router } from "./server";

// Import all sub-routers
// import { campaignRouter } from "./routers/campaign";
// import { storageRouter } from "./routers/storage";

// Create the app router with all sub-routers
export const appRouter = router({
  // Add routers here
  //   campaign: campaignRouter,
  //   storage: storageRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
