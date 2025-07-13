#include <iostream>
#include <svm-pay/svm_pay.hpp>

using namespace svm_pay;

int main() {
    std::cout << "SVM-Pay C++ SDK - Basic Payment Example\n";
    std::cout << "========================================\n\n";
    
    try {
        // Initialize the SDK
        initialize_sdk();
        
        // Create a client
        Client client(SVMNetwork::SOLANA);
        
        std::cout << "1. Creating a transfer URL...\n";
        
        // Create a simple transfer URL
        std::string recipient = "7v91N7iZ9eyTktBwWC2ckrjdLhvmS4R1HqvYZzG5FGvn";
        std::string amount = "1.5";
        
        std::unordered_map<std::string, std::string> options = {
            {"label", "Coffee Shop"},
            {"message", "Payment for coffee and pastry"},
            {"memo", "Order #12345"}
        };
        
        std::string payment_url = client.create_transfer_url(recipient, amount, options);
        std::cout << "   Payment URL: " << payment_url << "\n\n";
        
        std::cout << "2. Parsing the payment URL...\n";
        
        // Parse the URL back
        auto request = client.parse_url(payment_url);
        
        std::cout << "   Request type: " << request_type_to_string(request->type) << "\n";
        std::cout << "   Network: " << network_to_string(request->network) << "\n";
        std::cout << "   Recipient: " << request->recipient << "\n";
        
        if (request->label.has_value()) {
            std::cout << "   Label: " << request->label.value() << "\n";
        }
        
        if (request->message.has_value()) {
            std::cout << "   Message: " << request->message.value() << "\n";
        }
        
        if (request->memo.has_value()) {
            std::cout << "   Memo: " << request->memo.value() << "\n";
        }
        
        // Cast to TransferRequest to access amount
        if (request->type == RequestType::TRANSFER) {
            auto transfer_request = dynamic_cast<TransferRequest*>(request.get());
            if (transfer_request) {
                std::cout << "   Amount: " << transfer_request->amount << "\n";
            }
        }
        
        std::cout << "\n3. Generating reference IDs...\n";
        
        // Generate reference IDs
        for (int i = 0; i < 3; ++i) {
            std::string ref = client.generate_reference();
            std::cout << "   Reference " << (i + 1) << ": " << ref << "\n";
        }
        
        std::cout << "\n4. Creating a transaction URL...\n";
        
        // Create a transaction URL
        std::string transaction_link = "https://api.example.com/transaction";
        std::unordered_map<std::string, std::string> tx_options = {
            {"label", "NFT Marketplace"},
            {"message", "Purchase NFT #42"}
        };
        
        std::string transaction_url = client.create_transaction_url(recipient, transaction_link, tx_options);
        std::cout << "   Transaction URL: " << transaction_url << "\n\n";
        
        std::cout << "5. Working with different networks...\n";
        
        // Create URLs for different networks
        std::vector<SVMNetwork> networks = {SVMNetwork::SOLANA, SVMNetwork::SONIC, SVMNetwork::ECLIPSE, SVMNetwork::SOON};
        
        for (auto network : networks) {
            std::unordered_map<std::string, std::string> net_options = {
                {"network", network_to_string(network)}
            };
            
            std::string url = client.create_transfer_url(recipient, "2.0", net_options);
            std::cout << "   " << network_to_string(network) << ": " << url << "\n";
        }
        
        std::cout << "\nExample completed successfully!\n";
        
        // Cleanup
        cleanup_sdk();
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}