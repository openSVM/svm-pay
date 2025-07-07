#pragma once

#include "core/types.hpp"
#include "core/url_scheme.hpp"
#include "core/reference.hpp"
#include "network/adapter.hpp"
#include <string>
#include <memory>

namespace svm_pay {

/**
 * Main client class for SVM-Pay
 * 
 * This class provides a high-level interface for creating payment requests,
 * parsing URLs, and managing network adapters.
 */
class Client {
public:
    /**
     * Constructor
     * 
     * @param default_network The default network to use for payments
     */
    explicit Client(SVMNetwork default_network = SVMNetwork::SOLANA);
    
    /**
     * Destructor
     */
    ~Client();
    
    /**
     * Create a transfer URL
     * 
     * @param recipient The recipient address
     * @param amount The amount to transfer
     * @param options Optional parameters (network, label, message, etc.)
     * @return A payment URL string
     */
    std::string create_transfer_url(const std::string& recipient, 
                                   const std::string& amount,
                                   const std::unordered_map<std::string, std::string>& options = {});
    
    /**
     * Create a transaction URL
     * 
     * @param recipient The recipient address
     * @param link The transaction link
     * @param options Optional parameters (network, label, message, etc.)
     * @return A payment URL string
     */
    std::string create_transaction_url(const std::string& recipient,
                                      const std::string& link,
                                      const std::unordered_map<std::string, std::string>& options = {});
    
    /**
     * Parse a payment URL
     * 
     * @param url The payment URL to parse
     * @return A unique pointer to a PaymentRequest object
     */
    std::unique_ptr<PaymentRequest> parse_url(const std::string& url);
    
    /**
     * Generate a reference ID
     * 
     * @param length The length of the reference ID in bytes
     * @return A base58-encoded reference ID
     */
    std::string generate_reference(size_t length = 32);
    
    /**
     * Set the default network
     * 
     * @param network The new default network
     */
    void set_default_network(SVMNetwork network);
    
    /**
     * Get the default network
     * 
     * @return The current default network
     */
    SVMNetwork get_default_network() const;
    
    /**
     * Register a network adapter
     * 
     * @param network The network
     * @param adapter The network adapter to register
     */
    void register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter);
    
    /**
     * Get a network adapter
     * 
     * @param network The network to get an adapter for
     * @return The network adapter, or nullptr if none is registered
     */
    NetworkAdapter* get_adapter(SVMNetwork network);
    
    /**
     * Check if debug mode is enabled
     * 
     * @return True if debug mode is enabled, false otherwise
     */
    bool is_debug_enabled() const;
    
    /**
     * Enable or disable debug mode
     * 
     * @param enabled True to enable debug mode, false to disable
     */
    void set_debug_enabled(bool enabled);

private:
    SVMNetwork default_network_;
    bool debug_enabled_;
    
    /**
     * Parse network from options
     * 
     * @param options The options map
     * @return The network, or default_network_ if not specified
     */
    SVMNetwork parse_network_from_options(const std::unordered_map<std::string, std::string>& options);
    
    /**
     * Parse references from options
     * 
     * @param options The options map
     * @return A vector of reference IDs
     */
    std::vector<std::string> parse_references_from_options(const std::unordered_map<std::string, std::string>& options);
};

} // namespace svm_pay