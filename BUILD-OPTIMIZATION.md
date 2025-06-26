# NPM Package Build Optimization

This document describes the comprehensive build optimizations implemented for the svm-pay npm package to improve CLI/library distribution.

## Build System Improvements

### 1. TypeScript Configuration
- **Development config** (`tsconfig.json`): Includes source maps and declaration maps for debugging
- **Production config** (`tsconfig.prod.json`): Optimized for distribution with no source maps and removed comments
- Added proper Node.js and Jest types support
- Configured proper module resolution and JSX support

### 2. Build Scripts
```json
{
  "clean": "rm -rf dist",
  "build": "npm run clean && tsc",
  "build:production": "npm run clean && NODE_ENV=production tsc -p tsconfig.prod.json && NODE_ENV=production node scripts/optimize-build.js --no-source-maps",
  "postbuild": "chmod +x dist/bin/svm-pay.js && node scripts/optimize-build.js",
  "test:ci": "jest --passWithNoTests --ci --coverage",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "prepublishOnly": "npm run build:production && npm run test:ci && npm run lint",
  "cli:test": "node dist/bin/svm-pay.js --help",
  "validate:package": "npm pack --dry-run"
}
```

### 3. Build Optimization Script
The `scripts/optimize-build.js` script provides:
- **CLI Binary Permissions**: Ensures the CLI executable has proper permissions (755)
- **Source Map Removal**: Removes source maps in production builds to reduce package size
- **Build Summary**: Provides detailed information about the built package
- **File Counting**: Tracks the number of files generated

### 4. Package Configuration
- **Entry Points**: Properly configured main, types, and bin entries
- **Exports Map**: Comprehensive exports for different frameworks (React, Vue, Angular, Server)
- **Files Field**: Optimized to include only necessary distribution files
- **Peer Dependencies**: Properly configured optional peer dependencies for frameworks

## Distribution Optimizations

### Package Size Reduction
- **Production Builds**: Remove source maps, comments, and debug information
- **File Optimization**: Only include necessary files in the npm package
- **Build Artifacts**: Clean build process that removes old artifacts

### CLI Distribution
- **Executable Binary**: Properly configured CLI binary with shebang and permissions
- **Command Structure**: Well-organized command structure with proper help and version support
- **Dependencies**: Optimized dependency tree for CLI functionality

### Library Distribution
- **Multiple Entry Points**: Support for different frameworks and environments
- **Type Definitions**: Complete TypeScript type definitions for all exported modules
- **Tree Shaking**: Properly configured for optimal bundling in consumer applications

## Build Validation

### Testing
- **CI Tests**: Automated testing with coverage reports
- **CLI Testing**: Automated CLI functionality testing
- **Lint Checks**: Code quality and style validation

### Package Validation
- **Dry Run**: `npm pack --dry-run` validation to ensure proper package structure
- **Size Analysis**: Monitor package size and file count
- **Dependency Analysis**: Validate dependency tree and peer dependencies

## Usage

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:production
```

### Full CI Pipeline
```bash
npm run prepublishOnly
```

### Package Validation
```bash
npm run validate:package
```

### CLI Testing
```bash
npm run cli:test
```

## Package Structure

```
dist/
├── bin/
│   └── svm-pay.js          # CLI executable
├── cli/                    # CLI implementation
├── core/                   # Core SDK functionality
├── network/                # Network adapters
├── sdk/                    # Framework integrations
├── walletconnect/          # WalletConnect integration
└── index.js               # Main entry point
```

## Performance Metrics

- **Package Size**: ~75 KB compressed
- **Unpacked Size**: ~372 KB
- **File Count**: 176 files (production), 172 files (development)
- **CLI Startup**: Fast startup with minimal dependencies
- **Tree Shaking**: Optimized for modern bundlers

## Framework Support

The package provides optimized entry points for:
- **React**: `svm-pay/react` and `svm-pay/react-integration`
- **Vue**: `svm-pay/vue` and `svm-pay/vue-integration`
- **Angular**: `svm-pay/angular`
- **Server**: `svm-pay/server` for Node.js environments
- **CLI**: Global CLI installation via `npm install -g svm-pay`

## Publishing

The package is configured for automated publishing via GitHub Actions:
- **Release Tags**: Triggers on version tags (v*)
- **CI Pipeline**: Runs tests, linting, and builds
- **NPM Publishing**: Automated publishing to npm registry
- **Build Validation**: Ensures package quality before publishing

## Previous Optimizations

The repository also includes optimizations for the workspace build process:

### Package Manager Optimization
- pnpm workspace configuration for dependency hoisting
- Reduced package size through configuration optimizations
- Efficient dependency management with shared stores

### Build Configuration
- Turbo.json configuration for optimized caching
- Next.js configuration optimization for production builds
- Webpack optimization for reduced disk space

These comprehensive optimizations ensure optimal npm package distribution for both CLI and library usage.
