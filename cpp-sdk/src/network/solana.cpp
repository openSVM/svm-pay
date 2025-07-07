#include "svm-pay/network/solana.hpp"
#include <curl/curl.h>
#include <stdexcept>
#include <regex>
#include <sstream>
#include <future>

namespace svm_pay {

// Callback for curl to write response data
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* response) {
    size_t totalSize = size * nmemb;
    response->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}

SolanaNetworkAdapter::SolanaNetworkAdapter(const std::string& rpc_url)
    : NetworkAdapter(SVMNetwork::SOLANA), rpc_url_(rpc_url) {
    
    // Initialize curl
    curl_global_init(CURL_GLOBAL_DEFAULT);
}

void SolanaNetworkAdapter::set_rpc_url(const std::string& rpc_url) {
    rpc_url_ = rpc_url;
}

const std::string& SolanaNetworkAdapter::get_rpc_url() const {
    return rpc_url_;
}

bool SolanaNetworkAdapter::validate_address(const std::string& address) const {
    // Solana addresses are 32-44 characters long and base58 encoded
    if (address.length() < 32 || address.length() > 44) {
        return false;
    }
    
    // Check if all characters are valid base58
    const std::string base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return std::all_of(address.begin(), address.end(), [&](char c) {
        return base58_chars.find(c) != std::string::npos;
    });
}

std::future<std::string> SolanaNetworkAdapter::make_rpc_call(const std::string& method, const std::string& params) {
    return std::async(std::launch::async, [this, method, params]() -> std::string {
        CURL* curl = curl_easy_init();
        if (!curl) {
            throw std::runtime_error("Failed to initialize curl");
        }
        
        std::string response;
        std::string json_data = R"({"jsonrpc":"2.0","id":1,"method":")" + method + R"(","params":)" + params + "}";
        
        // Set curl options
        curl_easy_setopt(curl, CURLOPT_URL, rpc_url_.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        
        // Set headers
        struct curl_slist* headers = nullptr;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        
        // Perform the request
        CURLcode res = curl_easy_perform(curl);
        
        // Cleanup
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
        
        if (res != CURLE_OK) {
            throw std::runtime_error("curl_easy_perform() failed: " + std::string(curl_easy_strerror(res)));
        }
        
        return response;
    });
}

std::future<std::string> SolanaNetworkAdapter::create_transfer_transaction(const TransferRequest& request) {
    return std::async(std::launch::async, [this, request]() -> std::string {
        if (!validate_address(request.recipient)) {
            throw std::invalid_argument("Invalid recipient address");
        }
        
        // For now, return a placeholder transaction
        // In a real implementation, this would create a proper Solana transaction
        std::ostringstream transaction;
        transaction << "{"
                   << "\"type\":\"transfer\","
                   << "\"recipient\":\"" << request.recipient << "\","
                   << "\"amount\":\"" << request.amount << "\"";
        
        if (request.spl_token.has_value()) {
            transaction << ",\"spl_token\":\"" << request.spl_token.value() << "\"";
        }
        
        if (request.memo.has_value()) {
            transaction << ",\"memo\":\"" << request.memo.value() << "\"";
        }
        
        transaction << "}";
        
        return transaction.str();
    });
}

std::future<std::string> SolanaNetworkAdapter::fetch_transaction(const TransactionRequest& request) {
    return std::async(std::launch::async, [this, request]() -> std::string {
        if (!validate_address(request.recipient)) {
            throw std::invalid_argument("Invalid recipient address");
        }
        
        // Make HTTP request to fetch transaction from the link
        CURL* curl = curl_easy_init();
        if (!curl) {
            throw std::runtime_error("Failed to initialize curl");
        }
        
        std::string response;
        
        curl_easy_setopt(curl, CURLOPT_URL, request.link.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        
        if (res != CURLE_OK) {
            throw std::runtime_error("Failed to fetch transaction: " + std::string(curl_easy_strerror(res)));
        }
        
        return response;
    });
}

std::future<std::string> SolanaNetworkAdapter::submit_transaction(const std::string& transaction, const std::string& signature) {
    return std::async(std::launch::async, [this, transaction, signature]() -> std::string {
        // Create RPC call to submit transaction
        std::string params = "[\"" + transaction + "\"]";
        
        auto response_future = make_rpc_call("sendTransaction", params);
        std::string response = response_future.get();
        
        // Parse response to extract transaction signature
        // This is a simplified parser - in a real implementation, use a proper JSON library
        std::regex sig_regex(R"("result"\s*:\s*"([^"]+)")");
        std::smatch match;
        
        if (std::regex_search(response, match, sig_regex)) {
            return match[1].str();
        }
        
        throw std::runtime_error("Failed to parse transaction signature from response");
    });
}

std::future<PaymentStatus> SolanaNetworkAdapter::check_transaction_status(const std::string& signature) {
    return std::async(std::launch::async, [this, signature]() -> PaymentStatus {
        // Create RPC call to check transaction status
        std::string params = "[\"" + signature + "\"]";
        
        auto response_future = make_rpc_call("getSignatureStatus", params);
        std::string response = response_future.get();
        
        // Parse response to determine status
        // This is a simplified parser - in a real implementation, use a proper JSON library
        if (response.find("\"confirmationStatus\":\"confirmed\"") != std::string::npos) {
            return PaymentStatus::CONFIRMED;
        } else if (response.find("\"confirmationStatus\":\"processed\"") != std::string::npos) {
            return PaymentStatus::PENDING;
        } else if (response.find("\"err\":") != std::string::npos) {
            return PaymentStatus::FAILED;
        } else {
            return PaymentStatus::PENDING;
        }
    });
}

} // namespace svm_pay