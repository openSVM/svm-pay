#include "svm-pay/client.hpp"
#include "svm-pay/core/url_scheme.hpp"
#include "svm-pay/core/reference.hpp"
#include "svm-pay/network/solana.hpp"
#include <sstream>

namespace svm_pay {

Client::Client(SVMNetwork default_network) 
    : default_network_(default_network), debug_enabled_(false) {
    
    // Register default adapters
    auto solana_adapter = std::make_unique<SolanaNetworkAdapter>();
    register_adapter(SVMNetwork::SOLANA, std::move(solana_adapter));
}

Client::~Client() = default;

std::string Client::create_transfer_url(const std::string& recipient, 
                                       const std::string& amount,
                                       const std::unordered_map<std::string, std::string>& options) {
    
    SVMNetwork network = parse_network_from_options(options);
    TransferRequest request(network, recipient, amount);
    
    // Set optional parameters
    auto label_it = options.find("label");
    if (label_it != options.end()) {
        request.label = label_it->second;
    }
    
    auto message_it = options.find("message");
    if (message_it != options.end()) {
        request.message = message_it->second;
    }
    
    auto memo_it = options.find("memo");
    if (memo_it != options.end()) {
        request.memo = memo_it->second;
    }
    
    auto spl_token_it = options.find("spl-token");
    if (spl_token_it != options.end()) {
        request.spl_token = spl_token_it->second;
    }
    
    // Parse references
    request.references = parse_references_from_options(options);
    
    return svm_pay::create_transfer_url(request);
}

std::string Client::create_transaction_url(const std::string& recipient,
                                          const std::string& link,
                                          const std::unordered_map<std::string, std::string>& options) {
    
    SVMNetwork network = parse_network_from_options(options);
    TransactionRequest request(network, recipient, link);
    
    // Set optional parameters
    auto label_it = options.find("label");
    if (label_it != options.end()) {
        request.label = label_it->second;
    }
    
    auto message_it = options.find("message");
    if (message_it != options.end()) {
        request.message = message_it->second;
    }
    
    auto memo_it = options.find("memo");
    if (memo_it != options.end()) {
        request.memo = memo_it->second;
    }
    
    // Parse references
    request.references = parse_references_from_options(options);
    
    return svm_pay::create_transaction_url(request);
}

std::unique_ptr<PaymentRequest> Client::parse_url(const std::string& url) {
    return svm_pay::parse_url(url);
}

std::string Client::generate_reference(size_t length) {
    return svm_pay::generate_reference(length);
}

void Client::set_default_network(SVMNetwork network) {
    default_network_ = network;
}

SVMNetwork Client::get_default_network() const {
    return default_network_;
}

void Client::register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter) {
    NetworkAdapterFactory::register_adapter(network, std::move(adapter));
}

NetworkAdapter* Client::get_adapter(SVMNetwork network) {
    return NetworkAdapterFactory::get_adapter(network);
}

bool Client::is_debug_enabled() const {
    return debug_enabled_;
}

void Client::set_debug_enabled(bool enabled) {
    debug_enabled_ = enabled;
}

SVMNetwork Client::parse_network_from_options(const std::unordered_map<std::string, std::string>& options) {
    auto network_it = options.find("network");
    if (network_it != options.end()) {
        return string_to_network(network_it->second);
    }
    return default_network_;
}

std::vector<std::string> Client::parse_references_from_options(const std::unordered_map<std::string, std::string>& options) {
    std::vector<std::string> references;
    
    // Look for references in the format "reference", "reference1", "reference2", etc.
    auto reference_it = options.find("reference");
    if (reference_it != options.end()) {
        references.push_back(reference_it->second);
    }
    
    // Look for numbered references
    for (int i = 1; i <= 10; ++i) { // Support up to 10 references
        std::string key = "reference" + std::to_string(i);
        auto it = options.find(key);
        if (it != options.end()) {
            references.push_back(it->second);
        }
    }
    
    return references;
}

} // namespace svm_pay