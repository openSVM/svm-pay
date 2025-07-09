#include "svm-pay/network/curl_initializer.hpp"
#include <mutex>

namespace svm_pay {

std::shared_ptr<CurlInitializer> CurlInitializer::instance_;
std::atomic<bool> CurlInitializer::initialized_{false};

std::shared_ptr<CurlInitializer> CurlInitializer::get_instance() {
    static std::once_flag flag;
    std::call_once(flag, []() {
        instance_ = std::shared_ptr<CurlInitializer>(new CurlInitializer());
    });
    return instance_;
}

CurlInitializer::CurlInitializer() {
    if (!initialized_.exchange(true)) {
        curl_global_init(CURL_GLOBAL_DEFAULT);
    }
}

CurlInitializer::~CurlInitializer() {
    if (initialized_.exchange(false)) {
        curl_global_cleanup();
    }
}

} // namespace svm_pay