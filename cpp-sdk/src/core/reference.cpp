#include "svm-pay/core/reference.hpp"
#include "svm-pay/core/exceptions.hpp"
#include <openssl/rand.h>
#include <openssl/evp.h>
#include <stdexcept>
#include <vector>
#include <chrono>
#include <cstring>
#include <algorithm>

namespace svm_pay {

// Base58 alphabet
static const char* BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Encode binary data to base58
 * 
 * @param data The binary data to encode
 * @param size The size of the data
 * @return The base58-encoded string
 */
std::string encode_base58(const unsigned char* data, size_t size) {
    std::vector<unsigned char> digits(size * 2);
    
    // Count leading zeros
    size_t leading_zeros = 0;
    while (leading_zeros < size && data[leading_zeros] == 0) {
        leading_zeros++;
    }
    
    // Convert to base58
    std::string result;
    for (size_t i = leading_zeros; i < size; i++) {
        int carry = data[i];
        for (size_t j = 0; j < digits.size(); j++) {
            carry += 256 * digits[j];
            digits[j] = carry % 58;
            carry /= 58;
        }
    }
    
    // Add leading zeros
    result.append(leading_zeros, '1');
    
    // Convert digits to base58 characters
    for (int i = digits.size() - 1; i >= 0; i--) {
        if (digits[i] > 0 || !result.empty()) {
            result += BASE58_ALPHABET[digits[i]];
        }
    }
    
    return result;
}

/**
 * Decode base58 to binary data
 * 
 * @param encoded The base58-encoded string
 * @return The decoded binary data
 */
std::vector<unsigned char> decode_base58(const std::string& encoded) {
    std::vector<unsigned char> result(encoded.size() * 733 / 1000 + 1); // log(58) / log(256), rounded up
    
    // Count leading '1's
    size_t leading_ones = 0;
    while (leading_ones < encoded.size() && encoded[leading_ones] == '1') {
        leading_ones++;
    }
    
    // Convert from base58
    for (size_t i = leading_ones; i < encoded.size(); i++) {
        int carry = -1;  // Initialize to invalid value
        
        // Find the character in the alphabet
        for (int j = 0; j < 58; j++) {
            if (BASE58_ALPHABET[j] == encoded[i]) {
                carry = j;
                break;
            }
        }
        
        // Check if character was found
        if (carry == -1) {
            throw ReferenceException("Invalid base58 character: " + std::string(1, encoded[i]));
        }
        
        for (size_t j = 0; j < result.size(); j++) {
            carry += 58 * result[j];
            result[j] = carry % 256;
            carry /= 256;
        }
    }
    
    // Add leading zeros
    result.insert(result.begin(), leading_ones, 0);
    
    // Remove excess zeros
    while (result.size() > 1 && result.back() == 0) {
        result.pop_back();
    }
    
    std::reverse(result.begin(), result.end());
    return result;
}

std::string generate_reference(size_t length) {
    if (length == 0) {
        throw std::invalid_argument("Reference length must be greater than 0");
    }
    
    if (length > 1024) {
        throw std::invalid_argument("Reference length must be less than 1024 bytes");
    }
    
    std::vector<unsigned char> random_bytes(length);
    
    if (RAND_bytes(random_bytes.data(), static_cast<int>(length)) != 1) {
        throw CryptographicException("Failed to generate secure random bytes");
    }
    
    return encode_base58(random_bytes.data(), length);
}

bool validate_reference(const std::string& reference) {
    if (reference.empty()) {
        return false;
    }
    
    if (reference.length() > 1500) { // Generous upper bound for base58 encoded data
        return false;
    }
    
    try {
        auto decoded = decode_base58(reference);
        return decoded.size() >= 8 && decoded.size() <= 1024; // Reasonable size bounds
    } catch (const std::exception&) {
        return false;
    }
}

std::string generate_timestamped_reference(size_t length) {
    if (length < 4) {
        throw std::invalid_argument("Reference length must be at least 4 bytes for timestamp");
    }
    
    if (length > 1020) {
        throw std::invalid_argument("Reference length must be less than 1020 bytes for timestamped reference");
    }
    
    // Get current timestamp in seconds
    auto now = std::chrono::duration_cast<std::chrono::seconds>(
        std::chrono::system_clock::now().time_since_epoch()
    );
    uint32_t timestamp = static_cast<uint32_t>(now.count());
    
    // Generate random bytes
    std::vector<unsigned char> random_bytes(length);
    if (RAND_bytes(random_bytes.data(), static_cast<int>(length)) != 1) {
        throw CryptographicException("Failed to generate secure random bytes");
    }
    
    // Replace first 4 bytes with timestamp (big-endian)
    random_bytes[0] = (timestamp >> 24) & 0xFF;
    random_bytes[1] = (timestamp >> 16) & 0xFF;
    random_bytes[2] = (timestamp >> 8) & 0xFF;
    random_bytes[3] = timestamp & 0xFF;
    
    return encode_base58(random_bytes.data(), length);
}

} // namespace svm_pay