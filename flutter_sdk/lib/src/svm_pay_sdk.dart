/// SVM-Pay Flutter SDK
/// 
/// This file implements the main SDK class for SVM-Pay Flutter integration.

import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:crypto/crypto.dart';

import 'types.dart';
import 'network_adapters.dart';

/// Main SVM-Pay SDK class
class SVMPay {
  static const MethodChannel _channel = MethodChannel('com.opensvm.svm_pay');

  final SVMPayConfig _config;
  final NetworkAdapterManager _networkManager;

  /// Create a new SVMPay SDK instance
  SVMPay({SVMPayConfig? config})
      : _config = config ?? const SVMPayConfig(),
        _networkManager = NetworkAdapterManager();

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
    final effectiveNetwork = network ?? _config.defaultNetwork;
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
  /// @param url Payment URL to parse
  /// @returns Parsed payment request
  PaymentRequest? parseUrl(String url) {
    try {
      final uri = Uri.parse(url);
      
      if (!_isSvmPayUrl(uri)) {
        return null;
      }

      final network = SVMNetwork.fromString(uri.scheme);
      final recipient = uri.host;
      final queryParams = uri.queryParameters;

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
        print('SVM-Pay: Error parsing URL: $e');
      }
      return null;
    }
  }

  /// Generate a unique reference ID
  /// 
  /// @returns Unique reference string
  String generateReference() {
    final timestamp = DateTime.now().microsecondsSinceEpoch;
    final random = timestamp.hashCode ^ Object.hash(timestamp, DateTime.now().millisecondsSinceEpoch);
    final randomBytes = List.generate(8, (index) => random + index * 31);
    final hash = sha256.convert(randomBytes);
    return hash.toString().substring(0, 16);
  }

  /// Process a payment request
  /// 
  /// @param request Payment request to process
  /// @returns Future that resolves to payment result
  Future<PaymentResult> processPayment(PaymentRequest request) async {
    try {
      final adapter = _networkManager.getAdapter(request.network);
      if (adapter == null) {
        throw Exception('Unsupported network: ${request.network.value}');
      }

      // Use platform channel for native processing
      final result = await _channel.invokeMethod('processPayment', {
        'request': request.toJson(),
        'config': _config.toJson(),
      });

      return PaymentResult.fromJson(Map<String, dynamic>.from(result));
    } on PlatformException catch (e) {
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: e.message ?? 'Platform error occurred',
      );
    } catch (e) {
      return PaymentResult(
        status: PaymentStatus.failed,
        network: request.network,
        error: e.toString(),
      );
    }
  }

  /// Check wallet balance
  /// 
  /// @param address Wallet address
  /// @param network Target network
  /// @returns Future that resolves to balance string
  Future<String> getWalletBalance(
    String address, {
    SVMNetwork? network,
    String? tokenMint,
  }) async {
    try {
      final effectiveNetwork = network ?? _config.defaultNetwork;
      
      final result = await _channel.invokeMethod('getWalletBalance', {
        'address': address,
        'network': effectiveNetwork.value,
        if (tokenMint != null) 'tokenMint': tokenMint,
      });

      return result.toString();
    } on PlatformException catch (e) {
      throw Exception('Failed to get wallet balance: ${e.message}');
    }
  }

  /// Validate a wallet address for the given network
  /// 
  /// @param address Address to validate
  /// @param network Target network
  /// @returns True if address is valid
  bool validateAddress(String address, {SVMNetwork? network}) {
    final effectiveNetwork = network ?? _config.defaultNetwork;
    final adapter = _networkManager.getAdapter(effectiveNetwork);
    return adapter?.validateAddress(address) ?? false;
  }

  /// Build payment URL from request
  String _buildPaymentUrl(PaymentRequest request) {
    final buffer = StringBuffer();
    buffer.write('${request.network.value}://');

    if (request is TransferRequest) {
      buffer.write(request.recipient);
      
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

  /// Log message if debug is enabled
  void _log(String message) {
    if (_config.debug) {
      print('SVM-Pay: $message');
    }
  }
}