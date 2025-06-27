// Jest setup file for SVM-Pay tests
import 'jest';

// Global test setup
beforeEach(() => {
  // Clear console before each test to avoid noise
  jest.clearAllMocks();
});

// Mock console.warn and console.error for cleaner test output
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Add custom matchers if needed
expect.extend({
  // Custom matchers can be added here
});