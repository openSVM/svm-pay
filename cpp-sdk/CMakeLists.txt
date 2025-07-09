cmake_minimum_required(VERSION 3.16)
project(svm-pay-cpp VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set build type if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# Compiler-specific options
if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find required packages
find_package(CURL REQUIRED)
find_package(OpenSSL REQUIRED)

# Option to build tests
option(BUILD_TESTS "Build test suite" ON)

# Option to build examples
option(BUILD_EXAMPLES "Build examples" ON)

# Include directories
include_directories(include)

# Source files
set(SOURCES
    src/core/types.cpp
    src/core/url_scheme.cpp
    src/core/reference.cpp
    src/network/adapter.cpp
    src/network/solana.cpp
    src/network/curl_initializer.cpp
    src/client.cpp
    src/svm_pay.cpp
)

# Header files for installation
set(HEADERS
    include/svm-pay/svm_pay.hpp
    include/svm-pay/client.hpp
    include/svm-pay/core/types.hpp
    include/svm-pay/core/url_scheme.hpp
    include/svm-pay/core/reference.hpp
    include/svm-pay/core/exceptions.hpp
    include/svm-pay/network/adapter.hpp
    include/svm-pay/network/solana.hpp
    include/svm-pay/network/curl_initializer.hpp
)

# Create library
add_library(svm-pay ${SOURCES})

# Link libraries
target_link_libraries(svm-pay 
    CURL::libcurl 
    OpenSSL::SSL 
    OpenSSL::Crypto
)

# Set library properties
set_target_properties(svm-pay PROPERTIES
    VERSION ${PROJECT_VERSION}
    SOVERSION 1
)

# Install targets
install(TARGETS svm-pay
    EXPORT svm-pay-targets
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
)

install(DIRECTORY include/svm-pay 
    DESTINATION include
)

# Export targets
install(EXPORT svm-pay-targets
    FILE svm-pay-targets.cmake
    DESTINATION lib/cmake/svm-pay
)

# Build tests if enabled
if(BUILD_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

# Build examples if enabled
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()

# Package configuration
include(CMakePackageConfigHelpers)

configure_package_config_file(
    cmake/svm-pay-config.cmake.in
    "${CMAKE_CURRENT_BINARY_DIR}/svm-pay-config.cmake"
    INSTALL_DESTINATION lib/cmake/svm-pay
)

write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/svm-pay-config-version.cmake"
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY SameMajorVersion
)

install(FILES
    "${CMAKE_CURRENT_BINARY_DIR}/svm-pay-config.cmake"
    "${CMAKE_CURRENT_BINARY_DIR}/svm-pay-config-version.cmake"
    DESTINATION lib/cmake/svm-pay
)