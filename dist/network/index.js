"use strict";
/**
 * SVM-Pay Network Module
 *
 * This file exports all the network adapters and utilities for SVM-Pay.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Export adapter interface and factory
__exportStar(require("./adapter"), exports);
// Export network adapters
__exportStar(require("./solana"), exports);
__exportStar(require("./sonic"), exports);
__exportStar(require("./eclipse"), exports);
__exportStar(require("./soon"), exports);
// Export network detector
__exportStar(require("./detector"), exports);
//# sourceMappingURL=index.js.map