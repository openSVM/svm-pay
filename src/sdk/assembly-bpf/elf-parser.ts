/**
 * ELF parser for BPF programs integration
 */

import { BPFELFParseResult } from './types';

/**
 * ELF header constants
 */
const ELF_MAGIC = [0x7f, 0x45, 0x4c, 0x46]; // \x7fELF
const EI_CLASS = 4;
const EI_DATA = 5;
const EI_VERSION = 6;

const ELFCLASS64 = 2;
const ELFDATA2LSB = 1;
const EV_CURRENT = 1;

/**
 * Program header types
 */
enum ProgramHeaderType {
  PT_NULL = 0,
  PT_LOAD = 1,
  PT_DYNAMIC = 2,
  PT_INTERP = 3,
  PT_NOTE = 4,
  PT_SHLIB = 5,
  PT_PHDR = 6,
  PT_TLS = 7
}

/**
 * Section header types
 */
enum SectionHeaderType {
  SHT_NULL = 0,
  SHT_PROGBITS = 1,
  SHT_SYMTAB = 2,
  SHT_STRTAB = 3,
  SHT_RELA = 4,
  SHT_HASH = 5,
  SHT_DYNAMIC = 6,
  SHT_NOTE = 7,
  SHT_NOBITS = 8,
  SHT_REL = 9,
  SHT_DYNSYM = 11
}

/**
 * Enhanced ELF parser for BPF programs
 */
export class BPFELFParser {
  private data: Uint8Array;
  private view: DataView;
  private is64bit: boolean = false;
  private isLittleEndian: boolean = true;

  constructor(data: Uint8Array) {
    this.data = data;
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  /**
   * Parse ELF file and extract BPF program information
   */
  parse(): BPFELFParseResult {
    try {
      // Validate ELF header
      if (!this.validateELFHeader()) {
        return {
          success: false,
          error: 'Invalid ELF header'
        };
      }

      // Parse ELF header to get architecture info
      this.parseELFHeader();

      // Parse program headers
      const programHeaders = this.parseProgramHeaders();
      
      // Parse section headers
      const sectionHeaders = this.parseSectionHeaders();
      
      // Parse symbol table
      const symbols = this.parseSymbolTable(sectionHeaders);

      return {
        success: true,
        programHeaders,
        sectionHeaders,
        symbols
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error'
      };
    }
  }

  /**
   * Validate ELF magic number and basic header
   */
  private validateELFHeader(): boolean {
    if (this.data.length < 64) {
      return false;
    }

    // Check ELF magic number
    for (let i = 0; i < 4; i++) {
      if (this.data[i] !== ELF_MAGIC[i]) {
        return false;
      }
    }

    // Check class (32-bit or 64-bit)
    const elfClass = this.data[EI_CLASS];
    if (elfClass !== 1 && elfClass !== 2) { // ELFCLASS32 or ELFCLASS64
      return false;
    }

    // Check data encoding
    const elfData = this.data[EI_DATA];
    if (elfData !== 1 && elfData !== 2) { // ELFDATA2LSB or ELFDATA2MSB
      return false;
    }

    // Check version
    const elfVersion = this.data[EI_VERSION];
    if (elfVersion !== EV_CURRENT) {
      return false;
    }

    return true;
  }

  /**
   * Parse ELF header and extract architecture information
   */
  private parseELFHeader(): void {
    this.is64bit = this.data[EI_CLASS] === ELFCLASS64;
    this.isLittleEndian = this.data[EI_DATA] === ELFDATA2LSB;
  }

  /**
   * Parse program headers
   */
  private parseProgramHeaders(): Array<{
    type: number;
    offset: number;
    vaddr: number;
    paddr: number;
    filesz: number;
    memsz: number;
    flags: number;
  }> {
    const programHeaders: Array<any> = [];
    
    // Get program header table offset and size
    const phOff = this.is64bit 
      ? this.readUint64(32, this.isLittleEndian)
      : this.readUint32(28, this.isLittleEndian);
    const phEntSize = this.readUint16(this.is64bit ? 54 : 42, this.isLittleEndian);
    const phNum = this.readUint16(this.is64bit ? 56 : 44, this.isLittleEndian);

    for (let i = 0; i < phNum; i++) {
      const offset = Number(phOff) + (i * phEntSize);
      
      if (offset + phEntSize > this.data.length) {
        break;
      }

      const header = this.is64bit ? {
        type: this.readUint32(offset, this.isLittleEndian),
        flags: this.readUint32(offset + 4, this.isLittleEndian),
        offset: Number(this.readUint64(offset + 8, this.isLittleEndian)),
        vaddr: Number(this.readUint64(offset + 16, this.isLittleEndian)),
        paddr: Number(this.readUint64(offset + 24, this.isLittleEndian)),
        filesz: Number(this.readUint64(offset + 32, this.isLittleEndian)),
        memsz: Number(this.readUint64(offset + 40, this.isLittleEndian))
      } : {
        type: this.readUint32(offset, this.isLittleEndian),
        offset: this.readUint32(offset + 4, this.isLittleEndian),
        vaddr: this.readUint32(offset + 8, this.isLittleEndian),
        paddr: this.readUint32(offset + 12, this.isLittleEndian),
        filesz: this.readUint32(offset + 16, this.isLittleEndian),
        memsz: this.readUint32(offset + 20, this.isLittleEndian),
        flags: this.readUint32(offset + 24, this.isLittleEndian)
      };

      programHeaders.push(header);
    }

    return programHeaders;
  }

  /**
   * Parse section headers
   */
  private parseSectionHeaders(): Array<{
    name: string;
    type: number;
    flags: number;
    addr: number;
    offset: number;
    size: number;
  }> {
    const sectionHeaders: Array<any> = [];

    // Get section header table offset and size
    const shOff = this.is64bit 
      ? this.readUint64(40, this.isLittleEndian)
      : this.readUint32(32, this.isLittleEndian);
    const shEntSize = this.readUint16(this.is64bit ? 58 : 46, this.isLittleEndian);
    const shNum = this.readUint16(this.is64bit ? 60 : 48, this.isLittleEndian);
    const shStrNdx = this.readUint16(this.is64bit ? 62 : 50, this.isLittleEndian);

    // Read string table for section names
    let stringTable: Uint8Array | null = null;
    if (shStrNdx < shNum) {
      const strTabHeaderOffset = Number(shOff) + (shStrNdx * shEntSize);
      const strTabOffset = this.is64bit 
        ? Number(this.readUint64(strTabHeaderOffset + 24, this.isLittleEndian))
        : this.readUint32(strTabHeaderOffset + 16, this.isLittleEndian);
      const strTabSize = this.is64bit
        ? Number(this.readUint64(strTabHeaderOffset + 32, this.isLittleEndian))
        : this.readUint32(strTabHeaderOffset + 20, this.isLittleEndian);
      
      if (strTabOffset + strTabSize <= this.data.length) {
        stringTable = this.data.slice(strTabOffset, strTabOffset + strTabSize);
      }
    }

    for (let i = 0; i < shNum; i++) {
      const offset = Number(shOff) + (i * shEntSize);
      
      if (offset + shEntSize > this.data.length) {
        break;
      }

      const nameOffset = this.readUint32(offset, this.isLittleEndian);
      const name = stringTable ? this.readString(stringTable, nameOffset) : `section_${i}`;

      const header = this.is64bit ? {
        name,
        type: this.readUint32(offset + 4, this.isLittleEndian),
        flags: Number(this.readUint64(offset + 8, this.isLittleEndian)),
        addr: Number(this.readUint64(offset + 16, this.isLittleEndian)),
        offset: Number(this.readUint64(offset + 24, this.isLittleEndian)),
        size: Number(this.readUint64(offset + 32, this.isLittleEndian))
      } : {
        name,
        type: this.readUint32(offset + 4, this.isLittleEndian),
        flags: this.readUint32(offset + 8, this.isLittleEndian),
        addr: this.readUint32(offset + 12, this.isLittleEndian),
        offset: this.readUint32(offset + 16, this.isLittleEndian),
        size: this.readUint32(offset + 20, this.isLittleEndian)
      };

      sectionHeaders.push(header);
    }

    return sectionHeaders;
  }

  /**
   * Parse symbol table
   */
  private parseSymbolTable(sectionHeaders: Array<any>): Array<{
    name: string;
    value: number;
    size: number;
    type: number;
    binding: number;
  }> {
    const symbols: Array<any> = [];

    // Find symbol table section
    const symTabSection = sectionHeaders.find(sh => 
      sh.type === SectionHeaderType.SHT_SYMTAB || sh.type === SectionHeaderType.SHT_DYNSYM
    );

    if (!symTabSection) {
      return symbols;
    }

    // Find corresponding string table
    const strTabIndex = symTabSection.link || (sectionHeaders.findIndex(sh => sh.type === SectionHeaderType.SHT_STRTAB) + 1);
    const strTabSection = sectionHeaders[strTabIndex - 1];
    
    if (!strTabSection) {
      return symbols;
    }

    // Read string table
    const stringTable = this.data.slice(strTabSection.offset, strTabSection.offset + strTabSection.size);

    // Parse symbols
    const symEntSize = this.is64bit ? 24 : 16;
    const numSymbols = Math.floor(symTabSection.size / symEntSize);

    for (let i = 0; i < numSymbols; i++) {
      const offset = symTabSection.offset + (i * symEntSize);
      
      if (offset + symEntSize > this.data.length) {
        break;
      }

      const nameOffset = this.readUint32(offset, this.isLittleEndian);
      const name = this.readString(stringTable, nameOffset);

      const symbol = this.is64bit ? {
        name,
        value: Number(this.readUint64(offset + 8, this.isLittleEndian)),
        size: Number(this.readUint64(offset + 16, this.isLittleEndian)),
        type: this.data[offset + 4] & 0xf,
        binding: (this.data[offset + 4] >> 4) & 0xf
      } : {
        name,
        value: this.readUint32(offset + 4, this.isLittleEndian),
        size: this.readUint32(offset + 8, this.isLittleEndian),
        type: this.data[offset + 12] & 0xf,
        binding: (this.data[offset + 12] >> 4) & 0xf
      };

      symbols.push(symbol);
    }

    return symbols;
  }

  /**
   * Read string from string table
   */
  private readString(stringTable: Uint8Array, offset: number): string {
    if (offset >= stringTable.length) {
      return '';
    }

    const end = stringTable.indexOf(0, offset);
    const slice = stringTable.slice(offset, end === -1 ? undefined : end);
    return new TextDecoder().decode(slice);
  }

  /**
   * Read 32-bit unsigned integer
   */
  private readUint32(offset: number, littleEndian: boolean): number {
    return this.view.getUint32(offset, littleEndian);
  }

  /**
   * Read 16-bit unsigned integer
   */
  private readUint16(offset: number, littleEndian: boolean): number {
    return this.view.getUint16(offset, littleEndian);
  }

  /**
   * Read 64-bit unsigned integer (as BigInt)
   */
  private readUint64(offset: number, littleEndian: boolean): bigint {
    return this.view.getBigUint64(offset, littleEndian);
  }

  /**
   * Extract BPF program text section
   */
  extractProgramText(parseResult: BPFELFParseResult): Uint8Array | null {
    if (!parseResult.success || !parseResult.sectionHeaders) {
      return null;
    }

    const textSection = parseResult.sectionHeaders.find(sh => 
      sh.name === '.text' || sh.name === '.bpf'
    );

    if (!textSection) {
      return null;
    }

    return this.data.slice(textSection.offset, textSection.offset + textSection.size);
  }

  /**
   * Validate BPF ELF file structure
   */
  validateBPFELF(parseResult: BPFELFParseResult): string[] {
    const issues: string[] = [];

    if (!parseResult.success) {
      issues.push(parseResult.error || 'Failed to parse ELF');
      return issues;
    }

    // Check for required sections
    const requiredSections = ['.text'];
    const sectionNames = parseResult.sectionHeaders?.map(sh => sh.name) || [];
    
    for (const required of requiredSections) {
      if (!sectionNames.includes(required)) {
        issues.push(`Missing required section: ${required}`);
      }
    }

    // Validate program headers
    if (!parseResult.programHeaders || parseResult.programHeaders.length === 0) {
      issues.push('No program headers found');
    }

    // Check for valid entry point
    if (parseResult.symbols) {
      const entrySymbols = parseResult.symbols.filter(sym => 
        sym.name === 'entrypoint' || sym.name === '_start' || sym.name === 'main'
      );
      
      if (entrySymbols.length === 0) {
        issues.push('No valid entry point symbol found');
      }
    }

    return issues;
  }
}