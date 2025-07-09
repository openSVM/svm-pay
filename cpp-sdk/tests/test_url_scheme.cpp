#include <gtest/gtest.h>
#include "svm-pay/core/url_scheme.hpp"

using namespace svm_pay;

class UrlSchemeTest : public ::testing::Test {
protected:
    void SetUp() override {}
    void TearDown() override {}
};

TEST_F(UrlSchemeTest, ParseTransferUrl) {
    std::string url = "solana:recipient123?amount=1.5&label=Test%20Payment&message=Hello%20World";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->type, RequestType::TRANSFER);
    EXPECT_EQ(request->network, SVMNetwork::SOLANA);
    EXPECT_EQ(request->recipient, "recipient123");
    
    auto transfer_request = dynamic_cast<TransferRequest*>(request.get());
    ASSERT_NE(transfer_request, nullptr);
    
    EXPECT_EQ(transfer_request->amount, "1.5");
    EXPECT_EQ(transfer_request->label.value_or(""), "Test Payment");
    EXPECT_EQ(transfer_request->message.value_or(""), "Hello World");
}

TEST_F(UrlSchemeTest, ParseTransactionUrl) {
    std::string url = "solana:recipient123?link=https://example.com/tx&label=Test%20Transaction";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->type, RequestType::TRANSACTION);
    EXPECT_EQ(request->network, SVMNetwork::SOLANA);
    EXPECT_EQ(request->recipient, "recipient123");
    
    auto transaction_request = dynamic_cast<TransactionRequest*>(request.get());
    ASSERT_NE(transaction_request, nullptr);
    
    EXPECT_EQ(transaction_request->link, "https://example.com/tx");
    EXPECT_EQ(transaction_request->label.value_or(""), "Test Transaction");
}

TEST_F(UrlSchemeTest, ParseCrossChainUrl) {
    std::string url = "solana:recipient123?amount=100&token=USDC&source-network=ethereum&bridge=wormhole";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->type, RequestType::CROSS_CHAIN_TRANSFER);
    EXPECT_EQ(request->network, SVMNetwork::SOLANA);
    EXPECT_EQ(request->recipient, "recipient123");
    
    auto cross_chain_request = dynamic_cast<CrossChainTransferRequest*>(request.get());
    ASSERT_NE(cross_chain_request, nullptr);
    
    EXPECT_EQ(cross_chain_request->amount, "100");
    EXPECT_EQ(cross_chain_request->token, "USDC");
    EXPECT_EQ(cross_chain_request->source_network, "ethereum");
    EXPECT_EQ(cross_chain_request->bridge.value_or(""), "wormhole");
}

TEST_F(UrlSchemeTest, ParseUrlWithReferences) {
    std::string url = "solana:recipient123?amount=1.5&reference=ref1&reference=ref2";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->references.size(), 2);
    EXPECT_EQ(request->references[0], "ref1");
    EXPECT_EQ(request->references[1], "ref2");
}

TEST_F(UrlSchemeTest, ParseUrlWithSplToken) {
    std::string url = "solana:recipient123?amount=1.5&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    auto transfer_request = dynamic_cast<TransferRequest*>(request.get());
    ASSERT_NE(transfer_request, nullptr);
    
    EXPECT_EQ(transfer_request->spl_token.value_or(""), "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
}

TEST_F(UrlSchemeTest, ParseUrlWithMemo) {
    std::string url = "solana:recipient123?amount=1.5&memo=Test%20Memo";
    
    auto request = parse_url(url);
    ASSERT_NE(request, nullptr);
    
    EXPECT_EQ(request->memo.value_or(""), "Test Memo");
}

TEST_F(UrlSchemeTest, ParseInvalidUrl) {
    EXPECT_THROW(parse_url(""), std::invalid_argument);
    EXPECT_THROW(parse_url("invalid"), std::invalid_argument);
    EXPECT_THROW(parse_url("solana:"), std::invalid_argument);
    EXPECT_THROW(parse_url("solana:recipient123"), std::invalid_argument); // Missing amount
}

TEST_F(UrlSchemeTest, ParseUnsupportedNetwork) {
    EXPECT_THROW(parse_url("bitcoin:recipient123?amount=1.5"), std::invalid_argument);
}

TEST_F(UrlSchemeTest, CreateTransferUrl) {
    TransferRequest request(SVMNetwork::SOLANA, "recipient123", "1.5");
    request.label = "Test Payment";
    request.message = "Hello World";
    request.references = {"ref1", "ref2"};
    
    std::string url = create_transfer_url(request);
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("amount=1.5"), std::string::npos);
    EXPECT_NE(url.find("label=Test%20Payment"), std::string::npos);
    EXPECT_NE(url.find("message=Hello%20World"), std::string::npos);
    EXPECT_NE(url.find("reference=ref1"), std::string::npos);
    EXPECT_NE(url.find("reference=ref2"), std::string::npos);
}

TEST_F(UrlSchemeTest, CreateTransactionUrl) {
    TransactionRequest request(SVMNetwork::SOLANA, "recipient123", "https://example.com/tx");
    request.label = "Test Transaction";
    
    std::string url = create_transaction_url(request);
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("link=https%3A%2F%2Fexample.com%2Ftx"), std::string::npos);
    EXPECT_NE(url.find("label=Test%20Transaction"), std::string::npos);
}

TEST_F(UrlSchemeTest, CreateCrossChainUrl) {
    CrossChainTransferRequest request("ethereum", SVMNetwork::SOLANA, "recipient123", "100", "USDC");
    request.bridge = "wormhole";
    
    std::string url = create_cross_chain_url(request);
    
    EXPECT_NE(url.find("solana:recipient123"), std::string::npos);
    EXPECT_NE(url.find("amount=100"), std::string::npos);
    EXPECT_NE(url.find("token=USDC"), std::string::npos);
    EXPECT_NE(url.find("source-network=ethereum"), std::string::npos);
    EXPECT_NE(url.find("bridge=wormhole"), std::string::npos);
}

TEST_F(UrlSchemeTest, RoundTripTransferUrl) {
    TransferRequest original(SVMNetwork::SOLANA, "recipient123", "1.5");
    original.label = "Test Payment";
    original.message = "Hello World";
    original.spl_token = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    original.memo = "Test Memo";
    original.references = {"ref1", "ref2"};
    
    std::string url = create_transfer_url(original);
    auto parsed = parse_url(url);
    
    ASSERT_NE(parsed, nullptr);
    auto parsed_transfer = dynamic_cast<TransferRequest*>(parsed.get());
    ASSERT_NE(parsed_transfer, nullptr);
    
    EXPECT_EQ(parsed_transfer->network, original.network);
    EXPECT_EQ(parsed_transfer->recipient, original.recipient);
    EXPECT_EQ(parsed_transfer->amount, original.amount);
    EXPECT_EQ(parsed_transfer->label.value_or(""), original.label.value_or(""));
    EXPECT_EQ(parsed_transfer->message.value_or(""), original.message.value_or(""));
    EXPECT_EQ(parsed_transfer->spl_token.value_or(""), original.spl_token.value_or(""));
    EXPECT_EQ(parsed_transfer->memo.value_or(""), original.memo.value_or(""));
    EXPECT_EQ(parsed_transfer->references.size(), original.references.size());
    for (size_t i = 0; i < original.references.size(); ++i) {
        EXPECT_EQ(parsed_transfer->references[i], original.references[i]);
    }
}