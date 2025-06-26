"use strict";
/**
 * SVM-Pay Core Module
 *
 * This file exports all the core components of the SVM-Pay protocol.
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
// Export types
__exportStar(require("./types"), exports);
// Export URL scheme
__exportStar(require("./url-scheme"), exports);
// Export reference generator
__exportStar(require("./reference"), exports);
// Export request handlers
__exportStar(require("./transfer-handler"), exports);
__exportStar(require("./transaction-handler"), exports);
// Export metadata handler
__exportStar(require("./metadata"), exports);
//# sourceMappingURL=index.js.map