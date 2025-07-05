import { motion } from 'framer-motion'

// Enterprise Tutorials
export function EnterpriseTutorials() {
  const tutorials = [
    {
      title: "B2B Invoice Processing",
      description: "Automated invoice processing for enterprise clients",
      level: "Advanced",
      time: "2 hours",
      code: `// Enterprise B2B invoice processing
import { SVMPay, InvoiceProcessor, ComplianceManager } from '@svm-pay/sdk'

const EnterpriseInvoicing = ({ vendor, client, invoice }) => {
  const processB2BInvoice = async () => {
    // Validate invoice compliance
    const compliance = await ComplianceManager.validateInvoice({
      invoice,
      vendor: vendor.taxId,
      client: client.taxId,
      jurisdiction: invoice.jurisdiction
    })

    if (!compliance.isValid) {
      throw new Error('Compliance violation: ' + compliance.violations.join(', '))
    }

    // Create enterprise payment with extended terms
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

    payment.onSuccess(async (result) => {
      // Generate tax-compliant receipt
      const receipt = await InvoiceProcessor.generateReceipt({
        payment: result,
        invoice,
        taxCalculation: compliance.taxCalculation
      })

      // Update accounting systems
      await updateAccountingSystems({
        vendor: vendor.id,
        client: client.id,
        invoice: invoice.id,
        payment: result,
        receipt
      })

      // Trigger compliance reporting
      await ComplianceManager.reportPayment({
        payment: result,
        jurisdiction: invoice.jurisdiction,
        taxAmount: compliance.taxCalculation.totalTax
      })
    })

    return payment.execute()
  }
}`
    },
    {
      title: "Corporate Payroll System",
      description: "Multi-currency payroll with compliance features",
      level: "Expert",
      time: "3 hours",
      code: `// Enterprise payroll system
import { SVMPay, PayrollManager, TaxCalculator } from '@svm-pay/sdk'

const CorporatePayroll = ({ company, employees, payPeriod }) => {
  const processPayroll = async () => {
    const payrollRun = await PayrollManager.createPayrollRun({
      company: company.id,
      payPeriod,
      employees: employees.map(emp => emp.id)
    })

    for (const employee of employees) {
      // Calculate gross pay
      const grossPay = calculateGrossPay(employee, payPeriod)
      
      // Calculate taxes and deductions
      const taxCalculation = await TaxCalculator.calculate({
        employee: employee.taxInfo,
        grossPay,
        jurisdiction: employee.workLocation,
        payPeriod
      })

      const netPay = grossPay - taxCalculation.totalDeductions

      // Process employee payment
      const payment = SVMPay.createPayment({
        recipient: employee.wallet,
        amount: netPay,
        token: employee.preferredCurrency || 'USDC',
        metadata: {
          payrollRunId: payrollRun.id,
          employeeId: employee.id,
          payPeriod,
          grossPay,
          deductions: taxCalculation.deductions,
          netPay
        }
      })

      await payment.execute()

      // Process tax payments to authorities
      for (const taxPayment of taxCalculation.taxPayments) {
        const govPayment = SVMPay.createPayment({
          recipient: taxPayment.authority.wallet,
          amount: taxPayment.amount,
          token: 'USDC',
          metadata: {
            type: 'TAX_PAYMENT',
            taxType: taxPayment.type,
            employeeId: employee.id,
            payrollRunId: payrollRun.id,
            jurisdiction: taxPayment.jurisdiction
          }
        })

        await govPayment.execute()
      }

      // Generate pay stub
      await PayrollManager.generatePayStub({
        employee: employee.id,
        payrollRun: payrollRun.id,
        grossPay,
        deductions: taxCalculation.deductions,
        netPay
      })
    }

    // Complete payroll run
    await PayrollManager.completePayrollRun(payrollRun.id)
  }
}`
    },
    {
      title: "Supply Chain Payments",
      description: "Automated payments throughout supply chain milestones",
      level: "Advanced",
      time: "2.5 hours",
      code: `// Supply chain payment automation
import { SVMPay, SupplyChainManager, IoTIntegration } from '@svm-pay/sdk'

const SupplyChainPayments = ({ supplyChain, contract }) => {
  const setupAutomaticPayments = async () => {
    const paymentSchedule = await SupplyChainManager.createPaymentSchedule({
      contract: contract.id,
      milestones: contract.milestones,
      participants: supplyChain.participants
    })

    // Monitor IoT sensors for milestone completion
    const iotMonitor = await IoTIntegration.createMonitor({
      supplyChainId: supplyChain.id,
      sensors: supplyChain.sensors,
      milestones: contract.milestones
    })

    iotMonitor.onMilestoneReached(async (milestone) => {
      // Validate milestone completion
      const validation = await SupplyChainManager.validateMilestone({
        milestoneId: milestone.id,
        sensorData: milestone.sensorData,
        contractTerms: contract.terms
      })

      if (validation.isValid) {
        // Execute automatic payment
        const payment = SVMPay.createPayment({
          recipient: milestone.participant.wallet,
          amount: milestone.paymentAmount,
          token: 'USDC',
          metadata: {
            contractId: contract.id,
            milestoneId: milestone.id,
            validationData: validation.data,
            completedAt: milestone.completedAt
          }
        })

        await payment.execute()

        // Update supply chain status
        await SupplyChainManager.updateMilestoneStatus({
          milestoneId: milestone.id,
          status: 'COMPLETED',
          paymentId: payment.id
        })

        // Notify all participants
        await SupplyChainManager.notifyParticipants({
          supplyChainId: supplyChain.id,
          milestone: milestone.id,
          status: 'COMPLETED_AND_PAID'
        })
      }
    })

    return { paymentSchedule, iotMonitor }
  }
}`
    },
    {
      title: "Treasury Management",
      description: "Multi-signature treasury with approval workflows",
      level: "Expert",
      time: "3.5 hours",
      code: `// Enterprise treasury management
import { SVMPay, MultiSigWallet, ApprovalWorkflow } from '@svm-pay/sdk'

const EnterpriseTreasury = ({ company, signers, policies }) => {
  const setupTreasury = async () => {
    // Create multi-signature wallet
    const treasuryWallet = await MultiSigWallet.create({
      signers: signers.map(s => s.wallet),
      threshold: policies.signatureThreshold,
      policies: {
        dailyLimit: policies.dailyLimit,
        largeTransactionThreshold: policies.largeTransactionThreshold,
        requiredApprovals: policies.requiredApprovals
      }
    })

    // Setup approval workflows
    const workflow = await ApprovalWorkflow.create({
      treasury: treasuryWallet.address,
      approvers: company.approvers,
      rules: [
        {
          condition: { amount: { gte: 10000 } },
          requiredApprovals: 3,
          approvers: company.seniorManagement
        },
        {
          condition: { amount: { gte: 100000 } },
          requiredApprovals: 5,
          approvers: company.board,
          additionalChecks: ['compliance', 'legal']
        }
      ]
    })

    return { treasuryWallet, workflow }
  }

  const initiatePayment = async (paymentRequest) => {
    // Check if payment requires approval
    const requiresApproval = await workflow.requiresApproval(paymentRequest)

    if (requiresApproval) {
      // Start approval process
      const approval = await ApprovalWorkflow.initiate({
        requestId: paymentRequest.id,
        initiator: paymentRequest.initiator,
        amount: paymentRequest.amount,
        recipient: paymentRequest.recipient,
        purpose: paymentRequest.purpose
      })

      approval.onApprovalComplete(async (approvedRequest) => {
        await executeApprovedPayment(approvedRequest)
      })

      return approval
    } else {
      // Execute payment directly
      return await executePayment(paymentRequest)
    }
  }

  const executeApprovedPayment = async (approvedRequest) => {
    const payment = SVMPay.createPayment({
      recipient: approvedRequest.recipient,
      amount: approvedRequest.amount,
      token: approvedRequest.token,
      metadata: {
        approvalId: approvedRequest.approvalId,
        approvers: approvedRequest.approvers,
        companyId: company.id,
        purpose: approvedRequest.purpose
      }
    })

    // Execute with multi-sig
    const multiSigPayment = await treasuryWallet.executePayment({
      payment,
      requiredSignatures: approvedRequest.requiredSignatures
    })

    return multiSigPayment
  }
}`
    },
    {
      title: "Vendor Management System",
      description: "Automated vendor payments with performance tracking",
      level: "Advanced",
      time: "2 hours",
      code: `// Vendor management and payments
import { SVMPay, VendorManager, PerformanceTracker } from '@svm-pay/sdk'

const VendorManagement = ({ company, vendors }) => {
  const setupVendorPayments = async () => {
    const vendorSystem = await VendorManager.create({
      company: company.id,
      vendors: vendors.map(v => ({
        id: v.id,
        wallet: v.wallet,
        category: v.category,
        paymentTerms: v.paymentTerms,
        performanceMetrics: v.metrics
      }))
    })

    return vendorSystem
  }

  const processVendorPayment = async (vendor, invoice) => {
    // Check vendor performance
    const performance = await PerformanceTracker.getPerformance({
      vendorId: vendor.id,
      period: 'last_90_days'
    })

    // Apply performance-based payment adjustments
    let paymentAmount = invoice.amount
    if (performance.score < 70) {
      // Hold 10% for poor performance
      paymentAmount = invoice.amount * 0.9
    } else if (performance.score > 95) {
      // 2% bonus for excellent performance
      paymentAmount = invoice.amount * 1.02
    }

    const payment = SVMPay.createPayment({
      recipient: vendor.wallet,
      amount: paymentAmount,
      token: 'USDC',
      metadata: {
        vendorId: vendor.id,
        invoiceId: invoice.id,
        performanceScore: performance.score,
        paymentAdjustment: paymentAmount - invoice.amount,
        paymentTerms: vendor.paymentTerms
      }
    })

    payment.onSuccess(async (result) => {
      // Update vendor relationship
      await VendorManager.updateVendorRelationship({
        vendorId: vendor.id,
        lastPayment: result,
        performanceImpact: performance.score > 95 ? 'POSITIVE' : 'NEUTRAL'
      })

      // Track payment for performance metrics
      await PerformanceTracker.recordPayment({
        vendorId: vendor.id,
        amount: paymentAmount,
        onTime: Date.now() <= invoice.dueDate,
        performanceBonus: paymentAmount > invoice.amount
      })
    })

    return payment.execute()
  }

  const generateVendorReports = async (period) => {
    const reports = []
    
    for (const vendor of vendors) {
      const payments = await VendorManager.getPaymentHistory({
        vendorId: vendor.id,
        period
      })
      
      const performance = await PerformanceTracker.getDetailedPerformance({
        vendorId: vendor.id,
        period
      })

      reports.push({
        vendor: vendor.id,
        totalPaid: payments.reduce((sum, p) => sum + p.amount, 0),
        paymentCount: payments.length,
        averagePerformance: performance.averageScore,
        onTimePaymentRate: performance.onTimeRate,
        recommendations: generateVendorRecommendations(vendor, performance)
      })
    }

    return reports
  }
}`
    }
  ]

  return (
    <div className="pt-20 p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Enterprise Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Build enterprise-grade payment systems with compliance and automation
        </p>

        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{tutorial.title}</h3>
                  <p className="text-slate-600 mb-2">{tutorial.description}</p>
                  <div className="flex space-x-4 text-sm text-slate-500">
                    <span>Level: {tutorial.level}</span>
                    <span>Time: {tutorial.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{tutorial.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Cross-Chain Advanced Tutorials
export function CrossChainTutorials() {
  const tutorials = [
    {
      title: "Multi-Chain Arbitrage Strategy",
      description: "Automated arbitrage across multiple blockchain networks",
      level: "Expert",
      time: "4 hours",
      code: `// Multi-chain arbitrage implementation
import { SVMPay, CrossChainBridge, ArbitrageEngine } from '@svm-pay/sdk'

const MultiChainArbitrage = ({ networks, tokens, strategies }) => {
  const setupArbitrageBot = async () => {
    const engine = await ArbitrageEngine.create({
      networks: networks.map(n => ({
        id: n.id,
        rpc: n.rpcUrl,
        bridges: n.supportedBridges,
        dexes: n.dexes
      })),
      tokens: tokens,
      minProfitThreshold: 0.5 // 0.5% minimum profit
    })

    // Monitor price differences across chains
    engine.onOpportunityDetected(async (opportunity) => {
      const profitEstimate = await engine.calculateProfit({
        sourceChain: opportunity.sourceChain,
        targetChain: opportunity.targetChain,
        token: opportunity.token,
        amount: opportunity.optimalAmount
      })

      if (profitEstimate.netProfit > opportunity.threshold) {
        await executeArbitrage(opportunity, profitEstimate)
      }
    })

    return engine
  }

  const executeArbitrage = async (opportunity, profitEstimate) => {
    try {
      // Step 1: Buy on source chain
      const buyPayment = SVMPay.createPayment({
        recipient: opportunity.sourceExchange.wallet,
        amount: opportunity.amount * opportunity.sourcePrice,
        token: 'USDC',
        network: opportunity.sourceChain,
        metadata: {
          type: 'ARBITRAGE_BUY',
          strategy: 'multi_chain',
          expectedProfit: profitEstimate.netProfit
        }
      })

      await buyPayment.execute()

      // Step 2: Bridge tokens to target chain
      const bridgeTransfer = await CrossChainBridge.transfer({
        token: opportunity.token,
        amount: opportunity.amount,
        from: opportunity.sourceChain,
        to: opportunity.targetChain,
        bridge: opportunity.optimalBridge
      })

      // Step 3: Sell on target chain
      bridgeTransfer.onComplete(async () => {
        const sellPayment = SVMPay.createPayment({
          recipient: process.env.ARBITRAGE_WALLET,
          amount: opportunity.amount * opportunity.targetPrice,
          token: 'USDC',
          network: opportunity.targetChain,
          metadata: {
            type: 'ARBITRAGE_SELL',
            profit: profitEstimate.netProfit,
            sourceChain: opportunity.sourceChain
          }
        })

        await sellPayment.execute()

        // Record successful arbitrage
        await ArbitrageEngine.recordTrade({
          profit: profitEstimate.netProfit,
          sourceChain: opportunity.sourceChain,
          targetChain: opportunity.targetChain,
          token: opportunity.token,
          amount: opportunity.amount
        })
      })

    } catch (error) {
      await ArbitrageEngine.handleFailedTrade(opportunity, error)
    }
  }
}`
    },
    {
      title: "Cross-Chain Liquidity Pool",
      description: "Manage liquidity across multiple blockchain networks",
      level: "Expert",
      time: "3.5 hours",
      code: `// Cross-chain liquidity pool management
import { SVMPay, LiquidityPool, CrossChainManager } from '@svm-pay/sdk'

const CrossChainLiquidity = ({ pools, rebalanceStrategy }) => {
  const setupLiquidityPools = async () => {
    const poolManager = await CrossChainManager.create({
      pools: pools.map(pool => ({
        network: pool.network,
        address: pool.address,
        tokens: pool.tokens,
        totalLiquidity: pool.totalLiquidity
      })),
      rebalanceThreshold: 0.2, // 20% imbalance triggers rebalance
      targetAllocation: rebalanceStrategy.targetAllocation
    })

    // Monitor pool imbalances
    poolManager.onImbalanceDetected(async (imbalance) => {
      await rebalanceLiquidity(imbalance)
    })

    return poolManager
  }

  const rebalanceLiquidity = async (imbalance) => {
    const { sourcePool, targetPool, token, amount } = imbalance.rebalanceAction

    // Remove liquidity from over-allocated pool
    const withdrawal = await LiquidityPool.withdraw({
      pool: sourcePool.address,
      network: sourcePool.network,
      token,
      amount,
      provider: process.env.LIQUIDITY_PROVIDER_WALLET
    })

    // Bridge tokens to under-allocated pool's network
    const bridgeTransfer = await CrossChainBridge.transfer({
      token,
      amount,
      from: sourcePool.network,
      to: targetPool.network,
      recipient: process.env.LIQUIDITY_PROVIDER_WALLET
    })

    bridgeTransfer.onComplete(async () => {
      // Add liquidity to under-allocated pool
      const deposit = await LiquidityPool.deposit({
        pool: targetPool.address,
        network: targetPool.network,
        token,
        amount,
        provider: process.env.LIQUIDITY_PROVIDER_WALLET
      })

      // Record rebalance operation
      await CrossChainManager.recordRebalance({
        sourcePool: sourcePool.address,
        targetPool: targetPool.address,
        token,
        amount,
        cost: bridgeTransfer.fee,
        timestamp: Date.now()
      })
    })
  }

  const collectFees = async () => {
    const feeCollection = []

    for (const pool of pools) {
      const fees = await LiquidityPool.getAccruedFees({
        pool: pool.address,
        network: pool.network,
        provider: process.env.LIQUIDITY_PROVIDER_WALLET
      })

      if (fees.total > pool.minFeeCollection) {
        const feePayment = SVMPay.createPayment({
          recipient: process.env.FEE_COLLECTION_WALLET,
          amount: fees.total,
          token: fees.token,
          network: pool.network,
          metadata: {
            type: 'LIQUIDITY_FEE_COLLECTION',
            poolAddress: pool.address,
            network: pool.network,
            feePeriod: fees.period
          }
        })

        await feePayment.execute()
        feeCollection.push({
          pool: pool.address,
          network: pool.network,
          amount: fees.total
        })
      }
    }

    return feeCollection
  }
}`
    },
    {
      title: "Cross-Chain Payment Routing",
      description: "Optimal routing for cross-chain payments with multiple bridges",
      level: "Advanced",
      time: "2.5 hours",
      code: `// Cross-chain payment routing optimization
import { SVMPay, PaymentRouter, BridgeAggregator } from '@svm-pay/sdk'

const CrossChainRouter = ({ bridges, networks }) => {
  const setupPaymentRouting = async () => {
    const router = await PaymentRouter.create({
      bridges: bridges.map(bridge => ({
        id: bridge.id,
        supportedNetworks: bridge.networks,
        feeStructure: bridge.fees,
        averageTransferTime: bridge.avgTime,
        reliability: bridge.reliability
      })),
      routingStrategy: 'OPTIMAL_COST_TIME'
    })

    return router
  }

  const findOptimalRoute = async (paymentRequest) => {
    const routes = await PaymentRouter.calculateRoutes({
      source: paymentRequest.sourceNetwork,
      destination: paymentRequest.destinationNetwork,
      token: paymentRequest.token,
      amount: paymentRequest.amount,
      preferences: {
        prioritize: paymentRequest.prioritize || 'cost', // 'cost', 'speed', 'reliability'
        maxTransferTime: paymentRequest.maxTime || 3600, // 1 hour
        maxSlippage: paymentRequest.maxSlippage || 0.01 // 1%
      }
    })

    // Score routes based on multiple criteria
    const scoredRoutes = routes.map(route => ({
      ...route,
      score: calculateRouteScore(route, paymentRequest.preferences)
    }))

    return scoredRoutes.sort((a, b) => b.score - a.score)[0]
  }

  const executeOptimalPayment = async (paymentRequest) => {
    const optimalRoute = await findOptimalRoute(paymentRequest)

    if (!optimalRoute) {
      throw new Error('No viable route found for payment')
    }

    // Execute payment through optimal route
    const payment = SVMPay.createCrossChainPayment({
      route: optimalRoute,
      recipient: paymentRequest.recipient,
      amount: paymentRequest.amount,
      token: paymentRequest.token,
      metadata: {
        routeId: optimalRoute.id,
        estimatedTime: optimalRoute.estimatedTime,
        estimatedFee: optimalRoute.totalFee,
        bridgeSequence: optimalRoute.bridges
      }
    })

    // Monitor payment progress across bridges
    payment.onProgress(async (progress) => {
      await PaymentRouter.updatePaymentStatus({
        paymentId: payment.id,
        currentBridge: progress.currentBridge,
        completedSteps: progress.completedSteps,
        estimatedCompletion: progress.estimatedCompletion
      })

      // Notify user of progress
      await notifyPaymentProgress(paymentRequest.sender, progress)
    })

    payment.onComplete(async (result) => {
      // Record successful route for future optimization
      await PaymentRouter.recordSuccessfulRoute({
        route: optimalRoute,
        actualTime: result.actualTransferTime,
        actualFee: result.actualFee,
        timestamp: Date.now()
      })
    })

    return payment.execute()
  }

  const calculateRouteScore = (route, preferences) => {
    const weights = {
      cost: preferences.prioritize === 'cost' ? 0.5 : 0.2,
      speed: preferences.prioritize === 'speed' ? 0.5 : 0.3,
      reliability: preferences.prioritize === 'reliability' ? 0.5 : 0.3,
      slippage: 0.2
    }

    // Normalize metrics to 0-1 scale
    const costScore = 1 - (route.totalFee / route.amount)
    const speedScore = 1 - (route.estimatedTime / preferences.maxTransferTime)
    const reliabilityScore = route.reliability
    const slippageScore = 1 - (route.slippage / preferences.maxSlippage)

    return (
      costScore * weights.cost +
      speedScore * weights.speed +
      reliabilityScore * weights.reliability +
      slippageScore * weights.slippage
    )
  }
}`
    },
    {
      title: "Cross-Chain Governance System",
      description: "Implement governance across multiple blockchain networks",
      level: "Expert",
      time: "4 hours",
      code: `// Cross-chain governance implementation
import { SVMPay, GovernanceManager, CrossChainVoting } from '@svm-pay/sdk'

const CrossChainGovernance = ({ networks, governanceToken }) => {
  const setupGovernance = async () => {
    const governance = await GovernanceManager.create({
      governanceToken: governanceToken.address,
      networks: networks.map(network => ({
        id: network.id,
        governanceContract: network.governanceContract,
        votingPower: network.votingPower,
        minVotingThreshold: network.minThreshold
      })),
      crossChainBridges: ['wormhole', 'allbridge'],
      proposalDuration: 7 * 24 * 60 * 60, // 7 days
      executionDelay: 2 * 24 * 60 * 60 // 2 days
    })

    return governance
  }

  const createCrossChainProposal = async (proposal) => {
    const governanceProposal = await GovernanceManager.createProposal({
      title: proposal.title,
      description: proposal.description,
      actions: proposal.actions, // Actions to execute on different networks
      networks: proposal.targetNetworks,
      proposer: proposal.proposer,
      requiredQuorum: proposal.quorum || 0.1 // 10% minimum
    })

    // Deploy proposal to all governance networks
    for (const network of proposal.targetNetworks) {
      await CrossChainVoting.deployProposal({
        proposalId: governanceProposal.id,
        network: network.id,
        proposalData: governanceProposal.data
      })
    }

    return governanceProposal
  }

  const processVote = async (vote) => {
    // Validate voter's token holdings across all networks
    const votingPower = await GovernanceManager.calculateVotingPower({
      voter: vote.voter,
      networks: networks,
      governanceToken: governanceToken.address,
      snapshotBlock: vote.proposal.snapshotBlock
    })

    if (votingPower === 0) {
      throw new Error('No voting power detected')
    }

    // Record vote on voter's preferred network
    const voteTransaction = SVMPay.createPayment({
      recipient: governanceToken.treasuryWallet,
      amount: 0, // Gas/transaction fee only
      token: vote.network.nativeToken,
      metadata: {
        type: 'GOVERNANCE_VOTE',
        proposalId: vote.proposalId,
        vote: vote.choice, // 'for', 'against', 'abstain'
        votingPower: votingPower,
        voterAddress: vote.voter
      }
    })

    await voteTransaction.execute()

    // Aggregate vote across all networks
    await CrossChainVoting.aggregateVote({
      proposalId: vote.proposalId,
      voter: vote.voter,
      choice: vote.choice,
      votingPower: votingPower,
      sourceNetwork: vote.network.id
    })

    return voteTransaction
  }

  const executeProposal = async (proposalId) => {
    const proposal = await GovernanceManager.getProposal(proposalId)
    
    // Check if proposal passed across all networks
    const voteResults = await CrossChainVoting.tallyVotes({
      proposalId,
      networks: proposal.targetNetworks
    })

    const totalVotingPower = voteResults.reduce((sum, result) => sum + result.totalVotes, 0)
    const forVotes = voteResults.reduce((sum, result) => sum + result.forVotes, 0)
    const quorumMet = totalVotingPower >= proposal.requiredQuorum * governanceToken.totalSupply
    const majorityReached = forVotes > (totalVotingPower / 2)

    if (quorumMet && majorityReached) {
      // Execute proposal actions on each target network
      for (const action of proposal.actions) {
        const execution = SVMPay.createPayment({
          recipient: action.target,
          amount: action.value || 0,
          token: action.network.nativeToken,
          metadata: {
            type: 'GOVERNANCE_EXECUTION',
            proposalId,
            actionType: action.type,
            callData: action.callData
          }
        })

        await execution.execute()

        // Record execution
        await GovernanceManager.recordExecution({
          proposalId,
          actionId: action.id,
          network: action.network.id,
          executionTx: execution.transactionId,
          timestamp: Date.now()
        })
      }

      // Mark proposal as executed
      await GovernanceManager.markProposalExecuted(proposalId)
    } else {
      await GovernanceManager.markProposalFailed(proposalId, {
        reason: !quorumMet ? 'QUORUM_NOT_MET' : 'MAJORITY_NOT_REACHED',
        voteResults
      })
    }

    return { executed: quorumMet && majorityReached, voteResults }
  }
}`
    }
  ]

  return (
    <div className="pt-20 p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Cross-Chain Advanced Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Master complex cross-chain operations and multi-network integrations
        </p>

        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{tutorial.title}</h3>
                  <p className="text-slate-600 mb-2">{tutorial.description}</p>
                  <div className="flex space-x-4 text-sm text-slate-500">
                    <span>Level: {tutorial.level}</span>
                    <span>Time: {tutorial.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{tutorial.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Mobile & IoT Tutorials
export function MobileTutorials() {
  const tutorials = [
    {
      title: "Mobile Wallet Integration",
      description: "Integrate mobile wallet payments with biometric authentication",
      level: "Intermediate",
      time: "2 hours",
      code: `// Mobile wallet with biometric authentication
import { SVMPay, BiometricAuth, MobileWallet } from '@svm-pay/sdk'

const MobilePaymentApp = ({ user, device }) => {
  const setupMobileWallet = async () => {
    // Initialize biometric authentication
    const biometric = await BiometricAuth.initialize({
      types: ['fingerprint', 'face', 'voice'],
      fallbackToPin: true,
      maxAttempts: 3
    })

    // Create secure mobile wallet
    const wallet = await MobileWallet.create({
      userId: user.id,
      deviceId: device.id,
      biometricAuth: biometric,
      securityLevel: 'high',
      encryptionKey: device.hardwareSecurityModule
    })

    return { wallet, biometric }
  }

  const processMobilePayment = async (paymentRequest) => {
    // Authenticate user with biometrics
    const authResult = await BiometricAuth.authenticate({
      promptMessage: 'Authenticate to complete payment',
      fallbackTitle: 'Use PIN',
      paymentAmount: paymentRequest.amount
    })

    if (!authResult.success) {
      throw new Error('Authentication failed')
    }

    // Create mobile-optimized payment
    const payment = SVMPay.createPayment({
      recipient: paymentRequest.recipient,
      amount: paymentRequest.amount,
      token: paymentRequest.token,
      metadata: {
        deviceId: device.id,
        biometricVerified: authResult.biometricType,
        gpsLocation: device.location,
        networkType: device.networkType // wifi, cellular, etc.
      }
    })

    // Add mobile-specific security features
    payment.addSecurityFeatures({
      deviceBinding: true,
      geofencing: paymentRequest.geofence,
      velocityChecks: true,
      fraudDetection: true
    })

    payment.onSuccess(async (result) => {
      // Store transaction securely on device
      await MobileWallet.storeTransaction({
        transaction: result,
        encrypted: true,
        biometricProtected: true
      })

      // Send push notification
      await sendPaymentNotification({
        userId: user.id,
        amount: paymentRequest.amount,
        recipient: paymentRequest.recipient,
        status: 'SUCCESS'
      })
    })

    return payment.execute()
  }

  const setupContactlessPayments = async () => {
    // Enable NFC payments
    const nfc = await MobileWallet.enableNFC({
      wallet: wallet.address,
      maxTransactionAmount: 100, // $100 limit
      requiresBiometric: false // For small amounts
    })

    // Enable QR code payments
    const qr = await MobileWallet.enableQR({
      wallet: wallet.address,
      dynamicQR: true,
      expiryTime: 300 // 5 minutes
    })

    return { nfc, qr }
  }
}`
    },
    {
      title: "IoT Device Micropayments",
      description: "Enable micropayments for IoT devices and sensors",
      level: "Advanced",
      time: "2.5 hours",
      code: `// IoT device micropayment system
import { SVMPay, IoTManager, MicropaymentChannel } from '@svm-pay/sdk'

const IoTMicropayments = ({ devices, services }) => {
  const setupIoTPayments = async () => {
    const iotPayments = await IoTManager.initialize({
      devices: devices.map(device => ({
        id: device.id,
        type: device.type,
        capabilities: device.capabilities,
        paymentAddress: device.wallet,
        rateLimit: device.maxTransactionsPerHour
      })),
      micropaymentThreshold: 0.01, // $0.01 minimum
      batchSize: 100 // Batch 100 transactions
    })

    return iotPayments
  }

  const createMicropaymentChannel = async (device, service) => {
    // Create payment channel for efficient micropayments
    const channel = await MicropaymentChannel.create({
      device: device.wallet,
      service: service.wallet,
      initialDeposit: 10, // $10 initial deposit
      channelDuration: 24 * 60 * 60, // 24 hours
      minPayment: 0.001, // $0.001 minimum
      maxPayment: 1 // $1 maximum per transaction
    })

    // Monitor device usage and charge accordingly
    channel.onUsage(async (usage) => {
      const cost = calculateUsageCost(usage, service.pricing)
      
      if (cost > 0) {
        const micropayment = SVMPay.createMicropayment({
          channel: channel.id,
          amount: cost,
          token: 'USDC',
          metadata: {
            deviceId: device.id,
            serviceType: service.type,
            usageData: usage,
            timestamp: Date.now()
          }
        })

        await micropayment.execute()

        // Update device usage statistics
        await IoTManager.updateUsageStats({
          deviceId: device.id,
          usage: usage,
          cost: cost
        })
      }
    })

    return channel
  }

  const processIoTSensorData = async (sensor, dataPacket) => {
    // Charge for data processing
    const processingCost = calculateDataProcessingCost(dataPacket)
    
    const payment = SVMPay.createPayment({
      recipient: process.env.DATA_PROCESSING_SERVICE,
      amount: processingCost,
      token: 'USDC',
      metadata: {
        sensorId: sensor.id,
        dataSize: dataPacket.size,
        processingType: dataPacket.type,
        timestamp: dataPacket.timestamp
      }
    })

    payment.onSuccess(async () => {
      // Process sensor data
      const processedData = await processData(dataPacket)
      
      // Store results
      await IoTManager.storeProcessedData({
        sensorId: sensor.id,
        rawData: dataPacket,
        processedData: processedData,
        cost: processingCost
      })

      // Trigger alerts if necessary
      if (processedData.alertLevel > sensor.alertThreshold) {
        await IoTManager.triggerAlert({
          sensorId: sensor.id,
          alertLevel: processedData.alertLevel,
          data: processedData
        })
      }
    })

    return payment.execute()
  }

  const setupDeviceAutopay = async (device, budget) => {
    // Create autopay system for IoT devices
    const autopay = await IoTManager.createAutopay({
      deviceId: device.id,
      monthlyBudget: budget.monthly,
      dailyLimit: budget.daily,
      services: budget.allowedServices,
      autoTopup: {
        enabled: true,
        threshold: budget.monthly * 0.2, // Topup when 20% remaining
        amount: budget.monthly * 0.5 // Topup 50% of monthly budget
      }
    })

    autopay.onLowBalance(async (notification) => {
      if (autopay.autoTopup.enabled) {
        const topupPayment = SVMPay.createPayment({
          recipient: device.wallet,
          amount: autopay.autoTopup.amount,
          token: 'USDC',
          metadata: {
            type: 'DEVICE_AUTOPAY_TOPUP',
            deviceId: device.id,
            remainingBalance: notification.balance
          }
        })

        await topupPayment.execute()

        await IoTManager.notifyTopup({
          deviceId: device.id,
          amount: autopay.autoTopup.amount,
          newBalance: notification.balance + autopay.autoTopup.amount
        })
      }
    })

    return autopay
  }
}`
    },
    {
      title: "Smart City Payment Infrastructure",
      description: "Payment system for smart city services and utilities",
      level: "Expert",
      time: "3 hours",
      code: `// Smart city payment infrastructure
import { SVMPay, SmartCityManager, UtilityBilling } from '@svm-pay/sdk'

const SmartCityPayments = ({ city, residents, services }) => {
  const setupCityPayments = async () => {
    const citySystem = await SmartCityManager.initialize({
      cityId: city.id,
      residents: residents.map(r => ({
        id: r.id,
        wallet: r.wallet,
        residenceAddress: r.address,
        services: r.subscribedServices
      })),
      services: services.map(s => ({
        id: s.id,
        type: s.type, // 'water', 'electricity', 'gas', 'parking', 'transport'
        provider: s.provider,
        pricingModel: s.pricing
      }))
    })

    return citySystem
  }

  const processUtilityBilling = async (resident, period) => {
    const utilityUsage = await UtilityBilling.getUsage({
      residentId: resident.id,
      period: period,
      services: ['water', 'electricity', 'gas']
    })

    let totalBill = 0
    const billBreakdown = []

    for (const [service, usage] of Object.entries(utilityUsage)) {
      const cost = calculateUtilityCost(service, usage, city.rates[service])
      totalBill += cost
      billBreakdown.push({
        service,
        usage: usage.amount,
        rate: city.rates[service],
        cost
      })
    }

    // Create consolidated utility payment
    const utilityPayment = SVMPay.createPayment({
      recipient: city.treasuryWallet,
      amount: totalBill,
      token: 'USDC',
      metadata: {
        type: 'UTILITY_BILL',
        residentId: resident.id,
        period: period,
        billBreakdown: billBreakdown,
        totalUsage: utilityUsage
      }
    })

    utilityPayment.onSuccess(async (result) => {
      // Generate and send bill receipt
      const receipt = await UtilityBilling.generateReceipt({
        payment: result,
        resident: resident.id,
        breakdown: billBreakdown
      })

      await sendBillReceipt(resident.email, receipt)

      // Update resident payment history
      await SmartCityManager.updatePaymentHistory({
        residentId: resident.id,
        payment: result,
        services: Object.keys(utilityUsage)
      })
    })

    return utilityPayment.execute()
  }

  const setupSmartParkingPayments = async () => {
    const parkingSystem = await SmartCityManager.createParkingSystem({
      zones: city.parkingZones,
      pricing: city.parkingRates,
      sensors: city.parkingSensors
    })

    // Handle parking session payments
    parkingSystem.onParkingStart(async (session) => {
      // Create payment channel for parking session
      const parkingChannel = await SVMPay.createPaymentChannel({
        user: session.driverWallet,
        service: city.parkingWallet,
        maxAmount: session.estimatedCost * 2, // 2x buffer
        duration: session.maxDuration
      })

      session.paymentChannel = parkingChannel
    })

    parkingSystem.onParkingEnd(async (session) => {
      const totalCost = calculateParkingCost(session.duration, session.zone)
      
      const parkingPayment = SVMPay.createPayment({
        recipient: city.parkingWallet,
        amount: totalCost,
        token: 'USDC',
        metadata: {
          type: 'PARKING_PAYMENT',
          sessionId: session.id,
          zone: session.zone,
          duration: session.duration,
          vehicleId: session.vehicleId
        }
      })

      await parkingPayment.execute()

      // Close payment channel and refund unused amount
      await session.paymentChannel.close({
        finalPayment: totalCost
      })
    })

    return parkingSystem
  }

  const setupPublicTransportPayments = async () => {
    const transitSystem = await SmartCityManager.createTransitSystem({
      routes: city.transitRoutes,
      stations: city.transitStations,
      fares: city.transitFares
    })

    // Handle tap-to-pay for public transport
    transitSystem.onTap(async (tapEvent) => {
      let fare = 0
      
      if (tapEvent.type === 'ENTRY') {
        // Start journey - create pending payment
        const journey = await transitSystem.startJourney({
          userId: tapEvent.userId,
          station: tapEvent.station,
          timestamp: tapEvent.timestamp
        })
        
        return journey
      } else if (tapEvent.type === 'EXIT') {
        // End journey - calculate and charge fare
        const journey = await transitSystem.getActiveJourney(tapEvent.userId)
        fare = calculateTransitFare(journey.entryStation, tapEvent.station, city.transitFares)
        
        const transitPayment = SVMPay.createPayment({
          recipient: city.transitWallet,
          amount: fare,
          token: 'USDC',
          metadata: {
            type: 'TRANSIT_PAYMENT',
            journeyId: journey.id,
            entryStation: journey.entryStation,
            exitStation: tapEvent.station,
            duration: tapEvent.timestamp - journey.startTime
          }
        })

        await transitPayment.execute()

        // Complete journey
        await transitSystem.completeJourney({
          journeyId: journey.id,
          exitStation: tapEvent.station,
          fare: fare,
          paymentId: transitPayment.id
        })
      }
    })

    return transitSystem
  }
}`
    },
    {
      title: "Vehicle-to-Everything (V2X) Payments",
      description: "Autonomous payments for connected vehicles",
      level: "Expert",
      time: "3.5 hours",
      code: `// Vehicle-to-Everything payment system
import { SVMPay, V2XManager, AutonomousPayments } from '@svm-pay/sdk'

const V2XPayments = ({ vehicles, infrastructure }) => {
  const setupV2XPayments = async () => {
    const v2xSystem = await V2XManager.initialize({
      vehicles: vehicles.map(v => ({
        id: v.id,
        wallet: v.wallet,
        owner: v.owner,
        capabilities: v.capabilities,
        autonomyLevel: v.autonomyLevel
      })),
      infrastructure: infrastructure.map(i => ({
        id: i.id,
        type: i.type, // 'charging_station', 'toll_booth', 'parking_meter'
        location: i.location,
        services: i.services,
        wallet: i.wallet
      }))
    })

    return v2xSystem
  }

  const handleVehicleToInfrastructure = async (vehicle, service) => {
    // Negotiate service terms
    const negotiation = await V2XManager.negotiateService({
      vehicle: vehicle.id,
      service: service.id,
      requirements: vehicle.currentNeeds
    })

    if (negotiation.agreed) {
      // Create autonomous payment
      const payment = SVMPay.createAutonomousPayment({
        payer: vehicle.wallet,
        recipient: service.wallet,
        amount: negotiation.price,
        token: 'USDC',
        conditions: {
          serviceDelivered: true,
          qualityMet: negotiation.qualityThreshold,
          timeCompleted: negotiation.maxDuration
        },
        metadata: {
          type: 'V2I_PAYMENT',
          vehicleId: vehicle.id,
          serviceId: service.id,
          negotiationId: negotiation.id
        }
      })

      // Monitor service delivery
      payment.onServiceStart(async () => {
        await V2XManager.startServiceMonitoring({
          vehicleId: vehicle.id,
          serviceId: service.id,
          paymentId: payment.id
        })
      })

      payment.onServiceComplete(async (serviceResult) => {
        if (serviceResult.qualityMet) {
          await payment.execute()
        } else {
          // Partial payment based on quality delivered
          await payment.executePartial(serviceResult.qualityPercentage)
        }
      })

      return payment
    }
  }

  const setupVehicleToVehicle = async () => {
    const v2vSystem = await V2XManager.createV2VPayments({
      services: [
        'traffic_data',
        'parking_spots',
        'route_optimization',
        'emergency_assistance'
      ],
      pricingModel: 'market_based'
    })

    v2vSystem.onDataRequest(async (request) => {
      const { requester, provider, dataType, value } = request
      
      // Market-based pricing for data
      const price = await v2vSystem.calculateDataPrice({
        dataType: dataType,
        value: value,
        demand: request.currentDemand,
        supply: request.availableProviders
      })

      // Create micro-payment for data exchange
      const dataPayment = SVMPay.createMicropayment({
        payer: requester.wallet,
        recipient: provider.wallet,
        amount: price,
        token: 'USDC',
        metadata: {
          type: 'V2V_DATA_EXCHANGE',
          dataType: dataType,
          requestId: request.id,
          quality: value.quality
        }
      })

      dataPayment.onSuccess(async () => {
        // Transfer data to requesting vehicle
        await V2XManager.transferData({
          from: provider.id,
          to: requester.id,
          data: value,
          paymentId: dataPayment.id
        })

        // Update data marketplace metrics
        await v2vSystem.updateMarketMetrics({
          dataType: dataType,
          price: price,
          quality: value.quality,
          timestamp: Date.now()
        })
      })

      return dataPayment.execute()
    })

    return v2vSystem
  }

  const setupElectricVehicleCharging = async () => {
    const chargingSystem = await V2XManager.createChargingSystem({
      stations: infrastructure.filter(i => i.type === 'charging_station'),
      pricingModel: 'dynamic',
      reservationSystem: true
    })

    chargingSystem.onChargingSession(async (session) => {
      const { vehicle, station, estimatedEnergy } = session
      
      // Create dynamic pricing based on demand and grid conditions
      const dynamicRate = await chargingSystem.calculateDynamicRate({
        station: station.id,
        time: Date.now(),
        gridLoad: station.currentGridLoad,
        demand: station.currentDemand
      })

      // Setup streaming payments for charging
      const chargingPayment = SVMPay.createStreamingPayment({
        payer: vehicle.wallet,
        recipient: station.wallet,
        ratePerUnit: dynamicRate,
        unit: 'kWh',
        maxAmount: estimatedEnergy * dynamicRate * 1.2, // 20% buffer
        metadata: {
          type: 'EV_CHARGING',
          sessionId: session.id,
          stationId: station.id,
          vehicleId: vehicle.id
        }
      })

      // Monitor charging in real-time
      chargingPayment.onEnergyDelivered(async (energyAmount) => {
        const cost = energyAmount * dynamicRate
        await chargingPayment.streamPayment(cost)
        
        // Update vehicle's energy level
        await V2XManager.updateVehicleEnergy({
          vehicleId: vehicle.id,
          energyAdded: energyAmount,
          cost: cost
        })
      })

      chargingPayment.onChargingComplete(async (totalEnergy, totalCost) => {
        await chargingPayment.finalize()
        
        // Update charging history
        await chargingSystem.recordChargingSession({
          sessionId: session.id,
          totalEnergy: totalEnergy,
          totalCost: totalCost,
          averageRate: totalCost / totalEnergy
        })
      })

      return chargingPayment
    })

    return chargingSystem
  }
}`
    }
  ]

  return (
    <div className="pt-20 p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Mobile & IoT Tutorials</h1>
        <p className="text-xl text-slate-600 mb-8">
          Enable payments for mobile devices, IoT sensors, and smart infrastructure
        </p>

        <div className="space-y-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{tutorial.title}</h3>
                  <p className="text-slate-600 mb-2">{tutorial.description}</p>
                  <div className="flex space-x-4 text-sm text-slate-500">
                    <span>Level: {tutorial.level}</span>
                    <span>Time: {tutorial.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm text-slate-100 overflow-x-auto">
                  <code>{tutorial.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}