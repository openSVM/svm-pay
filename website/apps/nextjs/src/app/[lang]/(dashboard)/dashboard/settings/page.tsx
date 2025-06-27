import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Wallet Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your wallet connection and payment settings
        </p>
      </div>
      <div className="border rounded-md p-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Connected Wallet</h4>
            <p className="text-sm text-muted-foreground">
              Your currently connected Solana wallet
            </p>
          </div>
          {/* WalletConnect components will display connection status here */}
        </div>
      </div>
    </div>
  );
}
