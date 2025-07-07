cmake_minimum_required(VERSION 3.16)

# Find packages for testing
find_package(PkgConfig REQUIRED)
pkg_check_modules(GTEST REQUIRED gtest>=1.10.0)

if(NOT GTEST_FOUND)
    message(WARNING "Google Test not found, skipping tests")
    return()
endif()

# Test sources
set(TEST_SOURCES
    test_types.cpp
    test_reference.cpp
    test_url_scheme.cpp
    test_client.cpp
)

# Create test executable
add_executable(svm-pay-tests ${TEST_SOURCES})

# Link libraries
target_link_libraries(svm-pay-tests 
    svm-pay
    ${GTEST_LIBRARIES}
    pthread
)

# Include directories
target_include_directories(svm-pay-tests PRIVATE 
    ${GTEST_INCLUDE_DIRS}
)

# Compile options
target_compile_options(svm-pay-tests PRIVATE 
    ${GTEST_CFLAGS_OTHER}
)

# Add tests to CTest
add_test(NAME svm-pay-unit-tests COMMAND svm-pay-tests)