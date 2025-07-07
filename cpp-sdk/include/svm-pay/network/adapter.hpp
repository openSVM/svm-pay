#pragma once

#include "../core/types.hpp"
#include <string>
#include <future>

namespace svm_pay {

/**
 * Network adapter interface
 * Each supported SVM network must implement this interface
 */
class NetworkAdapter {
public:
    /**
     * Constructor
     * 
     * @param network The network this adapter handles
     */
    explicit NetworkAdapter(SVMNetwork network) : network_(network) {}
    
    virtual ~NetworkAdapter() = default;
    
    /**
     * Get the network this adapter handles
     * 
     * @return The network
     */
    SVMNetwork get_network() const { return network_; }
    
    /**
     * Create a transaction from a transfer request
     * 
     * @param request The transfer request to create a transaction for
     * @return A future that resolves to the transaction string
     */
    virtual std::future<std::string> create_transfer_transaction(const TransferRequest& request) = 0;
    
    /**
     * Fetch a transaction from a transaction request
     * 
     * @param request The transaction request to fetch a transaction for
     * @return A future that resolves to the transaction string
     */
    virtual std::future<std::string> fetch_transaction(const TransactionRequest& request) = 0;
    
    /**
     * Submit a signed transaction to the network
     * 
     * @param transaction The transaction to submit
     * @param signature The signature for the transaction
     * @return A future that resolves to the transaction signature
     */
    virtual std::future<std::string> submit_transaction(const std::string& transaction, 
                                                       const std::string& signature) = 0;
    
    /**
     * Check the status of a transaction
     * 
     * @param signature The signature of the transaction to check
     * @return A future that resolves to the payment status
     */
    virtual std::future<PaymentStatus> check_transaction_status(const std::string& signature) = 0;

protected:
    SVMNetwork network_;
};

/**
 * Factory for creating network adapters
 */
class NetworkAdapterFactory {
public:
    /**
     * Register a network adapter
     * 
     * @param network The network
     * @param adapter The network adapter to register
     */
    static void register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter);
    
    /**
     * Get a network adapter for a specific network
     * 
     * @param network The network to get an adapter for
     * @return The network adapter, or nullptr if none is registered
     */
    static NetworkAdapter* get_adapter(SVMNetwork network);
    
    /**
     * Check if an adapter is registered for a network
     * 
     * @param network The network to check
     * @return True if an adapter is registered, false otherwise
     */
    static bool has_adapter(SVMNetwork network);

private:
    static std::unordered_map<SVMNetwork, std::unique_ptr<NetworkAdapter>> adapters_;
};

} // namespace svm_pay