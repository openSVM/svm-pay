# SVM-Pay Mobile SDK Build Configuration

This directory contains the build configuration for the SVM-Pay mobile SDKs for iOS, Android, and Flutter.

## Flutter SDK 🎯

The Flutter SDK provides cross-platform support for both iOS and Android with a single codebase.

### Requirements

- Flutter 3.3.0 or later
- Dart 3.8.1 or later
- iOS 13.0 or later (for iOS builds)
- Android API level 21 or later (for Android builds)

### Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  svm_pay: ^1.1.0
```

### Quick Start

```dart
import 'package:svm_pay/svm_pay.dart';

final svmPay = SVMPay(
  config: const SVMPayConfig(
    defaultNetwork: SVMNetwork.solana,
    debug: true,
  ),
);

// Use payment widgets
PaymentButton(
  recipient: 'recipient_address',
  amount: '1.0',
  onPayment: (result) async {
    // Handle payment result
  },
)
```

### Building from Source

The Flutter SDK is included in this repository at `flutter_sdk/`.

```bash
cd flutter_sdk
flutter pub get
flutter test
```

To run the example app:

```bash
cd flutter_sdk/example
flutter run
```

For complete documentation, see [Flutter SDK README](../flutter_sdk/README.md).

## iOS SDK

The iOS SDK is built using Swift and provides native integration with iOS applications.

### Requirements

- Xcode 13.0 or later
- Swift 5.5 or later
- iOS 13.0 or later

### Installation

#### CocoaPods

```ruby
pod 'SVMPay', '~> 1.0.0'
```

#### Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/openSVM/svm-pay-ios.git", .upToNextMajor(from: "1.0.0"))
]
```

## Android SDK

The Android SDK is built using Kotlin and provides native integration with Android applications.

### Requirements

- Android Studio Arctic Fox (2020.3.1) or later
- Kotlin 1.5 or later
- Android API level 21 or later

### Installation

#### Gradle

```gradle
dependencies {
    implementation 'com.opensvm:svm-pay:1.0.0'
}
```

#### Maven

```xml
<dependency>
  <groupId>com.opensvm</groupId>
  <artifactId>svm-pay</artifactId>
  <version>1.0.0</version>
</dependency>
```

## Building from Source

### iOS SDK

1. Clone the repository:
```bash
git clone https://github.com/openSVM/svm-pay-ios.git
cd svm-pay-ios
```

2. Build the SDK:
```bash
xcodebuild -project SVMPay.xcodeproj -scheme SVMPay -configuration Release
```

3. The built framework will be available in the `build/Release-iphoneos` directory.

### Android SDK

1. Clone the repository:
```bash
git clone https://github.com/openSVM/svm-pay-android.git
cd svm-pay-android
```

2. Build the SDK:
```bash
./gradlew assembleRelease
```

3. The built AAR file will be available in the `svm-pay/build/outputs/aar` directory.

## Documentation

For detailed documentation on how to use the mobile SDKs, please refer to:

- [Flutter SDK Documentation](../flutter_sdk/README.md) 
- [SVM-Pay Documentation](../docs/documentation.md#mobile-sdk)
- [Main Project README](../README.md)
