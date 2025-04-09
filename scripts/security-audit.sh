#!/bin/bash
# SVM-Pay Security Audit Script
# This script performs a basic security audit of the SVM-Pay codebase

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting SVM-Pay security audit...${NC}"

# Create output directory
mkdir -p security-audit

# Check for vulnerable dependencies
echo -e "${YELLOW}Checking for vulnerable dependencies...${NC}"
npm audit > security-audit/dependencies.txt || true

# Check for hardcoded secrets
echo -e "${YELLOW}Checking for hardcoded secrets...${NC}"
grep -r "apiKey\|secret\|password\|token" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/secrets.txt || true

# Check for insecure random number generation
echo -e "${YELLOW}Checking for insecure random number generation...${NC}"
grep -r "Math.random" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/random.txt || true

# Check for eval usage
echo -e "${YELLOW}Checking for eval usage...${NC}"
grep -r "eval\|Function(" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/eval.txt || true

# Check for console.log statements
echo -e "${YELLOW}Checking for console.log statements...${NC}"
grep -r "console.log" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/console-logs.txt || true

# Check for TODO comments
echo -e "${YELLOW}Checking for TODO comments...${NC}"
grep -r "TODO\|FIXME" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/todos.txt || true

# Check for commented out code
echo -e "${YELLOW}Checking for commented out code...${NC}"
grep -r "\/\/.*[;{]" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" src/ > security-audit/commented-code.txt || true

# Generate summary
echo -e "${YELLOW}Generating security audit summary...${NC}"

echo "# SVM-Pay Security Audit Summary" > security-audit/summary.md
echo "" >> security-audit/summary.md
echo "Audit Date: $(date)" >> security-audit/summary.md
echo "" >> security-audit/summary.md

# Check dependencies
if [ -s security-audit/dependencies.txt ]; then
  echo "## Vulnerable Dependencies" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "The following vulnerabilities were found in dependencies:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/dependencies.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Update vulnerable dependencies to their latest versions." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Vulnerable Dependencies" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No vulnerable dependencies found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check secrets
if [ -s security-audit/secrets.txt ]; then
  echo "## Hardcoded Secrets" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "Potential hardcoded secrets were found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/secrets.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Remove hardcoded secrets and use environment variables or a secure secret management system." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Hardcoded Secrets" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No hardcoded secrets found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check random
if [ -s security-audit/random.txt ]; then
  echo "## Insecure Random Number Generation" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "Insecure random number generation was found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/random.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Use cryptographically secure random number generation methods like `crypto.randomBytes()` or `window.crypto.getRandomValues()`." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Insecure Random Number Generation" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No insecure random number generation found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check eval
if [ -s security-audit/eval.txt ]; then
  echo "## Eval Usage" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "Eval usage was found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/eval.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Avoid using `eval()` or `new Function()` as they can lead to code injection vulnerabilities." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Eval Usage" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No eval usage found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check console logs
if [ -s security-audit/console-logs.txt ]; then
  echo "## Console Log Statements" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "Console log statements were found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/console-logs.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Remove or disable console log statements in production code." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Console Log Statements" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No console log statements found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check TODOs
if [ -s security-audit/todos.txt ]; then
  echo "## TODO Comments" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "TODO comments were found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/todos.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Address all TODO comments before production release." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## TODO Comments" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No TODO comments found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Check commented code
if [ -s security-audit/commented-code.txt ]; then
  echo "## Commented Out Code" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "Commented out code was found in the following files:" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  cat security-audit/commented-code.txt >> security-audit/summary.md
  echo '```' >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "**Recommendation:** Remove commented out code to improve code readability." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
else
  echo "## Commented Out Code" >> security-audit/summary.md
  echo "" >> security-audit/summary.md
  echo "No commented out code found." >> security-audit/summary.md
  echo "" >> security-audit/summary.md
fi

# Add security best practices
echo "## Security Best Practices" >> security-audit/summary.md
echo "" >> security-audit/summary.md
echo "### General Recommendations" >> security-audit/summary.md
echo "" >> security-audit/summary.md
echo "1. **Input Validation**: Validate all user inputs, especially when parsing payment URLs." >> security-audit/summary.md
echo "2. **Output Encoding**: Encode outputs to prevent XSS attacks when displaying payment information." >> security-audit/summary.md
echo "3. **Error Handling**: Implement proper error handling to avoid leaking sensitive information." >> security-audit/summary.md
echo "4. **Secure Communication**: Use HTTPS for all API calls and webhook endpoints." >> security-audit/summary.md
echo "5. **Rate Limiting**: Implement rate limiting to prevent abuse of the payment API." >> security-audit/summary.md
echo "" >> security-audit/summary.md
echo "### Blockchain-Specific Recommendations" >> security-audit/summary.md
echo "" >> security-audit/summary.md
echo "1. **Transaction Verification**: Always verify transactions on-chain before considering them confirmed." >> security-audit/summary.md
echo "2. **Reference IDs**: Use cryptographically secure methods to generate reference IDs." >> security-audit/summary.md
echo "3. **Wallet Validation**: Validate wallet addresses to ensure they are in the correct format for each network." >> security-audit/summary.md
echo "4. **Double-Spending**: Be aware of potential double-spending attacks and implement proper confirmation checks." >> security-audit/summary.md
echo "5. **Network Selection**: Validate network selection to prevent cross-network attacks." >> security-audit/summary.md

echo -e "${GREEN}Security audit completed!${NC}"
echo -e "${YELLOW}Security audit summary available at: security-audit/summary.md${NC}"
