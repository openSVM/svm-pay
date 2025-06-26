"use strict";
/**
 * SVM-Pay Mobile SDK Interface
 *
 * This file defines the interface for mobile SDKs (iOS and Android).
 * It serves as a specification for implementing native mobile SDKs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation notes for native SDKs:
 *
 * 1. iOS SDK:
 *    - Implement using Swift
 *    - Use URLSession for network requests
 *    - Implement deep linking to wallet apps
 *    - Use Core Image for QR code generation
 *
 * 2. Android SDK:
 *    - Implement using Kotlin
 *    - Use OkHttp for network requests
 *    - Implement intent handling for wallet apps
 *    - Use ZXing for QR code generation
 *
 * Both implementations should:
 * - Follow the URL scheme defined in the core protocol
 * - Support all SVM networks (Solana, Sonic SVM, Eclipse, s00n)
 * - Handle wallet app selection and deep linking
 * - Provide synchronous and asynchronous APIs
 * - Include comprehensive error handling
 */
//# sourceMappingURL=mobile.js.map