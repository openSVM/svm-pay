"use strict";
/**
 * SVM-Pay Network Adapter Interface
 *
 * This file defines the interface for network adapters in the SVM-Pay protocol.
 * Each supported SVM network must implement this interface.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkAdapterFactory = exports.BaseNetworkAdapter = void 0;
/**
 * Abstract base class for network adapters
 */
class BaseNetworkAdapter {
    /**
     * Create a new BaseNetworkAdapter
     *
     * @param network The network this adapter handles
     */
    constructor(network) {
        this.network = network;
    }
}
exports.BaseNetworkAdapter = BaseNetworkAdapter;
/**
 * Factory for creating network adapters
 */
class NetworkAdapterFactory {
    /**
     * Register a network adapter
     *
     * @param adapter The network adapter to register
     */
    static registerAdapter(adapter) {
        this.adapters.set(adapter.network, adapter);
    }
    /**
     * Get a network adapter for a specific network
     *
     * @param network The network to get an adapter for
     * @returns The network adapter, or undefined if none is registered
     */
    static getAdapter(network) {
        return this.adapters.get(network);
    }
    /**
     * Get all registered network adapters
     *
     * @returns A map of all registered network adapters
     */
    static getAllAdapters() {
        return new Map(this.adapters);
    }
}
exports.NetworkAdapterFactory = NetworkAdapterFactory;
NetworkAdapterFactory.adapters = new Map();
//# sourceMappingURL=adapter.js.map