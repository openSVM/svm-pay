import React from 'react';

export default function ClusterPage({
  params,
}: {
  params: { clusterId: string };
}) {
  return (
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
  );
}
