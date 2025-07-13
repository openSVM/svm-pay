#include <gtest/gtest.h>
#include "svm-pay/core/reference.hpp"

using namespace svm_pay;

class ReferenceTest : public ::testing::Test {
protected:
    void SetUp() override {}
    void TearDown() override {}
};

TEST_F(ReferenceTest, GenerateReference) {
    // Test default length
    std::string ref1 = generate_reference();
    EXPECT_FALSE(ref1.empty());
    EXPECT_GT(ref1.length(), 0);
    
    // Test specific length
    std::string ref2 = generate_reference(16);
    EXPECT_FALSE(ref2.empty());
    EXPECT_GT(ref2.length(), 0);
    
    // Test that references are unique
    std::string ref3 = generate_reference();
    EXPECT_NE(ref1, ref3);
}

TEST_F(ReferenceTest, GenerateReferenceInvalidLength) {
    EXPECT_THROW(generate_reference(0), std::invalid_argument);
    EXPECT_THROW(generate_reference(2000), std::invalid_argument);
}

TEST_F(ReferenceTest, ValidateReference) {
    // Test valid reference
    std::string valid_ref = generate_reference(32);
    EXPECT_TRUE(validate_reference(valid_ref));
    
    // Test invalid references
    EXPECT_FALSE(validate_reference(""));
    EXPECT_FALSE(validate_reference("0")); // Contains invalid base58 character
    EXPECT_FALSE(validate_reference("O")); // Contains invalid base58 character
    EXPECT_FALSE(validate_reference("I")); // Contains invalid base58 character
    EXPECT_FALSE(validate_reference("l")); // Contains invalid base58 character
}

TEST_F(ReferenceTest, GenerateTimestampedReference) {
    // Test default length
    std::string ref1 = generate_timestamped_reference();
    EXPECT_FALSE(ref1.empty());
    EXPECT_GT(ref1.length(), 0);
    
    // Test specific length
    std::string ref2 = generate_timestamped_reference(16);
    EXPECT_FALSE(ref2.empty());
    EXPECT_GT(ref2.length(), 0);
    
    // Test that references are unique even with timestamp
    std::string ref3 = generate_timestamped_reference();
    EXPECT_NE(ref1, ref3);
}

TEST_F(ReferenceTest, GenerateTimestampedReferenceInvalidLength) {
    EXPECT_THROW(generate_timestamped_reference(3), std::invalid_argument);
    EXPECT_THROW(generate_timestamped_reference(2000), std::invalid_argument);
}

TEST_F(ReferenceTest, ValidateTimestampedReference) {
    std::string timestamped_ref = generate_timestamped_reference(32);
    EXPECT_TRUE(validate_reference(timestamped_ref));
}