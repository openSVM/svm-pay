import { createTRPCRouter } from "../trpc";
import { solanaRouter } from "./solana";

export const appRouter = createTRPCRouter({
  solana: solanaRouter,
});

export type AppRouter = typeof appRouter;
