type SVMPayConfig = {
    /**
     * - Default network to use if not specified
     */
    defaultNetwork?: string | undefined;
    /**
     * - API endpoint for server-side operations
     */
    apiEndpoint?: string | undefined;
    /**
     * - Whether to enable debug logging
     */
    debug?: boolean | undefined;
};
type TransferRequest = {
    /**
     * - The type of payment request
     */
    type: "transfer";
    /**
     * - The target SVM network for this payment
     */
    network: string;
    /**
     * - The recipient's address (base58 encoded public key)
     */
    recipient: string;
    /**
     * - The amount to transfer (as a string to preserve precision)
     */
    amount?: string | undefined;
    /**
     * - The SPL token mint address (if transferring an SPL token)
     */
    splToken?: string | undefined;
    /**
     * - Optional label describing the payment source
     */
    label?: string | undefined;
    /**
     * - Optional message describing the payment purpose
     */
    message?: string | undefined;
    /**
     * - Optional memo to be included in the transaction
     */
    memo?: string | undefined;
    /**
     * - Optional reference IDs for transaction identification
     */
    references?: string[] | undefined;
};
type TransactionRequest = {
    /**
     * - The type of payment request
     */
    type: "transaction";
    /**
     * - The target SVM network for this payment
     */
    network: string;
    /**
     * - The recipient's address (base58 encoded public key)
     */
    recipient: string;
    /**
     * - The URL to fetch the transaction details from
     */
    link: string;
    /**
     * - Optional label describing the payment source
     */
    label?: string | undefined;
    /**
     * - Optional message describing the payment purpose
     */
    message?: string | undefined;
    /**
     * - Optional memo to be included in the transaction
     */
    memo?: string | undefined;
    /**
     * - Optional reference IDs for transaction identification
     */
    references?: string[] | undefined;
};
type PaymentRecord = {
    /**
     * - Unique identifier for the payment
     */
    id: string;
    /**
     * - The payment request
     */
    request: TransferRequest | TransactionRequest;
    /**
     * - Current status of the payment
     */
    status: "created" | "pending" | "confirmed" | "failed" | "expired";
    /**
     * - Transaction signature (once submitted)
     */
    signature?: string | undefined;
    /**
     * - Timestamp when the payment was created
     */
    createdAt: number;
    /**
     * - Timestamp when the payment was last updated
     */
    updatedAt: number;
    /**
     * - Error message if the payment failed
     */
    error?: string | undefined;
};
type PaymentButtonProps = {
    /**
     * - SVM-Pay SDK instance
     */
    svmPay: SVMPay;
    /**
     * - Recipient address
     */
    recipient: string;
    /**
     * - Amount to transfer
     */
    amount?: string | undefined;
    /**
     * - Token to transfer (if not native token)
     */
    token?: string | undefined;
    /**
     * - Network to use
     */
    network?: string | undefined;
    /**
     * - Button label
     */
    label?: string | undefined;
    /**
     * - Payment description
     */
    description?: string | undefined;
    /**
     * - Callback when payment is completed
     */
    onComplete?: Function | undefined;
    /**
     * - Callback when payment is started
     */
    onStart?: Function | undefined;
    /**
     * - Button style
     */
    style?: Object | undefined;
    /**
     * - Button class name
     */
    className?: string | undefined;
};
type QRCodePaymentProps = {
    /**
     * - SVM-Pay SDK instance
     */
    svmPay: SVMPay;
    /**
     * - Recipient address
     */
    recipient: string;
    /**
     * - Amount to transfer
     */
    amount?: string | undefined;
    /**
     * - Token to transfer (if not native token)
     */
    token?: string | undefined;
    /**
     * - Network to use
     */
    network?: string | undefined;
    /**
     * - Payment label
     */
    label?: string | undefined;
    /**
     * - Payment description
     */
    description?: string | undefined;
    /**
     * - QR code size
     */
    size?: number | undefined;
    /**
     * - Callback when payment is completed
     */
    onComplete?: Function | undefined;
    /**
     * - Container style
     */
    style?: Object | undefined;
    /**
     * - Container class name
     */
    className?: string | undefined;
};
type ServerSDKConfig = {
    /**
     * - Default network to use if not specified
     */
    defaultNetwork?: string | undefined;
    /**
     * - Whether to enable debug logging
     */
    debug?: boolean | undefined;
    /**
     * - Secret key for signing server-side transactions
     */
    secretKey?: string | undefined;
};
type MobileSDKConfig = {
    /**
     * - Default network to use if not specified
     */
    defaultNetwork: string;
    /**
     * - API endpoint for server-side operations
     */
    apiEndpoint?: string | undefined;
    /**
     * - Whether to enable debug logging
     */
    debug?: boolean | undefined;
    /**
     * - Custom wallet app URI scheme
     */
    walletUriScheme?: string | undefined;
};
type PaymentRequestOptions = {
    /**
     * - Recipient address
     */
    recipient: string;
    /**
     * - Amount to transfer
     */
    amount?: string | undefined;
    /**
     * - Network to use
     */
    network?: string | undefined;
    /**
     * - Token to transfer (if not native token)
     */
    token?: string | undefined;
    /**
     * - Payment label
     */
    label?: string | undefined;
    /**
     * - Payment description
     */
    message?: string | undefined;
    /**
     * - Additional memo
     */
    memo?: string | undefined;
    /**
     * - Reference IDs for transaction identification
     */
    references?: string[] | undefined;
};
type PaymentResponse = {
    /**
     * - Payment status
     */
    status: string;
    /**
     * - Transaction signature (if successful)
     */
    signature?: string | undefined;
    /**
     * - Error message (if failed)
     */
    error?: string | undefined;
};
//# sourceMappingURL=api-docs.d.ts.map