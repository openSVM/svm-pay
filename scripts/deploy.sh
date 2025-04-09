#!/bin/bash
# SVM-Pay Deployment Script
# This script builds and packages the SVM-Pay SDK for deployment

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting SVM-Pay deployment process...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Run linting
echo -e "${YELLOW}Running linting...${NC}"
npm run lint || {
    echo -e "${RED}Linting failed. Please fix the issues and try again.${NC}"
    exit 1
}

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
npm test || {
    echo -e "${RED}Tests failed. Please fix the issues and try again.${NC}"
    exit 1
}

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
npm run build

# Create a distribution directory if it doesn't exist
mkdir -p dist

# Copy necessary files to the distribution directory
echo -e "${YELLOW}Preparing package for distribution...${NC}"
cp package.json README.md LICENSE dist/

# Create a tarball
echo -e "${YELLOW}Creating tarball...${NC}"
npm pack

# Success message
echo -e "${GREEN}SVM-Pay has been successfully built and packaged!${NC}"
echo -e "${GREEN}The package is ready for deployment.${NC}"

# Instructions for publishing
echo -e "${YELLOW}To publish to npm, run:${NC}"
echo -e "npm publish"

# Instructions for local testing
echo -e "${YELLOW}To test locally, run:${NC}"
echo -e "npm link"
echo -e "cd /path/to/your/project"
echo -e "npm link svm-pay"
