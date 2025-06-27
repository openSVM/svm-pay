/**
 * OpenRouter API utilities for SVM-Pay CLI
 */

import axios from 'axios';
import { isTestMode } from './config';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export interface OpenRouterUsage {
  usage: number;
  limit: number;
  remaining: number;
}

/**
 * Check OpenRouter API usage
 */
export async function checkApiUsage(apiKey: string): Promise<OpenRouterUsage> {
  if (isTestMode()) {
    console.log('TEST MODE: Simulating API usage check');
    return {
      usage: 150.75,
      limit: 1000,
      remaining: 849.25
    };
  }
  
  try {
    const response = await axios.get(`${OPENROUTER_API_BASE}/auth/key`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = response.data;
    
    // Extract usage information (this may need adjustment based on actual API response)
    return {
      usage: data.usage || 0,
      limit: data.limit || 0,
      remaining: (data.limit || 0) - (data.usage || 0)
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      }
      throw new Error(`OpenRouter API error: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw new Error(`Failed to check API usage: ${error}`);
  }
}

/**
 * Validate OpenRouter API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  // Basic validation - OpenRouter API keys typically start with 'sk-'
  return apiKey.startsWith('sk-') && apiKey.length > 10;
}