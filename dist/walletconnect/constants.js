"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectRPCMethods = exports.WalletConnectChainID = void 0;
exports.WalletConnectChainID = {
    Mainnet: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
    Devnet: 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
};
var WalletConnectRPCMethods;
(function (WalletConnectRPCMethods) {
    WalletConnectRPCMethods["signTransaction"] = "solana_signTransaction";
    WalletConnectRPCMethods["signAllTransactions"] = "solana_signAllTransactions";
    WalletConnectRPCMethods["signMessage"] = "solana_signMessage";
    WalletConnectRPCMethods["signAndSendTransaction"] = "solana_signAndSendTransaction";
})(WalletConnectRPCMethods || (exports.WalletConnectRPCMethods = WalletConnectRPCMethods = {}));
//# sourceMappingURL=constants.js.map