// This is a basic Flutter integration test.
//
// Since integration tests run in a full Flutter application, they can interact
// with the host side of a plugin implementation, unlike Dart unit tests.
//
// For more information about Flutter integration tests, please see
// https://flutter.dev/to/integration-testing


import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:svm_pay/svm_pay.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('SVMPay integration test', (WidgetTester tester) async {
    final SVMPay svmPay = SVMPay();
    
    // Test basic SDK functionality
    const testRecipient = '11111111111111111111111111111112';
    const testAmount = '1.0';
    
    final url = svmPay.createTransferUrl(
      testRecipient,
      testAmount,
      label: 'Test Payment',
      message: 'Integration test payment',
    );
    
    // Verify URL was generated successfully
    expect(url.isNotEmpty, true);
    expect(url.contains(testRecipient), true);
    expect(url.contains(testAmount), true);
    
    // Clean up
    svmPay.dispose();
  });
}
