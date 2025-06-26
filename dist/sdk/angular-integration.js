"use strict";
/**
 * Angular Integration for SVM-Pay
 *
 * This module provides Angular-specific components, services, and utilities
 * for integrating SVM-Pay into Angular applications.
 *
 * Note: This module requires Angular to be installed as a peer dependency.
 * Install with: npm install @angular/core rxjs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVMPayService = exports.SVM_PAY_CONFIG = void 0;
exports.createPaymentButton = createPaymentButton;
exports.createSVMPayModule = createSVMPayModule;
exports.getAngularUtilities = getAngularUtilities;
// Check if Angular is available at runtime
function hasAngularSupport() {
    try {
        require('@angular/core');
        require('rxjs');
        return true;
    }
    catch (_a) {
        return false;
    }
}
// Create a dummy injection token that works with or without Angular
exports.SVM_PAY_CONFIG = 'SVM_PAY_CONFIG';
/**
 * SVMPay service interface (works with or without Angular)
 */
class SVMPayService {
    constructor(config) {
        this.config = config;
        if (!hasAngularSupport()) {
            console.warn('Angular integration requires @angular/core and rxjs to be installed');
        }
    }
    createTransferUrl(recipient, amount, options) {
        // Import SVMPay dynamically to avoid circular dependencies
        const { SVMPay } = require('../index');
        const svmPay = new SVMPay(this.config);
        return svmPay.createTransferUrl(recipient, amount, options);
    }
    createTransactionUrl(link, recipient) {
        const { SVMPay } = require('../index');
        const svmPay = new SVMPay(this.config);
        return svmPay.createTransactionUrl(link, recipient);
    }
    async checkWalletBalance() {
        const { SVMPay } = require('../index');
        const svmPay = new SVMPay(this.config);
        return svmPay.checkWalletBalance();
    }
    async getPaymentHistory() {
        const { SVMPay } = require('../index');
        const svmPay = new SVMPay(this.config);
        return svmPay.getPaymentHistory();
    }
    async setupWallet(walletConfig) {
        const { SVMPay } = require('../index');
        const svmPay = new SVMPay(this.config);
        return svmPay.setupWallet(walletConfig);
    }
}
exports.SVMPayService = SVMPayService;
/**
 * Create a payment button (framework agnostic)
 */
function createPaymentButton(props, config) {
    const button = document.createElement('button');
    button.textContent = `Pay ${props.amount} SOL`;
    button.className = 'svm-pay-button';
    button.onclick = () => {
        try {
            const service = new SVMPayService(config);
            const url = service.createTransferUrl(props.recipient, props.amount, {
                label: props.label,
                message: props.message,
                memo: props.memo
            });
            if (props.onPaymentInitiated) {
                props.onPaymentInitiated(url);
            }
            window.open(url, '_blank');
        }
        catch (error) {
            const errorMessage = error.message;
            if (props.onPaymentError) {
                props.onPaymentError(errorMessage);
            }
        }
    };
    return button;
}
/**
 * Factory function for creating Angular module when Angular is available
 */
function createSVMPayModule(config) {
    if (hasAngularSupport()) {
        console.log('Creating SVM-Pay Angular module with config:', config);
        // Return a basic module configuration that Angular can understand
        return {
            providers: [
                {
                    provide: exports.SVM_PAY_CONFIG,
                    useValue: config
                },
                SVMPayService
            ]
        };
    }
    else {
        console.warn('Angular not available. Install @angular/core and rxjs to use Angular integration.');
        return {
            providers: []
        };
    }
}
/**
 * Get Angular-specific utilities if available
 */
function getAngularUtilities() {
    if (hasAngularSupport()) {
        try {
            const { Injectable, Component } = require('@angular/core');
            const { BehaviorSubject } = require('rxjs');
            return {
                Injectable,
                Component,
                BehaviorSubject,
                hasAngular: true
            };
        }
        catch (error) {
            console.warn('Failed to load Angular utilities:', error);
        }
    }
    return {
        hasAngular: false
    };
}
//# sourceMappingURL=angular-integration.js.map