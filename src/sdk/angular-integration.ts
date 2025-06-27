/**
 * Angular Integration for SVM-Pay
 * 
 * This module provides Angular-specific components, services, and utilities
 * for integrating SVM-Pay into Angular applications with proper dependency injection,
 * reactive patterns, and AOT compilation support.
 * 
 * Note: This module requires Angular to be installed as a peer dependency.
 * Install with: npm install @angular/core rxjs
 */

// Configuration interface with enhanced options
export interface SVMPayConfig {
  debug?: boolean;
  network?: string;
  rpcEndpoint?: string;
  defaultGas?: number;
  timeout?: number;
}

// Payment state interface for reactive updates
export interface PaymentState {
  status: 'idle' | 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

// Check if Angular is available at runtime
function hasAngularSupport(): boolean {
  try {
    require('@angular/core');
    require('rxjs');
    return true;
  } catch {
    return false;
  }
}

// Dynamic Angular imports (AOT-safe)
let Injectable: any;
let InjectionToken: any;
let NgModule: any;
let Component: any;
let Input: any;
let Output: any;
let EventEmitter: any;
let Inject: any;
let Optional: any;

// Dynamic RxJS imports
let _Observable: any;
let BehaviorSubject: any;
let from: any;
let of: any;
let _EMPTY: any;
let catchError: any;
let map: any;
let shareReplay: any;

// Initialize Angular decorators and RxJS if available
if (hasAngularSupport()) {
  try {
    const angularCore = require('@angular/core');
    Injectable = angularCore.Injectable;
    InjectionToken = angularCore.InjectionToken;
    NgModule = angularCore.NgModule;
    Component = angularCore.Component;
    Input = angularCore.Input;
    Output = angularCore.Output;
    EventEmitter = angularCore.EventEmitter;
    Inject = angularCore.Inject;
    Optional = angularCore.Optional;

    const rxjs = require('rxjs');
    _Observable = rxjs.Observable;
    BehaviorSubject = rxjs.BehaviorSubject;
    from = rxjs.from;
    of = rxjs.of;
    _EMPTY = rxjs.EMPTY;

    const operators = require('rxjs/operators');
    catchError = operators.catchError;
    map = operators.map;
    shareReplay = operators.shareReplay;
  } catch (error) {
    console.warn('Failed to load Angular decorators or RxJS:', error);
  }
}

// Create injection tokens with proper typing
export const SVM_PAY_CONFIG = hasAngularSupport() && InjectionToken
  ? new InjectionToken('SVM_PAY_CONFIG', {
      providedIn: 'root',
      factory: () => ({ debug: false })
    })
  : 'SVM_PAY_CONFIG';

/**
 * Angular service for SVM-Pay with dependency injection and reactive patterns
 */
export class SVMPayService {
  private config: SVMPayConfig;
  private paymentState$: any = null;
  
  // Cached observables for better performance
  private balance$: any = null;
  private paymentHistory$: any = null;

  constructor(config?: SVMPayConfig) {
    this.config = config || { debug: false };
    
    if (hasAngularSupport() && BehaviorSubject) {
      this.paymentState$ = new BehaviorSubject({ status: 'idle' });
    }
    
    if (!hasAngularSupport()) {
      console.warn('Angular integration requires @angular/core and rxjs to be installed');
    }
  }

  /**
   * Get current payment state as observable
   */
  getPaymentState(): any {
    if (this.paymentState$) {
      return this.paymentState$.asObservable();
    }
    return null;
  }

  /**
   * Create transfer URL (synchronous)
   */
  createTransferUrl(
    recipient: string,
    amount: string,
    options?: { label?: string; message?: string; memo?: string }
  ): string {
    try {
      const { SVMPay } = require('../index');
      const svmPay = new SVMPay(this.config);
      return svmPay.createTransferUrl(recipient, amount, options);
    } catch (error) {
      console.error('Failed to create transfer URL:', error);
      throw error;
    }
  }

  /**
   * Create transaction URL (synchronous)  
   */
  createTransactionUrl(link: string, recipient: string): string {
    try {
      const { SVMPay } = require('../index');
      const svmPay = new SVMPay(this.config);
      return svmPay.createTransactionUrl(link, recipient);
    } catch (error) {
      console.error('Failed to create transaction URL:', error);
      throw error;
    }
  }
  
  /**
   * Check wallet balance (reactive)
   */
  checkWalletBalance(): any {
    if (!hasAngularSupport() || !from || !shareReplay || !catchError) {
      // Fallback to promise-based approach
      return this.getSDKInstance().checkWalletBalance();
    }

    if (!this.balance$) {
      this.balance$ = from(this.getSDKInstance().checkWalletBalance()).pipe(
        shareReplay(1),
        catchError((error: any) => {
          console.error('Failed to check wallet balance:', error);
          throw error;
        })
      );
    }
    return this.balance$;
  }

  /**
   * Get payment history (reactive)
   */
  getPaymentHistory(): any {
    if (!hasAngularSupport() || !from || !map || !shareReplay || !catchError || !of) {
      // Fallback to promise-based approach
      return this.getSDKInstance().getPaymentHistory();
    }

    if (!this.paymentHistory$) {
      this.paymentHistory$ = from(this.getSDKInstance().getPaymentHistory()).pipe(
        map((history: any) => Array.isArray(history) ? history : []),
        shareReplay(1),
        catchError((error: any) => {
          console.error('Failed to get payment history:', error);
          return of([]);
        })
      );
    }
    return this.paymentHistory$;
  }

  /**
   * Process payment with state updates
   */
  processPayment(recipient: string, amount: string, options?: any): any {
    if (this.paymentState$) {
      this.paymentState$.next({ status: 'pending' });
    }

    if (!hasAngularSupport() || !from || !map || !catchError) {
      // Fallback to promise-based approach
      return this.executePayment(recipient, amount, options);
    }

    return from(this.executePayment(recipient, amount, options)).pipe(
      map((result: any) => {
        if (this.paymentState$) {
          this.paymentState$.next({ status: 'success', data: result });
        }
        // Invalidate cached data
        this.balance$ = null;
        this.paymentHistory$ = null;
        return result;
      }),
      catchError((error: any) => {
        if (this.paymentState$) {
          this.paymentState$.next({ status: 'error', error: error.message });
        }
        throw error;
      })
    );
  }

  /**
   * Check API usage (reactive)
   */
  checkApiUsage(): any {
    if (!hasAngularSupport() || !from || !catchError) {
      return this.getSDKInstance().checkApiUsage();
    }

    return from(this.getSDKInstance().checkApiUsage()).pipe(
      catchError((error: any) => {
        console.error('Failed to check API usage:', error);
        throw error;
      })
    );
  }

  /**
   * Setup wallet configuration
   */
  setupWallet(config: any): any {
    if (!hasAngularSupport() || !from || !map || !catchError) {
      return this.getSDKInstance().setupWallet(config);
    }

    return from(this.getSDKInstance().setupWallet(config)).pipe(
      map((result: any) => {
        // Invalidate cached data after setup
        this.balance$ = null;
        this.paymentHistory$ = null;
        return result;
      }),
      catchError((error: any) => {
        console.error('Failed to setup wallet:', error);
        throw error;
      })
    );
  }

  /**
   * Reset cached data and state
   */
  reset(): void {
    if (this.paymentState$) {
      this.paymentState$.next({ status: 'idle' });
    }
    this.balance$ = null;
    this.paymentHistory$ = null;
  }

  private getSDKInstance(): any {
    const { SVMPay } = require('../index');
    return new SVMPay(this.config);
  }

  private async executePayment(_recipient: string, _amount: string, _options?: any): Promise<any> {
    // Placeholder for payment execution logic
    // In a real implementation, this would handle the payment flow
    throw new Error('Payment execution not implemented in Angular integration');
  }
}

/**
 * Angular component for payment button with proper decorators
 */
export class SVMPayButtonComponent {
  recipient!: string;
  amount!: string;
  label: string = 'Pay';
  disabled: boolean = false;
  
  paymentCompleted: any = null;
  paymentError: any = null;

  private svmPayService: SVMPayService;

  constructor(svmPayService?: SVMPayService) {
    this.svmPayService = svmPayService || new SVMPayService();
    
    // Initialize event emitters if Angular is available
    if (hasAngularSupport() && EventEmitter) {
      this.paymentCompleted = new EventEmitter();
      this.paymentError = new EventEmitter();
    }
  }

  onPaymentClick(): void {
    if (!this.recipient || !this.amount) {
      const error = 'Recipient and amount are required';
      console.error(error);
      if (this.paymentError && this.paymentError.emit) {
        this.paymentError.emit(error);
      }
      return;
    }

    this.disabled = true;

    const paymentResult = this.svmPayService.processPayment(this.recipient, this.amount);
    
    // Handle both Observable and Promise results
    if (paymentResult && paymentResult.subscribe) {
      // Observable result
      paymentResult.subscribe({
        next: (result: any) => {
          console.log('Payment completed:', result);
          if (this.paymentCompleted && this.paymentCompleted.emit) {
            this.paymentCompleted.emit(result);
          }
          this.disabled = false;
        },
        error: (error: any) => {
          console.error('Payment failed:', error);
          if (this.paymentError && this.paymentError.emit) {
            this.paymentError.emit(error.message || 'Payment failed');
          }
          this.disabled = false;
        }
      });
    } else if (paymentResult && paymentResult.then) {
      // Promise result
      paymentResult
        .then((result: any) => {
          console.log('Payment completed:', result);
          if (this.paymentCompleted && this.paymentCompleted.emit) {
            this.paymentCompleted.emit(result);
          }
          this.disabled = false;
        })
        .catch((error: any) => {
          console.error('Payment failed:', error);
          if (this.paymentError && this.paymentError.emit) {
            this.paymentError.emit(error.message || 'Payment failed');
          }
          this.disabled = false;
        });
    }
  }
}

/**
 * Enhanced Angular service and component with decorators (if Angular is available)
 */
if (hasAngularSupport() && Injectable && Component && Input && Output && Inject && Optional && EventEmitter) {
  // Create decorated service class
  const DecoratedSVMPayService = Injectable({
    providedIn: 'root'
  })(class DecoratedSVMPayService extends SVMPayService {
    constructor(config?: SVMPayConfig) {
      super(config);
    }
  });

  // Create decorated component class
  const DecoratedSVMPayButtonComponent = Component({
    selector: 'svm-pay-button',
    template: `
      <button 
        (click)="onPaymentClick()" 
        [disabled]="disabled"
        class="svm-pay-button">
        {{ label }}
      </button>
    `,
    styles: [`
      .svm-pay-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .svm-pay-button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }
      .svm-pay-button:hover:not(:disabled) {
        background-color: #0056b3;
      }
    `]
  })(class DecoratedSVMPayButtonComponent extends SVMPayButtonComponent {
    recipient!: string;
    amount!: string;
    label: string = 'Pay';
    disabled: boolean = false;
    
    paymentCompleted = new EventEmitter();
    paymentError = new EventEmitter();

    constructor(svmPayService: SVMPayService) {
      super(svmPayService);
    }
  });

  // Export decorated versions for Angular use
  if (typeof exports !== 'undefined') {
    exports.AngularSVMPayService = DecoratedSVMPayService;
    exports.AngularSVMPayButtonComponent = DecoratedSVMPayButtonComponent;
  }
}

/**
 * Angular module for SVM-Pay with proper module definition
 */
export class SVMPayModule {
  static forRoot(config?: SVMPayConfig): any {
    if (!hasAngularSupport() || !NgModule) {
      console.warn('SVMPayModule.forRoot() requires Angular NgModule to be available');
      return this;
    }

    const moduleConfig = {
      providers: [
        SVMPayService,
        {
          provide: SVM_PAY_CONFIG,
          useValue: config || { debug: false }
        }
      ]
    };

    if (typeof exports !== 'undefined' && exports.AngularSVMPayButtonComponent) {
      (moduleConfig as any).declarations = [exports.AngularSVMPayButtonComponent];
      (moduleConfig as any).exports = [exports.AngularSVMPayButtonComponent];
    }

    return NgModule(moduleConfig)(class {});
  }

  static forChild(): any {
    if (!hasAngularSupport() || !NgModule) {
      console.warn('SVMPayModule.forChild() requires Angular NgModule to be available');
      return this;
    }

    const moduleConfig: any = {};

    if (typeof exports !== 'undefined' && exports.AngularSVMPayButtonComponent) {
      moduleConfig.declarations = [exports.AngularSVMPayButtonComponent];
      moduleConfig.exports = [exports.AngularSVMPayButtonComponent];
    }

    return NgModule(moduleConfig)(class {});
  }
}

/**
 * Utility function to check if Angular integration is properly set up
 */
export function validateAngularIntegration(): boolean {
  if (!hasAngularSupport()) {
    console.error('Angular integration requires @angular/core and rxjs dependencies');
    return false;
  }

  if (!Injectable || !NgModule || !Component) {
    console.error('Angular decorators are not available - check Angular installation');
    return false;
  }

  return true;
}

/**
 * Factory function for creating SVM-Pay service outside Angular DI
 */
export function createSVMPayService(config?: SVMPayConfig): SVMPayService {
  return new SVMPayService(config);
}
