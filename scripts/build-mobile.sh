#!/bin/bash
# SVM-Pay Mobile SDK Build Script
# This script builds the mobile SDKs for iOS and Android

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting SVM-Pay Mobile SDK build process...${NC}"

# Create directories for mobile SDKs
mkdir -p mobile/ios
mkdir -p mobile/android

# iOS SDK
echo -e "${YELLOW}Preparing iOS SDK...${NC}"

# Create Swift Package manifest
cat > mobile/ios/Package.swift << EOF
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "SVMPay",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "SVMPay",
            targets: ["SVMPay"]),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "SVMPay",
            dependencies: []),
        .testTarget(
            name: "SVMPayTests",
            dependencies: ["SVMPay"]),
    ]
)
EOF

# Create basic Swift implementation
mkdir -p mobile/ios/Sources/SVMPay
cat > mobile/ios/Sources/SVMPay/SVMPay.swift << EOF
import Foundation

public enum SVMNetwork: String {
    case solana = "solana"
    case sonic = "sonic"
    case eclipse = "eclipse"
    case soon = "soon"
}

public class SVMPay {
    private let defaultNetwork: SVMNetwork
    private let debug: Bool
    
    public init(defaultNetwork: SVMNetwork = .solana, debug: Bool = false) {
        self.defaultNetwork = defaultNetwork
        self.debug = debug
        
        if debug {
            print("SVMPay iOS SDK initialized with network: \(defaultNetwork.rawValue)")
        }
    }
    
    public func createTransferUrl(recipient: String, amount: String? = nil, options: [String: Any] = [:]) -> String {
        let network = options["network"] as? String ?? defaultNetwork.rawValue
        var url = "\(network):\(recipient)"
        
        var queryItems: [String] = []
        
        if let amount = amount {
            queryItems.append("amount=\(amount)")
        }
        
        if let token = options["splToken"] as? String {
            queryItems.append("spl-token=\(token)")
        }
        
        if let label = options["label"] as? String {
            queryItems.append("label=\(label)")
        }
        
        if let message = options["message"] as? String {
            queryItems.append("message=\(message)")
        }
        
        if let memo = options["memo"] as? String {
            queryItems.append("memo=\(memo)")
        }
        
        if let references = options["references"] as? [String] {
            for reference in references {
                queryItems.append("reference=\(reference)")
            }
        }
        
        if !queryItems.isEmpty {
            url += "?" + queryItems.joined(separator: "&")
        }
        
        return url
    }
    
    public func generateReference() -> String {
        let uuid = UUID().uuidString
        return uuid.replacingOccurrences(of: "-", with: "")
    }
}
EOF

# Create test directory
mkdir -p mobile/ios/Tests/SVMPayTests
cat > mobile/ios/Tests/SVMPayTests/SVMPayTests.swift << EOF
import XCTest
@testable import SVMPay

final class SVMPayTests: XCTestCase {
    func testCreateTransferUrl() {
        let svmPay = SVMPay()
        let url = svmPay.createTransferUrl(recipient: "test123", amount: "1.0")
        XCTAssertTrue(url.hasPrefix("solana:test123?amount=1.0"))
    }
    
    func testGenerateReference() {
        let svmPay = SVMPay()
        let reference = svmPay.generateReference()
        XCTAssertEqual(reference.count, 32)
    }
}
EOF

# Android SDK
echo -e "${YELLOW}Preparing Android SDK...${NC}"

# Create build.gradle file
cat > mobile/android/build.gradle << EOF
plugins {
    id 'com.android.library'
    id 'kotlin-android'
    id 'maven-publish'
}

android {
    compileSdkVersion 31
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 31
        versionCode 1
        versionName "1.0.0"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles "consumer-rules.pro"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.5.31"
    implementation 'androidx.core:core-ktx:1.7.0'
    implementation 'androidx.appcompat:appcompat:1.4.0'
    implementation 'com.google.android.material:material:1.4.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}

afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                from components.release
                
                groupId = 'com.opensvm'
                artifactId = 'svm-pay'
                version = '1.0.0'
            }
        }
    }
}
EOF

# Create basic Kotlin implementation
mkdir -p mobile/android/src/main/kotlin/com/opensvm/svmpay
cat > mobile/android/src/main/kotlin/com/opensvm/svmpay/SVMPay.kt << EOF
package com.opensvm.svmpay

import java.util.*

enum class SVMNetwork(val value: String) {
    SOLANA("solana"),
    SONIC("sonic"),
    ECLIPSE("eclipse"),
    SOON("soon")
}

class SVMPay(
    private val defaultNetwork: SVMNetwork = SVMNetwork.SOLANA,
    private val debug: Boolean = false
) {
    init {
        if (debug) {
            println("SVMPay Android SDK initialized with network: \${defaultNetwork.value}")
        }
    }
    
    fun createTransferUrl(
        recipient: String,
        amount: String? = null,
        options: Map<String, Any> = emptyMap()
    ): String {
        val network = (options["network"] as? String) ?: defaultNetwork.value
        var url = "\$network:\$recipient"
        
        val queryItems = mutableListOf<String>()
        
        amount?.let {
            queryItems.add("amount=\$it")
        }
        
        (options["splToken"] as? String)?.let {
            queryItems.add("spl-token=\$it")
        }
        
        (options["label"] as? String)?.let {
            queryItems.add("label=\$it")
        }
        
        (options["message"] as? String)?.let {
            queryItems.add("message=\$it")
        }
        
        (options["memo"] as? String)?.let {
            queryItems.add("memo=\$it")
        }
        
        (options["references"] as? List<String>)?.forEach {
            queryItems.add("reference=\$it")
        }
        
        if (queryItems.isNotEmpty()) {
            url += "?" + queryItems.joinToString("&")
        }
        
        return url
    }
    
    fun generateReference(): String {
        return UUID.randomUUID().toString().replace("-", "")
    }
}
EOF

# Create test directory
mkdir -p mobile/android/src/test/kotlin/com/opensvm/svmpay
cat > mobile/android/src/test/kotlin/com/opensvm/svmpay/SVMPayTest.kt << EOF
package com.opensvm.svmpay

import org.junit.Test
import org.junit.Assert.*

class SVMPayTest {
    @Test
    fun testCreateTransferUrl() {
        val svmPay = SVMPay()
        val url = svmPay.createTransferUrl("test123", "1.0")
        assertTrue(url.startsWith("solana:test123?amount=1.0"))
    }
    
    @Test
    fun testGenerateReference() {
        val svmPay = SVMPay()
        val reference = svmPay.generateReference()
        assertEquals(32, reference.length)
    }
}
EOF

# Create README files
cat > mobile/ios/README.md << EOF
# SVM-Pay iOS SDK

This is the iOS SDK for SVM-Pay, a payment solution for SVM networks.

## Installation

### Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/openSVM/svm-pay-ios.git", .upToNextMajor(from: "1.0.0"))
]
```

## Usage

```swift
import SVMPay

let svmPay = SVMPay(defaultNetwork: .solana)

// Create a payment URL
let url = svmPay.createTransferUrl(
    recipient: "recipient-address",
    amount: "1.0",
    options: [
        "label": "My Store",
        "message": "Payment for Order #123",
        "references": ["order-123"]
    ]
)

// Generate a reference ID
let reference = svmPay.generateReference()
```

For more information, see the [SVM-Pay Documentation](../../docs/documentation.md).
EOF

cat > mobile/android/README.md << EOF
# SVM-Pay Android SDK

This is the Android SDK for SVM-Pay, a payment solution for SVM networks.

## Installation

### Gradle

```gradle
dependencies {
    implementation 'com.opensvm:svm-pay:1.0.0'
}
```

## Usage

```kotlin
import com.opensvm.svmpay.SVMPay
import com.opensvm.svmpay.SVMNetwork

val svmPay = SVMPay(defaultNetwork = SVMNetwork.SOLANA)

// Create a payment URL
val url = svmPay.createTransferUrl(
    recipient = "recipient-address",
    amount = "1.0",
    options = mapOf(
        "label" to "My Store",
        "message" to "Payment for Order #123",
        "references" to listOf("order-123")
    )
)

// Generate a reference ID
val reference = svmPay.generateReference()
```

For more information, see the [SVM-Pay Documentation](../../docs/documentation.md).
EOF

echo -e "${GREEN}Mobile SDK preparation completed!${NC}"
echo -e "${YELLOW}iOS SDK available in: mobile/ios${NC}"
echo -e "${YELLOW}Android SDK available in: mobile/android${NC}"
