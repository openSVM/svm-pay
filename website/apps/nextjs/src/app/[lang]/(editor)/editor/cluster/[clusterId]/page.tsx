import React from 'react';
// import { SolanaWalletProvider } from '../../../../../../../../src/sdk/solana-integration';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function ClusterPage({
  params,
}: {
  params: { clusterId: string };
}) {
  // Replace with your WalletConnect project ID
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
  
  return (
    <SolanaWalletProvider 
      projectId={projectId}
      network={WalletAdapterNetwork.Mainnet}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Cluster: {params.clusterId}</h3>
          <p className="text-sm text-muted-foreground">
            Manage your cluster settings and payments
          </p>
        </div>
        <div className="border rounded-md p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Cluster Details</h4>
              <p className="text-sm text-muted-foreground">
                Cluster ID: {params.clusterId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SolanaWalletProvider>
  );
}
