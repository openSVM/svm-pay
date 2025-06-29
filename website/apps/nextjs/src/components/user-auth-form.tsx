"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { toast } from "@saasfly/ui/use-toast";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict: Dictionary;
  disabled?: boolean;
}

function UserAuthFormInner({
  className,
  lang,
  dict,
  disabled,
  ...props
}: UserAuthFormProps) {
  const searchParams = useSearchParams();
  
  // Use try-catch to handle missing wallet context gracefully
  let walletState = { publicKey: null, connecting: false };
  try {
    const { publicKey, connecting } = useWallet();
    walletState = { publicKey, connecting };
  } catch (error) {
    console.warn("Wallet context not available:", error);
  }

  const { publicKey, connecting } = walletState;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (publicKey) {
      toast({
        title: "Wallet Connected",
        description: `Connected with wallet ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`,
      });
      
      // Redirect to dashboard after successful connection
      const callbackUrl = searchParams?.get("from") ?? `/${lang}/dashboard`;
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 1000);
    }
  }, [publicKey, lang, searchParams]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {dict?.signin_others || "Connect with Solana"}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center">
        <WalletMultiButton />
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        {connecting ? "Connecting..." : "Connect your Solana wallet to continue"}
      </p>
    </div>
  );
}

export function UserAuthForm(props: UserAuthFormProps) {
  return (
    <Suspense fallback={
      <div className={cn("grid gap-6", props.className)}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Loading...
            </span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Loading wallet connection...
        </p>
      </div>
    }>
      <UserAuthFormInner {...props} />
    </Suspense>
  );
}
