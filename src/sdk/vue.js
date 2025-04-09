/**
 * SVM-Pay Vue Components
 * 
 * This file implements Vue components for SVM-Pay integration.
 */

// Vue component for payment button
export const PaymentButton = {
  name: 'SvmPayButton',
  
  props: {
    // SVM-Pay SDK instance
    svmPay: {
      type: Object,
      required: true
    },
    
    // Recipient address
    recipient: {
      type: String,
      required: true
    },
    
    // Amount to transfer
    amount: {
      type: String,
      default: ''
    },
    
    // Token to transfer (if not native token)
    token: {
      type: String,
      default: ''
    },
    
    // Network to use
    network: {
      type: String,
      default: ''
    },
    
    // Button label
    label: {
      type: String,
      default: 'Pay'
    },
    
    // Payment description
    description: {
      type: String,
      default: ''
    },
    
    // Button variant (primary, secondary, etc.)
    variant: {
      type: String,
      default: 'primary'
    },
    
    // Button size (small, medium, large)
    size: {
      type: String,
      default: 'medium'
    }
  },
  
  data() {
    return {
      isLoading: false,
      error: null
    };
  },
  
  computed: {
    buttonClasses() {
      return [
        'svm-pay-button',
        `svm-pay-button--${this.variant}`,
        `svm-pay-button--${this.size}`,
        { 'svm-pay-button--loading': this.isLoading }
      ];
    }
  },
  
  methods: {
    async handleClick() {
      try {
        this.isLoading = true;
        this.error = null;
        
        this.$emit('start');
        
        // Generate a reference ID for this payment
        const reference = this.svmPay.generateReference();
        
        // Create a payment URL
        const paymentUrl = this.svmPay.createTransferUrl(
          this.recipient,
          this.amount,
          {
            network: this.network || undefined,
            splToken: this.token || undefined,
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
          this.$emit('complete', 'confirmed', 'simulated-signature');
        }, 2000);
      } catch (err) {
        this.error = err.message;
        this.isLoading = false;
        this.$emit('complete', 'failed');
      }
    }
  },
  
  template: `
    <div class="svm-pay-container">
      <button
        :class="buttonClasses"
        @click="handleClick"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Processing...</span>
        <span v-else>{{ label }}</span>
      </button>
      <div v-if="error" class="svm-pay-error">{{ error }}</div>
    </div>
  `
};

// Vue component for QR code payment
export const QRCodePayment = {
  name: 'SvmPayQRCode',
  
  props: {
    // SVM-Pay SDK instance
    svmPay: {
      type: Object,
      required: true
    },
    
    // Recipient address
    recipient: {
      type: String,
      required: true
    },
    
    // Amount to transfer
    amount: {
      type: String,
      default: ''
    },
    
    // Token to transfer (if not native token)
    token: {
      type: String,
      default: ''
    },
    
    // Network to use
    network: {
      type: String,
      default: ''
    },
    
    // Payment label
    label: {
      type: String,
      default: ''
    },
    
    // Payment description
    description: {
      type: String,
      default: ''
    },
    
    // QR code size
    size: {
      type: Number,
      default: 200
    }
  },
  
  data() {
    return {
      paymentUrl: '',
      status: null,
      reference: '',
      error: null
    };
  },
  
  computed: {
    isConfirmed() {
      return this.status === 'confirmed';
    },
    
    qrCodeStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      };
    }
  },
  
  mounted() {
    this.initializePayment();
  },
  
  methods: {
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
            network: this.network || undefined,
            splToken: this.token || undefined,
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
          this.$emit('complete', 'confirmed', 'simulated-signature');
        }, 5000);
      } catch (err) {
        this.error = err.message;
        this.$emit('error', err.message);
      }
    }
  },
  
  template: `
    <div class="svm-pay-qr-container">
      <div v-if="isConfirmed" class="svm-pay-confirmation">
        <div class="svm-pay-confirmation-title">Payment Confirmed!</div>
        <p class="svm-pay-confirmation-message">Thank you for your payment.</p>
      </div>
      <template v-else>
        <div class="svm-pay-qr-instructions">
          Scan with your SVM wallet to pay
        </div>
        <div class="svm-pay-qr-code" :style="qrCodeStyle">
          <!-- In a real implementation, this would be a QR code -->
          <div class="svm-pay-qr-placeholder">
            <div>QR Code Placeholder</div>
            <div class="svm-pay-qr-note">
              (In a real implementation, this would be a QR code)
            </div>
          </div>
        </div>
        <div v-if="amount" class="svm-pay-amount">
          {{ amount }} {{ token || 'SOL' }}
        </div>
        <div v-if="description" class="svm-pay-description">
          {{ description }}
        </div>
        <div class="svm-pay-status">
          Waiting for payment...
        </div>
        <div v-if="error" class="svm-pay-error">{{ error }}</div>
      </template>
    </div>
  `
};

// Vue plugin
export const SVMPayVue = {
  install(Vue, options = {}) {
    Vue.component('svm-pay-button', PaymentButton);
    Vue.component('svm-pay-qr-code', QRCodePayment);
  }
};

export default SVMPayVue;
