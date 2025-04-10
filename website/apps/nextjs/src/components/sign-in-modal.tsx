"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { Modal } from "~/components/modal";
import { siteConfig } from "~/config/site";
import { useSigninModal } from "~/hooks/use-signin-modal";

export const SignInModal = ({ dict }: { dict: Record<string, string> }) => {
  const signInModal = useSigninModal();
  const { connecting } = useWallet();
  
  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Image
              src="/images/avatars/saasfly-logo.svg"
              className="mx-auto"
              width="64"
              height="64"
              alt=""
            />
          </a>
          <h3 className="font-urban text-2xl font-bold">{dict.signup || "Connect Wallet"}</h3>
          <p className="text-sm text-gray-500">{dict.privacy || "Connect your Solana wallet to continue"}</p>
        </div>
        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <div className="wallet-adapter-button-container flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </Modal>
  );
};
