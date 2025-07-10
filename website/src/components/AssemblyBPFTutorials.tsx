import { motion } from 'framer-motion'

export function AssemblyBPFTutorials() {
  const tutorials = [
    {
      title: "Hello World BPF Program",
      description: "Create your first BPF program with Assembly-BPF SDK",
      level: "Beginner",
      time: "15 minutes",
      code: `// Your first Assembly-BPF program
import { AssemblyBPFSDK, examples } from 'svm-pay/assembly-bpf'

const createHelloWorld = async () => {
  // Use the built-in example
  const { sdk, compilationResult, metadata } = await examples.createHelloWorld()
  
  console.log('✅ Hello World compiled successfully')
  console.log('📜 Assembly:')
  console.log(compilationResult.assembly)
  
  // Output:
  // 0000: ldi     r1, 1745172467 ; Debug: Hello from SVM-Pay Assembly-BPF SDK!
  // 0001: call    1 ; Log debug message
  // 0002: ldi     r0, 0 ; Return success
  // 0003: exit    r0 ; Exit program
}

createHelloWorld()`
    },
    {
      title: "Payment Processor BPF Program", 
      description: "Build a payment processor with fee handling",
      level: "Intermediate",
      time: "45 minutes",
      code: `// Payment processor with fees
import { 
  AssemblyBPFSDK, 
  BPFTemplates, 
  SVMNetwork,
  BPFProgramConfig 
} from 'svm-pay/assembly-bpf'

const createPaymentProcessor = async () => {
  // Configure SDK
  const config: BPFProgramConfig = {
    network: SVMNetwork.SOLANA,
    debug: true
  }
  
  const sdk = new AssemblyBPFSDK(config)
  
  // Create payment processor template
  const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
    networks: [SVMNetwork.SOLANA, SVMNetwork.SONIC],
    feeRate: 0.01, // 1% fee
    maxAmount: 1000000 // Max 1M tokens
  })
  
  // Compile the program
  const result = await sdk.compile(instructions, metadata)
  
  if (result.success) {
    console.log('✅ Payment processor compiled successfully')
    console.log(\`📊 Instructions: \${instructions.length}\`)
    console.log(\`💾 Bytecode size: \${result.bytecode?.length} bytes\`)
    console.log(\`⚡ Estimated compute units: \${result.computeUnits}\`)
  }
  
  return result
}`
    },
    {
      title: "Cross-Chain Bridge Program",
      description: "Implement cross-chain asset bridging with validation",
      level: "Advanced", 
      time: "1.5 hours",
      code: `// Cross-chain bridge implementation
import { 
  AssemblyBPFSDK,
  BPFTemplates,
  BPFProgramBuilder,
  BPFHelpers,
  SVMNetwork
} from 'svm-pay/assembly-bpf'

const createCrossChainBridge = async () => {
  const sdk = new AssemblyBPFSDK({ 
    network: SVMNetwork.SOLANA,
    debug: true 
  })
  
  // Create bridge template
  const { metadata, instructions } = BPFTemplates.createCrossChainBridge({
    supportedNetworks: [
      SVMNetwork.SOLANA,
      SVMNetwork.SONIC,
      SVMNetwork.ECLIPSE,
      SVMNetwork.SOON
    ],
    bridgeFee: 0.005, // 0.5% bridge fee
    minAmount: 1000, // Minimum 1000 tokens
    maxAmount: 10000000 // Maximum 10M tokens
  })
  
  // Build custom program with additional validation
  const builder = sdk.createProgram(metadata)
  
  builder
    .addInstructions(BPFHelpers.createDebugLog('Starting bridge operation'))
    .addValidator() // Add validation layer
    .addInstructions(instructions) // Add bridge logic
    .addInstructions(BPFHelpers.createDebugLog('Bridge operation completed'))
  
  // Compile with optimizations
  const result = await builder.compile({
    optimize: true,
    targetNetwork: SVMNetwork.SOLANA
  })
  
  console.log('🌉 Cross-chain bridge compiled:')
  console.log(\`📊 Instructions: \${result.instructionCount}\`)
  console.log(\`💾 Bytecode: \${result.bytecode?.length} bytes\`)
  console.log(\`⚡ Compute units: \${result.computeUnits}\`)
  
  return result
}`
    },
    {
      title: "Custom Memory Management",
      description: "Advanced memory management and syscall handling",
      level: "Expert",
      time: "2 hours", 
      code: `// Advanced memory management
import { 
  AssemblyBPFSDK,
  BPFMemoryManager,
  BPFSyscallHelper,
  BPFInstruction,
  BPFRegister,
  SVMNetwork
} from 'svm-pay/assembly-bpf'

const createAdvancedProgram = async () => {
  const sdk = new AssemblyBPFSDK({ network: SVMNetwork.SOLANA })
  
  // Create custom memory structures
  const paymentStruct = BPFMemoryManager.createStruct([
    { name: 'amount', type: 'u64', offset: 0 },
    { name: 'recipient', type: 'pubkey', offset: 8 },
    { name: 'fee', type: 'u64', offset: 40 },
    { name: 'timestamp', type: 'u64', offset: 48 }
  ])
  
  // Allocate stack space
  const stackPtr = BPFMemoryManager.allocateStack(128)
  
  // Create syscall helper
  const syscalls = new BPFSyscallHelper(SVMNetwork.SOLANA)
  
  // Build program with custom instructions
  const instructions = [
    // Load payment amount
    {
      opcode: BPFInstruction.LOAD_IMM,
      dst: BPFRegister.R1,
      immediate: 1000000, // 1M tokens
      comment: 'Load payment amount'
    },
    
    // Validate amount using syscall
    syscalls.validateAmount(BPFRegister.R1),
    
    // Store to memory structure
    {
      opcode: BPFInstruction.STORE_MEM,
      dst: BPFRegister.R10,
      src: BPFRegister.R1,
      offset: paymentStruct.fields.amount.offset,
      comment: 'Store amount to payment struct'
    },
    
    // Get current timestamp
    syscalls.getCurrentTimestamp(BPFRegister.R2),
    
    // Store timestamp
    {
      opcode: BPFInstruction.STORE_MEM,
      dst: BPFRegister.R10,
      src: BPFRegister.R2,
      offset: paymentStruct.fields.timestamp.offset,
      comment: 'Store timestamp'
    },
    
    // Process payment
    syscalls.processPayment(stackPtr),
    
    // Return success
    {
      opcode: BPFInstruction.LOAD_IMM,
      dst: BPFRegister.R0,
      immediate: 0,
      comment: 'Return success'
    },
    
    {
      opcode: BPFInstruction.EXIT,
      src: BPFRegister.R0,
      comment: 'Exit program'
    }
  ]
  
  const metadata = {
    name: 'advanced-payment-processor',
    version: '1.0.0',
    description: 'Advanced payment processor with custom memory management',
    networks: [SVMNetwork.SOLANA],
    computeUnits: 1000
  }
  
  const result = await sdk.compile(instructions, metadata)
  console.log('🔧 Advanced program compiled:', result.success)
  
  return result
}`
    }
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
            Assembly-BPF SDK
            <br />
            <span className="gradient-text">Tutorials</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn how to build efficient, low-level BPF programs for SVM networks with step-by-step tutorials
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      tutorial.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      tutorial.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      tutorial.level === 'Advanced' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tutorial.level}
                    </span>
                    <span className="text-slate-500">
                      ⏱️ {tutorial.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-xl p-6 overflow-hidden">
                <pre className="text-slate-100 font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{tutorial.code}</code>
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}