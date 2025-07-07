cmake_minimum_required(VERSION 3.16)

# Example sources
set(EXAMPLE_SOURCES
    basic_payment.cpp
    url_parsing.cpp
    network_adapter.cpp
)

# Create example executables
foreach(EXAMPLE_SOURCE ${EXAMPLE_SOURCES})
    get_filename_component(EXAMPLE_NAME ${EXAMPLE_SOURCE} NAME_WE)
    add_executable(${EXAMPLE_NAME} ${EXAMPLE_SOURCE})
    target_link_libraries(${EXAMPLE_NAME} svm-pay)
    set(EXAMPLE_TARGETS ${EXAMPLE_TARGETS} ${EXAMPLE_NAME})
endforeach()

# Install examples
install(TARGETS ${EXAMPLE_TARGETS}
    DESTINATION bin/examples
)