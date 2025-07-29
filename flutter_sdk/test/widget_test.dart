import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:svm_pay/svm_pay.dart';

void main() {
  group('Payment Widget Tests', () {
    const testAddress = '11111111111111111111111111111112';
    
    testWidgets('PaymentButton should render correctly', (tester) async {
      bool paymentCallbackCalled = false;
      PaymentResult? capturedResult;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: PaymentButton(
              recipient: testAddress,
              amount: '1.0',
              label: 'Test Payment',
              message: 'Test message',
              onPayment: (result) async {
                paymentCallbackCalled = true;
                capturedResult = result;
              },
            ),
          ),
        ),
      );

      // Check if button is rendered
      expect(find.byType(PaymentButton), findsOneWidget);
      expect(find.text('Test Payment'), findsOneWidget);

      // Tap the button
      await tester.tap(find.byType(PaymentButton));
      await tester.pump();

      // Should show loading state
      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      // Wait for the payment to complete (mock implementation)
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Callback should have been called
      expect(paymentCallbackCalled, isTrue);
      expect(capturedResult, isNotNull);
      expect(capturedResult!.network, equals(SVMNetwork.solana));
    });

    testWidgets('PaymentButton should handle custom styling', (tester) async {
      const customStyle = ButtonStyle(
        backgroundColor: WidgetStatePropertyAll(Colors.red),
      );

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentButton(
              recipient: testAddress,
              amount: '2.5',
              style: customStyle,
            ),
          ),
        ),
      );

      final buttonWidget = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(buttonWidget.style, equals(customStyle));
    });

    testWidgets('PaymentButton should show custom loading widget', (tester) async {
      const customLoadingWidget = Text('Processing...');

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentButton(
              recipient: testAddress,
              amount: '1.0',
              loadingWidget: customLoadingWidget,
            ),
          ),
        ),
      );

      // Tap the button to trigger loading state
      await tester.tap(find.byType(PaymentButton));
      await tester.pump();

      // Should show custom loading widget
      expect(find.text('Processing...'), findsOneWidget);
      
      // Wait for completion to avoid timer issues
      await tester.pumpAndSettle(const Duration(seconds: 5));
    });

    testWidgets('PaymentForm should validate inputs correctly', (tester) async {
      final formKey = GlobalKey<FormState>();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Form(
              key: formKey,
              child: const PaymentForm(
                initialRecipient: 'invalid-address',
                initialAmount: '-1.0',
              ),
            ),
          ),
        ),
      );

      // Find the submit button and tap it
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle();

      // Should show validation errors
      expect(find.text('Invalid address for selected network'), findsOneWidget);
      expect(find.text('Please enter a valid amount'), findsOneWidget);
    });

    testWidgets('PaymentForm should handle valid inputs', (tester) async {
      bool submitCallbackCalled = false;
      PaymentResult? capturedResult;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: PaymentForm(
              initialRecipient: testAddress,
              initialAmount: '1.0',
              onSubmit: (result) async {
                submitCallbackCalled = true;
                capturedResult = result;
              },
            ),
          ),
        ),
      );

      // Submit the form
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Callback should have been called
      expect(submitCallbackCalled, isTrue);
      expect(capturedResult, isNotNull);
    });

    testWidgets('PaymentForm should handle network selection', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentForm(),
          ),
        ),
      );

      // Find the network dropdown
      final networkDropdown = find.byType(DropdownButtonFormField<SVMNetwork>);
      expect(networkDropdown, findsOneWidget);

      // Tap to open dropdown
      await tester.tap(networkDropdown);
      await tester.pumpAndSettle();

      // Should show network options in dropdown menu - check for unique option
      expect(find.descendant(
        of: find.byType(DropdownMenuItem<SVMNetwork>),
        matching: find.text('ECLIPSE'),
      ), findsOneWidget);

      // Select a different network
      await tester.tap(find.text('SONIC'));
      await tester.pumpAndSettle();

      // The dropdown should now show SONIC as selected
      expect(find.text('SONIC'), findsOneWidget);
    });

    testWidgets('PaymentForm should validate amount input', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentForm(),
          ),
        ),
      );

      // Enter invalid amounts and test validation
      final amountField = find.byType(TextFormField).at(1); // Amount field is second

      // Test empty amount
      await tester.enterText(amountField, '');
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter amount'), findsOneWidget);

      // Test invalid amount
      await tester.enterText(amountField, 'abc');
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid amount'), findsOneWidget);

      // Test negative amount
      await tester.enterText(amountField, '-5.0');
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid amount'), findsOneWidget);

      // Test zero amount
      await tester.enterText(amountField, '0');
      await tester.tap(find.text('Create Payment'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid amount'), findsOneWidget);
    });

    testWidgets('PaymentQRCode should render correctly', (tester) async {
      const testUrl = 'solana://11111111111111111111111111111112?amount=1.0';

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentQRCode(
              paymentUrl: testUrl,
              size: 200,
            ),
          ),
        ),
      );

      // Should show QR code container
      final container = find.byType(Container);
      expect(container, findsOneWidget);

      // Should show QR code icon and text
      expect(find.byIcon(Icons.qr_code), findsOneWidget);
      expect(find.text('QR Code'), findsOneWidget);
      expect(find.text('Tap to copy URL'), findsOneWidget);

      // Tap to copy URL
      await tester.tap(find.text('Tap to copy URL'));
      await tester.pumpAndSettle();

      // Should show success snackbar
      expect(find.text('Payment URL copied to clipboard'), findsOneWidget);
    });

    testWidgets('PaymentQRCode should handle custom size', (tester) async {
      const testUrl = 'solana://11111111111111111111111111111112?amount=1.0';
      const customSize = 300.0;

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentQRCode(
              paymentUrl: testUrl,
              size: customSize,
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(find.byType(Container));
      expect(container.constraints?.maxWidth, equals(customSize));
      expect(container.constraints?.maxHeight, equals(customSize));
    });

    testWidgets('PaymentForm should handle message input', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentForm(),
          ),
        ),
      );

      // Find the message field (last text field)
      final messageField = find.byType(TextFormField).last;

      // Enter a message
      const testMessage = 'This is a test payment message';
      await tester.enterText(messageField, testMessage);

      // The message should be stored
      final textField = tester.widget<TextFormField>(messageField);
      expect(textField.controller?.text, equals(testMessage));
    });

    testWidgets('Widgets should handle SDK configuration', (tester) async {
      final customSvmPay = SVMPay(
        config: const SVMPayConfig(
          defaultNetwork: SVMNetwork.sonic,
          debug: true,
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                PaymentButton(
                  recipient: testAddress,
                  amount: '1.0',
                  svmPay: customSvmPay,
                ),
                PaymentForm(
                  network: SVMNetwork.sonic,
                  svmPay: customSvmPay,
                ),
              ],
            ),
          ),
        ),
      );

      // Widgets should use the custom SDK configuration
      expect(find.byType(PaymentButton), findsOneWidget);
      expect(find.byType(PaymentForm), findsOneWidget);

      // The form should have Sonic selected by default
      expect(find.text('SONIC'), findsOneWidget);
    });

    testWidgets('PaymentButton should show error snackbar on failure', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentButton(
              recipient: '', // Empty address will cause validation failure
              amount: '1.0',
            ),
          ),
        ),
      );

      // Tap the button
      await tester.tap(find.byType(PaymentButton));
      await tester.pump(); // Initial pump to trigger the async operation
      await tester.pump(const Duration(milliseconds: 100)); // Wait for setState
      
      // Should show error snackbar
      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.text('Invalid recipient address'), findsOneWidget);
    });

    testWidgets('Widgets should handle loading states correctly', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PaymentButton(
              recipient: testAddress,
              amount: '1.0',
            ),
          ),
        ),
      );

      // Initial state - button should be enabled
      final button = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(button.onPressed, isNotNull);

      // Tap to start loading
      await tester.tap(find.byType(PaymentButton));
      await tester.pump(); // Only pump once to catch loading state

      // Should be in loading state
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      
      // Button should be disabled during loading
      final loadingButton = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(loadingButton.onPressed, isNull);
      
      // Wait for the payment to complete to clean up timers
      await tester.pumpAndSettle(const Duration(seconds: 5));
    });
  });
}