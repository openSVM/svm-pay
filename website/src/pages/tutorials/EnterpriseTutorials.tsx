import { TutorialLayout } from '../../components/ui/TutorialLayout'

export function B2BInvoiceProcessingTutorial() {
  return (
    <TutorialLayout
      title="B2B Invoice Processing"
      description="Automated invoice processing for enterprise clients with compliance and validation"
      level="Advanced"
      time="2 hours"
      category="Enterprise Tutorials"
      categoryPath="/docs/tutorials/enterprise"
      overview="Learn how to implement automated B2B invoice processing with SVM-Pay, including compliance validation, multi-tier approval workflows, and automated payment processing for enterprise-level transactions."
      prerequisites={[
        "Advanced React/TypeScript knowledge",
        "Understanding of enterprise payment flows",
        "Node.js development environment",
        "SVM-Pay SDK installed",
        "Understanding of compliance requirements"
      ]}
      steps={[
        {
          title: "Set up Enterprise SDK",
          description: "Initialize SVM-Pay with enterprise configuration for B2B processing",
          code: `// Enterprise B2B invoice processing setup
import { SVMPay, InvoiceProcessor, ComplianceManager } from '@svm-pay/sdk'

const enterpriseConfig = {
  network: 'solana',
  complianceLevel: 'enterprise',
  multiSigRequired: true,
  auditTrail: true
}

const svmPay = new SVMPay(enterpriseConfig)`
        },
        {
          title: "Invoice Validation",
          description: "Implement comprehensive invoice validation with compliance checks",
          code: `const validateInvoice = async (invoice, vendor, client) => {
  const compliance = await ComplianceManager.validateInvoice({
    invoice,
    vendor: vendor.taxId,
    client: client.taxId,
    jurisdiction: invoice.jurisdiction
  })

  if (!compliance.isValid) {
    throw new Error('Compliance violation: ' + compliance.violations.join(', '))
  }

  return compliance
}`
        },
        {
          title: "Create Enterprise Payment",
          description: "Process B2B payments with extended terms and approval workflows",
          code: `const processB2BInvoice = async (invoice, vendor, client) => {
  const payment = SVMPay.createPayment({
    recipient: vendor.corporateWallet,
    amount: invoice.amount,
    token: 'USDC',
    metadata: {
      invoiceId: invoice.id,
      vendorTaxId: vendor.taxId,
      clientTaxId: client.taxId,
      paymentTerms: invoice.paymentTerms,
      purchaseOrder: invoice.poNumber
    },
    paymentSchedule: {
      dueDate: invoice.dueDate,
      earlyPaymentDiscount: invoice.earlyPaymentDiscount,
      lateFee: invoice.lateFee
    }
  })

  return await payment.execute()
}`
        }
      ]}
    />
  )
}

export function EmployeePayrollSystemTutorial() {
  return (
    <TutorialLayout
      title="Employee Payroll System"
      description="Automated payroll processing with multi-currency support and compliance"
      level="Advanced"
      time="3 hours"
      category="Enterprise Tutorials"
      categoryPath="/docs/tutorials/enterprise"
      overview="Build a comprehensive employee payroll system with SVM-Pay that handles multiple currencies, automatic deductions, tax compliance, and direct deposits across different blockchain networks."
      prerequisites={[
        "Advanced development experience",
        "Understanding of payroll systems",
        "Knowledge of tax compliance",
        "SVM-Pay SDK familiarity"
      ]}
      steps={[
        {
          title: "Payroll System Setup",
          description: "Initialize the payroll system with employee management",
          code: `// Employee payroll system
import { SVMPay, PayrollProcessor, TaxCalculator } from '@svm-pay/sdk'

const payrollSystem = new PayrollProcessor({
  company: 'TechCorp Inc',
  taxJurisdiction: 'US',
  paymentFrequency: 'biweekly',
  defaultCurrency: 'USDC'
})`
        },
        {
          title: "Process Payroll Batch",
          description: "Execute payroll for multiple employees with automatic tax calculations",
          code: `const processPayroll = async (employees, payPeriod) => {
  const payrollBatch = []

  for (const employee of employees) {
    const grossPay = calculateGrossPay(employee, payPeriod)
    const taxes = await TaxCalculator.calculate(grossPay, employee.taxInfo)
    const netPay = grossPay - taxes.total

    payrollBatch.push({
      employee: employee.id,
      grossPay,
      taxes,
      netPay,
      payment: SVMPay.createPayment({
        recipient: employee.wallet,
        amount: netPay,
        token: employee.preferredCurrency || 'USDC',
        metadata: {
          payrollId: \`\${payPeriod.id}-\${employee.id}\`,
          grossPay,
          deductions: taxes,
          payPeriod
        }
      })
    })
  }

  return await PayrollProcessor.executeBatch(payrollBatch)
}`
        }
      ]}
    />
  )
}

export function SupplyChainPaymentsTutorial() {
  return (
    <TutorialLayout
      title="Supply Chain Payments"
      description="Automated supply chain payments with milestone-based releases"
      level="Advanced"
      time="2.5 hours"
      category="Enterprise Tutorials"
      categoryPath="/docs/tutorials/enterprise"
      overview="Implement automated supply chain payment systems with milestone tracking, escrow mechanisms, and multi-party approval workflows for complex supply chain operations."
      prerequisites={[
        "Supply chain knowledge",
        "Smart contract understanding",
        "SVM-Pay advanced features",
        "Multi-signature wallet experience"
      ]}
      steps={[
        {
          title: "Supply Chain Setup",
          description: "Configure supply chain payment infrastructure",
          code: `// Supply chain payment system
import { SVMPay, SupplyChainManager, EscrowService } from '@svm-pay/sdk'

const supplyChain = new SupplyChainManager({
  escrowEnabled: true,
  milestoneTracking: true,
  multiPartyApproval: true
})`
        }
      ]}
    />
  )
}

export function TreasuryManagementTutorial() {
  return (
    <TutorialLayout
      title="Treasury Management"
      description="Enterprise treasury management with automated liquidity optimization"
      level="Expert"
      time="4 hours"
      category="Enterprise Tutorials"
      categoryPath="/docs/tutorials/enterprise"
      overview="Build sophisticated treasury management systems that automatically optimize liquidity across multiple networks, currencies, and investment vehicles while maintaining compliance and risk management."
      prerequisites={[
        "Treasury management experience",
        "DeFi protocol knowledge",
        "Risk management understanding",
        "Advanced SVM-Pay features"
      ]}
      steps={[
        {
          title: "Treasury System Initialization",
          description: "Set up enterprise treasury management with multi-network support",
          code: `// Enterprise treasury management
import { SVMPay, TreasuryManager, LiquidityOptimizer } from '@svm-pay/sdk'

const treasury = new TreasuryManager({
  networks: ['solana', 'sonic', 'eclipse'],
  riskProfile: 'conservative',
  autoRebalancing: true,
  complianceMode: 'enterprise'
})`
        }
      ]}
    />
  )
}

export function VendorPaymentManagementTutorial() {
  return (
    <TutorialLayout
      title="Vendor Payment Management"
      description="Automated vendor payment processing with approval workflows"
      level="Intermediate"
      time="2 hours"
      category="Enterprise Tutorials"
      categoryPath="/docs/tutorials/enterprise"
      overview="Create a comprehensive vendor payment management system with automated approval workflows, payment scheduling, and vendor onboarding processes."
      prerequisites={[
        "Vendor management knowledge",
        "Approval workflow understanding",
        "SVM-Pay intermediate features",
        "Database management"
      ]}
      steps={[
        {
          title: "Vendor Management Setup",
          description: "Initialize vendor payment system with approval workflows",
          code: `// Vendor payment management
import { SVMPay, VendorManager, ApprovalWorkflow } from '@svm-pay/sdk'

const vendorSystem = new VendorManager({
  approvalRequired: true,
  paymentScheduling: true,
  vendorOnboarding: true
})`
        }
      ]}
    />
  )
}