#!/usr/bin/env node

/**
 * SVM-Pay CLI Entry Point
 * 
 * This is the main entry point for the svm-pay CLI tool.
 */

import { cli } from '../cli/index';

// Parse command line arguments and execute
cli.parse(process.argv);