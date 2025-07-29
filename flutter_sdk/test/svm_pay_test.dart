import 'package:flutter_test/flutter_test.dart';
import 'package:svm_pay/svm_pay.dart';

void main() {
  group('SVM-Pay Flutter SDK', () {
    late SVMPay svmPay;

    setUp(() {
      svmPay = SVMPay(
        config: const SVMPayConfig(
          defaultNetwork: SVMNetwork.solana,
          debug: false,
        ),
      );
    });

    test('should create transfer URL correctly', () {
      final url = svmPay.createTransferUrl(
        '11111111111111111111111111111112',
        '1.5',
        label: 'Test Payment',
        message: 'Test message',
      );

      expect(url, contains('solana://'));
      expect(url, contains('11111111111111111111111111111112'));
      expect(url, contains('amount=1.5'));
      expect(url, contains('label=Test%20Payment'));
      expect(url, contains('message=Test%20message'));
    });

    test('should create transaction URL correctly', () {
      final url = svmPay.createTransactionUrl(
        'base64encodedtransaction',
        network: SVMNetwork.solana,
        memo: 'Test memo',
      );

      expect(url, contains('solana://'));
      expect(url, contains('transaction=base64encodedtransaction'));
      expect(url, contains('memo=Test%20memo'));
    });

    test('should parse transfer URL correctly', () {
      const testUrl = 'solana://11111111111111111111111111111112?amount=2.5&label=Coffee&message=Payment%20for%20coffee';
      
      final request = svmPay.parseUrl(testUrl);
      
      expect(request, isA<TransferRequest>());
      final transferRequest = request as TransferRequest;
      expect(transferRequest.recipient, equals('11111111111111111111111111111112'));
      expect(transferRequest.amount, equals('2.5'));
      expect(transferRequest.label, equals('Coffee'));
      expect(transferRequest.message, equals('Payment for coffee'));
      expect(transferRequest.network, equals(SVMNetwork.solana));
    });

    test('should parse transaction URL correctly', () {
      const testUrl = 'solana://?transaction=base64transaction&memo=Test%20memo';
      
      final request = svmPay.parseUrl(testUrl);
      
      expect(request, isA<TransactionRequest>());
      final transactionRequest = request as TransactionRequest;
      expect(transactionRequest.transaction, equals('base64transaction'));
      expect(transactionRequest.memo, equals('Test memo'));
      expect(transactionRequest.network, equals(SVMNetwork.solana));
    });

    test('should validate Solana addresses correctly', () {
      // Valid Solana address
      expect(
        svmPay.validateAddress('11111111111111111111111111111112'),
        isTrue,
      );

      // Invalid addresses
      expect(svmPay.validateAddress(''), isFalse);
      expect(svmPay.validateAddress('invalid'), isFalse);
      expect(svmPay.validateAddress('0x1234567890abcdef'), isFalse);
    });

    test('should generate unique references', () {
      final ref1 = svmPay.generateReference();
      final ref2 = svmPay.generateReference();
      
      expect(ref1, isNotEmpty);
      expect(ref2, isNotEmpty);
      expect(ref1, isNot(equals(ref2)));
      expect(ref1.length, equals(16));
      expect(ref2.length, equals(16));
    });

    test('should handle invalid URLs gracefully', () {
      expect(svmPay.parseUrl('invalid-url'), isNull);
      expect(svmPay.parseUrl('http://example.com'), isNull);
      expect(svmPay.parseUrl(''), isNull);
    });
  });

  group('Network Adapters', () {
    test('should validate addresses for different networks', () {
      final solanaAdapter = SolanaNetworkAdapter();
      final sonicAdapter = SonicNetworkAdapter();
      final eclipseAdapter = EclipseNetworkAdapter();
      final soonAdapter = SoonNetworkAdapter();

      const validAddress = '11111111111111111111111111111112';
      const invalidAddress = 'invalid';

      expect(solanaAdapter.validateAddress(validAddress), isTrue);
      expect(sonicAdapter.validateAddress(validAddress), isTrue);
      expect(eclipseAdapter.validateAddress(validAddress), isTrue);
      expect(soonAdapter.validateAddress(validAddress), isTrue);

      expect(solanaAdapter.validateAddress(invalidAddress), isFalse);
      expect(sonicAdapter.validateAddress(invalidAddress), isFalse);
      expect(eclipseAdapter.validateAddress(invalidAddress), isFalse);
      expect(soonAdapter.validateAddress(invalidAddress), isFalse);
    });

    test('should provide correct network configurations', () {
      final solanaAdapter = SolanaNetworkAdapter();
      final config = solanaAdapter.getNetworkConfig();

      expect(config['name'], equals('Solana'));
      expect(config['symbol'], equals('SOL'));
      expect(config['decimals'], equals(9));
    });
  });

  group('Payment Types', () {
    test('should create TransferRequest correctly', () {
      const request = TransferRequest(
        recipient: '11111111111111111111111111111112',
        amount: '1.0',
        network: SVMNetwork.solana,
        label: 'Test',
        message: 'Test payment',
      );

      expect(request.type, equals(RequestType.transfer));
      expect(request.network, equals(SVMNetwork.solana));
      expect(request.recipient, equals('11111111111111111111111111111112'));
      expect(request.amount, equals('1.0'));
      expect(request.label, equals('Test'));
      expect(request.message, equals('Test payment'));
    });

    test('should create TransactionRequest correctly', () {
      const request = TransactionRequest(
        transaction: 'base64transaction',
        network: SVMNetwork.solana,
        memo: 'Test memo',
      );

      expect(request.type, equals(RequestType.transaction));
      expect(request.network, equals(SVMNetwork.solana));
      expect(request.transaction, equals('base64transaction'));
      expect(request.memo, equals('Test memo'));
    });

    test('should serialize requests to JSON correctly', () {
      const transferRequest = TransferRequest(
        recipient: '11111111111111111111111111111112',
        amount: '1.0',
        network: SVMNetwork.solana,
        label: 'Test',
      );

      final json = transferRequest.toJson();
      expect(json['type'], equals('transfer'));
      expect(json['network'], equals('solana'));
      expect(json['recipient'], equals('11111111111111111111111111111112'));
      expect(json['amount'], equals('1.0'));
      expect(json['label'], equals('Test'));
    });
  });
}