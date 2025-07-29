/// Network Adapters for SVM-Pay Flutter SDK
/// 
/// This file implements network-specific adapters for different SVM networks.

import 'types.dart';

/// Base interface for network adapters
abstract class NetworkAdapter {
  /// Network this adapter supports
  SVMNetwork get network;

  /// Validate an address for this network
  bool validateAddress(String address);

  /// Get network-specific configuration
  Map<String, dynamic> getNetworkConfig();

  /// Get the RPC endpoint for this network
  String getRpcEndpoint();
}

/// Solana network adapter
class SolanaNetworkAdapter extends NetworkAdapter {
  @override
  SVMNetwork get network => SVMNetwork.solana;

  @override
  bool validateAddress(String address) {
    // Basic validation for Solana addresses (base58, 32-44 characters)
    if (address.isEmpty || address.length < 32 || address.length > 44) {
      return false;
    }

    // Check if all characters are valid base58
    const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (int i = 0; i < address.length; i++) {
      if (!base58Chars.contains(address[i])) {
        return false;
      }
    }

    return true;
  }

  @override
  Map<String, dynamic> getNetworkConfig() {
    return {
      'name': 'Solana',
      'chainId': 101,
      'symbol': 'SOL',
      'decimals': 9,
      'explorerUrl': 'https://explorer.solana.com',
    };
  }

  @override
  String getRpcEndpoint() {
    return 'https://api.mainnet-beta.solana.com';
  }
}

/// Sonic SVM network adapter
class SonicNetworkAdapter extends NetworkAdapter {
  @override
  SVMNetwork get network => SVMNetwork.sonic;

  @override
  bool validateAddress(String address) {
    // Sonic uses similar address format to Solana
    return SolanaNetworkAdapter().validateAddress(address);
  }

  @override
  Map<String, dynamic> getNetworkConfig() {
    return {
      'name': 'Sonic SVM',
      'chainId': 146, // Sonic chain ID
      'symbol': 'SOL', // Using SOL as base token
      'decimals': 9,
      'explorerUrl': 'https://explorer.sonic.game',
    };
  }

  @override
  String getRpcEndpoint() {
    return 'https://rpc.sonic.game';
  }
}

/// Eclipse network adapter
class EclipseNetworkAdapter extends NetworkAdapter {
  @override
  SVMNetwork get network => SVMNetwork.eclipse;

  @override
  bool validateAddress(String address) {
    // Eclipse uses similar address format to Solana
    return SolanaNetworkAdapter().validateAddress(address);
  }

  @override
  Map<String, dynamic> getNetworkConfig() {
    return {
      'name': 'Eclipse',
      'chainId': 256, // Eclipse chain ID (placeholder)
      'symbol': 'ETH', // Eclipse uses ETH as gas token
      'decimals': 18,
      'explorerUrl': 'https://explorer.eclipse.xyz',
    };
  }

  @override
  String getRpcEndpoint() {
    return 'https://mainnetbeta-rpc.eclipse.xyz';
  }
}

/// Soon network adapter
class SoonNetworkAdapter extends NetworkAdapter {
  @override
  SVMNetwork get network => SVMNetwork.soon;

  @override
  bool validateAddress(String address) {
    // Soon uses similar address format to Solana
    return SolanaNetworkAdapter().validateAddress(address);
  }

  @override
  Map<String, dynamic> getNetworkConfig() {
    return {
      'name': 'Soon',
      'chainId': 512, // Soon chain ID (placeholder)
      'symbol': 'SOON',
      'decimals': 9,
      'explorerUrl': 'https://explorer.soon.money',
    };
  }

  @override
  String getRpcEndpoint() {
    return 'https://rpc.soon.money';
  }
}

/// Network adapter manager
class NetworkAdapterManager {
  final Map<SVMNetwork, NetworkAdapter> _adapters = {};

  NetworkAdapterManager() {
    _registerDefaultAdapters();
  }

  /// Register default network adapters
  void _registerDefaultAdapters() {
    registerAdapter(SolanaNetworkAdapter());
    registerAdapter(SonicNetworkAdapter());
    registerAdapter(EclipseNetworkAdapter());
    registerAdapter(SoonNetworkAdapter());
  }

  /// Register a network adapter
  void registerAdapter(NetworkAdapter adapter) {
    _adapters[adapter.network] = adapter;
  }

  /// Get adapter for a network
  NetworkAdapter? getAdapter(SVMNetwork network) {
    return _adapters[network];
  }

  /// Get all registered adapters
  List<NetworkAdapter> getAllAdapters() {
    return _adapters.values.toList();
  }

  /// Get supported networks
  List<SVMNetwork> getSupportedNetworks() {
    return _adapters.keys.toList();
  }

  /// Check if network is supported
  bool isNetworkSupported(SVMNetwork network) {
    return _adapters.containsKey(network);
  }
}