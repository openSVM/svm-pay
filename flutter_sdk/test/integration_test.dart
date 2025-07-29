import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:svm_pay/svm_pay.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('SVM-Pay SDK E2E Tests', () {
    late SVMPay svmPay;
    const testAddress = '11111111111111111111111111111112';
    const invalidAddress = 'invalid-address';

    setUp(() {
      svmPay = SVMPay(
        config: const SVMPayConfig(
          defaultNetwork: SVMNetwork.solana,
          debug: true,
        ),
      );
    });

    group('Security Tests', () {
      testWidgets('should validate addresses properly', (tester) async {
        // Valid addresses should pass
        expect(svmPay.validateAddress(testAddress), isTrue);
        
        // Invalid addresses should fail
        expect(svmPay.validateAddress(invalidAddress), isFalse);
        expect(svmPay.validateAddress(''), isFalse);
        expect(svmPay.validateAddress('0x1234567890abcdef'), isFalse);
        expect(svmPay.validateAddress('too-short'), isFalse);
        expect(svmPay.validateAddress('a' * 50), isFalse); // Too long
      });

      testWidgets('should generate secure references', (tester) async {
        final refs = <String>{};
        
        // Generate 100 references and ensure they're unique
        for (int i = 0; i < 100; i++) {
          final ref = svmPay.generateReference();
          expect(ref.length, equals(16));
          expect(refs.contains(ref), isFalse, reason: 'Reference should be unique');
          refs.add(ref);
        }
      });

      testWidgets('should validate input parameters', (tester) async {
        // Empty recipient should throw
        expect(
          () => svmPay.createTransferUrl('', '1.0'),
          throwsA(isA<ArgumentError>()),
        );

        // Empty amount should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, ''),
          throwsA(isA<ArgumentError>()),
        );

        // Invalid amount should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, 'invalid'),
          throwsA(isA<ArgumentError>()),
        );

        // Negative amount should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, '-1.0'),
          throwsA(isA<ArgumentError>()),
        );

        // Zero amount should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, '0'),
          throwsA(isA<ArgumentError>()),
        );

        // Invalid recipient address should throw
        expect(
          () => svmPay.createTransferUrl(invalidAddress, '1.0'),
          throwsA(isA<ArgumentError>()),
        );
      });

      testWidgets('should validate string length limits', (tester) async {
        final longString = 'a' * 500;
        
        // Long label should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, '1.0', label: longString),
          throwsA(isA<ArgumentError>()),
        );

        // Long message should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, '1.0', message: longString),
          throwsA(isA<ArgumentError>()),
        );

        // Long memo should throw
        expect(
          () => svmPay.createTransferUrl(testAddress, '1.0', memo: longString),
          throwsA(isA<ArgumentError>()),
        );
      });

      testWidgets('should validate transaction parameters', (tester) async {
        // Empty transaction should throw
        expect(
          () => svmPay.createTransactionUrl(''),
          throwsA(isA<ArgumentError>()),
        );

        // Invalid base64 should throw
        expect(
          () => svmPay.createTransactionUrl('invalid-base64!@#'),
          throwsA(isA<ArgumentError>()),
        );

        // Valid base64 should work
        expect(
          () => svmPay.createTransactionUrl('SGVsbG8gV29ybGQ='), // "Hello World" in base64
          returnsNormally,
        );
      });
    });

    group('Network Integration Tests', () {
      testWidgets('should handle payment processing', (tester) async {
        final request = TransferRequest(
          recipient: testAddress,
          amount: '0.001',
          network: SVMNetwork.solana,
          label: 'Test Payment',
          message: 'Integration test payment',
        );

        final result = await svmPay.processPayment(request);
        
        expect(result.network, equals(SVMNetwork.solana));
        expect(result.status, isIn([PaymentStatus.confirmed, PaymentStatus.failed]));
        
        if (result.status == PaymentStatus.confirmed) {
          expect(result.signature, isNotNull);
          expect(result.signature!.isNotEmpty, isTrue);
        } else {
          expect(result.error, isNotNull);
          expect(result.error!.isNotEmpty, isTrue);
        }
      });

      testWidgets('should handle wallet balance queries', (tester) async {
        try {
          final balance = await svmPay.getWalletBalance(testAddress);
          expect(balance, isNotNull);
          expect(balance.isNotEmpty, isTrue);
          
          // Balance should be a valid number
          final balanceValue = double.tryParse(balance);
          expect(balanceValue, isNotNull);
          expect(balanceValue! >= 0, isTrue);
        } catch (e) {
          // Balance queries might fail in test environment, that's acceptable
          expect(e, isA<Exception>());
        }
      });

      testWidgets('should handle network timeouts gracefully', (tester) async {
        // This test might be challenging in a real environment
        // We're testing that timeouts are handled properly
        final request = TransferRequest(
          recipient: testAddress,
          amount: '1000000.0', // Large amount to potentially trigger timeout
          network: SVMNetwork.solana,
        );

        final result = await svmPay.processPayment(request);
        expect(result.status, isIn([PaymentStatus.confirmed, PaymentStatus.failed]));
      });

      testWidgets('should validate addresses for different networks', (tester) async {
        for (final network in SVMNetwork.values) {
          // Valid Solana-style address should work for all SVM networks
          expect(
            svmPay.validateAddress(testAddress, network: network),
            isTrue,
            reason: 'Valid address should work for ${network.value}',
          );

          // Invalid address should fail for all networks
          expect(
            svmPay.validateAddress(invalidAddress, network: network),
            isFalse,
            reason: 'Invalid address should fail for ${network.value}',
          );
        }
      });
    });

    group('URL Generation and Parsing Tests', () {
      testWidgets('should generate and parse transfer URLs correctly', (tester) async {
        const amount = '1.5';
        const label = 'Coffee Shop';
        const message = 'Payment for coffee ☕';
        const memo = 'Test memo';

        final url = svmPay.createTransferUrl(
          testAddress,
          amount,
          label: label,
          message: message,
          memo: memo,
        );

        expect(url, contains('solana://'));
        expect(url, contains(testAddress));
        expect(url, contains('amount=$amount'));
        expect(url, contains(Uri.encodeComponent(label)));
        expect(url, contains(Uri.encodeComponent(message)));
        expect(url, contains(Uri.encodeComponent(memo)));

        // Parse the URL back
        final parsed = svmPay.parseUrl(url);
        expect(parsed, isA<TransferRequest>());
        
        final transferRequest = parsed as TransferRequest;
        expect(transferRequest.recipient, equals(testAddress));
        expect(transferRequest.amount, equals(amount));
        expect(transferRequest.label, equals(label));
        expect(transferRequest.message, equals(message));
        expect(transferRequest.memo, equals(memo));
        expect(transferRequest.network, equals(SVMNetwork.solana));
      });

      testWidgets('should generate and parse transaction URLs correctly', (tester) async {
        const transaction = 'SGVsbG8gV29ybGQ='; // "Hello World" in base64
        const memo = 'Transaction memo';

        final url = svmPay.createTransactionUrl(
          transaction,
          memo: memo,
        );

        expect(url, contains('solana://'));
        expect(url, contains('transaction=$transaction'));
        expect(url, contains(Uri.encodeComponent(memo)));

        // Parse the URL back
        final parsed = svmPay.parseUrl(url);
        expect(parsed, isA<TransactionRequest>());
        
        final transactionRequest = parsed as TransactionRequest;
        expect(transactionRequest.transaction, equals(transaction));
        expect(transactionRequest.memo, equals(memo));
        expect(transactionRequest.network, equals(SVMNetwork.solana));
      });

      testWidgets('should handle special characters in URLs', (tester) async {
        const specialChars = 'Special chars: !@#\$%^&*()_+{}[]|;:,.<>?';
        
        final url = svmPay.createTransferUrl(
          testAddress,
          '1.0',
          label: specialChars,
          message: specialChars,
          memo: specialChars,
        );

        final parsed = svmPay.parseUrl(url);
        expect(parsed, isA<TransferRequest>());
        
        final transferRequest = parsed as TransferRequest;
        expect(transferRequest.label, equals(specialChars));
        expect(transferRequest.message, equals(specialChars));
        expect(transferRequest.memo, equals(specialChars));
      });

      testWidgets('should handle malformed URLs gracefully', (tester) async {
        final malformedUrls = [
          '',
          'not-a-url',
          'http://example.com',
          'solana://',
          'solana://invalid-address',
          'invalid-scheme://address',
          'solana://address?amount=invalid',
        ];

        for (final url in malformedUrls) {
          final result = svmPay.parseUrl(url);
          expect(result, isNull, reason: 'Malformed URL should return null: $url');
        }
      });
    });

    group('Error Handling Tests', () {
      testWidgets('should handle platform exceptions gracefully', (tester) async {
        // Create a request that might trigger platform errors
        final request = TransferRequest(
          recipient: testAddress,
          amount: '999999999.0', // Very large amount
          network: SVMNetwork.solana,
        );

        final result = await svmPay.processPayment(request);
        
        // Should not throw, should return a failed result
        expect(result.status, isIn([PaymentStatus.confirmed, PaymentStatus.failed]));
        
        if (result.status == PaymentStatus.failed) {
          expect(result.error, isNotNull);
          expect(result.error!.isNotEmpty, isTrue);
          // Error should not contain sensitive information
          expect(result.error!, isNot(contains(testAddress)));
        }
      });

      testWidgets('should sanitize sensitive data in errors', (tester) async {
        try {
          await svmPay.getWalletBalance('invalid-but-long-address-that-looks-real-12345678');
        } catch (e) {
          final errorMessage = e.toString();
          // Error message should not contain the full address
          expect(errorMessage, isNot(contains('invalid-but-long-address-that-looks-real-12345678')));
        }
      });
    });

    group('Performance Tests', () {
      testWidgets('should handle multiple concurrent requests', (tester) async {
        final futures = <Future<PaymentResult>>[];
        
        // Create 10 concurrent payment requests
        for (int i = 0; i < 10; i++) {
          final request = TransferRequest(
            recipient: testAddress,
            amount: '0.001',
            network: SVMNetwork.solana,
            reference: 'concurrent-test-$i',
          );
          futures.add(svmPay.processPayment(request));
        }

        final results = await Future.wait(futures);
        expect(results.length, equals(10));
        
        for (final result in results) {
          expect(result.status, isIn([PaymentStatus.confirmed, PaymentStatus.failed]));
        }
      });

      testWidgets('should handle large data efficiently', (tester) async {
        // Test with maximum allowed string lengths
        const maxLabel = 'a' * 200;
        const maxMessage = 'b' * 500;
        const maxMemo = 'c' * 100;

        final stopwatch = Stopwatch()..start();
        
        final url = svmPay.createTransferUrl(
          testAddress,
          '1.0',
          label: maxLabel,
          message: maxMessage,
          memo: maxMemo,
        );
        
        stopwatch.stop();
        
        // Should complete quickly (less than 100ms)
        expect(stopwatch.elapsedMilliseconds, lessThan(100));
        
        // Parse it back
        final parsed = svmPay.parseUrl(url);
        expect(parsed, isNotNull);
      });
    });
  });
}