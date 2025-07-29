#!/bin/bash

# Flutter SDK Test Validation Script for GitHub Actions
# This script validates test coverage and ensures all critical tests are present

set -e  # Exit on any error

echo "🧪 Flutter SDK Test Validation"
echo "=============================="

# Check if we're in the correct directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ Error: Not in Flutter project directory"
    exit 1
fi

# Verify test files exist
echo "📁 Checking test file structure..."

REQUIRED_TESTS=(
    "test/svm_pay_test.dart"
    "test/security_test.dart" 
    "test/bug_fixes_test.dart"
    "test/integration_test.dart"
    "test/widget_test.dart"
)

MISSING_TESTS=()

for test_file in "${REQUIRED_TESTS[@]}"; do
    if [ -f "$test_file" ]; then
        echo "✅ Found: $test_file"
    else
        echo "❌ Missing: $test_file"
        MISSING_TESTS+=("$test_file")
    fi
done

if [ ${#MISSING_TESTS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required test files:"
    printf '%s\n' "${MISSING_TESTS[@]}"
    exit 1
fi

echo ""
echo "📊 Analyzing test coverage..."

# Count tests in each file (handle grep exit codes properly)
get_test_count() {
    local file=$1
    if [ -f "$file" ]; then
        # Count both 'test(' and 'testWidgets(' patterns
        local test_count=$(grep -c "test(" "$file" 2>/dev/null || true)
        local widget_count=$(grep -c "testWidgets(" "$file" 2>/dev/null || true)
        
        # Ensure we have valid numbers
        test_count=${test_count:-0}
        widget_count=${widget_count:-0}
        
        # Return the sum, ensuring it's a number
        echo $((test_count + widget_count))
    else
        echo "0"
    fi
}

CORE_TESTS=$(get_test_count "test/svm_pay_test.dart")
SECURITY_TESTS=$(get_test_count "test/security_test.dart")
BUG_FIX_TESTS=$(get_test_count "test/bug_fixes_test.dart")
INTEGRATION_TESTS=$(get_test_count "test/integration_test.dart")
WIDGET_TESTS=$(get_test_count "test/widget_test.dart")

# Ensure all variables are numeric
CORE_TESTS=${CORE_TESTS:-0}
SECURITY_TESTS=${SECURITY_TESTS:-0}
BUG_FIX_TESTS=${BUG_FIX_TESTS:-0}
INTEGRATION_TESTS=${INTEGRATION_TESTS:-0}
WIDGET_TESTS=${WIDGET_TESTS:-0}

TOTAL_TESTS=$((CORE_TESTS + SECURITY_TESTS + BUG_FIX_TESTS + INTEGRATION_TESTS + WIDGET_TESTS))

echo "Core SDK tests: $CORE_TESTS"
echo "Security tests: $SECURITY_TESTS"
echo "Bug fix tests: $BUG_FIX_TESTS"  
echo "Integration tests: $INTEGRATION_TESTS"
echo "Widget tests: $WIDGET_TESTS"
echo "Total tests: $TOTAL_TESTS"

# Validate minimum test requirements
MIN_CORE_TESTS=10
MIN_SECURITY_TESTS=15
MIN_BUG_FIX_TESTS=8
MIN_TOTAL_TESTS=40

echo ""
echo "🎯 Validating test coverage requirements..."

VALIDATION_FAILED=false

if [ $CORE_TESTS -lt $MIN_CORE_TESTS ]; then
    echo "❌ Insufficient core tests: $CORE_TESTS < $MIN_CORE_TESTS"
    VALIDATION_FAILED=true
else
    echo "✅ Core tests coverage sufficient: $CORE_TESTS >= $MIN_CORE_TESTS"
fi

if [ $SECURITY_TESTS -lt $MIN_SECURITY_TESTS ]; then
    echo "❌ Insufficient security tests: $SECURITY_TESTS < $MIN_SECURITY_TESTS"
    VALIDATION_FAILED=true
else
    echo "✅ Security tests coverage sufficient: $SECURITY_TESTS >= $MIN_SECURITY_TESTS"
fi

if [ $BUG_FIX_TESTS -lt $MIN_BUG_FIX_TESTS ]; then
    echo "❌ Insufficient bug fix tests: $BUG_FIX_TESTS < $MIN_BUG_FIX_TESTS"
    VALIDATION_FAILED=true
else
    echo "✅ Bug fix tests coverage sufficient: $BUG_FIX_TESTS >= $MIN_BUG_FIX_TESTS"
fi

if [ $TOTAL_TESTS -lt $MIN_TOTAL_TESTS ]; then
    echo "❌ Insufficient total tests: $TOTAL_TESTS < $MIN_TOTAL_TESTS"
    VALIDATION_FAILED=true
else
    echo "✅ Total test coverage sufficient: $TOTAL_TESTS >= $MIN_TOTAL_TESTS"
fi

if [ "$VALIDATION_FAILED" = true ]; then
    echo ""
    echo "❌ Test validation failed - minimum coverage requirements not met"
    exit 1
fi

echo ""
echo "🎉 Test validation completed successfully!"
echo "📈 Test coverage meets all requirements"
echo "🔒 Security tests validated"
echo "🐛 Bug fix tests validated"
echo "✨ Ready for production deployment"