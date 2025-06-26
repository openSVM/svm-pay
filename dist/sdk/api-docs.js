"use strict";
/**
 * SVM-Pay API Documentation
 *
 * This file contains the API documentation for the SVM-Pay SDK.
 * It uses JSDoc format for TypeScript/JavaScript documentation.
 */
/**
 * @module svm-pay
 * @description A payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n)
 */
/**
 * @typedef {Object} SVMPayConfig
 * @property {string} [defaultNetwork='solana'] - Default network to use if not specified
 * @property {string} [apiEndpoint] - API endpoint for server-side operations
 * @property {boolean} [debug=false] - Whether to enable debug logging
 */
/**
 * @typedef {Object} TransferRequest
 * @property {'transfer'} type - The type of payment request
 * @property {string} network - The target SVM network for this payment
 * @property {string} recipient - The recipient's address (base58 encoded public key)
 * @property {string} [amount] - The amount to transfer (as a string to preserve precision)
 * @property {string} [splToken] - The SPL token mint address (if transferring an SPL token)
 * @property {string} [label] - Optional label describing the payment source
 * @property {string} [message] - Optional message describing the payment purpose
 * @property {string} [memo] - Optional memo to be included in the transaction
 * @property {string[]} [references] - Optional reference IDs for transaction identification
 */
/**
 * @typedef {Object} TransactionRequest
 * @property {'transaction'} type - The type of payment request
 * @property {string} network - The target SVM network for this payment
 * @property {string} recipient - The recipient's address (base58 encoded public key)
 * @property {string} link - The URL to fetch the transaction details from
 * @property {string} [label] - Optional label describing the payment source
 * @property {string} [message] - Optional message describing the payment purpose
 * @property {string} [memo] - Optional memo to be included in the transaction
 * @property {string[]} [references] - Optional reference IDs for transaction identification
 */
/**
 * @typedef {Object} PaymentRecord
 * @property {string} id - Unique identifier for the payment
 * @property {TransferRequest|TransactionRequest} request - The payment request
 * @property {'created'|'pending'|'confirmed'|'failed'|'expired'} status - Current status of the payment
 * @property {string} [signature] - Transaction signature (once submitted)
 * @property {number} createdAt - Timestamp when the payment was created
 * @property {number} updatedAt - Timestamp when the payment was last updated
 * @property {string} [error] - Error message if the payment failed
 */
/**
 * @class SVMPay
 * @description Main SDK class for SVM-Pay
 */
/**
 * Creates a new SVMPay instance
 * @constructor
 * @param {SVMPayConfig} [config] - Configuration options
 */
/**
 * Create a payment URL for a transfer request
 * @method
 * @name SVMPay#createTransferUrl
 * @param {string} recipient - Recipient address
 * @param {string} [amount] - Amount to transfer
 * @param {Object} [options] - Additional options
 * @param {string} [options.network] - Network to use
 * @param {string} [options.splToken] - Token to transfer (if not native token)
 * @param {string} [options.label] - Payment label
 * @param {string} [options.message] - Payment description
 * @param {string} [options.memo] - Additional memo
 * @param {string[]} [options.references] - Reference IDs for transaction identification
 * @returns {string} Payment URL
 */
/**
 * Create a payment URL for a transaction request
 * @method
 * @name SVMPay#createTransactionUrl
 * @param {string} recipient - Recipient address
 * @param {string} link - URL to fetch transaction details
 * @param {Object} [options] - Additional options
 * @param {string} [options.network] - Network to use
 * @param {string} [options.label] - Payment label
 * @param {string} [options.message] - Payment description
 * @param {string} [options.memo] - Additional memo
 * @param {string[]} [options.references] - Reference IDs for transaction identification
 * @returns {string} Payment URL
 */
/**
 * Parse a payment URL
 * @method
 * @name SVMPay#parseUrl
 * @param {string} url - Payment URL to parse
 * @returns {TransferRequest|TransactionRequest} Parsed payment request
 */
/**
 * Generate a reference ID
 * @method
 * @name SVMPay#generateReference
 * @returns {string} Reference ID
 */
/**
 * Process a payment request
 * @method
 * @name SVMPay#processPayment
 * @param {TransferRequest|TransactionRequest} request - Payment request to process
 * @returns {Promise<PaymentRecord>} Payment record
 */
/**
 * Check the status of a payment
 * @method
 * @name SVMPay#checkPaymentStatus
 * @param {string} paymentId - ID of the payment to check
 * @returns {Promise<'created'|'pending'|'confirmed'|'failed'|'expired'>} Payment status
 */
/**
 * @module svm-pay/react
 * @description React components for SVM-Pay
 */
/**
 * @typedef {Object} PaymentButtonProps
 * @property {SVMPay} svmPay - SVM-Pay SDK instance
 * @property {string} recipient - Recipient address
 * @property {string} [amount] - Amount to transfer
 * @property {string} [token] - Token to transfer (if not native token)
 * @property {string} [network] - Network to use
 * @property {string} [label='Pay'] - Button label
 * @property {string} [description] - Payment description
 * @property {Function} [onComplete] - Callback when payment is completed
 * @property {Function} [onStart] - Callback when payment is started
 * @property {Object} [style] - Button style
 * @property {string} [className] - Button class name
 */
/**
 * Payment Button Component
 * @component
 * @param {PaymentButtonProps} props - Component props
 * @returns {React.Element} React component
 */
/**
 * @typedef {Object} QRCodePaymentProps
 * @property {SVMPay} svmPay - SVM-Pay SDK instance
 * @property {string} recipient - Recipient address
 * @property {string} [amount] - Amount to transfer
 * @property {string} [token] - Token to transfer (if not native token)
 * @property {string} [network] - Network to use
 * @property {string} [label] - Payment label
 * @property {string} [description] - Payment description
 * @property {number} [size=200] - QR code size
 * @property {Function} [onComplete] - Callback when payment is completed
 * @property {Object} [style] - Container style
 * @property {string} [className] - Container class name
 */
/**
 * QR Code Payment Component
 * @component
 * @param {QRCodePaymentProps} props - Component props
 * @returns {React.Element} React component
 */
/**
 * @module svm-pay/vue
 * @description Vue components for SVM-Pay
 */
/**
 * Payment Button Component
 * @component
 * @name SvmPayButton
 * @prop {Object} svmPay - SVM-Pay SDK instance
 * @prop {string} recipient - Recipient address
 * @prop {string} [amount] - Amount to transfer
 * @prop {string} [token] - Token to transfer (if not native token)
 * @prop {string} [network] - Network to use
 * @prop {string} [label='Pay'] - Button label
 * @prop {string} [description] - Payment description
 * @prop {string} [variant='primary'] - Button variant
 * @prop {string} [size='medium'] - Button size
 * @emits start - Emitted when payment is started
 * @emits complete - Emitted when payment is completed
 */
/**
 * QR Code Payment Component
 * @component
 * @name SvmPayQRCode
 * @prop {Object} svmPay - SVM-Pay SDK instance
 * @prop {string} recipient - Recipient address
 * @prop {string} [amount] - Amount to transfer
 * @prop {string} [token] - Token to transfer (if not native token)
 * @prop {string} [network] - Network to use
 * @prop {string} [label] - Payment label
 * @prop {string} [description] - Payment description
 * @prop {number} [size=200] - QR code size
 * @emits complete - Emitted when payment is completed
 * @emits error - Emitted when an error occurs
 */
/**
 * Vue plugin
 * @name SVMPayVue
 * @param {Vue} Vue - Vue instance
 * @param {Object} [options] - Plugin options
 */
/**
 * @module svm-pay/server
 * @description Server-side SDK for SVM-Pay
 */
/**
 * @typedef {Object} ServerSDKConfig
 * @property {string} [defaultNetwork='solana'] - Default network to use if not specified
 * @property {boolean} [debug=false] - Whether to enable debug logging
 * @property {string} [secretKey] - Secret key for signing server-side transactions
 */
/**
 * @class SVMPayServer
 * @description Server-side SDK for SVM-Pay
 */
/**
 * Creates a new SVMPayServer instance
 * @constructor
 * @param {ServerSDKConfig} [config] - Configuration options
 */
/**
 * Create a payment URL for a transfer request
 * @method
 * @name SVMPayServer#createTransferUrl
 * @param {string} recipient - Recipient address
 * @param {string} [amount] - Amount to transfer
 * @param {Object} [options] - Additional options
 * @param {string} [options.network] - Network to use
 * @param {string} [options.splToken] - Token to transfer (if not native token)
 * @param {string} [options.label] - Payment label
 * @param {string} [options.message] - Payment description
 * @param {string} [options.memo] - Additional memo
 * @param {string[]} [options.references] - Reference IDs for transaction identification
 * @param {string} [options.orderId] - Order ID to generate a reference from
 * @returns {string} Payment URL
 */
/**
 * Create a transaction request URL
 * @method
 * @name SVMPayServer#createTransactionUrl
 * @param {string} recipient - Recipient address
 * @param {string} link - URL to fetch transaction details
 * @param {Object} [options] - Additional options
 * @param {string} [options.network] - Network to use
 * @param {string} [options.label] - Payment label
 * @param {string} [options.message] - Payment description
 * @param {string} [options.memo] - Additional memo
 * @param {string[]} [options.references] - Reference IDs for transaction identification
 * @param {string} [options.orderId] - Order ID to generate a reference from
 * @returns {string} Payment URL
 */
/**
 * Parse a payment URL
 * @method
 * @name SVMPayServer#parseUrl
 * @param {string} url - Payment URL to parse
 * @returns {TransferRequest|TransactionRequest} Parsed payment request
 */
/**
 * Generate a reference ID
 * @method
 * @name SVMPayServer#generateReference
 * @returns {string} Reference ID
 */
/**
 * Generate a deterministic reference ID from an order ID
 * @method
 * @name SVMPayServer#generateOrderReference
 * @param {string} orderId - Order ID to generate a reference from
 * @returns {string} Reference ID
 */
/**
 * Verify a transaction against a payment request
 * @method
 * @name SVMPayServer#verifyTransaction
 * @param {Object} transaction - Transaction to verify
 * @param {TransferRequest|TransactionRequest} request - Payment request to verify against
 * @returns {boolean} Whether the transaction is valid
 */
/**
 * Handle a transaction webhook
 * @method
 * @name SVMPayServer#handleWebhook
 * @param {string} signature - Transaction signature
 * @param {string} reference - Reference ID
 * @returns {Promise<'created'|'pending'|'confirmed'|'failed'|'expired'>} Payment status
 */
/**
 * Check the status of a transaction
 * @method
 * @name SVMPayServer#checkTransactionStatus
 * @param {string} signature - Transaction signature
 * @param {string} [network] - Network to check on
 * @returns {Promise<'created'|'pending'|'confirmed'|'failed'|'expired'>} Payment status
 */
/**
 * Find transactions by reference
 * @method
 * @name SVMPayServer#findTransactionsByReference
 * @param {string} reference - Reference ID to search for
 * @param {string} [network] - Network to search on
 * @returns {Promise<string[]>} Array of transaction signatures
 */
/**
 * @module svm-pay/mobile
 * @description Mobile SDK interface for SVM-Pay
 */
/**
 * @typedef {Object} MobileSDKConfig
 * @property {string} defaultNetwork - Default network to use if not specified
 * @property {string} [apiEndpoint] - API endpoint for server-side operations
 * @property {boolean} [debug] - Whether to enable debug logging
 * @property {string} [walletUriScheme] - Custom wallet app URI scheme
 */
/**
 * @typedef {Object} PaymentRequestOptions
 * @property {string} recipient - Recipient address
 * @property {string} [amount] - Amount to transfer
 * @property {string} [network] - Network to use
 * @property {string} [token] - Token to transfer (if not native token)
 * @property {string} [label] - Payment label
 * @property {string} [message] - Payment description
 * @property {string} [memo] - Additional memo
 * @property {string[]} [references] - Reference IDs for transaction identification
 */
/**
 * @typedef {Object} PaymentResponse
 * @property {string} status - Payment status
 * @property {string} [signature] - Transaction signature (if successful)
 * @property {string} [error] - Error message (if failed)
 */
/**
 * @interface SVMPayMobileSDK
 * @description Interface for mobile SDKs
 */
/**
 * Initialize the SDK
 * @method
 * @name SVMPayMobileSDK#initialize
 * @param {MobileSDKConfig} config - Configuration options
 */
/**
 * Create a payment request URL
 * @method
 * @name SVMPayMobileSDK#createPaymentUrl
 * @param {PaymentRequestOptions} options - Payment request options
 * @returns {string} Payment URL
 */
/**
 * Open a payment request in the wallet app
 * @method
 * @name SVMPayMobileSDK#requestPayment
 * @param {PaymentRequestOptions} options - Payment request options
 * @returns {Promise<PaymentResponse>} Payment response
 */
/**
 * Generate a QR code for a payment request
 * @method
 * @name SVMPayMobileSDK#generateQRCode
 * @param {PaymentRequestOptions} options - Payment request options
 * @param {number} size - QR code size
 * @returns {string} Base64-encoded image data
 */
/**
 * Check the status of a payment
 * @method
 * @name SVMPayMobileSDK#checkPaymentStatus
 * @param {string} reference - Reference ID of the payment
 * @returns {Promise<string>} Payment status
 */
/**
 * Generate a reference ID
 * @method
 * @name SVMPayMobileSDK#generateReference
 * @returns {string} Reference ID
 */
//# sourceMappingURL=api-docs.js.map