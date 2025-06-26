"use strict";
/**
 * SVM-Pay Core Types
 *
 * This file defines the core types used throughout the SVM-Pay protocol.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.RequestType = exports.SVMNetwork = void 0;
/**
 * Supported SVM networks
 */
var SVMNetwork;
(function (SVMNetwork) {
    SVMNetwork["SOLANA"] = "solana";
    SVMNetwork["SONIC"] = "sonic";
    SVMNetwork["ECLIPSE"] = "eclipse";
    SVMNetwork["SOON"] = "soon";
})(SVMNetwork || (exports.SVMNetwork = SVMNetwork = {}));
/**
 * Payment request types
 */
var RequestType;
(function (RequestType) {
    RequestType["TRANSFER"] = "transfer";
    RequestType["TRANSACTION"] = "transaction";
})(RequestType || (exports.RequestType = RequestType = {}));
/**
 * Payment status enum
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["CREATED"] = "created";
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["CONFIRMED"] = "confirmed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["EXPIRED"] = "expired";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=types.js.map