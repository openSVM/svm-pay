#pragma once

#include <string>

namespace svm_pay {

/**
 * Generate a cryptographically secure reference ID
 * 
 * @param length The length of the reference ID in bytes (default: 32)
 * @return A base58-encoded reference ID
 */
std::string generate_reference(size_t length = 32);

/**
 * Validate a reference ID format
 * 
 * @param reference The reference ID to validate
 * @return True if the reference ID is valid, false otherwise
 */
bool validate_reference(const std::string& reference);

/**
 * Create a reference ID with a timestamp component
 * 
 * @param length The length of the random component in bytes (default: 28)
 * @return A base58-encoded reference ID with timestamp
 */
std::string generate_timestamped_reference(size_t length = 28);

} // namespace svm_pay