/**
 * SVM-Pay Vue One-Click Integration
 * 
 * This file implements Vue components for one-click integration of SVM-Pay.
 */

import { SVMPay } from './index';
import { PaymentButton, QRCodePayment, SVMPayVue } from './vue';

/**
 * Create a Vue plugin for SVM-Pay one-click integration
 * 
 * @param {Object} options Configuration options
 * @returns {Object} Vue plugin
 */
export const createSVMPayPlugin = (options = {}) => {
  // Create SVM-Pay instance
  const svmPay = new SVMPay(options);
  
  return {
    install(Vue) {
      // Register the Vue components
      Vue.component('svm-pay-button', {
        functional: true,
        render(h, context) {
          return h(PaymentButton, {
            ...context.data,
            props: {
              ...context.props,
              svmPay,
            },
          });
        },
      });
      
      Vue.component('svm-pay-qr-code', {
        functional: true,
        render(h, context) {
          return h(QRCodePayment, {
            ...context.data,
            props: {
              ...context.props,
              svmPay,
            },
          });
        },
      });
      
      // Add SVM-Pay instance to Vue prototype
      Vue.prototype.$svmPay = svmPay;
      
      // Register payment form component
      Vue.component('svm-pay-form', {
        template: `
          <div class="svm-pay-form" :class="className" :style="formStyle">
            <form v-if="showForm" @submit.prevent="handleSubmit">
              <div class="svm-pay-form-group">
                <label>Recipient Address</label>
                <input 
                  type="text" 
                  v-model="recipient" 
                  required
                  class="svm-pay-form-input"
                />
              </div>
              
              <div class="svm-pay-form-group">
                <label>Amount</label>
                <input 
                  type="text" 
                  v-model="amount" 
                  class="svm-pay-form-input"
                />
              </div>
              
              <div class="svm-pay-form-group">
                <label>Token (leave empty for native token)</label>
                <input 
                  type="text" 
                  v-model="token" 
                  class="svm-pay-form-input"
                />
              </div>
              
              <div class="svm-pay-form-group">
                <label>Network</label>
                <select 
                  v-model="network" 
                  class="svm-pay-form-select"
                >
                  <option value="solana">Solana</option>
                  <option value="sonic">Sonic SVM</option>
                  <option value="eclipse">Eclipse</option>
                  <option value="soon">SOON</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                class="svm-pay-form-button"
              >
                Continue to Payment
              </button>
            </form>
            
            <div v-if="showPayment">
              <svm-pay-qr-code
                v-if="showQRCode"
                :recipient="recipient"
                :amount="amount"
                :token="token"
                :network="network"
                @complete="handleComplete"
              />
              
              <svm-pay-button
                v-else
                :recipient="recipient"
                :amount="amount"
                :token="token"
                :network="network"
                @complete="handleComplete"
              />
              
              <button 
                @click="backToForm" 
                class="svm-pay-form-back-button"
              >
                Back to Form
              </button>
            </div>
          </div>
        `,
        
        props: {
          defaultRecipient: {
            type: String,
            default: '',
          },
          defaultAmount: {
            type: String,
            default: '',
          },
          defaultToken: {
            type: String,
            default: '',
          },
          defaultNetwork: {
            type: String,
            default: 'solana',
          },
          showQRCode: {
            type: Boolean,
            default: true,
          },
          className: {
            type: String,
            default: '',
          },
          style: {
            type: Object,
            default: () => ({}),
          },
        },
        
        data() {
          return {
            recipient: this.defaultRecipient,
            amount: this.defaultAmount,
            token: this.defaultToken,
            network: this.defaultNetwork,
            showForm: true,
            showPayment: false,
          };
        },
        
        computed: {
          formStyle() {
            return {
              maxWidth: '500px',
              margin: '0 auto',
              padding: '20px',
              ...this.style,
            };
          },
        },
        
        methods: {
          handleSubmit() {
            this.showForm = false;
            this.showPayment = true;
          },
          
          backToForm() {
            this.showForm = true;
            this.showPayment = false;
          },
          
          handleComplete(status, signature) {
            this.$emit('complete', status, signature);
          },
        },
      });
    },
  };
};

// Export Vue components
export { PaymentButton, QRCodePayment, SVMPayVue };

// Default export
export default createSVMPayPlugin;
