/// Network Adapters for SVM-Pay Flutter SDK
/// 
/// This file implements network-specific adapters for different SVM networks.
library;

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
    // Enhanced validation for Solana addresses
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

    // Attempt to decode base58 to ensure it's a valid 32-byte public key
    try {
      final decoded = _decodeBase58(address);
      return decoded.length == 32;
    } catch (e) {
      return false;
    }
  }

  /// Fix Bug #4: Optimized base58 decoder with performance improvements
  /// Decode base58 string to bytes with proper validation and DoS protection
  List<int> _decodeBase58(String input) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    
    // DoS protection: limit input length
    if (input.isEmpty) {
      throw ArgumentError('Cannot decode empty base58 string');
    }
    
    if (input.length > 50) { // Reasonable limit for addresses
      throw ArgumentError('Base58 input too long: ${input.length} characters');
    }
    
    // Pre-validate all characters before processing
    for (int i = 0; i < input.length; i++) {
      if (!alphabet.contains(input[i])) {
        throw ArgumentError('Invalid base58 character: ${input[i]}');
      }
    }
    
    // Optimized decoding using integer arithmetic instead of BigInt when possible
    if (input.length <= 10) { // Small inputs can use regular int
      return _decodeBase58Small(input, alphabet);
    }
    
    // Use BigInt for larger inputs with performance optimizations
    final base = BigInt.from(58);
    var result = BigInt.zero;
    
    for (int i = 0; i < input.length; i++) {
      final charIndex = alphabet.indexOf(input[i]);
      result = result * base + BigInt.from(charIndex);
      
      // Prevent extreme computational load
      if (i > 0 && i % 10 == 0) {
        // Check if result is getting too large (basic DoS protection)
        if (result.bitLength > 2048) {
          throw ArgumentError('Base58 decoding result too large');
        }
      }
    }
    
    // Convert to bytes efficiently
    final bytes = <int>[];
    var temp = result;
    while (temp > BigInt.zero) {
      final remainder = temp.remainder(BigInt.from(256));
      bytes.insert(0, remainder.toInt());
      temp = temp ~/ BigInt.from(256);
    }
    
    // Handle leading zeros efficiently
    int leadingZeros = 0;
    for (int i = 0; i < input.length && input[i] == '1'; i++) {
      leadingZeros++;
    }
    
    final finalBytes = List<int>.filled(leadingZeros, 0) + bytes;
    
    // Validate result length for Solana addresses
    if (finalBytes.length != 32) {
      throw ArgumentError('Invalid address length: expected 32 bytes, got ${finalBytes.length}');
    }
    
    return finalBytes;
  }
  
  /// Helper method for small base58 strings using regular int arithmetic
  List<int> _decodeBase58Small(String input, String alphabet) {
    int result = 0;
    
    for (int i = 0; i < input.length; i++) {
      final charIndex = alphabet.indexOf(input[i]);
      result = result * 58 + charIndex;
    }
    
    final bytes = <int>[];
    while (result > 0) {
      bytes.insert(0, result & 0xFF);
      result >>= 8;
    }
    
    // Handle leading zeros
    for (int i = 0; i < input.length && input[i] == '1'; i++) {
      bytes.insert(0, 0);
    }
    
    return bytes;
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
  bool _disposed = false;

  NetworkAdapterManager() {
    _registerDefaultAdapters();
  }

  /// Fix Bug #1: Add dispose method to prevent memory leaks
  void dispose() {
    if (!_disposed) {
      _adapters.clear();
      _disposed = true;
    }
  }

  /// Register default network adapters
  void _registerDefaultAdapters() {
    if (_disposed) throw StateError('NetworkAdapterManager has been disposed');
    
    registerAdapter(SolanaNetworkAdapter());
    registerAdapter(SonicNetworkAdapter());
    registerAdapter(EclipseNetworkAdapter());
    registerAdapter(SoonNetworkAdapter());
  }

  /// Register a network adapter
  void registerAdapter(NetworkAdapter adapter) {
    if (_disposed) throw StateError('NetworkAdapterManager has been disposed');
    _adapters[adapter.network] = adapter;
  }

  /// Get adapter for a network
  NetworkAdapter? getAdapter(SVMNetwork network) {
    if (_disposed) return null;
    return _adapters[network];
  }

  /// Get all registered adapters
  List<NetworkAdapter> getAllAdapters() {
    if (_disposed) return [];
    return _adapters.values.toList();
  }

  /// Get supported networks
  List<SVMNetwork> getSupportedNetworks() {
    if (_disposed) return [];
    return _adapters.keys.toList();
  }

  /// Check if network is supported
  bool isNetworkSupported(SVMNetwork network) {
    if (_disposed) return false;
    return _adapters.containsKey(network);
  }
}