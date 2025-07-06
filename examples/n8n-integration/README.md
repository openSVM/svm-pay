# n8n SVM-Pay Integration Examples

This directory contains example n8n workflows and custom node implementations for integrating SVM-Pay with n8n automation workflows.

## Files Structure

```
examples/n8n-integration/
├── README.md
├── workflows/
│   ├── ecommerce-automation.json
│   ├── subscription-billing.json
│   ├── payroll-distribution.json
│   └── conditional-payments.json
├── nodes/
│   ├── SVMPay.node.js
│   ├── SVMPayWebhook.node.js
│   ├── SVMPayBatch.node.js
│   └── credentials/
│       └── SVMPayApi.credentials.js
└── package.json
```

## Quick Start

1. **Install n8n**:
```bash
npm install -g n8n
```

2. **Copy the custom nodes**:
```bash
cp -r nodes/* ~/.n8n/custom/
```

3. **Import example workflows**:
   - Open n8n in your browser
   - Go to Workflows
   - Click Import and select a workflow JSON file

4. **Configure credentials**:
   - Add your SVM-Pay credentials in n8n settings
   - Update webhook URLs and secrets

## Example Workflows

### E-commerce Automation
- Processes order payments automatically
- Sends payment confirmations
- Updates order status
- Handles failed payments

### Subscription Billing
- Monthly recurring billing automation
- Pro-rated upgrades and downgrades
- Dunning management for failed payments
- Invoice generation and delivery

### Payroll Distribution
- Bulk employee payment processing
- Tax calculation and withholding
- Payment confirmation tracking
- Compliance reporting

### Conditional Payments
- Smart payment routing based on conditions
- Multi-signature approvals for large amounts
- Automatic refund processing
- Fraud detection integration

## Custom Nodes

### SVMPay Node
Main payment processing node with operations:
- Create payment requests
- Process direct payments
- Verify transactions
- Check wallet balances

### SVMPayWebhook Node
Webhook trigger node for:
- Payment completed events
- Payment failed notifications
- Subscription renewals
- Custom event handling

### SVMPayBatch Node
Batch processing node for:
- Bulk payments
- Payroll distribution
- Airdrop campaigns
- Multi-recipient transfers

## Configuration

Set up your environment variables:

```bash
# Production
export SVMPAY_ENVIRONMENT=mainnet
export SVMPAY_PRIVATE_KEY=your_mainnet_private_key

# Development
export SVMPAY_ENVIRONMENT=devnet
export SVMPAY_PRIVATE_KEY=your_devnet_private_key

# Common settings
export SVMPAY_API_KEY=your_api_key
export WEBHOOK_SECRET=your_webhook_secret
```

## Support

For questions and support:
- Check the main documentation at `/docs/n8n-integration.md`
- Visit the SVM-Pay tutorial at `/docs/tutorials/saas/n8n-integration`
- Join our Discord community
- Open issues on GitHub

## License

These examples are provided under the MIT license, same as the main SVM-Pay project.