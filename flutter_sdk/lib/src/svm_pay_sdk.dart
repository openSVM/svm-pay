/// SVM-Pay Flutter SDK
/// 
/// This file implements the main SDK class for SVM-Pay Flutter integration.
library;

import 'dart:async';
import 'dart:convert';
import 'dart:math' show Random;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:crypto/crypto.dart';

import 'types.dart';
import 'network_adapters.dart';

/// Main SVM-Pay SDK class
class SVMPay {
  static const MethodChannel _channel = MethodChannel('com.opensvm.svm_pay');

  final SVMPayConfig _config;
  final NetworkAdapterManager _networkManager;
  
  // Fix Bug #2: Add mutex for concurrent payment protection
  final Completer<void> _paymentMutex = Completer<void>();
  bool _isProcessingPayment = false;

  /// Create a new SVMPay SDK instance
  SVMPay({SVMPayConfig? config})
      : _config = config ?? const SVMPayConfig(),
        _networkManager = NetworkAdapterManager() {
    _paymentMutex.complete(); // Initialize as available
  }

  /// Fix Bug #1: Dispose resources to prevent memory leaks
  void dispose() {
    _networkManager.dispose();
  }

  /// Get the current configuration
  SVMPayConfig get config => _config;

  /// Create a payment URL for a transfer request
  /// 
  /// @param recipient Recipient address
  /// @param amount Amount to transfer
  /// @param options Additional options
  /// @returns Payment URL string
  String createTransferUrl(
    String recipient,
    String amount, {
    SVMNetwork? network,
    String? splToken,
    String? label,
    String? message,
    String? memo,
    String? reference,
  }) {
    // Input validation
    if (recipient.isEmpty) {
      throw ArgumentError('Recipient address cannot be empty');
    }
    
    if (amount.isEmpty) {
      throw ArgumentError('Amount cannot be empty');
    }
    
    // Validate amount is a positive number
    final amountValue = double.tryParse(amount);
    if (amountValue == null || amountValue <= 0) {
      throw ArgumentError('Amount must be a positive number');
    }
    
    // Check for reasonable upper bounds (1 billion tokens max)
    if (amountValue > 1000000000) {
      throw ArgumentError('Amount exceeds maximum allowed limit of 1 billion tokens');
    }
    
    // Check for extremely precise decimal places (max 9 decimal places for SOL)
    final parts = amount.split('.');
    if (parts.length > 1 && parts[1].length > 9) {
      throw ArgumentError('Amount has too many decimal places (maximum 9 allowed)');
    }
    
    final effectiveNetwork = network ?? _config.defaultNetwork;
    
    // Validate recipient address for the target network
    if (!validateAddress(recipient, network: effectiveNetwork)) {
      throw ArgumentError('Invalid recipient address for ${effectiveNetwork.value} network');
    }
    
    // Validate optional parameters
    if (label != null && label.length > 200) {
      throw ArgumentError('Label cannot exceed 200 characters');
    }
    
    if (message != null && message.length > 500) {
      throw ArgumentError('Message cannot exceed 500 characters');
    }
    
    if (memo != null && memo.length > 100) {
      throw ArgumentError('Memo cannot exceed 100 characters');
    }

    final effectiveReference = reference ?? generateReference();

    final request = TransferRequest(
      recipient: recipient,
      amount: amount,
      network: effectiveNetwork,
      splToken: splToken,
      label: label,
      message: message,
      memo: memo,
      reference: effectiveReference,
    );

    return _buildPaymentUrl(request);
  }

  /// Create a payment URL for a transaction request
  /// 
  /// @param transaction Base64 encoded transaction
  /// @param options Additional options
  /// @returns Payment URL string
  String createTransactionUrl(
    String transaction, {
    SVMNetwork? network,
    String? memo,
    String? reference,
  }) {
    // Input validation
    if (transaction.isEmpty) {
      throw ArgumentError('Transaction cannot be empty');
    }
    
    // Validate base64 encoding
    try {
      base64.decode(transaction);
    } catch (e) {
      throw ArgumentError('Transaction must be valid base64 encoded data');
    }
    
    if (memo != null && memo.length > 100) {
      throw ArgumentError('Memo cannot exceed 100 characters');
    }

    final effectiveNetwork = network ?? _config.defaultNetwork;
    final effectiveReference = reference ?? generateReference();

    final request = TransactionRequest(
      transaction: transaction,
      network: effectiveNetwork,
      memo: memo,
      reference: effectiveReference,
    );

    return _buildPaymentUrl(request);
  }

  /// Parse a payment URL to extract payment request information
  /// 
  /// Fix Bug #5: Add URL validation to prevent malformed URL attacks
  /// @param url Payment URL to parse
  /// @returns Parsed payment request
  PaymentRequest? parseUrl(String url) {
    try {
      // Fix Bug #5: Validate URL length and complexity to prevent DoS
      if (url.isEmpty || url.length > 2048) {
        return null;
      }
      
      // Check for suspicious patterns that could cause parsing issues
      if (url.contains('..') || url.contains('%') && url.length > 500) {
        return null;
      }
      
      final uri = Uri.parse(url);
      
      // Additional URI validation
      if (uri.scheme.isEmpty || uri.scheme.length > 20) {
        return null;
      }
      
      if (!_isSvmPayUrl(uri)) {
        return null;
      }

      final network = SVMNetwork.fromString(uri.scheme);
      final recipient = uri.host;
      final queryParams = uri.queryParameters;
      
      // Validate query parameters don't exceed reasonable limits
      if (queryParams.length > 10) {
        return null;
      }

      if (queryParams.containsKey('transaction')) {
        return TransactionRequest(
          transaction: queryParams['transaction']!,
          network: network,
          memo: queryParams['memo'],
          reference: queryParams['reference'],
        );
      } else {
        return TransferRequest(
          recipient: recipient,
          amount: queryParams['amount'] ?? '0',
          network: network,
          splToken: queryParams['spl-token'],
          label: queryParams['label'],
          message: queryParams['message'],
          memo: queryParams['memo'],
          reference: queryParams['reference'],
        );
      }
    } catch (e) {
      if (_config.debug) {
        // Fix Bug #10: More thorough error sanitization
        final sanitizedError = _sanitizeErrorMessage(e.toString());
        _log('Error parsing URL: $sanitizedError');
      }
      return null;
    }
  }

  /// Generate a unique reference ID using secure randomness
  /// 
  /// Fix Bug #3: Improve entropy by using only secure random data
  /// @returns Cryptographically secure unique reference string
  String generateReference() {
    final secureRandom = Random.secure();
    
    // Generate 32 bytes of secure random data (increased from 16)
    final randomBytes = List.generate(32, (index) => secureRandom.nextInt(256));
    
    // Add additional entropy from high-resolution timer
    final nanoTime = DateTime.now().microsecondsSinceEpoch * 1000 + 
                     secureRandom.nextInt(1000000);
    final entropyBytes = _intToBytes(nanoTime);
    
    // Combine all random sources
    final combinedBytes = [...randomBytes, ...entropyBytes];
    
    // Hash the combined data with multiple rounds
    var hash = sha256.convert(combinedBytes).bytes;
    hash = sha256.convert(hash).bytes; // Double hash for additional security
    
    // Convert to base64 for better entropy preservation than hex
    return base64.encode(hash).substring(0, 22).replaceAll('/', '_').replaceAll('+', '-');
  }

  /// Convert integer to bytes
  List<int> _intToBytes(int value) {
    final bytes = <int>[];
    while (value > 0) {
      bytes.insert(0, value & 0xFF);
      value >>= 8;
    }
    return bytes.isEmpty ? [0] : bytes;
  }

  /// Log message if debug is enabled with sensitive data sanitization
  void _log(String message) {
    if (_config.debug) {
      // Sanitize sensitive information from logs
      final sanitized = message
          .replaceAll(RegExp(r'\b[1-9A-HJ-NP-Za-km-z]{32,44}\b'), '[ADDRESS_REDACTED]')
          .replaceAll(RegExp(r'"signature":\s*"[^"]*"'), '"signature": "[SIGNATURE_REDACTED]"')
          .replaceAll(RegExp(r'"transaction":\s*"[^"]*"'), '"transaction": "[TRANSACTION_REDACTED]"');
      debugPrint('SVM-Pay: $sanitized');
    }
  }

  /// Process a payment request with enhanced error handling
  /// 
  /// Fix Bug #2: Add mutex protection against concurrent payments
  /// @param request Payment request to process
  /// @returns Future that resolves to payment result
  Future<PaymentResult> processPayment(PaymentRequest request) async {
    _log('Processing payment request: ${request.type.value}');
    
    // Fix Bug #2: Prevent concurrent payment processing
    if (_isProcessingPayment) {
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: 'Another payment is already in progress. Please wait.',
      );
    }
    
    _isProcessingPayment = true;
    
    try {
      // Validate request
      if (request is TransferRequest) {
        if (!validateAddress(request.recipient, network: request.network)) {
          throw ArgumentError('Invalid recipient address');
        }
        
        final amount = double.tryParse(request.amount);
        if (amount == null || amount <= 0) {
          throw ArgumentError('Invalid amount: ${request.amount}');
        }
        
        if (amount > 1000000000) {
          throw ArgumentError('Amount exceeds maximum allowed limit of 1 billion tokens');
        }
        
        // Fix Bug #8: Add basic fee estimation warning
        _log('Warning: This amount does not include network fees. Ensure sufficient balance.');
      }

      final adapter = _networkManager.getAdapter(request.network);
      if (adapter == null) {
        throw Exception('Unsupported network: ${request.network.value}');
      }

      // Use platform channel for native processing with timeout
      final result = await _channel.invokeMethod('processPayment', {
        'request': request.toJson(),
        'config': _config.toJson(),
      }).timeout(
        const Duration(seconds: 30),
        onTimeout: () => throw TimeoutException('Payment request timed out', const Duration(seconds: 30)),
      );

      final paymentResult = PaymentResult.fromJson(Map<String, dynamic>.from(result));
      _log('Payment completed with status: ${paymentResult.status.value}');
      return paymentResult;
      
    } on PlatformException catch (e) {
      _log('Platform error: ${e.code} - ${_sanitizeErrorMessage(e.message ?? "Unknown error")}');
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: _sanitizeErrorMessage(e.message ?? 'Platform error occurred'),
      );
    } on TimeoutException catch (e) {
      _log('Timeout error: ${_sanitizeErrorMessage(e.message ?? "Timeout")}');
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: 'Payment request timed out. Please try again.',
      );
    } on ArgumentError catch (e) {
      _log('Validation error: ${_sanitizeErrorMessage(e.message ?? "Validation error")}');
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: e.message ?? 'Invalid payment request',
      );
    } catch (e) {
      _log('Unexpected error: ${e.runtimeType}');
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: 'An unexpected error occurred. Please try again.',
      );
    } finally {
      _isProcessingPayment = false;
    }
  }

  /// Sanitize error messages to prevent information disclosure
  /// Fix Bug #10: Enhanced sanitization with stack trace removal
  String _sanitizeErrorMessage(String message) {
    return message
        .replaceAll(RegExp(r'\b[1-9A-HJ-NP-Za-km-z]{32,44}\b'), '[ADDRESS]')
        .replaceAll(RegExp(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'), '[IP_ADDRESS]')
        .replaceAll(RegExp(r'(private|secret|key|token|password|credential):\s*\S+', caseSensitive: false), r'$1: [REDACTED]')
        .replaceAll(RegExp(r'#\d+\s+.*\(.*:\d+:\d+\)'), '[STACK_TRACE_REDACTED]') // Remove stack traces
        .replaceAll(RegExp(r'file:///.*'), '[FILE_PATH_REDACTED]') // Remove file paths
        .replaceAll(RegExp(r'Exception:\s*.*'), 'Exception: [DETAILS_REDACTED]'); // Sanitize exception details
  }

  /// Check wallet balance with enhanced validation and error handling
  /// 
  /// @param address Wallet address
  /// @param network Target network
  /// @returns Future that resolves to balance string
  Future<String> getWalletBalance(
    String address, {
    SVMNetwork? network,
    String? tokenMint,
  }) async {
    // Input validation
    if (address.isEmpty) {
      throw ArgumentError('Address cannot be empty');
    }
    
    final effectiveNetwork = network ?? _config.defaultNetwork;
    
    // Validate address format
    if (!validateAddress(address, network: effectiveNetwork)) {
      throw ArgumentError('Invalid address format for ${effectiveNetwork.value} network');
    }
    
    try {
      _log('Getting wallet balance for address: [ADDRESS_REDACTED]');
      
      final result = await _channel.invokeMethod('getWalletBalance', {
        'address': address,
        'network': effectiveNetwork.value,
        if (tokenMint != null) 'tokenMint': tokenMint,
      }).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw TimeoutException('Balance request timed out', const Duration(seconds: 15)),
      );

      return result.toString();
    } on PlatformException catch (e) {
      _log('Platform error getting balance: ${e.code}');
      throw Exception('Failed to get wallet balance: ${_sanitizeErrorMessage(e.message ?? 'Unknown error')}');
    } on TimeoutException {
      _log('Timeout getting balance');
      throw Exception('Balance request timed out. Please try again.');
    } catch (e) {
      _log('Unexpected error getting balance: ${e.runtimeType}');
      throw Exception('Failed to get wallet balance: An unexpected error occurred');
    }
  }

  /// Validate a wallet address for the given network
  /// 
  /// @param address Address to validate
  /// @param network Target network
  /// @returns True if address is valid
  bool validateAddress(String address, {SVMNetwork? network}) {
    if (address.isEmpty) {
      return false;
    }
    
    final effectiveNetwork = network ?? _config.defaultNetwork;
    final adapter = _networkManager.getAdapter(effectiveNetwork);
    return adapter?.validateAddress(address) ?? false;
  }

  /// Build payment URL from request with proper encoding
  String _buildPaymentUrl(PaymentRequest request) {
    final buffer = StringBuffer();
    buffer.write('${request.network.value}://');

    if (request is TransferRequest) {
      buffer.write(Uri.encodeComponent(request.recipient));
      
      final queryParams = <String, String>{};
      queryParams['amount'] = request.amount;
      
      if (request.splToken != null) {
        queryParams['spl-token'] = request.splToken!;
      }
      if (request.label != null) {
        queryParams['label'] = request.label!;
      }
      if (request.message != null) {
        queryParams['message'] = request.message!;
      }
      if (request.memo != null) {
        queryParams['memo'] = request.memo!;
      }
      if (request.reference != null) {
        queryParams['reference'] = request.reference!;
      }

      if (queryParams.isNotEmpty) {
        buffer.write('?');
        buffer.write(queryParams.entries
            .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
            .join('&'));
      }
    } else if (request is TransactionRequest) {
      final queryParams = <String, String>{
        'transaction': request.transaction,
      };
      
      if (request.memo != null) {
        queryParams['memo'] = request.memo!;
      }
      if (request.reference != null) {
        queryParams['reference'] = request.reference!;
      }

      buffer.write('?');
      buffer.write(queryParams.entries
          .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
          .join('&'));
    }

    return buffer.toString();
  }

  /// Check if URL is a valid SVM-Pay URL
  bool _isSvmPayUrl(Uri uri) {
    try {
      SVMNetwork.fromString(uri.scheme);
      return true;
    } catch (e) {
      return false;
    }
  }
}