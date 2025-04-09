// This is a modified version of the env.mjs file that makes certain variables optional for testing
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Make these variables optional with default empty strings for testing
    GITHUB_CLIENT_ID: z.string().default("dummy-github-id"),
    GITHUB_CLIENT_SECRET: z.string().default("dummy-github-secret"),
    STRIPE_API_KEY: z.string().default("dummy-stripe-key"),
    STRIPE_WEBHOOK_SECRET: z.string().default("dummy-webhook-secret"),
    STRIPE_PRO_MONTHLY_PLAN_ID: z.string().default("dummy-plan-id"),
    STRIPE_PRO_YEARLY_PLAN_ID: z.string().default("dummy-plan-id"),
    STRIPE_PREMIUM_MONTHLY_PLAN_ID: z.string().default("dummy-plan-id"),
    STRIPE_PREMIUM_YEARLY_PLAN_ID: z.string().default("dummy-plan-id"),
    
    // Required variables
    NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
    NEXTAUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/svmpay"),
    
    // Optional variables
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    VERCEL_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRO_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
    STRIPE_PRO_YEARLY_PLAN_ID: process.env.STRIPE_PRO_YEARLY_PLAN_ID,
    STRIPE_PREMIUM_MONTHLY_PLAN_ID: process.env.STRIPE_PREMIUM_MONTHLY_PLAN_ID,
    STRIPE_PREMIUM_YEARLY_PLAN_ID: process.env.STRIPE_PREMIUM_YEARLY_PLAN_ID,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    VERCEL_URL: process.env.VERCEL_URL,
  },
});
