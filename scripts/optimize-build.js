#!/usr/bin/env node

/**
 * Build optimization script for svm-pay
 * This script optimizes the built package for distribution
 */

const fs = require('fs');
const path = require('path');

function optimizeBuild() {
  console.log('Optimizing build for distribution...');
  
  // Ensure the CLI binary is executable
  const cliPath = path.join(__dirname, '../dist/bin/svm-pay.js');
  if (fs.existsSync(cliPath)) {
    fs.chmodSync(cliPath, '755');
    console.log('✓ CLI binary permissions set');
  }
  
  // Remove source map files in production builds
  if (process.env.NODE_ENV === 'production' || process.argv.includes('--no-source-maps')) {
    removeSourceMaps(path.join(__dirname, '../dist'));
  }
  
  // Create a package summary
  const packagePath = path.join(__dirname, '../package.json');
  const distPath = path.join(__dirname, '../dist');
  
  if (fs.existsSync(packagePath) && fs.existsSync(distPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Count files in dist
    function countFiles(dir) {
      let count = 0;
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          count += countFiles(filePath);
        } else {
          count++;
        }
      }
      return count;
    }
    
    const fileCount = countFiles(distPath);
    
    console.log('📦 Build Summary:');
    console.log(`   Package: ${packageJson.name}@${packageJson.version}`);
    console.log(`   Files built: ${fileCount}`);
    console.log(`   Main entry: ${packageJson.main}`);
    console.log(`   CLI binary: ${packageJson.bin['svm-pay']}`);
    console.log(`   Types: ${packageJson.types}`);
    console.log('✓ Build optimization complete');
  }
}

function removeSourceMaps(dir) {
  console.log('Removing source maps for production...');
  const files = fs.readdirSync(dir);
  let removedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      removedCount += removeSourceMaps(filePath);
    } else if (file.endsWith('.map')) {
      fs.unlinkSync(filePath);
      removedCount++;
    }
  }
  
  if (removedCount > 0) {
    console.log(`✓ Removed ${removedCount} source map files`);
  }
  
  return removedCount;
}

if (require.main === module) {
  optimizeBuild();
}

module.exports = { optimizeBuild, removeSourceMaps };