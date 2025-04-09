import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const k8sRouter = createTRPCRouter({
  getCluster: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Implementation without auth dependency
      const cluster = await ctx.db
        .selectFrom("Cluster")
        .where("id", "=", input.id)
        .selectAll()
        .executeTakeFirst();
      
      return cluster;
    }),
  
  // Other k8s related procedures...
});
