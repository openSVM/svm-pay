import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
  getCustomer: protectedProcedure
    .query(async ({ ctx }) => {
      // Implementation without auth and stripe dependencies
      const customer = await ctx.db
        .selectFrom("Customer")
        .where("authUserId", "=", ctx.user.id)
        .selectAll()
        .executeTakeFirst();
      
      return customer;
    }),
  
  // Other customer related procedures without Stripe dependencies
});
