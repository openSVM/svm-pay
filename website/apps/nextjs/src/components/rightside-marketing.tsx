import * as React from "react";
import { Card } from "@saasfly/ui/card";

export function RightsideMarketing() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M19.07 4.93a10 10 0 0 0 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
            <path d="M10.59 13.41a2 2 0 1 1 2.83-2.83" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Cross-Network Compatibility</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks with a single integration.
          </p>
        </div>
      </Card>
      <Card className="flex flex-col gap-4 p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 13v-1h8v1" />
            <path d="M12 16V8" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">One-Click Integration</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Integrate SVM-Pay into your application with just a few lines of code. No complex setup required.
          </p>
        </div>
      </Card>
      <Card className="flex flex-col gap-4 p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Secure by Design</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Built with security best practices for blockchain payments, ensuring your transactions are safe and reliable.
          </p>
        </div>
      </Card>
    </div>
  );
}
