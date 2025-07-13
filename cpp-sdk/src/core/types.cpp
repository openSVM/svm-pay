#include "svm-pay/core/types.hpp"
#include <stdexcept>

namespace svm_pay {

std::string network_to_string(SVMNetwork network) {
    switch (network) {
        case SVMNetwork::SOLANA:
            return "solana";
        case SVMNetwork::SONIC:
            return "sonic";
        case SVMNetwork::ECLIPSE:
            return "eclipse";
        case SVMNetwork::SOON:
            return "soon";
        default:
            throw std::invalid_argument("Unknown network");
    }
}

SVMNetwork string_to_network(const std::string& network) {
    if (network == "solana") {
        return SVMNetwork::SOLANA;
    } else if (network == "sonic") {
        return SVMNetwork::SONIC;
    } else if (network == "eclipse") {
        return SVMNetwork::ECLIPSE;
    } else if (network == "soon") {
        return SVMNetwork::SOON;
    } else {
        throw std::invalid_argument("Unknown network: " + network);
    }
}

std::string request_type_to_string(RequestType type) {
    switch (type) {
        case RequestType::TRANSFER:
            return "transfer";
        case RequestType::TRANSACTION:
            return "transaction";
        case RequestType::CROSS_CHAIN_TRANSFER:
            return "cross-chain-transfer";
        default:
            throw std::invalid_argument("Unknown request type");
    }
}

RequestType string_to_request_type(const std::string& type) {
    if (type == "transfer") {
        return RequestType::TRANSFER;
    } else if (type == "transaction") {
        return RequestType::TRANSACTION;
    } else if (type == "cross-chain-transfer") {
        return RequestType::CROSS_CHAIN_TRANSFER;
    } else {
        throw std::invalid_argument("Unknown request type: " + type);
    }
}

std::string payment_status_to_string(PaymentStatus status) {
    switch (status) {
        case PaymentStatus::CREATED:
            return "created";
        case PaymentStatus::PENDING:
            return "pending";
        case PaymentStatus::CONFIRMED:
            return "confirmed";
        case PaymentStatus::FAILED:
            return "failed";
        case PaymentStatus::EXPIRED:
            return "expired";
        case PaymentStatus::BRIDGING:
            return "bridging";
        case PaymentStatus::BRIDGE_CONFIRMED:
            return "bridge-confirmed";
        case PaymentStatus::BRIDGE_FAILED:
            return "bridge-failed";
        default:
            throw std::invalid_argument("Unknown payment status");
    }
}

PaymentStatus string_to_payment_status(const std::string& status) {
    if (status == "created") {
        return PaymentStatus::CREATED;
    } else if (status == "pending") {
        return PaymentStatus::PENDING;
    } else if (status == "confirmed") {
        return PaymentStatus::CONFIRMED;
    } else if (status == "failed") {
        return PaymentStatus::FAILED;
    } else if (status == "expired") {
        return PaymentStatus::EXPIRED;
    } else if (status == "bridging") {
        return PaymentStatus::BRIDGING;
    } else if (status == "bridge-confirmed") {
        return PaymentStatus::BRIDGE_CONFIRMED;
    } else if (status == "bridge-failed") {
        return PaymentStatus::BRIDGE_FAILED;
    } else {
        throw std::invalid_argument("Unknown payment status: " + status);
    }
}

} // namespace svm_pay