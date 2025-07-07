#pragma once

#include "adapter.hpp"
#include <string>

namespace svm_pay {

/**
 * Solana network adapter implementation
 */
class SolanaNetworkAdapter : public NetworkAdapter {
public:
    /**
     * Constructor
     * 
     * @param rpc_url The Solana RPC URL to use (default: mainnet-beta)
     */
    explicit SolanaNetworkAdapter(const std::string& rpc_url = "https://api.mainnet-beta.solana.com");
    
    /**
     * Create a transaction from a transfer request
     * 
     * @param request The transfer request to create a transaction for
     * @return A future that resolves to the transaction string
     */
    std::future<std::string> create_transfer_transaction(const TransferRequest& request) override;
    
    /**
     * Fetch a transaction from a transaction request
     * 
     * @param request The transaction request to fetch a transaction for
     * @return A future that resolves to the transaction string
     */
    std::future<std::string> fetch_transaction(const TransactionRequest& request) override;
    
    /**
     * Submit a signed transaction to the network
     * 
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @return A future that resolves to the transaction signature
     */
    std::future<std::string> submit_transaction(const std::string& transaction, 
                                               const std::string& signature) override;
    
    /**
     * Check the status of a transaction
     * 
     * @param signature The signature of the transaction to check
     * @return A future that resolves to the payment status
     */
    std::future<PaymentStatus> check_transaction_status(const std::string& signature) override;
    
    /**
     * Set the RPC URL
     * 
     * @param rpc_url The new RPC URL
     */
    void set_rpc_url(const std::string& rpc_url);
    
    /**
     * Get the current RPC URL
     * 
     * @return The current RPC URL
     */
    const std::string& get_rpc_url() const;

private:
    std::string rpc_url_;
    
    /**
     * Make an RPC call to the Solana network
     * 
     * @param method The RPC method name
     * @param params The RPC parameters as JSON string
     * @return The RPC response as JSON string
     */
    std::future<std::string> make_rpc_call(const std::string& method, const std::string& params);
    
    /**
     * Validate a Solana address
     * 
     * @param address The address to validate
     * @return True if valid, false otherwise
     */
    bool validate_address(const std::string& address) const;
};

} // namespace svm_pay