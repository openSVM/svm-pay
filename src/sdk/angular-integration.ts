/**
 * SVM-Pay Angular One-Click Integration
 * 
 * This file implements Angular components for one-click integration of SVM-Pay.
 */

import { Component, Input, Output, EventEmitter, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SVMPay } from './index';
import { SVMNetwork } from '../core/types';

/**
 * SVM-Pay Service for Angular
 */
export class SVMPayService {
  private svmPay: SVMPay;
  
  constructor(config = {}) {
    this.svmPay = new SVMPay(config);
  }
  
  getSVMPay(): SVMPay {
    return this.svmPay;
  }
}

/**
 * SVM-Pay Button Component for Angular
 */
@Component({
  selector: 'svm-pay-button',
  template: `
    <div>
      <button
        [disabled]="isLoading"
        [ngClass]="className"
        [ngStyle]="buttonStyle"
        (click)="handleClick()"
      >
        <span *ngIf="isLoading">Processing...</span>
        <span *ngIf="!isLoading">{{ label }}</span>
      </button>
      <div *ngIf="error" style="color: red; margin-top: 8px;">{{ error }}</div>
    </div>
  `
})
export class SVMPayButtonComponent {
  @Input() recipient: string;
  @Input() amount?: string;
  @Input() token?: string;
  @Input() network?: SVMNetwork;
  @Input() label: string = 'Pay';
  @Input() description?: string;
  @Input() style?: any = {};
  @Input() className?: string;
  
  @Output() start = new EventEmitter<void>();
  @Output() complete = new EventEmitter<{status: string, signature?: string}>();
  
  isLoading: boolean = false;
  error: string | null = null;
  
  private svmPay: SVMPay;
  
  constructor(private svmPayService: SVMPayService) {
    this.svmPay = svmPayService.getSVMPay();
  }
  
  get buttonStyle() {
    return {
      padding: '10px 20px',
      borderRadius: '4px',
      backgroundColor: '#9945FF',
      color: 'white',
      border: 'none',
      cursor: this.isLoading ? 'wait' : 'pointer',
      ...this.style
    };
  }
  
  async handleClick() {
    try {
      this.isLoading = true;
      this.error = null;
      
      this.start.emit();
      
      // Generate a reference ID for this payment
      const reference = this.svmPay.generateReference();
      
      // Create a payment URL
      const paymentUrl = this.svmPay.createTransferUrl(
        this.recipient,
        this.amount,
        {
          network: this.network,
          splToken: this.token,
          label: this.label,
          message: this.description,
          references: [reference],
        }
      );
      
      // In a real implementation, this would open a wallet or QR code
      // For this example, we'll just log the URL
      console.log('Payment URL:', paymentUrl);
      
      // Simulate a successful payment
      setTimeout(() => {
        this.isLoading = false;
        this.complete.emit({
          status: 'confirmed',
          signature: 'simulated-signature'
        });
      }, 2000);
    } catch (err) {
      this.error = err.message;
      this.isLoading = false;
      this.complete.emit({
        status: 'failed'
      });
    }
  }
}

/**
 * SVM-Pay QR Code Component for Angular
 */
@Component({
  selector: 'svm-pay-qr-code',
  template: `
    <div [ngStyle]="containerStyle" [ngClass]="className">
      <div *ngIf="status === 'confirmed'" style="text-align: center;">
        <div style="font-size: 24px; color: green; margin-bottom: 16px;">
          Payment Confirmed!
        </div>
        <p>Thank you for your payment.</p>
      </div>
      <ng-container *ngIf="status !== 'confirmed'">
        <div style="margin-bottom: 16px;">
          Scan with your SVM wallet to pay
        </div>
        <div [ngStyle]="qrCodeStyle">
          <!-- In a real implementation, this would be a QR code -->
          <div style="text-align: center;">
            <div>QR Code Placeholder</div>
            <div style="font-size: 12px; margin-top: 8px;">
              (In a real implementation, this would be a QR code)
            </div>
          </div>
        </div>
        <div *ngIf="amount" style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
          {{ amount }} {{ token || 'SOL' }}
        </div>
        <div *ngIf="description" style="margin-bottom: 16px;">{{ description }}</div>
        <div style="font-size: 12px; color: #666;">
          Waiting for payment...
        </div>
      </ng-container>
    </div>
  `
})
export class SVMPayQRCodeComponent implements OnInit {
  @Input() recipient: string;
  @Input() amount?: string;
  @Input() token?: string;
  @Input() network?: SVMNetwork;
  @Input() label?: string;
  @Input() description?: string;
  @Input() size: number = 200;
  @Input() style?: any = {};
  @Input() className?: string;
  
  @Output() complete = new EventEmitter<{status: string, signature?: string}>();
  
  paymentUrl: string = '';
  status: string | null = null;
  reference: string = '';
  
  private svmPay: SVMPay;
  
  constructor(private svmPayService: SVMPayService) {
    this.svmPay = svmPayService.getSVMPay();
  }
  
  get containerStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...this.style
    };
  }
  
  get qrCodeStyle() {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '16px'
    };
  }
  
  ngOnInit() {
    this.initializePayment();
  }
  
  initializePayment() {
    try {
      // Generate a reference ID for this payment
      const ref = this.svmPay.generateReference();
      this.reference = ref;
      
      // Create a payment URL
      const url = this.svmPay.createTransferUrl(
        this.recipient,
        this.amount,
        {
          network: this.network,
          splToken: this.token,
          label: this.label,
          message: this.description,
          references: [ref],
        }
      );
      
      this.paymentUrl = url;
      
      // In a real implementation, this would poll for payment status
      // For this example, we'll just simulate a payment after 5 seconds
      setTimeout(() => {
        this.status = 'confirmed';
        this.complete.emit({
          status: 'confirmed',
          signature: 'simulated-signature'
        });
      }, 5000);
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * SVM-Pay Form Component for Angular
 */
@Component({
  selector: 'svm-pay-form',
  template: `
    <div [ngStyle]="formStyle" [ngClass]="className">
      <form *ngIf="showForm" (ngSubmit)="handleSubmit()">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Recipient Address
          </label>
          <input
            type="text"
            [(ngModel)]="recipient"
            name="recipient"
            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
            required
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Amount
          </label>
          <input
            type="text"
            [(ngModel)]="amount"
            name="amount"
            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Token (leave empty for native token)
          </label>
          <input
            type="text"
            [(ngModel)]="token"
            name="token"
            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">
            Network
          </label>
          <select
            [(ngModel)]="network"
            name="network"
            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
          >
            <option value="solana">Solana</option>
            <option value="sonic">Sonic SVM</option>
            <option value="eclipse">Eclipse</option>
            <option value="soon">SOON</option>
          </select>
        </div>
        
        <button
          type="submit"
          style="padding: 10px 20px; border-radius: 4px; background-color: #9945FF; color: white; border: none; cursor: pointer; width: 100%;"
        >
          Continue to Payment
        </button>
      </form>
      
      <div *ngIf="showPayment">
        <svm-pay-qr-code
          *ngIf="showQRCode"
          [recipient]="recipient"
          [amount]="amount"
          [token]="token"
          [network]="network"
          (complete)="handleComplete($event)"
        ></svm-pay-qr-code>
        
        <svm-pay-button
          *ngIf="!showQRCode"
          [recipient]="recipient"
          [amount]="amount"
          [token]="token"
          [network]="network"
          (complete)="handleComplete($event)"
        ></svm-pay-button>
        
        <button
          (click)="backToForm()"
          style="padding: 10px 20px; border-radius: 4px; background-color: #f0f0f0; color: #333; border: none; cursor: pointer; width: 100%; margin-top: 16px;"
        >
          Back to Form
        </button>
      </div>
    </div>
  `
})
export class SVMPayFormComponent {
  @Input() defaultRecipient: string = '';
  @Input() defaultAmount: string = '';
  @Input() defaultToken: string = '';
  @Input() defaultNetwork: SVMNetwork = SVMNetwork.SOLANA;
  @Input() showQRCode: boolean = true;
  @Input() style?: any = {};
  @Input() className?: string;
  
  @Output() complete = new EventEmitter<{status: string, signature?: string}>();
  
  recipient: string;
  amount: string;
  token: string;
  network: SVMNetwork;
  showForm: boolean = true;
  showPayment: boolean = false;
  
  constructor() {
    this.recipient = this.defaultRecipient;
    this.amount = this.defaultAmount;
    this.token = this.defaultToken;
    this.network = this.defaultNetwork;
  }
  
  get formStyle() {
    return {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      ...this.style
    };
  }
  
  handleSubmit() {
    this.showForm = false;
    this.showPayment = true;
  }
  
  backToForm() {
    this.showForm = true;
    this.showPayment = false;
  }
  
  handleComplete(event: {status: string, signature?: string}) {
    this.complete.emit(event);
  }
}

/**
 * SVM-Pay Angular Module
 */
@NgModule({
  declarations: [
    SVMPayButtonComponent,
    SVMPayQRCodeComponent,
    SVMPayFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SVMPayButtonComponent,
    SVMPayQRCodeComponent,
    SVMPayFormComponent
  ],
  providers: [
    SVMPayService
  ]
})
export class SVMPayModule {
  static forRoot(config = {}) {
    return {
      ngModule: SVMPayModule,
      providers: [
        {
          provide: SVMPayService,
          useFactory: () => new SVMPayService(config)
        }
      ]
    };
  }
}
