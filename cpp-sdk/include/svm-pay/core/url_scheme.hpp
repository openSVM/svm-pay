#pragma once

#include "types.hpp"
#include <string>
#include <memory>

namespace svm_pay {

/**
 * Parse a payment URL into a PaymentRequest object
 * 
 * @param url The payment URL to parse
 * @return A unique pointer to a PaymentRequest object
 * @throws std::invalid_argument if the URL is invalid
 */
std::unique_ptr<PaymentRequest> parse_url(const std::string& url);

/**
 * Create a payment URL from a TransferRequest
 * 
 * @param request The TransferRequest to convert to a URL
 * @return A payment URL string
 */
std::string create_transfer_url(const TransferRequest& request);

/**
 * Create a payment URL from a TransactionRequest
 * 
 * @param request The TransactionRequest to convert to a URL
 * @return A payment URL string
 */
std::string create_transaction_url(const TransactionRequest& request);

/**
 * Create a payment URL from a CrossChainTransferRequest
 * 
 * @param request The CrossChainTransferRequest to convert to a URL
 * @return A payment URL string
 */
std::string create_cross_chain_url(const CrossChainTransferRequest& request);

/**
 * Create a payment URL from any PaymentRequest
 * 
 * @param request The PaymentRequest to convert to a URL
 * @return A payment URL string
 */
std::string create_url(const PaymentRequest& request);

} // namespace svm_pay