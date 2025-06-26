import { FC } from 'react';
export interface SolanaPaymentProps {
    amount: number;
    recipientAddress: string;
    onSuccess?: (signature: string) => void;
    onError?: (error: Error) => void;
}
export declare const SolanaPayment: FC<SolanaPaymentProps>;
//# sourceMappingURL=solana-payment.d.ts.map