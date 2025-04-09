// This file is used to disable the billing page during development and testing
// We're creating a mock implementation that doesn't require a database connection

import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your billing and subscription",
};

export default function BillingPage() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl">Billing</h1>
        <p className="text-lg text-muted-foreground">
          SVM-Pay is completely free to use. There are no subscription fees or additional charges beyond standard network transaction fees.
        </p>
        
        <div className="mt-8 grid gap-8">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Current Plan: Free</h2>
            <p className="mt-2 text-muted-foreground">
              You are currently on the free plan with access to all features.
            </p>
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Cross-network compatibility</li>
                <li>One-click integration</li>
                <li>Comprehensive documentation</li>
                <li>Developer SDK</li>
                <li>No additional fees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
