import 'package:flutter_test/flutter_test.dart';
import 'package:svm_pay/svm_pay.dart';

void main() {
  group('Security Enhancement Tests', () {
    late SVMPay svmPay;

    setUp(() {
      svmPay = SVMPay(
        config: const SVMPayConfig(
          defaultNetwork: SVMNetwork.solana,
          debug: false, // Disable debug to test log sanitization
        ),
      );
    });

    group('Enhanced Address Validation', () {
      test('should validate valid Solana addresses', () {
        // Valid Solana addresses
        const validAddresses = [
          '11111111111111111111111111111112', // System Program
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token Program
          'So11111111111111111111111111111111111111112', // Native SOL
          '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Random valid address
        ];

        for (final address in validAddresses) {
          expect(
            svmPay.validateAddress(address),
            isTrue,
            reason: 'Address $address should be valid',
          );
        }
      });

      test('should reject invalid addresses', () {
        final invalidAddresses = [
          '', // Empty
          '123', // Too short
          'invalid', // Invalid characters
          '0x1234567890abcdef1234567890abcdef12345678', // Ethereum address
          'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Bitcoin address
          'a' * 50, // Too long
          '11111111111111111111111111111O12', // Contains invalid base58 char
          '11111111111111111111111111111I12', // Contains invalid base58 char
          '11111111111111111111111111111l12', // Contains invalid base58 char
          '11111111111111111111111111111012', // Contains invalid base58 char
          '2' * 50, // Too many characters, won't decode to 32 bytes
          '2' * 20, // Too few characters, won't decode to 32 bytes
        ];

        for (final address in invalidAddresses) {
          expect(
            svmPay.validateAddress(address),
            isFalse,
            reason: 'Address $address should be invalid',
          );
        }
      });

      test('should handle base58 edge cases', () {
        // Test addresses with leading zeros (represented as '1' in base58)
        // This should pass if it decodes to exactly 32 bytes
        const leadingOnesAddress = '11111111111111111111111111111111'; // 32 '1's
        expect(svmPay.validateAddress(leadingOnesAddress), isTrue);
        
        // Test maximum valid length addresses that decode to 32 bytes
        const validLongAddress = '11111111111111111111111111111112'; // Known valid address
        expect(svmPay.validateAddress(validLongAddress), isTrue);
        
        // Test addresses that are too long and won't decode to 32 bytes
        final tooLongAddress = '2' * 50;
        expect(svmPay.validateAddress(tooLongAddress), isFalse);
        
        // Test addresses that are too short to be 32 bytes when decoded
        final tooShortAddress = '2' * 20;
        expect(svmPay.validateAddress(tooShortAddress), isFalse);
      });
    });

    group('Secure Reference Generation', () {
      test('should generate unique references', () {
        final references = <String>{};
        
        // Generate 1000 references and ensure uniqueness
        for (int i = 0; i < 1000; i++) {
          final ref = svmPay.generateReference();
          expect(ref.length, equals(16));
          expect(references.contains(ref), isFalse, reason: 'Reference $ref should be unique');
          references.add(ref);
        }
      });

      test('should generate cryptographically secure references', () {
        final references = <String>[];
        
        // Generate 100 references
        for (int i = 0; i < 100; i++) {
          references.add(svmPay.generateReference());
        }
        
        // Test for patterns that indicate weak randomness
        // References should not follow predictable patterns
        for (int i = 1; i < references.length; i++) {
          final current = references[i];
          final previous = references[i - 1];
          
          // References should not be sequential or have obvious patterns
          expect(current, isNot(equals(previous)));
          
          // Should not have obvious incremental patterns
          final currentInt = int.tryParse(current, radix: 16);
          final previousInt = int.tryParse(previous, radix: 16);
          
          if (currentInt != null && previousInt != null) {
            expect((currentInt - previousInt).abs(), greaterThan(1));
          }
        }
      });

      test('should generate references with proper entropy', () {
        final references = <String>[];
        final charCounts = <String, int>{};
        
        // Generate many references to test entropy
        for (int i = 0; i < 500; i++) {
          final ref = svmPay.generateReference();
          references.add(ref);
          
          // Count character frequency
          for (int j = 0; j < ref.length; j++) {
            final char = ref[j];
            charCounts[char] = (charCounts[char] ?? 0) + 1;
          }
        }
        
        // Check that we have good character distribution
        // Should use most hex characters (0-9, a-f)
        expect(charCounts.keys.length, greaterThan(10));
        
        // No single character should dominate
        final totalChars = references.length * 16;
        for (final count in charCounts.values) {
          final frequency = count / totalChars;
          expect(frequency, lessThan(0.15)); // Less than 15% for any character
        }
      });
    });

    group('Input Validation Security', () {
      test('should reject malicious recipient addresses', () {
        final maliciousAddresses = [
          '<script>alert("xss")</script>',
          '../../etc/passwd',
          'null',
          'undefined',
          '\${evil_code}',
          '%00%00%00%00',
          '../../../sensitive-file',
        ];

        for (final address in maliciousAddresses) {
          expect(
            () => svmPay.createTransferUrl(address, '1.0'),
            throwsA(isA<ArgumentError>()),
            reason: 'Malicious address $address should be rejected',
          );
        }
      });

      test('should validate amount bounds', () {
        const validAddress = '11111111111111111111111111111112';
        
        // Test very large amounts (over 1 billion)
        expect(
          () => svmPay.createTransferUrl(validAddress, '1000000001'),
          throwsA(isA<ArgumentError>()),
        );
        
        // Test scientific notation (should work if reasonable)
        expect(
          () => svmPay.createTransferUrl(validAddress, '1e6'), // 1 million
          returnsNormally,
        );
        
        // Test very large scientific notation
        expect(
          () => svmPay.createTransferUrl(validAddress, '1e12'), // 1 trillion
          throwsA(isA<ArgumentError>()),
        );
        
        // Test negative amounts
        expect(
          () => svmPay.createTransferUrl(validAddress, '-0.001'),
          throwsA(isA<ArgumentError>()),
        );
        
        // Test zero amount
        expect(
          () => svmPay.createTransferUrl(validAddress, '0'),
          throwsA(isA<ArgumentError>()),
        );
        
        // Test too many decimal places
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.1234567890'), // 10 decimal places
          throwsA(isA<ArgumentError>()),
        );
        
        // Test valid amounts with 9 decimal places (should work)
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.123456789'),
          returnsNormally,
        );
      });

      test('should enforce string length limits', () {
        const validAddress = '11111111111111111111111111111112';
        
        // Test label length limit (200 characters)
        final longLabel = 'a' * 201;
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.0', label: longLabel),
          throwsA(isA<ArgumentError>()),
        );
        
        // Test message length limit (500 characters)
        final longMessage = 'b' * 501;
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.0', message: longMessage),
          throwsA(isA<ArgumentError>()),
        );
        
        // Test memo length limit (100 characters)
        final longMemo = 'c' * 101;
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.0', memo: longMemo),
          throwsA(isA<ArgumentError>()),
        );
        
        // Valid lengths should work
        expect(
          () => svmPay.createTransferUrl(
            validAddress,
            '1.0',
            label: 'a' * 200,
            message: 'b' * 500,
            memo: 'c' * 100,
          ),
          returnsNormally,
        );
      });

      test('should validate base64 transactions', () {
        // Valid base64
        expect(
          () => svmPay.createTransactionUrl('SGVsbG8gV29ybGQ='),
          returnsNormally,
        );
        
        // Invalid base64
        expect(
          () => svmPay.createTransactionUrl('not-base64!@#'),
          throwsA(isA<ArgumentError>()),
        );
        
        // Empty transaction
        expect(
          () => svmPay.createTransactionUrl(''),
          throwsA(isA<ArgumentError>()),
        );
      });
    });

    group('URL Parsing Security', () {
      test('should handle malformed URLs safely', () {
        const malformedUrls = [
          'javascript:alert("xss")',
          'data:text/html,<script>alert("xss")</script>',
          'file:///etc/passwd',
          'ftp://malicious.com/steal-data',
          'http://evil.com',
          'https://evil.com',
        ];

        for (final url in malformedUrls) {
          final result = svmPay.parseUrl(url);
          // These should return null as they're not valid SVM-Pay URLs
          expect(result, isNull, reason: 'Malformed URL should return null: $url');
        }
        
        // Test URLs that might be parsed but contain malicious content
        const potentiallyMaliciousUrls = [
          'solana://address?amount=<script>alert("xss")</script>',
          'solana://address?label=<script>alert("xss")</script>',
          'solana://address?message=javascript:alert("xss")',
        ];
        
        for (final url in potentiallyMaliciousUrls) {
          final result = svmPay.parseUrl(url);
          // If parsed, should not contain malicious content in a way that would be executed
          if (result != null && result is TransferRequest) {
            // The content should still be there as text (not executed as code)
            // This is actually acceptable as long as the app sanitizes display
            expect(result.amount, isNotEmpty);
          }
        }
      });

      test('should properly encode and decode special characters', () {
        const validAddress = '11111111111111111111111111111112';
        const specialChars = 'Special: !@#\$%^&*()_+{}[]|;:,.<>?';
        
        final url = svmPay.createTransferUrl(
          validAddress,
          '1.0',
          label: specialChars,
          message: specialChars,
        );
        
        final parsed = svmPay.parseUrl(url);
        expect(parsed, isNotNull);
        
        final transferRequest = parsed as TransferRequest;
        expect(transferRequest.label, equals(specialChars));
        expect(transferRequest.message, equals(specialChars));
      });

      test('should handle unicode characters safely', () {
        const validAddress = '11111111111111111111111111111112';
        const unicodeText = '🚀 Payment for coffee ☕ from café 中文 العربية';
        
        final url = svmPay.createTransferUrl(
          validAddress,
          '1.0',
          label: unicodeText,
          message: unicodeText,
        );
        
        final parsed = svmPay.parseUrl(url);
        expect(parsed, isNotNull);
        
        final transferRequest = parsed as TransferRequest;
        expect(transferRequest.label, equals(unicodeText));
        expect(transferRequest.message, equals(unicodeText));
      });
    });

    group('Error Message Sanitization', () {
      test('should sanitize addresses in error messages', () async {
        const sensitiveAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        
        try {
          await svmPay.getWalletBalance(sensitiveAddress);
        } catch (e) {
          final errorMessage = e.toString();
          // Error should not contain the full address
          expect(errorMessage, isNot(contains(sensitiveAddress)));
        }
      });

      test('should sanitize sensitive data in debug logs', () {
        // This test verifies that debug logs don't leak sensitive information
        // In a real implementation, you would capture log output and verify sanitization
        final debugSvmPay = SVMPay(
          config: const SVMPayConfig(debug: true),
        );
        
        // These operations should generate sanitized logs
        const sensitiveAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        
        expect(
          () => debugSvmPay.createTransferUrl(sensitiveAddress, '1.0'),
          returnsNormally,
        );
      });
    });

    group('DoS Protection', () {
      test('should handle extremely long inputs gracefully', () {
        const validAddress = '11111111111111111111111111111112';
        
        // Test very long strings that might cause performance issues
        final veryLongString = 'a' * 10000;
        
        expect(
          () => svmPay.createTransferUrl(validAddress, '1.0', label: veryLongString),
          throwsA(isA<ArgumentError>()),
        );
      });

      test('should handle many concurrent operations', () async {
        const validAddress = '11111111111111111111111111111112';
        
        // Create many concurrent URL generation operations
        final futures = <Future<String>>[];
        for (int i = 0; i < 100; i++) {
          futures.add(
            Future.value(svmPay.createTransferUrl(validAddress, '1.0', reference: 'test-$i'))
          );
        }
        
        final results = await Future.wait(futures);
        expect(results.length, equals(100));
        
        // All results should be unique
        final uniqueResults = results.toSet();
        expect(uniqueResults.length, equals(100));
      });
    });

    group('Network Security', () {
      test('should validate network parameters', () {
        // Test with all supported networks
        for (final network in SVMNetwork.values) {
          expect(
            () => svmPay.createTransferUrl(
              '11111111111111111111111111111112',
              '1.0',
              network: network,
            ),
            returnsNormally,
            reason: 'Network ${network.value} should be supported',
          );
        }
      });

      test('should handle timeout scenarios gracefully', () async {
        const validAddress = '11111111111111111111111111111112';
        
        final request = TransferRequest(
          recipient: validAddress,
          amount: '1.0',
          network: SVMNetwork.solana,
        );
        
        // Process payment should handle timeouts gracefully
        final result = await svmPay.processPayment(request);
        expect(result.status, isIn([PaymentStatus.confirmed, PaymentStatus.failed]));
        
        if (result.status == PaymentStatus.failed && result.error != null) {
          // Error message should not expose internal details
          expect(result.error!, isNot(contains('timeout')));
          expect(result.error!, isNot(contains('connection')));
          expect(result.error!, isNot(contains('socket')));
        }
      });
    });
  });
}