#include <gtest/gtest.h>
#include "svm-pay/core/types.hpp"

using namespace svm_pay;

class TypesTest : public ::testing::Test {
protected:
    void SetUp() override {}
    void TearDown() override {}
};

TEST_F(TypesTest, NetworkToString) {
    EXPECT_EQ(network_to_string(SVMNetwork::SOLANA), "solana");
    EXPECT_EQ(network_to_string(SVMNetwork::SONIC), "sonic");
    EXPECT_EQ(network_to_string(SVMNetwork::ECLIPSE), "eclipse");
    EXPECT_EQ(network_to_string(SVMNetwork::SOON), "soon");
}

TEST_F(TypesTest, StringToNetwork) {
    EXPECT_EQ(string_to_network("solana"), SVMNetwork::SOLANA);
    EXPECT_EQ(string_to_network("sonic"), SVMNetwork::SONIC);
    EXPECT_EQ(string_to_network("eclipse"), SVMNetwork::ECLIPSE);
    EXPECT_EQ(string_to_network("soon"), SVMNetwork::SOON);
    
    EXPECT_THROW(string_to_network("invalid"), std::invalid_argument);
}

TEST_F(TypesTest, RequestTypeToString) {
    EXPECT_EQ(request_type_to_string(RequestType::TRANSFER), "transfer");
    EXPECT_EQ(request_type_to_string(RequestType::TRANSACTION), "transaction");
    EXPECT_EQ(request_type_to_string(RequestType::CROSS_CHAIN_TRANSFER), "cross-chain-transfer");
}

TEST_F(TypesTest, StringToRequestType) {
    EXPECT_EQ(string_to_request_type("transfer"), RequestType::TRANSFER);
    EXPECT_EQ(string_to_request_type("transaction"), RequestType::TRANSACTION);
    EXPECT_EQ(string_to_request_type("cross-chain-transfer"), RequestType::CROSS_CHAIN_TRANSFER);
    
    EXPECT_THROW(string_to_request_type("invalid"), std::invalid_argument);
}

TEST_F(TypesTest, PaymentStatusToString) {
    EXPECT_EQ(payment_status_to_string(PaymentStatus::CREATED), "created");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::PENDING), "pending");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::CONFIRMED), "confirmed");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::FAILED), "failed");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::EXPIRED), "expired");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::BRIDGING), "bridging");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::BRIDGE_CONFIRMED), "bridge-confirmed");
    EXPECT_EQ(payment_status_to_string(PaymentStatus::BRIDGE_FAILED), "bridge-failed");
}

TEST_F(TypesTest, StringToPaymentStatus) {
    EXPECT_EQ(string_to_payment_status("created"), PaymentStatus::CREATED);
    EXPECT_EQ(string_to_payment_status("pending"), PaymentStatus::PENDING);
    EXPECT_EQ(string_to_payment_status("confirmed"), PaymentStatus::CONFIRMED);
    EXPECT_EQ(string_to_payment_status("failed"), PaymentStatus::FAILED);
    EXPECT_EQ(string_to_payment_status("expired"), PaymentStatus::EXPIRED);
    EXPECT_EQ(string_to_payment_status("bridging"), PaymentStatus::BRIDGING);
    EXPECT_EQ(string_to_payment_status("bridge-confirmed"), PaymentStatus::BRIDGE_CONFIRMED);
    EXPECT_EQ(string_to_payment_status("bridge-failed"), PaymentStatus::BRIDGE_FAILED);
    
    EXPECT_THROW(string_to_payment_status("invalid"), std::invalid_argument);
}

TEST_F(TypesTest, TransferRequestCreation) {
    TransferRequest request(SVMNetwork::SOLANA, "recipient123", "1.5");
    
    EXPECT_EQ(request.type, RequestType::TRANSFER);
    EXPECT_EQ(request.network, SVMNetwork::SOLANA);
    EXPECT_EQ(request.recipient, "recipient123");
    EXPECT_EQ(request.amount, "1.5");
    EXPECT_FALSE(request.spl_token.has_value());
    EXPECT_FALSE(request.label.has_value());
    EXPECT_FALSE(request.message.has_value());
    EXPECT_FALSE(request.memo.has_value());
    EXPECT_TRUE(request.references.empty());
}

TEST_F(TypesTest, TransactionRequestCreation) {
    TransactionRequest request(SVMNetwork::SOLANA, "recipient123", "https://example.com/tx");
    
    EXPECT_EQ(request.type, RequestType::TRANSACTION);
    EXPECT_EQ(request.network, SVMNetwork::SOLANA);
    EXPECT_EQ(request.recipient, "recipient123");
    EXPECT_EQ(request.link, "https://example.com/tx");
    EXPECT_FALSE(request.label.has_value());
    EXPECT_FALSE(request.message.has_value());
    EXPECT_FALSE(request.memo.has_value());
    EXPECT_TRUE(request.references.empty());
}

TEST_F(TypesTest, CrossChainTransferRequestCreation) {
    CrossChainTransferRequest request("ethereum", SVMNetwork::SOLANA, "recipient123", "100", "USDC");
    
    EXPECT_EQ(request.type, RequestType::CROSS_CHAIN_TRANSFER);
    EXPECT_EQ(request.network, SVMNetwork::SOLANA);
    EXPECT_EQ(request.recipient, "recipient123");
    EXPECT_EQ(request.source_network, "ethereum");
    EXPECT_EQ(request.amount, "100");
    EXPECT_EQ(request.token, "USDC");
    EXPECT_FALSE(request.bridge.has_value());
    EXPECT_FALSE(request.label.has_value());
    EXPECT_FALSE(request.message.has_value());
    EXPECT_FALSE(request.memo.has_value());
    EXPECT_TRUE(request.references.empty());
}