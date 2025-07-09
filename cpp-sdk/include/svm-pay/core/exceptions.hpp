#pragma once

#include <stdexcept>
#include <string>

namespace svm_pay {

/**
 * Base exception class for all SVM-Pay SDK exceptions
 */
class SVMPayException : public std::runtime_error {
public:
    explicit SVMPayException(const std::string& message) : std::runtime_error(message) {}
};

/**
 * Exception thrown when network operations fail
 */
class NetworkException : public SVMPayException {
public:
    explicit NetworkException(const std::string& message) : SVMPayException("Network error: " + message) {}
};

/**
 * Exception thrown when URL parsing fails
 */
class URLParseException : public SVMPayException {
public:
    explicit URLParseException(const std::string& message) : SVMPayException("URL parse error: " + message) {}
};

/**
 * Exception thrown when address validation fails
 */
class AddressValidationException : public SVMPayException {
public:
    explicit AddressValidationException(const std::string& message) : SVMPayException("Address validation error: " + message) {}
};

/**
 * Exception thrown when reference operations fail
 */
class ReferenceException : public SVMPayException {
public:
    explicit ReferenceException(const std::string& message) : SVMPayException("Reference error: " + message) {}
};

/**
 * Exception thrown when cryptographic operations fail
 */
class CryptographicException : public SVMPayException {
public:
    explicit CryptographicException(const std::string& message) : SVMPayException("Cryptographic error: " + message) {}
};

} // namespace svm_pay