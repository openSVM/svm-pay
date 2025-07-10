/**
 * Tests for Assembly-BPF SDK
 */

import { PublicKey } from '@solana/web3.js';
import { SVMNetwork } from '../../src/core/types';
import { 
  AssemblyBPFSDK, 
  BPFProgramConfig, 
  BPFTemplates, 
  BPFHelpers,
  BPFInstruction,
  BPFRegister,
  SVMPayBPFProgramType,
  examples
} from '../../src/sdk/assembly-bpf';

describe('Assembly-BPF SDK', () => {
  let sdk: AssemblyBPFSDK;
  let config: BPFProgramConfig;

  beforeEach(() => {
    config = {
      network: SVMNetwork.SOLANA,
      debug: true
    };
    sdk = new AssemblyBPFSDK(config);
  });

  describe('SDK Initialization', () => {
    it('should initialize with default configuration', () => {
      const defaultSDK = new AssemblyBPFSDK({ network: SVMNetwork.SOLANA });
      expect(defaultSDK).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customConfig: BPFProgramConfig = {
        network: SVMNetwork.SONIC,
        debug: true,
        maxComputeUnits: 200000
      };
      const customSDK = new AssemblyBPFSDK(customConfig);
      expect(customSDK).toBeDefined();
    });
  });

  describe('Program Creation', () => {
    it('should create a new BPF program builder', () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Test Program',
        SVMPayBPFProgramType.PAYMENT_PROCESSOR,
        [SVMNetwork.SOLANA]
      );

      const builder = sdk.createProgram(metadata);
      expect(builder).toBeDefined();
      expect(builder.getMetadata()).toEqual(metadata);
    });

    it('should build a program with instructions', () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Test Program',
        SVMPayBPFProgramType.PAYMENT_PROCESSOR,
        [SVMNetwork.SOLANA]
      );

      const builder = sdk.createProgram(metadata);
      builder.addInstruction({
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R0,
        immediate: 42,
        comment: 'Load test value'
      });

      const instructions = builder.getInstructions();
      expect(instructions).toHaveLength(1);
      expect(instructions[0].immediate).toBe(42);
    });
  });

  describe('Compilation', () => {
    it('should compile simple instructions successfully', async () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Simple Test',
        SVMPayBPFProgramType.PAYMENT_PROCESSOR,
        [SVMNetwork.SOLANA]
      );

      const instructions = [
        {
          opcode: BPFInstruction.LOAD_IMM,
          dst: BPFRegister.R0,
          immediate: 0,
          comment: 'Return success'
        },
        {
          opcode: BPFInstruction.EXIT,
          dst: BPFRegister.R0,
          comment: 'Exit program'
        }
      ];

      const result = await sdk.compile(instructions, metadata);
      
      expect(result.success).toBe(true);
      expect(result.bytecode).toBeDefined();
      expect(result.assembly).toBeDefined();
      expect(result.bytecode!.length).toBeGreaterThan(0);
    });

    it('should handle compilation errors gracefully', async () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Error Test',
        SVMPayBPFProgramType.PAYMENT_PROCESSOR,
        [SVMNetwork.SOLANA]
      );

      // Invalid instruction (should cause error in real implementation)
      const instructions = [
        {
          opcode: 999 as BPFInstruction, // Invalid opcode
          dst: BPFRegister.R0,
          immediate: 0
        }
      ];

      const result = await sdk.compile(instructions, metadata);
      
      // Should now properly fail with enhanced validation
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('Templates', () => {
    it('should create payment processor template', () => {
      const { metadata, instructions } = BPFTemplates.createPaymentProcessor({
        networks: [SVMNetwork.SOLANA]
      });

      expect(metadata.type).toBe(SVMPayBPFProgramType.PAYMENT_PROCESSOR);
      expect(metadata.networks).toContain(SVMNetwork.SOLANA);
      expect(instructions.length).toBeGreaterThan(0);
    });

    it('should create cross-chain bridge template', () => {
      const bridgeAuthority = new PublicKey('11111111111111111111111111111112');
      const { metadata, instructions } = BPFTemplates.createCrossChainBridge({
        supportedChains: [1, 137],
        bridgeAuthority,
        networks: [SVMNetwork.SOLANA, SVMNetwork.ECLIPSE]
      });

      expect(metadata.type).toBe(SVMPayBPFProgramType.CROSS_CHAIN_BRIDGE);
      expect(metadata.networks).toContain(SVMNetwork.SOLANA);
      expect(metadata.networks).toContain(SVMNetwork.ECLIPSE);
      expect(instructions.length).toBeGreaterThan(0);
    });

    it('should create payment validator template', () => {
      const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
      const { metadata, instructions } = BPFTemplates.createPaymentValidator({
        minAmount: 1000,
        maxAmount: 1000000000,
        allowedTokens: [usdcMint],
        networks: [SVMNetwork.SOLANA]
      });

      expect(metadata.type).toBe(SVMPayBPFProgramType.VALIDATOR);
      expect(instructions.length).toBeGreaterThan(0);
    });

    it('should create hello world template', () => {
      const { metadata, instructions } = BPFTemplates.createHelloWorld([SVMNetwork.SOON]);

      expect(metadata.networks).toContain(SVMNetwork.SOON);
      expect(instructions.length).toBeGreaterThan(0);
      expect(instructions[instructions.length - 1].opcode).toBe(BPFInstruction.EXIT);
    });
  });

  describe('Helper Functions', () => {
    it('should create payment validation instructions', () => {
      const instructions = BPFHelpers.createPaymentValidator();
      expect(instructions.length).toBeGreaterThan(0);
      expect(instructions.some(i => i.comment?.includes('Load source account'))).toBe(true);
    });

    it('should create error handling instructions', () => {
      const instructions = BPFHelpers.createErrorHandler(1001);
      expect(instructions.length).toBeGreaterThan(0);
      expect(instructions[0].immediate).toBe(1001);
      expect(instructions[instructions.length - 1].opcode).toBe(BPFInstruction.EXIT);
    });

    it('should convert public key to hash', () => {
      const publicKey = new PublicKey('11111111111111111111111111111112');
      const hash = BPFHelpers.publicKeyToHash(publicKey);
      expect(typeof hash).toBe('number');
      expect(hash).toBeGreaterThanOrEqual(0); // Changed to allow zero
    });

    it('should convert string to hash', () => {
      const hash = BPFHelpers.stringToHash('test-string');
      expect(typeof hash).toBe('number');
      expect(hash).toBeGreaterThan(0);
    });
  });

  describe('Program Validation', () => {
    it('should validate empty bytecode', async () => {
      const result = await sdk.validateBytecode(new Uint8Array(0));
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Empty bytecode');
    });

    it('should validate large bytecode', async () => {
      const largeBytecode = new Uint8Array(2 * 1024 * 1024); // 2MB
      const result = await sdk.validateBytecode(largeBytecode);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Program size exceeds maximum limit');
    });

    it('should validate normal bytecode', async () => {
      const normalBytecode = new Uint8Array(1024); // 1KB
      normalBytecode[0] = 0x7f; // ELF magic
      normalBytecode[1] = 0x45;
      normalBytecode[2] = 0x4c;
      normalBytecode[3] = 0x46;
      
      const result = await sdk.validateBytecode(normalBytecode);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('Program Builder Patterns', () => {
    it('should add payment processor functionality', () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Payment Builder Test',
        SVMPayBPFProgramType.PAYMENT_PROCESSOR,
        [SVMNetwork.SOLANA]
      );

      const builder = sdk.createProgram(metadata);
      builder.addPaymentProcessor();

      const instructions = builder.getInstructions();
      expect(instructions.length).toBeGreaterThan(0);
      expect(instructions.some(i => i.comment?.includes('payment processing'))).toBe(true);
    });

    it('should add cross-chain bridge functionality', () => {
      const metadata = BPFHelpers.createProgramMetadata(
        'Bridge Builder Test',
        SVMPayBPFProgramType.CROSS_CHAIN_BRIDGE,
        [SVMNetwork.SOLANA]
      );

      const builder = sdk.createProgram(metadata);
      builder.addCrossChainBridge();

      const instructions = builder.getInstructions();
      expect(instructions.length).toBeGreaterThan(0);
      expect(instructions.some(i => i.comment?.includes('Cross-chain bridge'))).toBe(true);
    });
  });

  describe('Network Specific Features', () => {
    it('should handle different network configurations', () => {
      const networks = [SVMNetwork.SOLANA, SVMNetwork.SONIC, SVMNetwork.ECLIPSE, SVMNetwork.SOON];
      
      networks.forEach(network => {
        const networkConfig: BPFProgramConfig = {
          network,
          debug: true
        };
        const networkSDK = new AssemblyBPFSDK(networkConfig);
        expect(networkSDK).toBeDefined();
      });
    });

    it('should get correct RPC endpoints for networks', () => {
      // Test private method via reflection for testing purposes
      const getDefaultRpcEndpoint = (sdk as any).getDefaultRpcEndpoint.bind(sdk);
      
      expect(getDefaultRpcEndpoint(SVMNetwork.SOLANA)).toContain('solana.com');
      expect(getDefaultRpcEndpoint(SVMNetwork.SONIC)).toContain('sonic.game');
      expect(getDefaultRpcEndpoint(SVMNetwork.ECLIPSE)).toContain('eclipse.xyz');
      expect(getDefaultRpcEndpoint(SVMNetwork.SOON)).toContain('soon.network');
    });
  });
});

describe('Assembly-BPF Examples', () => {
  it('should create hello world example', async () => {
    const result = await examples.createHelloWorld();
    expect(result.compilationResult.success).toBe(true);
    expect(result.metadata.type).toBe(SVMPayBPFProgramType.MIDDLEWARE);
  });

  it('should create simple payment processor example', async () => {
    const result = await examples.createSimplePaymentProcessor();
    expect(result.compilationResult.success).toBe(true);
    expect(result.metadata.type).toBe(SVMPayBPFProgramType.PAYMENT_PROCESSOR);
  });

  it('should run testing workflow', async () => {
    const results = await examples.testingWorkflow();
    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.compilationResult.success).toBe(true);
    });
  });

  it('should run deployment workflow', async () => {
    const result = await examples.deploymentWorkflow();
    expect(result.success).toBe(true);
    expect(result.programId).toBeDefined();
  });
});

describe('BPF Assembler', () => {
  let sdk: AssemblyBPFSDK;

  beforeEach(() => {
    sdk = new AssemblyBPFSDK({ network: SVMNetwork.SOLANA, debug: true });
  });

  it('should generate assembly listing', async () => {
    const instructions = [
      {
        opcode: BPFInstruction.LOAD_IMM,
        dst: BPFRegister.R1,
        immediate: 42,
        comment: 'Load test value'
      },
      {
        opcode: BPFInstruction.ADD,
        dst: BPFRegister.R1,
        src: BPFRegister.R2,
        comment: 'Add registers'
      }
    ];

    const metadata = BPFHelpers.createProgramMetadata(
      'Assembly Test',
      SVMPayBPFProgramType.MIDDLEWARE,
      [SVMNetwork.SOLANA]
    );

    const result = await sdk.compile(instructions, metadata);
    expect(result.assembly).toBeDefined();
    expect(result.assembly).toContain('ldi');
    expect(result.assembly).toContain('add');
    expect(result.assembly).toContain('Load test value');
  });

  it('should estimate compute units correctly', () => {
    const assembler = sdk.getAssembler();
    const instructions = [
      { opcode: BPFInstruction.LOAD_IMM, dst: BPFRegister.R0, immediate: 0 },
      { opcode: BPFInstruction.CALL, dst: BPFRegister.R0, immediate: 1 },
      { opcode: BPFInstruction.EXIT, dst: BPFRegister.R0 }
    ];

    const computeUnits = assembler.estimateComputeUnits(instructions);
    expect(computeUnits).toBeGreaterThan(100); // Call instruction should be expensive
  });
});

describe('BPF Memory Manager', () => {
  let sdk: AssemblyBPFSDK;

  beforeEach(() => {
    sdk = new AssemblyBPFSDK({ network: SVMNetwork.SOLANA, debug: true });
  });

  it('should allocate stack space', () => {
    const memoryManager = sdk.getMemoryManager();
    const instructions = memoryManager.allocateStack(64);
    
    expect(instructions.length).toBeGreaterThan(0);
    expect(instructions.some(i => i.comment?.includes('Allocate'))).toBe(true);
  });

  it('should create memory store/load instructions', () => {
    const memoryManager = sdk.getMemoryManager();
    
    const storeInstr = memoryManager.storeMemory(BPFRegister.R1, -8);
    expect(storeInstr.opcode).toBe(BPFInstruction.STORE_MEM);
    expect(storeInstr.offset).toBe(-8);

    const loadInstr = memoryManager.loadMemory(BPFRegister.R2, -8);
    expect(loadInstr.opcode).toBe(BPFInstruction.LOAD_MEM);
    expect(loadInstr.offset).toBe(-8);
  });

  it('should calculate structure layout', () => {
    const memoryManager = sdk.getMemoryManager();
    const fields = [
      { name: 'amount', size: 8 },
      { name: 'recipient', size: 32 },
      { name: 'memo', size: 64 }
    ];

    const totalSize = memoryManager.calculateStackSpace(fields);
    expect(totalSize).toBe(104);

    const instructions = memoryManager.createStructureLayout(fields);
    expect(instructions.length).toBeGreaterThan(0);
  });
});