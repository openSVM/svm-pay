#include "svm-pay/svm_pay.hpp"
#include "svm-pay/network/solana.hpp"
#include <iostream>

namespace svm_pay {

void initialize_sdk(const std::unordered_map<std::string, std::string>& options) {
    // Register default network adapters
    
    // Solana adapter with configurable RPC URL
    std::string solana_rpc = "https://api.mainnet-beta.solana.com";
    auto solana_rpc_it = options.find("solana_rpc_url");
    if (solana_rpc_it != options.end()) {
        solana_rpc = solana_rpc_it->second;
    }
    
    auto solana_adapter = std::make_unique<SolanaNetworkAdapter>(solana_rpc);
    NetworkAdapterFactory::register_adapter(SVMNetwork::SOLANA, std::move(solana_adapter));
    
    // TODO: Register other network adapters when implemented
    // auto sonic_adapter = std::make_unique<SonicNetworkAdapter>();
    // NetworkAdapterFactory::register_adapter(SVMNetwork::SONIC, std::move(sonic_adapter));
    
    // auto eclipse_adapter = std::make_unique<EclipseNetworkAdapter>();
    // NetworkAdapterFactory::register_adapter(SVMNetwork::ECLIPSE, std::move(eclipse_adapter));
    
    // auto soon_adapter = std::make_unique<SoonNetworkAdapter>();
    // NetworkAdapterFactory::register_adapter(SVMNetwork::SOON, std::move(soon_adapter));
    
    // Debug output if enabled
    auto debug_it = options.find("debug");
    if (debug_it != options.end() && debug_it->second == "true") {
        std::cout << "SVM-Pay SDK initialized with options:\n";
        for (const auto& option : options) {
            std::cout << "  " << option.first << ": " << option.second << "\n";
        }
    }
}

void cleanup_sdk() {
    // Currently, the NetworkAdapterFactory handles cleanup automatically
    // when the static map is destroyed. Future versions might need explicit cleanup.
}

} // namespace svm_pay