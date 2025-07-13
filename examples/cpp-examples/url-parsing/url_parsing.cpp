#include <iostream>
#include <vector>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    std::cout << "SVM-Pay C++ SDK - URL Parsing Example\n";
    std::cout << "=====================================\n\n";
    
    try {
        // Initialize the SDK
        initialize_sdk();
        
        // Create a client
        Client client;
        
        // Test URLs for different types of requests
        std::vector<std::string> test_urls = {
            // Transfer request
            "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=1.5&label=Coffee%20Shop&message=Payment%20for%20coffee",
            
            // Transfer with SPL token
            "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=100&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&label=USDC%20Payment",
            
            // Transaction request
            "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?link=https://api.example.com/transaction&label=NFT%20Purchase",
            
            // Cross-chain transfer
            "solana:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=50&token=USDC&source-network=ethereum&bridge=wormhole",
            
            // URL with multiple references
            "sonic:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=2.0&reference=ref1&reference=ref2&memo=Sonic%20payment",
            
            // Eclipse network
            "eclipse:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=0.5&label=Eclipse%20Test",
            
            // Soon network
            "soon:7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn?amount=10&message=Soon%20network%20payment"
        };
        
        for (size_t i = 0; i < test_urls.size(); ++i) {
            std::cout << "Example " << (i + 1) << ":\n";
            std::cout << "URL: " << test_urls[i] << "\n";
            
            try {
                auto request = client.parse_url(test_urls[i]);
                
                std::cout << "Parsed successfully:\n";
                std::cout << "  Type: " << request_type_to_string(request->type) << "\n";
                std::cout << "  Network: " << network_to_string(request->network) << "\n";
                std::cout << "  Recipient: " << request->recipient << "\n";
                
                if (request->label.has_value()) {
                    std::cout << "  Label: " << request->label.value() << "\n";
                }
                
                if (request->message.has_value()) {
                    std::cout << "  Message: " << request->message.value() << "\n";
                }
                
                if (request->memo.has_value()) {
                    std::cout << "  Memo: " << request->memo.value() << "\n";
                }
                
                if (!request->references.empty()) {
                    std::cout << "  References: ";
                    for (size_t j = 0; j < request->references.size(); ++j) {
                        std::cout << request->references[j];
                        if (j < request->references.size() - 1) {
                            std::cout << ", ";
                        }
                    }
                    std::cout << "\n";
                }
                
                // Type-specific information
                switch (request->type) {
                    case RequestType::TRANSFER: {
                        auto transfer_request = dynamic_cast<TransferRequest*>(request.get());
                        if (transfer_request) {
                            std::cout << "  Amount: " << transfer_request->amount << "\n";
                            if (transfer_request->spl_token.has_value()) {
                                std::cout << "  SPL Token: " << transfer_request->spl_token.value() << "\n";
                            }
                        }
                        break;
                    }
                    case RequestType::TRANSACTION: {
                        auto transaction_request = dynamic_cast<TransactionRequest*>(request.get());
                        if (transaction_request) {
                            std::cout << "  Link: " << transaction_request->link << "\n";
                        }
                        break;
                    }
                    case RequestType::CROSS_CHAIN_TRANSFER: {
                        auto cross_chain_request = dynamic_cast<CrossChainTransferRequest*>(request.get());
                        if (cross_chain_request) {
                            std::cout << "  Amount: " << cross_chain_request->amount << "\n";
                            std::cout << "  Token: " << cross_chain_request->token << "\n";
                            std::cout << "  Source Network: " << cross_chain_request->source_network << "\n";
                            if (cross_chain_request->bridge.has_value()) {
                                std::cout << "  Bridge: " << cross_chain_request->bridge.value() << "\n";
                            }
                        }
                        break;
                    }
                }
                
                // Test round-trip: create URL from parsed request
                std::string recreated_url = create_url(*request);
                std::cout << "  Recreated URL: " << recreated_url << "\n";
                
            } catch (const std::exception& e) {
                std::cout << "Failed to parse: " << e.what() << "\n";
            }
            
            std::cout << "\n";
        }
        
        std::cout << "Testing invalid URLs:\n";
        
        std::vector<std::string> invalid_urls = {
            "",
            "invalid",
            "bitcoin:address?amount=1.0",  // Unsupported network
            "solana:",                     // No recipient
            "solana:recipient",            // No amount for transfer
            "solana:recipient?link=",      // Empty link for transaction
        };
        
        for (const auto& invalid_url : invalid_urls) {
            std::cout << "Testing: " << (invalid_url.empty() ? "(empty string)" : invalid_url) << "\n";
            try {
                auto request = client.parse_url(invalid_url);
                std::cout << "  Unexpectedly succeeded!\n";
            } catch (const std::exception& e) {
                std::cout << "  Expected error: " << e.what() << "\n";
            }
        }
        
        std::cout << "\nURL parsing example completed!\n";
        
        // Cleanup
        cleanup_sdk();
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}