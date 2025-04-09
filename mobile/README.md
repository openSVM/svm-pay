# SVM-Pay Mobile SDK Build Configuration

This directory contains the build configuration for the SVM-Pay mobile SDKs for iOS and Android.

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

For detailed documentation on how to use the mobile SDKs, please refer to the [SVM-Pay Documentation](../docs/documentation.md#mobile-sdk).
