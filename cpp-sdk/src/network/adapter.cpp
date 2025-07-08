#include "svm-pay/network/adapter.hpp"
#include <mutex>

namespace svm_pay {

// Static member definitions
std::unordered_map<SVMNetwork, std::unique_ptr<NetworkAdapter>> NetworkAdapterFactory::adapters_;
std::mutex NetworkAdapterFactory::adapters_mutex_;

void NetworkAdapterFactory::register_adapter(SVMNetwork network, std::unique_ptr<NetworkAdapter> adapter) {
    std::lock_guard<std::mutex> lock(adapters_mutex_);
    adapters_[network] = std::move(adapter);
}

NetworkAdapter* NetworkAdapterFactory::get_adapter(SVMNetwork network) {
    std::lock_guard<std::mutex> lock(adapters_mutex_);
    auto it = adapters_.find(network);
    if (it != adapters_.end()) {
        return it->second.get();
    }
    return nullptr;
}

bool NetworkAdapterFactory::has_adapter(SVMNetwork network) {
    std::lock_guard<std::mutex> lock(adapters_mutex_);
    return adapters_.find(network) != adapters_.end();
}

} // namespace svm_pay