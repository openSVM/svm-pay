/// SVM-Pay Flutter SDK Types
/// 
/// This file defines the core types used throughout the SVM-Pay Flutter SDK.
library;

/// Supported SVM networks
enum SVMNetwork {
  solana('solana'),
  sonic('sonic'),
  eclipse('eclipse'),
  soon('soon');

  const SVMNetwork(this.value);
  final String value;

  static SVMNetwork fromString(String value) {
    for (SVMNetwork network in SVMNetwork.values) {
      if (network.value == value) {
        return network;
      }
    }
    throw ArgumentError('Invalid network: $value');
  }
}

/// Supported EVM networks for cross-chain payments
enum EVMNetwork {
  ethereum('ethereum'),
  bnbChain('bnb-chain'),
  polygon('polygon'),
  arbitrum('arbitrum'),
  optimism('optimism'),
  avalanche('avalanche');

  const EVMNetwork(this.value);
  final String value;

  static EVMNetwork fromString(String value) {
    for (EVMNetwork network in EVMNetwork.values) {
      if (network.value == value) {
        return network;
      }
    }
    throw ArgumentError('Invalid network: $value');
  }
}

/// Payment request types
enum RequestType {
  transfer('transfer'),
  transaction('transaction'),
  crossChainTransfer('cross-chain-transfer');

  const RequestType(this.value);
  final String value;
}

/// Payment status
enum PaymentStatus {
  pending('pending'),
  confirmed('confirmed'),
  failed('failed'),
  cancelled('cancelled');

  const PaymentStatus(this.value);
  final String value;

  static PaymentStatus fromString(String value) {
    for (PaymentStatus status in PaymentStatus.values) {
      if (status.value == value) {
        return status;
      }
    }
    throw ArgumentError('Invalid payment status: $value');
  }
}

/// Base interface for all payment requests
abstract class PaymentRequest {
  /// The type of payment request
  final RequestType type;

  /// The target SVM network for this payment
  final SVMNetwork network;

  /// Optional memo for the payment
  final String? memo;

  /// Optional reference ID for tracking
  final String? reference;

  const PaymentRequest({
    required this.type,
    required this.network,
    this.memo,
    this.reference,
  });

  Map<String, dynamic> toJson();
}

/// Transfer request for simple token transfers
class TransferRequest extends PaymentRequest {
  /// Recipient address
  final String recipient;

  /// Amount to transfer
  final String amount;

  /// Optional SPL token mint address
  final String? splToken;

  /// Optional label for the payment
  final String? label;

  /// Optional message for the payment
  final String? message;

  const TransferRequest({
    required this.recipient,
    required this.amount,
    required super.network,
    this.splToken,
    this.label,
    this.message,
    super.memo,
    super.reference,
  }) : super(
          type: RequestType.transfer,
        );

  @override
  Map<String, dynamic> toJson() {
    return {
      'type': type.value,
      'network': network.value,
      'recipient': recipient,
      'amount': amount,
      if (splToken != null) 'splToken': splToken,
      if (label != null) 'label': label,
      if (message != null) 'message': message,
      if (memo != null) 'memo': memo,
      if (reference != null) 'reference': reference,
    };
  }
}

/// Transaction request for custom transactions
class TransactionRequest extends PaymentRequest {
  /// Base64 encoded transaction
  final String transaction;

  const TransactionRequest({
    required this.transaction,
    required super.network,
    super.memo,
    super.reference,
  }) : super(
          type: RequestType.transaction,
        );

  @override
  Map<String, dynamic> toJson() {
    return {
      'type': type.value,
      'network': network.value,
      'transaction': transaction,
      if (memo != null) 'memo': memo,
      if (reference != null) 'reference': reference,
    };
  }
}

/// Payment result
class PaymentResult {
  /// Payment status
  final PaymentStatus status;

  /// Transaction signature (if successful)
  final String? signature;

  /// Error message (if failed)
  final String? error;

  /// Network where the payment was processed
  final SVMNetwork network;

  const PaymentResult({
    required this.status,
    required this.network,
    this.signature,
    this.error,
  });

  factory PaymentResult.fromJson(Map<String, dynamic> json) {
    return PaymentResult(
      status: PaymentStatus.fromString(json['status']),
      network: SVMNetwork.fromString(json['network']),
      signature: json['signature'],
      error: json['error'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status.value,
      'network': network.value,
      if (signature != null) 'signature': signature,
      if (error != null) 'error': error,
    };
  }
}

/// Configuration for the SVM-Pay SDK
class SVMPayConfig {
  /// Default network to use if not specified
  final SVMNetwork defaultNetwork;

  /// API endpoint for server-side operations
  final String? apiEndpoint;

  /// Whether to enable debug logging
  final bool debug;

  const SVMPayConfig({
    this.defaultNetwork = SVMNetwork.solana,
    this.apiEndpoint,
    this.debug = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'defaultNetwork': defaultNetwork.value,
      if (apiEndpoint != null) 'apiEndpoint': apiEndpoint,
      'debug': debug,
    };
  }
}