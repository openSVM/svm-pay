#include <gtest/gtest.h>
#include "svm-pay/client.hpp"

using namespace svm_pay;

class ClientTest : public ::testing::Test {
protected:
    void SetUp() override {
        client = std::make_unique<Client>(SVMNetwork::SOLANA);
    }
    
    void TearDown() override {
        client.reset();
    }
    
    std::unique_ptr<Client> client;
};

TEST_F(ClientTest, DefaultNetwork) {
    EXPECT_EQ(client->get_default_network(), SVMNetwork::SOLANA);
    
    client->set_default_network(SVMNetwork::SONIC);
    EXPECT_EQ(client->get_default_network(), SVMNetwork::SONIC);
}

TEST_F(ClientTest, DebugMode) {
    EXPECT_FALSE(client->is_debug_enabled());
    
    client->set_debug_enabled(true);
    EXPECT_TRUE(client->is_debug_enabled());
    
    client->set_debug_enabled(false);
    EXPECT_FALSE(client->is_debug_enabled());
}

TEST_F(ClientTest, GenerateReference) {
    std::string ref1 = client->generate_reference();
    std::string ref2 = client->generate_reference();
    
    EXPECT_FALSE(ref1.empty());
    EXPECT_FALSE(ref2.empty());
    EXPECT_NE(ref1, ref2);
    
    std::string ref3 = client->generate_reference(16);
    EXPECT_FALSE(ref3.empty());
}

TEST_F(ClientTest, CreateTransferUrl) {
    std::string url = client->create_transfer_url("recipient123", "1.5");
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("amount=1.5"), std::string::npos);
}

TEST_F(ClientTest, CreateTransferUrlWithOptions) {
    std::unordered_map<std::string, std::string> options = {
        {"label", "Test Payment"},
        {"message", "Hello World"},
        {"memo", "Test Memo"},
        {"spl-token", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},
        {"reference", "ref123"}
    };
    
    std::string url = client->create_transfer_url("recipient123", "1.5", options);
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("amount=1.5"), std::string::npos);
    EXPECT_NE(url.find("label=Test%20Payment"), std::string::npos);
    EXPECT_NE(url.find("message=Hello%20World"), std::string::npos);
    EXPECT_NE(url.find("memo=Test%20Memo"), std::string::npos);
    EXPECT_NE(url.find("spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), std::string::npos);
    EXPECT_NE(url.find("reference=ref123"), std::string::npos);
}

TEST_F(ClientTest, CreateTransferUrlWithDifferentNetwork) {
    std::unordered_map<std::string, std::string> options = {
        {"network", "sonic"}
    };
    
    std::string url = client->create_transfer_url("recipient123", "1.5", options);
    
    EXPECT_NE(url.find("sonic:recipient123"), std::string::npos);
    EXPECT_NE(url.find("amount=1.5"), std::string::npos);
}

TEST_F(ClientTest, CreateTransactionUrl) {
    std::string url = client->create_transaction_url("recipient123", "https://example.com/tx");
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("link=https%3A%2F%2Fexample.com%2Ftx"), std::string::npos);
}

TEST_F(ClientTest, CreateTransactionUrlWithOptions) {
    std::unordered_map<std::string, std::string> options = {
        {"label", "Test Transaction"},
        {"message", "Hello World"},
        {"memo", "Test Memo"},
        {"reference", "ref123"}
    };
    
    std::string url = client->create_transaction_url("recipient123", "https://example.com/tx", options);
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("link=https%3A%2F%2Fexample.com%2Ftx"), std::string::npos);
    EXPECT_NE(url.find("label=Test%20Transaction"), std::string::npos);
    EXPECT_NE(url.find("message=Hello%20World"), std::string::npos);
    EXPECT_NE(url.find("memo=Test%20Memo"), std::string::npos);
    EXPECT_NE(url.find("reference=ref123"), std::string::npos);
}

TEST_F(ClientTest, ParseUrl) {
    std::string url = "solana:recipient123?amount=1.5&label=Test%20Payment";
    
    auto request = client->parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->type, RequestType::TRANSFER);
    EXPECT_EQ(request->network, SVMNetwork::SOLANA);
    EXPECT_EQ(request->recipient, "recipient123");
    
    auto transfer_request = dynamic_cast<TransferRequest*>(request.get());
    ASSERT_NE(transfer_request, nullptr);
    
    EXPECT_EQ(transfer_request->amount, "1.5");
    EXPECT_EQ(transfer_request->label.value_or(""), "Test Payment");
}

TEST_F(ClientTest, HasSolanaAdapter) {
    // The client should have a Solana adapter registered by default
    NetworkAdapter* adapter = client->get_adapter(SVMNetwork::SOLANA);
    EXPECT_NE(adapter, nullptr);
    EXPECT_EQ(adapter->get_network(), SVMNetwork::SOLANA);
}

TEST_F(ClientTest, MultipleReferences) {
    std::unordered_map<std::string, std::string> options = {
        {"reference", "ref1"},
        {"reference1", "ref2"},
        {"reference2", "ref3"}
    };
    
    std::string url = client->create_transfer_url("recipient123", "1.5", options);
    
    EXPECT_NE(url.find("reference=ref1"), std::string::npos);
    EXPECT_NE(url.find("reference=ref2"), std::string::npos);
    EXPECT_NE(url.find("reference=ref3"), std::string::npos);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}