/// Payment Widgets for SVM-Pay Flutter SDK
/// 
/// This file implements Flutter widgets for easy payment integration.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'types.dart';
import 'svm_pay_sdk.dart';

/// Callback for payment completion
typedef PaymentCallback = Future<void> Function(PaymentResult result);

/// Payment button widget
class PaymentButton extends StatefulWidget {
  /// Recipient address
  final String recipient;

  /// Amount to transfer
  final String amount;

  /// Target network
  final SVMNetwork? network;

  /// Optional SPL token mint
  final String? splToken;

  /// Button label
  final String? label;

  /// Payment message
  final String? message;

  /// Payment callback
  final PaymentCallback? onPayment;

  /// Button style
  final ButtonStyle? style;

  /// Loading indicator widget
  final Widget? loadingWidget;

  /// SVM-Pay SDK instance
  final SVMPay? svmPay;

  const PaymentButton({
    super.key,
    required this.recipient,
    required this.amount,
    this.network,
    this.splToken,
    this.label,
    this.message,
    this.onPayment,
    this.style,
    this.loadingWidget,
    this.svmPay,
  });

  @override
  State<PaymentButton> createState() => _PaymentButtonState();
}

class _PaymentButtonState extends State<PaymentButton> {
  bool _isLoading = false;
  late final SVMPay _svmPay;

  @override
  void initState() {
    super.initState();
    _svmPay = widget.svmPay ?? SVMPay();
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: widget.style,
      onPressed: _isLoading ? null : _handlePayment,
      child: _isLoading
          ? (widget.loadingWidget ?? const CircularProgressIndicator())
          : Text(widget.label ?? 'Pay ${widget.amount}'),
    );
  }

  Future<void> _handlePayment() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final request = TransferRequest(
        recipient: widget.recipient,
        amount: widget.amount,
        network: widget.network ?? _svmPay.config.defaultNetwork,
        splToken: widget.splToken,
        message: widget.message,
      );

      final result = await _svmPay.processPayment(request);

      if (widget.onPayment != null) {
        await widget.onPayment!(result);
      }

      if (result.status == PaymentStatus.failed && mounted) {
        _showErrorSnackBar(result.error ?? 'Payment failed');
      } else if (result.status == PaymentStatus.confirmed && mounted) {
        _showSuccessSnackBar('Payment successful');
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Payment error: $e');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }
}

/// QR Code widget for payment URLs
class PaymentQRCode extends StatelessWidget {
  /// Payment URL to encode
  final String paymentUrl;

  /// QR code size
  final double size;

  /// Error correction level
  final int errorCorrectionLevel;

  const PaymentQRCode({
    super.key,
    required this.paymentUrl,
    this.size = 200.0,
    this.errorCorrectionLevel = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.qr_code, size: 64),
            const SizedBox(height: 8),
            const Text('QR Code'),
            const SizedBox(height: 4),
            GestureDetector(
              onTap: () => _copyToClipboard(context),
              child: const Text(
                'Tap to copy URL',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _copyToClipboard(BuildContext context) {
    Clipboard.setData(ClipboardData(text: paymentUrl));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Payment URL copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

/// Payment form widget
class PaymentForm extends StatefulWidget {
  /// Initial recipient address
  final String? initialRecipient;

  /// Initial amount
  final String? initialAmount;

  /// Target network
  final SVMNetwork? network;

  /// Form submission callback
  final PaymentCallback? onSubmit;

  /// SVM-Pay SDK instance
  final SVMPay? svmPay;

  const PaymentForm({
    super.key,
    this.initialRecipient,
    this.initialAmount,
    this.network,
    this.onSubmit,
    this.svmPay,
  });

  @override
  State<PaymentForm> createState() => _PaymentFormState();
}

class _PaymentFormState extends State<PaymentForm> {
  final _formKey = GlobalKey<FormState>();
  final _recipientController = TextEditingController();
  final _amountController = TextEditingController();
  final _messageController = TextEditingController();

  late SVMNetwork _selectedNetwork;
  late final SVMPay _svmPay;

  @override
  void initState() {
    super.initState();
    _svmPay = widget.svmPay ?? SVMPay();
    _selectedNetwork = widget.network ?? _svmPay.config.defaultNetwork;

    if (widget.initialRecipient != null) {
      _recipientController.text = widget.initialRecipient!;
    }
    if (widget.initialAmount != null) {
      _amountController.text = widget.initialAmount!;
    }
  }

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          DropdownButtonFormField<SVMNetwork>(
            value: _selectedNetwork,
            decoration: const InputDecoration(
              labelText: 'Network',
              border: OutlineInputBorder(),
            ),
            items: SVMNetwork.values.map((network) {
              return DropdownMenuItem(
                value: network,
                child: Text(network.value.toUpperCase()),
              );
            }).toList(),
            onChanged: (value) {
              if (value != null) {
                setState(() {
                  _selectedNetwork = value;
                });
              }
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _recipientController,
            decoration: const InputDecoration(
              labelText: 'Recipient Address',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter recipient address';
              }
              if (!_svmPay.validateAddress(value, network: _selectedNetwork)) {
                return 'Invalid address for selected network';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _amountController,
            decoration: const InputDecoration(
              labelText: 'Amount',
              border: OutlineInputBorder(),
            ),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter amount';
              }
              final amount = double.tryParse(value);
              if (amount == null || amount <= 0) {
                return 'Please enter a valid amount';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _messageController,
            decoration: const InputDecoration(
              labelText: 'Message (Optional)',
              border: OutlineInputBorder(),
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _handleSubmit,
            child: const Text('Create Payment'),
          ),
        ],
      ),
    );
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final request = TransferRequest(
      recipient: _recipientController.text,
      amount: _amountController.text,
      network: _selectedNetwork,
      message: _messageController.text.isNotEmpty 
          ? _messageController.text 
          : null,
    );

    try {
      final result = await _svmPay.processPayment(request);
      
      if (widget.onSubmit != null) {
        await widget.onSubmit!(result);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}