#pragma once

#include <curl/curl.h>
#include <memory>
#include <atomic>

namespace svm_pay {

/**
 * RAII wrapper for libcurl global initialization
 * Ensures curl_global_init() and curl_global_cleanup() are called exactly once
 * for the entire SDK lifecycle.
 */
class CurlInitializer {
public:
    /**
     * Get the singleton instance and ensure curl is initialized
     * 
     * @return Shared pointer to the initializer instance
     */
    static std::shared_ptr<CurlInitializer> get_instance();
    
    /**
     * Destructor - cleans up libcurl
     */
    ~CurlInitializer();

private:
    /**
     * Private constructor - initializes libcurl
     */
    CurlInitializer();
    
    // Prevent copying and assignment
    CurlInitializer(const CurlInitializer&) = delete;
    CurlInitializer& operator=(const CurlInitializer&) = delete;
    
    static std::shared_ptr<CurlInitializer> instance_;
    static std::atomic<bool> initialized_;
};

} // namespace svm_pay