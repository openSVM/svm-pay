import 'package:flutter/material.dart';
import 'package:svm_pay/svm_pay.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SVM-Pay Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late final SVMPay _svmPay;
  String _balance = 'Loading...';
  String _lastPaymentResult = 'No payments yet';

  @override
  void initState() {
    super.initState();
    _svmPay = SVMPay(
      config: const SVMPayConfig(
        defaultNetwork: SVMNetwork.solana,
        debug: true,
      ),
    );
    _loadBalance();
  }

  Future<void> _loadBalance() async {
    try {
      // Example wallet address (replace with actual address)
      const sampleAddress = '11111111111111111111111111111112';
      final balance = await _svmPay.getWalletBalance(sampleAddress);
      setState(() {
        _balance = '$balance SOL';
      });
    } catch (e) {
      setState(() {
        _balance = 'Error loading balance';
      });
    }
  }

  Future<void> _handlePayment(PaymentResult result) async {
    setState(() {
      _lastPaymentResult = 'Status: ${result.status.value}';
      if (result.signature != null) {
        _lastPaymentResult += '\nSignature: ${result.signature!.substring(0, 20)}...';
      }
      if (result.error != null) {
        _lastPaymentResult += '\nError: ${result.error}';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SVM-Pay Flutter Demo'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Balance Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Wallet Balance',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _balance,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: _loadBalance,
                      child: const Text('Refresh Balance'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Quick Payment Button
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Quick Payment',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    PaymentButton(
                      recipient: '11111111111111111111111111111112',
                      amount: '1.0',
                      label: 'Pay 1.0 SOL',
                      message: 'Demo payment from Flutter SDK',
                      onPayment: _handlePayment,
                      svmPay: _svmPay,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 48),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Payment Form
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Custom Payment',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    PaymentForm(
                      initialRecipient: '11111111111111111111111111111112',
                      initialAmount: '0.5',
                      network: SVMNetwork.solana,
                      onSubmit: _handlePayment,
                      svmPay: _svmPay,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Payment URL Demo
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Payment URL Demo',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        final url = _svmPay.createTransferUrl(
                          '11111111111111111111111111111112',
                          '2.5',
                          label: 'Coffee Shop',
                          message: 'Payment for coffee',
                        );
                        
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Payment URL'),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                PaymentQRCode(
                                  paymentUrl: url,
                                  size: 200,
                                ),
                                const SizedBox(height: 16),
                                SelectableText(
                                  url,
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        );
                      },
                      child: const Text('Generate Payment URL'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Last Payment Result
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Last Payment Result',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _lastPaymentResult,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
