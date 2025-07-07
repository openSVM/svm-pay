#include "svm-pay/core/url_scheme.hpp"
#include <stdexcept>
#include <sstream>
#include <algorithm>
#include <regex>
#include <unordered_map>

namespace svm_pay {

/**
 * URL decode a string
 * 
 * @param encoded The URL-encoded string
 * @return The decoded string
 */
std::string url_decode(const std::string& encoded) {
    std::string decoded;
    decoded.reserve(encoded.size());
    
    for (size_t i = 0; i < encoded.size(); ++i) {
        if (encoded[i] == '%' && i + 2 < encoded.size()) {
            // Parse hex digits
            char hex[3] = {encoded[i+1], encoded[i+2], '\0'};
            char* end;
            long value = std::strtol(hex, &end, 16);
            if (end == hex + 2) {
                decoded += static_cast<char>(value);
                i += 2;
            } else {
                decoded += encoded[i];
            }
        } else if (encoded[i] == '+') {
            decoded += ' ';
        } else {
            decoded += encoded[i];
        }
    }
    
    return decoded;
}

/**
 * URL encode a string
 * 
 * @param decoded The string to encode
 * @return The URL-encoded string
 */
std::string url_encode(const std::string& decoded) {
    std::ostringstream encoded;
    encoded.fill('0');
    encoded << std::hex;
    
    for (char c : decoded) {
        if (std::isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded << c;
        } else {
            encoded << '%' << std::setw(2) << std::uppercase << static_cast<unsigned char>(c);
        }
    }
    
    return encoded.str();
}

/**
 * Parse query parameters from a URL
 * 
 * @param query The query string
 * @return A map of parameter names to values
 */
std::unordered_map<std::string, std::vector<std::string>> parse_query_params(const std::string& query) {
    std::unordered_map<std::string, std::vector<std::string>> params;
    
    if (query.empty()) {
        return params;
    }
    
    std::istringstream iss(query);
    std::string pair;
    
    while (std::getline(iss, pair, '&')) {
        size_t pos = pair.find('=');
        if (pos != std::string::npos) {
            std::string key = url_decode(pair.substr(0, pos));
            std::string value = url_decode(pair.substr(pos + 1));
            params[key].push_back(value);
        }
    }
    
    return params;
}

/**
 * Get the first value for a parameter, or empty string if not found
 * 
 * @param params The parameters map
 * @param key The parameter name
 * @return The first value, or empty string
 */
std::string get_param(const std::unordered_map<std::string, std::vector<std::string>>& params, const std::string& key) {
    auto it = params.find(key);
    if (it != params.end() && !it->second.empty()) {
        return it->second[0];
    }
    return "";
}

/**
 * Get all values for a parameter
 * 
 * @param params The parameters map
 * @param key The parameter name
 * @return A vector of all values
 */
std::vector<std::string> get_all_params(const std::unordered_map<std::string, std::vector<std::string>>& params, const std::string& key) {
    auto it = params.find(key);
    if (it != params.end()) {
        return it->second;
    }
    return {};
}

std::unique_ptr<PaymentRequest> parse_url(const std::string& url) {
    if (url.empty()) {
        throw std::invalid_argument("URL must be a non-empty string");
    }
    
    // Parse the URL using regex
    std::regex url_regex(R"(^([a-zA-Z][a-zA-Z0-9+.-]*):([^?]+)(?:\?(.*))?$)");
    std::smatch match;
    
    if (!std::regex_match(url, match, url_regex)) {
        throw std::invalid_argument("Invalid URL format");
    }
    
    std::string protocol = match[1].str();
    std::string path = match[2].str();
    std::string query = match[3].str();
    
    // Determine network from protocol
    SVMNetwork network;
    if (protocol == "solana") {
        network = SVMNetwork::SOLANA;
    } else if (protocol == "sonic") {
        network = SVMNetwork::SONIC;
    } else if (protocol == "eclipse") {
        network = SVMNetwork::ECLIPSE;
    } else if (protocol == "soon") {
        network = SVMNetwork::SOON;
    } else {
        throw std::invalid_argument("Unsupported protocol: " + protocol);
    }
    
    // Extract recipient from path
    std::string recipient = path;
    if (recipient.empty()) {
        throw std::invalid_argument("Missing recipient address");
    }
    
    // Remove leading slash if present
    if (recipient[0] == '/') {
        recipient = recipient.substr(1);
    }
    
    if (recipient.empty()) {
        throw std::invalid_argument("Empty recipient address");
    }
    
    // Parse query parameters
    auto params = parse_query_params(query);
    
    // Check if this is a cross-chain transfer request
    if (params.count("source-network") > 0 || params.count("bridge") > 0) {
        std::string amount = get_param(params, "amount");
        std::string token = get_param(params, "token");
        std::string source_network = get_param(params, "source-network");
        
        if (amount.empty()) {
            throw std::invalid_argument("Cross-chain transfer request requires an amount parameter");
        }
        
        if (token.empty()) {
            throw std::invalid_argument("Cross-chain transfer request requires a token parameter");
        }
        
        if (source_network.empty()) {
            throw std::invalid_argument("Cross-chain transfer request requires a source-network parameter");
        }
        
        auto request = std::make_unique<CrossChainTransferRequest>(source_network, network, recipient, amount, token);
        
        // Add optional parameters
        std::string bridge = get_param(params, "bridge");
        if (!bridge.empty()) {
            request->bridge = bridge;
        }
        
        std::string label = get_param(params, "label");
        if (!label.empty()) {
            request->label = label;
        }
        
        std::string message = get_param(params, "message");
        if (!message.empty()) {
            request->message = message;
        }
        
        std::string memo = get_param(params, "memo");
        if (!memo.empty()) {
            request->memo = memo;
        }
        
        // Parse references
        auto references = get_all_params(params, "reference");
        request->references = references;
        
        return std::move(request);
    }
    
    // Check if this is a transaction request
    if (params.count("link") > 0) {
        std::string link = get_param(params, "link");
        
        auto request = std::make_unique<TransactionRequest>(network, recipient, link);
        
        // Add optional parameters
        std::string label = get_param(params, "label");
        if (!label.empty()) {
            request->label = label;
        }
        
        std::string message = get_param(params, "message");
        if (!message.empty()) {
            request->message = message;
        }
        
        std::string memo = get_param(params, "memo");
        if (!memo.empty()) {
            request->memo = memo;
        }
        
        // Parse references
        auto references = get_all_params(params, "reference");
        request->references = references;
        
        return std::move(request);
    } else {
        // This is a transfer request
        std::string amount = get_param(params, "amount");
        if (amount.empty()) {
            throw std::invalid_argument("Transfer request requires an amount parameter");
        }
        
        auto request = std::make_unique<TransferRequest>(network, recipient, amount);
        
        // Add optional parameters
        std::string spl_token = get_param(params, "spl-token");
        if (!spl_token.empty()) {
            request->spl_token = spl_token;
        }
        
        std::string label = get_param(params, "label");
        if (!label.empty()) {
            request->label = label;
        }
        
        std::string message = get_param(params, "message");
        if (!message.empty()) {
            request->message = message;
        }
        
        std::string memo = get_param(params, "memo");
        if (!memo.empty()) {
            request->memo = memo;
        }
        
        // Parse references
        auto references = get_all_params(params, "reference");
        request->references = references;
        
        return std::move(request);
    }
}

std::string create_transfer_url(const TransferRequest& request) {
    std::string network_prefix = network_to_string(request.network);
    std::ostringstream url;
    
    url << network_prefix << ":" << request.recipient;
    
    // Add required parameters
    url << "?amount=" << url_encode(request.amount);
    
    // Add optional parameters
    if (request.spl_token.has_value()) {
        url << "&spl-token=" << url_encode(request.spl_token.value());
    }
    
    if (request.label.has_value()) {
        url << "&label=" << url_encode(request.label.value());
    }
    
    if (request.message.has_value()) {
        url << "&message=" << url_encode(request.message.value());
    }
    
    if (request.memo.has_value()) {
        url << "&memo=" << url_encode(request.memo.value());
    }
    
    // Add references
    for (const auto& reference : request.references) {
        url << "&reference=" << url_encode(reference);
    }
    
    return url.str();
}

std::string create_transaction_url(const TransactionRequest& request) {
    std::string network_prefix = network_to_string(request.network);
    std::ostringstream url;
    
    url << network_prefix << ":" << request.recipient;
    
    // Add required parameters
    url << "?link=" << url_encode(request.link);
    
    // Add optional parameters
    if (request.label.has_value()) {
        url << "&label=" << url_encode(request.label.value());
    }
    
    if (request.message.has_value()) {
        url << "&message=" << url_encode(request.message.value());
    }
    
    if (request.memo.has_value()) {
        url << "&memo=" << url_encode(request.memo.value());
    }
    
    // Add references
    for (const auto& reference : request.references) {
        url << "&reference=" << url_encode(reference);
    }
    
    return url.str();
}

std::string create_cross_chain_url(const CrossChainTransferRequest& request) {
    std::string network_prefix = network_to_string(request.network);
    std::ostringstream url;
    
    url << network_prefix << ":" << request.recipient;
    
    // Add required parameters
    url << "?amount=" << url_encode(request.amount);
    url << "&token=" << url_encode(request.token);
    url << "&source-network=" << url_encode(request.source_network);
    
    // Add optional parameters
    if (request.bridge.has_value()) {
        url << "&bridge=" << url_encode(request.bridge.value());
    }
    
    if (request.label.has_value()) {
        url << "&label=" << url_encode(request.label.value());
    }
    
    if (request.message.has_value()) {
        url << "&message=" << url_encode(request.message.value());
    }
    
    if (request.memo.has_value()) {
        url << "&memo=" << url_encode(request.memo.value());
    }
    
    // Add references
    for (const auto& reference : request.references) {
        url << "&reference=" << url_encode(reference);
    }
    
    return url.str();
}

std::string create_url(const PaymentRequest& request) {
    switch (request.type) {
        case RequestType::TRANSFER:
            return create_transfer_url(static_cast<const TransferRequest&>(request));
        case RequestType::TRANSACTION:
            return create_transaction_url(static_cast<const TransactionRequest&>(request));
        case RequestType::CROSS_CHAIN_TRANSFER:
            return create_cross_chain_url(static_cast<const CrossChainTransferRequest&>(request));
        default:
            throw std::invalid_argument("Unsupported request type");
    }
}

} // namespace svm_pay