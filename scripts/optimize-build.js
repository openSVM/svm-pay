#!/usr/bin/env node

/**
 * Async build optimization script for svm-pay
 * This script optimizes the built package for distribution with improved CI performance
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

async function optimizeBuild() {
  console.log('Optimizing build for distribution...');
  
  try {
    // Ensure the CLI binary is executable
    const cliPath = path.join(__dirname, '../dist/bin/svm-pay.js');
    if (await fileExists(cliPath)) {
      await fs.chmod(cliPath, '755');
      console.log('✓ CLI binary permissions set');
    }
    
    // Remove source map files in production builds (async)
    if (process.env.NODE_ENV === 'production' || process.argv.includes('--no-source-maps')) {
      const removedCount = await removeSourceMaps(path.join(__dirname, '../dist'));
      if (removedCount > 0) {
        console.log(`✓ Removed ${removedCount} source map files`);
      }
    }
    
    // Create a package summary (async)
    await createBuildSummary();
    
    console.log('✓ Build optimization complete');
  } catch (error) {
    console.error('❌ Build optimization failed:', error.message);
    process.exit(1);
  }
}

async function createBuildSummary() {
  const packagePath = path.join(__dirname, '../package.json');
  const distPath = path.join(__dirname, '../dist');
  
  if (!(await fileExists(packagePath)) || !(await fileExists(distPath))) {
    console.warn('⚠ Package.json or dist directory not found, skipping summary');
    return;
  }
  
  try {
    // Read package.json asynchronously
    const packageData = await fs.readFile(packagePath, 'utf8');
    const packageJson = JSON.parse(packageData);
    
    // Count files in dist directory asynchronously
    const fileCount = await countFilesAsync(distPath);
    
    // Calculate total size asynchronously
    const totalSize = await calculateDirectorySizeAsync(distPath);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    console.log('📦 Build Summary:');
    console.log(`   Package: ${packageJson.name}@${packageJson.version}`);
    console.log(`   Files built: ${fileCount}`);
    console.log(`   Total size: ${sizeInMB} MB`);
    console.log(`   Main entry: ${packageJson.main}`);
    console.log(`   CLI binary: ${packageJson.bin['svm-pay']}`);
    console.log(`   Types: ${packageJson.types}`);
  } catch (error) {
    console.warn('⚠ Failed to create build summary:', error.message);
  }
}

async function countFilesAsync(dir) {
  let count = 0;
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    // Process entries in parallel for better performance
    const promises = entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        return await countFilesAsync(fullPath);
      } else {
        return 1;
      }
    });
    
    const counts = await Promise.all(promises);
    count = counts.reduce((sum, c) => sum + c, 0);
  } catch (error) {
    console.warn(`Warning: Could not count files in ${dir}:`, error.message);
  }
  
  return count;
}

async function calculateDirectorySizeAsync(dir) {
  let totalSize = 0;
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    // Process entries in parallel
    const promises = entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        return await calculateDirectorySizeAsync(fullPath);
      } else {
        try {
          const stats = await fs.stat(fullPath);
          return stats.size;
        } catch (error) {
          console.warn(`Warning: Could not stat file ${fullPath}:`, error.message);
          return 0;
        }
      }
    });
    
    const sizes = await Promise.all(promises);
    totalSize = sizes.reduce((sum, size) => sum + size, 0);
  } catch (error) {
    console.warn(`Warning: Could not calculate size of ${dir}:`, error.message);
  }
  
  return totalSize;
}

async function removeSourceMaps(dir) {
  let removedCount = 0;
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    // Process entries in parallel for better performance
    const promises = entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        return await removeSourceMaps(fullPath);
      } else if (entry.name.endsWith('.map')) {
        try {
          await fs.unlink(fullPath);
          return 1;
        } catch (error) {
          console.warn(`Warning: Could not remove ${fullPath}:`, error.message);
          return 0;
        }
      } else {
        return 0;
      }
    });
    
    const counts = await Promise.all(promises);
    removedCount = counts.reduce((sum, count) => sum + count, 0);
  } catch (error) {
    console.warn(`Warning: Could not process directory ${dir}:`, error.message);
  }
  
  return removedCount;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Performance monitoring
async function measurePerformance(operation, fn) {
  const startTime = process.hrtime.bigint();
  const result = await fn();
  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
  
  console.log(`⏱ ${operation} completed in ${duration.toFixed(2)}ms`);
  return result;
}

// Enhanced main execution with performance monitoring
async function main() {
  if (require.main === module) {
    try {
      await measurePerformance('Build optimization', optimizeBuild);
    } catch (error) {
      console.error('❌ Build script failed:', error);
      process.exit(1);
    }
  }
}

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run if this script is executed directly
main();

module.exports = { 
  optimizeBuild, 
  removeSourceMaps, 
  countFilesAsync, 
  calculateDirectorySizeAsync,
  measurePerformance 
};