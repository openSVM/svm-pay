#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <optional>

namespace svm_pay {

/**
 * Supported SVM networks
 */
enum class SVMNetwork {
    SOLANA,
    SONIC,
    ECLIPSE,
    SOON
};

/**
 * Supported EVM networks for cross-chain payments
 */
enum class EVMNetwork {
    ETHEREUM,
    BNB_CHAIN,
    POLYGON,
    ARBITRUM,
    OPTIMISM,
    AVALANCHE
};

/**
 * Payment request types
 */
enum class RequestType {
    TRANSFER,
    TRANSACTION,
    CROSS_CHAIN_TRANSFER
};

/**
 * Payment status enum
 */
enum class PaymentStatus {
    CREATED,
    PENDING,
    CONFIRMED,
    FAILED,
    EXPIRED,
    // Cross-chain specific statuses
    BRIDGING,
    BRIDGE_CONFIRMED,
    BRIDGE_FAILED
};

/**
 * Bridge transfer status
 */
enum class BridgeTransferStatus {
    INITIATED,
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
};

/**
 * Base interface for all payment requests
 */
struct PaymentRequest {
    RequestType type;
    SVMNetwork network;
    std::string recipient;
    std::optional<std::string> label;
    std::optional<std::string> message;
    std::optional<std::string> memo;
    std::vector<std::string> references;
    
    PaymentRequest(RequestType type, SVMNetwork network, const std::string& recipient)
        : type(type), network(network), recipient(recipient) {}
    
    virtual ~PaymentRequest() = default;
};

/**
 * Transfer request for simple token transfers
 */
struct TransferRequest : public PaymentRequest {
    std::string amount;
    std::optional<std::string> spl_token;
    
    TransferRequest(SVMNetwork network, const std::string& recipient, const std::string& amount)
        : PaymentRequest(RequestType::TRANSFER, network, recipient), amount(amount) {}
};

/**
 * Transaction request for complex transactions
 */
struct TransactionRequest : public PaymentRequest {
    std::string link;
    
    TransactionRequest(SVMNetwork network, const std::string& recipient, const std::string& link)
        : PaymentRequest(RequestType::TRANSACTION, network, recipient), link(link) {}
};

/**
 * Cross-chain transfer request for payments across different networks via bridges
 */
struct CrossChainTransferRequest : public PaymentRequest {
    std::string source_network;
    std::string destination_network;
    std::string amount;
    std::string token;
    std::optional<std::string> bridge;
    std::unordered_map<std::string, std::string> bridge_params;
    
    CrossChainTransferRequest(const std::string& source_network, SVMNetwork destination_network,
                             const std::string& recipient, const std::string& amount, const std::string& token)
        : PaymentRequest(RequestType::CROSS_CHAIN_TRANSFER, destination_network, recipient),
          source_network(source_network), amount(amount), token(token) {}
};

/**
 * Bridge quote information
 */
struct BridgeQuote {
    std::string id;
    std::string input_amount;
    std::string output_amount;
    std::string fee;
    int64_t estimated_time;
    int64_t expires_at;
    std::unordered_map<std::string, std::string> data;
};

/**
 * Bridge transfer result
 */
struct BridgeTransferResult {
    std::string transfer_id;
    std::string source_transaction_hash;
    std::optional<std::string> destination_transaction_hash;
    BridgeTransferStatus status;
    std::unordered_map<std::string, std::string> metadata;
};

/**
 * Bridge information interface
 */
struct BridgeInfo {
    std::string id;
    std::string name;
    std::vector<std::string> supported_source_networks;
    std::vector<SVMNetwork> supported_destination_networks;
    std::unordered_map<std::string, std::vector<std::string>> supported_tokens;
    std::optional<std::string> fixed_fee;
    std::optional<double> percentage_fee;
    int64_t estimated_time;
    std::unordered_map<std::string, std::string> contracts;
};

/**
 * Payment record interface
 */
struct PaymentRecord {
    std::string id;
    std::unique_ptr<PaymentRequest> request;
    PaymentStatus status;
    std::optional<std::string> signature;
    int64_t created_at;
    int64_t updated_at;
    std::optional<std::string> error;
    std::optional<std::string> bridge_transaction_hash;
    std::optional<std::string> bridge_used;
    std::optional<BridgeQuote> bridge_quote;
};

/**
 * Utility functions for enum conversions
 */
std::string network_to_string(SVMNetwork network);
SVMNetwork string_to_network(const std::string& network);
std::string request_type_to_string(RequestType type);
RequestType string_to_request_type(const std::string& type);
std::string payment_status_to_string(PaymentStatus status);
PaymentStatus string_to_payment_status(const std::string& status);

} // namespace svm_pay