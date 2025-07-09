#pragma once

/**
 * SVM-Pay C++ SDK
 * 
 * A payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n)
 * 
 * This is the main header file that includes all components of the SDK.
 */

#include "client.hpp"
#include "core/types.hpp"
#include "core/url_scheme.hpp"
#include "core/reference.hpp"
#include "core/exceptions.hpp"
#include "network/adapter.hpp"
#include "network/solana.hpp"

namespace svm_pay {

/**
 * SDK version information
 */
constexpr const char* VERSION = "1.0.0";

/**
 * Initialize the SVM-Pay SDK with default adapters
 * 
 * This function sets up the default network adapters for all supported networks.
 * Call this function once at the beginning of your application.
 * 
 * @param options Configuration options for the SDK
 */
void initialize_sdk(const std::unordered_map<std::string, std::string>& options = {});

/**
 * Clean up the SVM-Pay SDK
 * 
 * This function cleans up any resources used by the SDK.
 * Call this function once when your application is shutting down.
 */
void cleanup_sdk();

} // namespace svm_pay