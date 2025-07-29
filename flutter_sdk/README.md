# SVM-Pay Flutter SDK

Flutter SDK for SVM-Pay: Cross-network payment solution for SVM networks (Solana, Sonic SVM, Eclipse, s00n).

## Features

- **Cross-Network Support**: Support for Solana, Sonic SVM, Eclipse, and s00n networks
- **Simple Integration**: Easy-to-use Flutter widgets and API
- **Payment URLs**: Generate and parse payment URLs compatible with SVM-Pay protocol
- **Native Performance**: Platform channels for optimal performance on iOS and Android
- **Type Safety**: Full Dart type safety with comprehensive error handling
- **Flexible Widgets**: Pre-built payment forms, buttons, and QR code widgets

## Installation

Add this to your package's `pubspec.yaml` file:

```yaml
dependencies:
  svm_pay: ^1.1.0
```

Then run:

```bash
flutter pub get
```

## Usage

### Basic Setup

```dart
import 'package:svm_pay/svm_pay.dart';

// Initialize the SDK
final svmPay = SVMPay(
  config: const SVMPayConfig(
    defaultNetwork: SVMNetwork.solana,
    debug: true,
  ),
);
```

### Create Payment URLs

```dart
// Create a simple transfer URL
final url = svmPay.createTransferUrl(
  'recipient_address_here',
  '1.5',
  label: 'Coffee Shop',
  message: 'Payment for coffee',
);

print(url);
// Output: solana://recipient_address_here?amount=1.5&label=Coffee%20Shop&message=Payment%20for%20coffee
```

### Process Payments

```dart
final request = TransferRequest(
  recipient: 'recipient_address_here',
  amount: '1.0',
  network: SVMNetwork.solana,
  message: 'Demo payment',
);

final result = await svmPay.processPayment(request);

if (result.status == PaymentStatus.confirmed) {
  print('Payment successful: ${result.signature}');
} else {
  print('Payment failed: ${result.error}');
}
```

### Using Pre-built Widgets

#### Payment Button

```dart
PaymentButton(
  recipient: 'recipient_address_here',
  amount: '1.0',
  label: 'Pay 1.0 SOL',
  message: 'Demo payment from Flutter SDK',
  onPayment: (result) async {
    if (result.status == PaymentStatus.confirmed) {
      // Handle successful payment
      print('Payment successful!');
    } else {
      // Handle failed payment
      print('Payment failed: ${result.error}');
    }
  },
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.green,
    foregroundColor: Colors.white,
  ),
)
```

#### Payment Form

```dart
PaymentForm(
  initialRecipient: 'recipient_address_here',
  initialAmount: '0.5',
  network: SVMNetwork.solana,
  onSubmit: (result) async {
    // Handle form submission
    print('Payment result: ${result.status}');
  },
)
```

#### QR Code Widget

```dart
PaymentQRCode(
  paymentUrl: paymentUrl,
  size: 200.0,
)
```

### Network Support

The SDK supports multiple SVM networks:

```dart
// Solana
SVMNetwork.solana

// Sonic SVM
SVMNetwork.sonic

// Eclipse
SVMNetwork.eclipse

// Soon
SVMNetwork.soon
```

### Wallet Balance

```dart
try {
  final balance = await svmPay.getWalletBalance(
    'wallet_address_here',
    network: SVMNetwork.solana,
  );
  print('Balance: $balance SOL');
} catch (e) {
  print('Error getting balance: $e');
}
```

### Address Validation

```dart
final isValid = svmPay.validateAddress(
  'address_to_validate',
  network: SVMNetwork.solana,  
);

if (isValid) {
  print('Address is valid');
} else {
  print('Invalid address');
}
```

## Configuration

### SVMPayConfig Options

```dart
const config = SVMPayConfig(
  defaultNetwork: SVMNetwork.solana,  // Default network to use
  apiEndpoint: 'https://api.example.com',  // Custom API endpoint
  debug: true,  // Enable debug logging
);
```

## Network Adapters

The SDK includes built-in network adapters for all supported SVM networks:

- **SolanaNetworkAdapter**: Solana mainnet support
- **SonicNetworkAdapter**: Sonic SVM network support  
- **EclipseNetworkAdapter**: Eclipse network support
- **SoonNetworkAdapter**: Soon network support

Each adapter provides:
- Address validation
- Network configuration
- RPC endpoints

## Error Handling

The SDK provides comprehensive error handling:

```dart
try {
  final result = await svmPay.processPayment(request);
  
  switch (result.status) {
    case PaymentStatus.confirmed:
      // Payment successful
      break;
    case PaymentStatus.failed:
      // Handle failure: result.error contains details
      break;
    case PaymentStatus.pending:
      // Payment is still processing
      break;
    case PaymentStatus.cancelled:
      // Payment was cancelled
      break;
  }
} catch (e) {
  // Handle unexpected errors
  print('Unexpected error: $e');
}
```

## Platform Requirements

### Android
- Minimum SDK: API level 21 (Android 5.0)
- Compile SDK: API level 35
- Kotlin support

### iOS  
- Minimum iOS version: 13.0
- Swift 5.0+
- Xcode 13.0+

## Example App

The package includes a comprehensive example app demonstrating all features:

```bash
cd example
flutter run
```

The example app showcases:
- Payment buttons and forms
- QR code generation  
- Balance checking
- Network switching
- Error handling

## Testing

The Flutter SDK includes comprehensive test coverage with 73+ tests covering all critical functionality.

### Running Tests

```bash
# Run all tests
flutter test

# Run tests with coverage
flutter test --coverage

# Run specific test files
flutter test test/svm_pay_test.dart        # Core SDK tests (12 tests)
flutter test test/security_test.dart       # Security tests (19 tests)  
flutter test test/bug_fixes_test.dart      # Bug fix tests (12 tests)
flutter test test/integration_test.dart    # Integration tests (17 tests)
flutter test test/widget_test.dart         # Widget tests (13 tests)
```

### Test Validation

Use the built-in validation script to ensure test coverage meets requirements:

```bash
chmod +x scripts/validate_tests.sh
./scripts/validate_tests.sh
```

### Test Categories

**Core SDK Tests** - Basic functionality testing:
- URL generation and parsing
- Address validation 
- Network adapter functionality
- Configuration handling

**Security Tests** - Security enhancement validation:
- Enhanced address validation with edge cases
- Secure random number generation
- Input sanitization and validation
- URL parsing security
- Error message sanitization
- DoS protection mechanisms

**Bug Fix Tests** - Critical bug resolution validation:
- Memory leak prevention
- Race condition handling
- Secure entropy generation
- DoS attack protection
- Malicious input handling

**Integration Tests** - End-to-end functionality:
- Payment flow testing
- Network integration
- Error handling scenarios
- Widget lifecycle management

**Widget Tests** - UI component testing:
- PaymentButton functionality
- PaymentForm validation
- PaymentQRCode generation
- State management
- Event handling

### GitHub Actions

The Flutter SDK is automatically tested on every commit and pull request through GitHub Actions:

- **Flutter SDK Tests**: Runs all tests with coverage reporting
- **Security Validation**: Validates security test coverage  
- **Bug Fix Validation**: Ensures critical bug fixes are tested
- **Integration Testing**: E2E testing scenarios
- **Test Coverage Validation**: Ensures minimum test coverage requirements

All tests must pass before code can be merged or published.

## Contributing

Contributions are welcome! Please see the main [SVM-Pay repository](https://github.com/openSVM/svm-pay) for contributing guidelines.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and documentation, visit:
- [SVM-Pay Documentation](https://github.com/openSVM/svm-pay/docs)
- [GitHub Issues](https://github.com/openSVM/svm-pay/issues)
- [SVM-Pay Website](https://opensvm.org)

