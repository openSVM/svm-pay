export declare const WalletConnectChainID: {
    readonly Mainnet: "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ";
    readonly Devnet: "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K";
};
export type WalletConnectChainIDType = typeof WalletConnectChainID[keyof typeof WalletConnectChainID];
export declare enum WalletConnectRPCMethods {
    signTransaction = "solana_signTransaction",
    signAllTransactions = "solana_signAllTransactions",
    signMessage = "solana_signMessage",
    signAndSendTransaction = "solana_signAndSendTransaction"
}
//# sourceMappingURL=constants.d.ts.map