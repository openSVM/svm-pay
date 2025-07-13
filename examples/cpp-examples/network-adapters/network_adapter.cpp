#include <iostream>
#include <thread>
#include <chrono>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    std::cout << "SVM-Pay C++ SDK - Network Adapter Example\n";
    std::cout << "==========================================\n\n";
    
    try {
        // Initialize the SDK
        initialize_sdk();
        
        // Create a client
        Client client;
        
        std::cout << "1. Checking available network adapters...\n";
        
        // Check for Solana adapter
        NetworkAdapter* solana_adapter = client.get_adapter(SVMNetwork::SOLANA);
        if (solana_adapter) {
            std::cout << "   ✓ Solana adapter available\n";
            std::cout << "   Network: " << network_to_string(solana_adapter->get_network()) << "\n";
        } else {
            std::cout << "   ✗ Solana adapter not available\n";
        }
        
        // Check for other adapters
        std::vector<SVMNetwork> networks = {SVMNetwork::SONIC, SVMNetwork::ECLIPSE, SVMNetwork::SOON};
        for (auto network : networks) {
            NetworkAdapter* adapter = client.get_adapter(network);
            if (adapter) {
                std::cout << "   ✓ " << network_to_string(network) << " adapter available\n";
            } else {
                std::cout << "   ✗ " << network_to_string(network) << " adapter not available\n";
            }
        }
        
        std::cout << "\n2. Creating a transfer transaction...\n";
        
        if (solana_adapter) {
            TransferRequest transfer_request(
                SVMNetwork::SOLANA,
                "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
                "1.5"
            );
            transfer_request.label = "Test Payment";
            transfer_request.memo = "SDK Example";
            
            std::cout << "   Creating transfer transaction...\n";
            
            try {
                auto transaction_future = solana_adapter->create_transfer_transaction(transfer_request);
                
                std::cout << "   Waiting for transaction creation...\n";
                
                // Wait for the transaction to be created (with timeout)
                auto status = transaction_future.wait_for(std::chrono::seconds(10));
                
                if (status == std::future_status::ready) {
                    std::string transaction = transaction_future.get();
                    std::cout << "   ✓ Transaction created successfully\n";
                    std::cout << "   Transaction data: " << transaction << "\n";
                } else {
                    std::cout << "   ⚠ Transaction creation timed out\n";
                }
                
            } catch (const std::exception& e) {
                std::cout << "   ✗ Transaction creation failed: " << e.what() << "\n";
            }
        }
        
        std::cout << "\n3. Fetching a transaction...\n";
        
        if (solana_adapter) {
            TransactionRequest transaction_request(
                SVMNetwork::SOLANA,
                "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn",
                "https://httpbin.org/json"  // Using httpbin for demo
            );
            
            std::cout << "   Fetching transaction from: " << transaction_request.link << "\n";
            
            try {
                auto fetch_future = solana_adapter->fetch_transaction(transaction_request);
                
                std::cout << "   Waiting for transaction fetch...\n";
                
                // Wait for the transaction to be fetched (with timeout)
                auto status = fetch_future.wait_for(std::chrono::seconds(10));
                
                if (status == std::future_status::ready) {
                    std::string transaction = fetch_future.get();
                    std::cout << "   ✓ Transaction fetched successfully\n";
                    std::cout << "   Transaction data (first 200 chars): " 
                              << transaction.substr(0, 200) << "...\n";
                } else {
                    std::cout << "   ⚠ Transaction fetch timed out\n";
                }
                
            } catch (const std::exception& e) {
                std::cout << "   ✗ Transaction fetch failed: " << e.what() << "\n";
            }
        }
        
        std::cout << "\n4. Checking transaction status...\n";
        
        if (solana_adapter) {
            // Use a mock transaction signature for demonstration
            std::string mock_signature = "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
            
            std::cout << "   Checking status of signature: " << mock_signature << "\n";
            
            try {
                auto status_future = solana_adapter->check_transaction_status(mock_signature);
                
                std::cout << "   Waiting for status check...\n";
                
                // Wait for the status check (with timeout)
                auto future_status = status_future.wait_for(std::chrono::seconds(10));
                
                if (future_status == std::future_status::ready) {
                    PaymentStatus status = status_future.get();
                    std::cout << "   ✓ Status check completed\n";
                    std::cout << "   Status: " << payment_status_to_string(status) << "\n";
                } else {
                    std::cout << "   ⚠ Status check timed out\n";
                }
                
            } catch (const std::exception& e) {
                std::cout << "   ✗ Status check failed: " << e.what() << "\n";
            }
        }
        
        std::cout << "\n5. Demonstrating error handling...\n";
        
        if (solana_adapter) {
            // Test with invalid recipient address
            TransferRequest invalid_request(
                SVMNetwork::SOLANA,
                "invalid-address",
                "1.0"
            );
            
            std::cout << "   Testing with invalid recipient address...\n";
            
            try {
                auto transaction_future = solana_adapter->create_transfer_transaction(invalid_request);
                auto status = transaction_future.wait_for(std::chrono::seconds(5));
                
                if (status == std::future_status::ready) {
                    std::string transaction = transaction_future.get();
                    std::cout << "   ⚠ Unexpectedly succeeded with invalid address\n";
                } else {
                    std::cout << "   ⚠ Request timed out\n";
                }
                
            } catch (const std::exception& e) {
                std::cout << "   ✓ Expected error caught: " << e.what() << "\n";
            }
        }
        
        std::cout << "\nNetwork adapter example completed!\n";
        
        // Cleanup
        cleanup_sdk();
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}