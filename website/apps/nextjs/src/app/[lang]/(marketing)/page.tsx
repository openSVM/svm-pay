import Link from "next/link";
import { getDictionary } from "~/lib/get-dictionary";
import { CodeCopy } from "~/components/code-copy";
import { Button } from "@saasfly/ui/button";
import { Card } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";
import type { Locale } from "~/config/i18n-config";

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-stone-50"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23000000' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
           }}>
      </div>

      {/* Hero Section - Developer Focused */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-none">
          <div className="text-center max-w-6xl mx-auto px-4">
            {/* Developer-focused badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 mb-12 backdrop-blur-md shadow-lg shadow-slate-900/5">
              <Icons.Code className="w-4 h-4 text-emerald-500" />
              Developer-first payment infrastructure
              <div className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-md font-semibold">v1.1.0</div>
            </div>
            
            {/* Developer-focused heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-slate-900 leading-[0.9] mb-8">
              Build cross-chain payments
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                in minutes, not months
              </span>
            </h1>
            
            {/* Developer-focused subheading */}
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-16 font-light">
              Accept payments from Ethereum, BNB Chain, Polygon → Solana, Sonic, Eclipse, s00n. 
              One SDK, all SVM networks, zero platform fees.
            </p>
            
            {/* Quick start code preview */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">quickstart.js</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-100 font-mono leading-relaxed overflow-x-auto">
{`import { CrossChainPaymentManager, EVMNetwork, SVMNetwork } from 'svm-pay';

// Accept payments from Ethereum to Solana
const paymentManager = new CrossChainPaymentManager();

const payment = await paymentManager.executePayment({
  sourceNetwork: EVMNetwork.ETHEREUM,
  destinationNetwork: SVMNetwork.SOLANA,
  recipient: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  amount: '100',
  token: '0xA0b86a33E6441c4d0C85c81a1a4e18a3f3F3f77f', // USDC
});

console.log('Payment status:', payment.status);`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Developer-focused CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="#quickstart">
                <Button 
                  size="lg"
                  className="h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl shadow-slate-900/25 hover:shadow-slate-900/40 hover:scale-105 text-lg"
                >
                  <Icons.Rocket className="mr-3 h-5 w-5" />
                  Get started now
                </Button>
              </Link>
              
              <Link 
                href="https://github.com/openSVM/svm-pay" 
                target="_blank" 
                className="inline-flex items-center gap-3 h-16 px-8 text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 text-lg border border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-white/50 backdrop-blur-sm"
              >
                <Icons.Github className="h-5 w-5" />
                View on GitHub
                <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Installation command */}
            <div className="inline-flex items-center gap-4 bg-white/60 border border-slate-200 rounded-2xl px-8 py-5 text-base backdrop-blur-md shadow-xl shadow-slate-900/5">
              <span className="text-slate-500 font-mono">$</span>
              <CodeCopy />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quickstart" className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              Start building in 60 seconds
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Three simple steps to integrate cross-chain payments. No complex setup, no lengthy onboarding, no hidden complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {/* Step 1: Install */}
            <div className="group">
              <Card className="p-8 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Install SDK</h3>
                <div className="rounded-xl bg-slate-900 p-4 mb-4">
                  <code className="text-emerald-400 font-mono text-sm">npm install svm-pay</code>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Install with npm, yarn, or pnpm. Zero configuration required, works with any JavaScript framework.
                </p>
              </Card>
            </div>

            {/* Step 2: Import */}
            <div className="group">
              <Card className="p-8 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Import & Setup</h3>
                <div className="rounded-xl bg-slate-900 p-4 mb-4">
                  <code className="text-blue-400 font-mono text-sm">import { SVMPay } from 'svm-pay'</code>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  TypeScript-first with full intellisense. Initialize with your preferred network configuration.
                </p>
              </Card>
            </div>

            {/* Step 3: Accept Payments */}
            <div className="group">
              <Card className="p-8 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Accept Payments</h3>
                <div className="rounded-xl bg-slate-900 p-4 mb-4">
                  <code className="text-purple-400 font-mono text-sm">svmPay.executePayment(request)</code>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Start accepting payments across all SVM networks with a single method call.
                </p>
              </Card>
            </div>
          </div>

          {/* Framework Integration Examples */}
          <div className="mt-24 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Framework Integration Examples
              </h3>
              <p className="text-lg text-slate-600">
                Native components for React, Vue, Angular, and vanilla JavaScript
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* React Example */}
              <div className="rounded-2xl bg-white/60 border border-slate-200 overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white/80">
                  <Icons.Code className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-900">React</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-700 font-mono leading-relaxed overflow-x-auto">
{`import { SVMPayment } from 'svm-pay/react';

export function Checkout() {
  return (
    <SVMPayment
      amount={99.99}
      token="USDC"
      recipient="your-address"
      onSuccess={(sig) => {
        console.log('Payment complete:', sig);
      }}
    />
  );
}`}
                  </pre>
                </div>
              </div>

              {/* Vue Example */}
              <div className="rounded-2xl bg-white/60 border border-slate-200 overflow-hidden backdrop-blur-sm">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white/80">
                  <Icons.Code className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-900">Vue</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-700 font-mono leading-relaxed overflow-x-auto">
{`<template>
  <svm-payment
    :amount="99.99"
    token="USDC"
    recipient="your-address"
    @success="onPaymentSuccess"
  />
</template>

<script setup>
const onPaymentSuccess = (signature) => {
  console.log('Payment complete:', signature);
};
</script>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases & Tutorials Section */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              Real-world use cases
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              From e-commerce to DeFi, see how developers are building the next generation of payment experiences with SVM-Pay.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-24">
            {/* E-commerce Integration */}
            <div className="space-y-6">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
                  <Icons.ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">E-commerce Integration</h3>
                <p className="text-slate-600 text-lg mb-6">Accept crypto payments in your online store with automatic order fulfillment</p>
              </div>
              <div className="rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">checkout.tsx</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-100 font-mono leading-relaxed overflow-x-auto">
{`const checkout = new Checkout();
checkout.addToCart({ 
  name: 'Product 1', 
  price: 10.99 
});

const result = await checkout.checkout(
  'your-wallet-address'
);

console.log('Payment URL:', result.url);
// QR code generation
// Status monitoring
// Order fulfillment`}
                  </pre>
                </div>
              </div>
              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/examples/point-of-sale-demo.tsx" 
                target="_blank"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                View full example
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Subscription Service */}
            <div className="space-y-6">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                  <Icons.CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Subscription Payments</h3>
                <p className="text-slate-600 text-lg mb-6">Recurring payments for SaaS, content platforms, and subscription services</p>
              </div>
              <div className="rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">subscription.ts</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-100 font-mono leading-relaxed overflow-x-auto">
{`const subscription = new SubscriptionService();

const plans = [
  { 
    id: 'pro', 
    name: 'Pro Plan', 
    price: '19.99', 
    interval: 'monthly' 
  }
];

const result = await subscription
  .createSubscription(
    user, 
    plans[0], 
    'your-address'
  );`}
                  </pre>
                </div>
              </div>
              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/examples/subscription-payment-demo.tsx" 
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View full example
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Cross-Chain Payments */}
            <div className="space-y-6">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
                  <Icons.ArrowLeftRight className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Cross-Chain Payments</h3>
                <p className="text-slate-600 text-lg mb-6">Accept payments from Ethereum, Polygon, BNB Chain to Solana networks</p>
              </div>
              <div className="rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700 bg-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">cross-chain.ts</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-100 font-mono leading-relaxed overflow-x-auto">
{`const manager = new CrossChainPaymentManager();

const request = CrossChainRequestFactory
  .createTransferRequest({
    sourceNetwork: EVMNetwork.ETHEREUM,
    destinationNetwork: SVMNetwork.SOLANA,
    recipient: 'solana-address',
    amount: '100',
    token: '0xA0b...', // USDC
  });

const result = await manager
  .executePayment(request);`}
                  </pre>
                </div>
              </div>
              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/examples/cross-chain-payment-demo.html" 
                target="_blank"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                View live demo
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Developer Resources */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Developer Resources
              </h3>
              <p className="text-lg text-slate-600">
                Everything you need to build, deploy, and scale your payment integration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/docs/developer-guide.md"
                target="_blank"
                className="group p-6 rounded-xl bg-white/60 border border-slate-200 hover:border-slate-300 hover:bg-white/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Icons.BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Developer Guide</h4>
                <p className="text-slate-600 text-sm mb-3">Comprehensive documentation with tutorials and examples</p>
                <div className="flex items-center text-blue-600 group-hover:text-blue-700 text-sm font-medium">
                  Read the docs
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/docs/cross-chain-payments.md"
                target="_blank"
                className="group p-6 rounded-xl bg-white/60 border border-slate-200 hover:border-slate-300 hover:bg-white/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Icons.Link className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Cross-Chain Guide</h4>
                <p className="text-slate-600 text-sm mb-3">Learn how to integrate cross-chain payment flows</p>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700 text-sm font-medium">
                  View guide
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                href="https://github.com/openSVM/svm-pay"
                target="_blank"
                className="group p-6 rounded-xl bg-white/60 border border-slate-200 hover:border-slate-300 hover:bg-white/80 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                  <Icons.Github className="h-6 w-6 text-slate-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Source Code</h4>
                <p className="text-slate-600 text-sm mb-3">Explore the codebase, contribute, and join the community</p>
                <div className="flex items-center text-slate-600 group-hover:text-slate-700 text-sm font-medium">
                  Browse code
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks & Cross-Chain Features */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              Cross-chain by design
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Accept payments from any EVM network to any SVM network. Our bridge infrastructure handles the complexity so you don't have to.
            </p>
          </div>
          
          {/* Source Networks (EVM) */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Source Networks (Pay From)</h3>
              <p className="text-slate-600">Accept payments from major EVM networks</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Ethereum', symbol: 'ETH', color: 'from-blue-500 to-blue-600' },
                { name: 'BNB Chain', symbol: 'BNB', color: 'from-yellow-500 to-yellow-600' },
                { name: 'Polygon', symbol: 'MATIC', color: 'from-purple-500 to-purple-600' },
                { name: 'Arbitrum', symbol: 'ARB', color: 'from-indigo-500 to-indigo-600' },
                { name: 'Optimism', symbol: 'OP', color: 'from-red-500 to-red-600' },
                { name: 'Avalanche', symbol: 'AVAX', color: 'from-rose-500 to-rose-600' },
              ].map((network) => (
                <div key={network.name} className="group">
                  <div className="p-6 rounded-2xl bg-white/60 border border-slate-200 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm text-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${network.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <span className="text-xl font-black text-white">{network.symbol.charAt(0)}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{network.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bridge Arrow */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-slate-200">
              <span className="text-slate-600 font-medium">Bridged via</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Wormhole</span>
                <span className="text-slate-400">•</span>
                <span className="text-sm font-semibold text-slate-700">Allbridge</span>
              </div>
              <Icons.ArrowDown className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Destination Networks (SVM) */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Destination Networks (Pay To)</h3>
              <p className="text-slate-600">Fast, low-cost SVM networks for final settlement</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Solana */}
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 border border-slate-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                    <span className="text-2xl font-black text-white">S</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Solana</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">TPS:</span>
                      <span className="font-semibold text-slate-700">65,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Finality:</span>
                      <span className="font-semibold text-slate-700">~400ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-emerald-600">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sonic SVM */}
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 border border-slate-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Sonic</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">TPS:</span>
                      <span className="font-semibold text-slate-700">100,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Finality:</span>
                      <span className="font-semibold text-slate-700">~200ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-emerald-600">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eclipse */}
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 border border-slate-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                    <span className="text-2xl font-black text-white">E</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Eclipse</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type:</span>
                      <span className="font-semibold text-slate-700">Layer 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Settlement:</span>
                      <span className="font-semibold text-slate-700">Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-emerald-600">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* s00n */}
              <div className="group">
                <div className="p-8 rounded-2xl bg-white/60 border border-slate-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                    <span className="text-2xl font-black text-white">s</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">s00n</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type:</span>
                      <span className="font-semibold text-slate-700">SVM Chain</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consensus:</span>
                      <span className="font-semibold text-slate-700">Optimized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-blue-600">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Chain Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-8 p-8 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">6+</div>
                <div className="text-sm text-slate-600">EVM Networks</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">4+</div>
                <div className="text-sm text-slate-600">SVM Networks</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">2</div>
                <div className="text-sm text-slate-600">Bridge Partners</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">0%</div>
                <div className="text-sm text-slate-600">Platform Fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer-Focused CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
        <div className="absolute inset-0 opacity-30" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
             }}>
        </div>

        <div className="relative w-full max-w-none">
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white mb-8">
              Ready to build the future
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                of payments?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of developers already building with SVM-Pay. 
              From your first payment to enterprise scale, we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
              <Link href="#quickstart">
                <Button 
                  size="lg"
                  className="h-16 px-12 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 text-lg"
                >
                  <Icons.Code className="mr-3 h-5 w-5" />
                  Start coding now
                </Button>
              </Link>
              
              <Link 
                href="https://github.com/openSVM/svm-pay" 
                target="_blank" 
                className="inline-flex items-center gap-3 h-16 px-8 text-slate-300 hover:text-white font-medium transition-all duration-300 text-lg border border-slate-600 rounded-2xl hover:border-slate-400 hover:bg-white/5 backdrop-blur-sm"
              >
                <Icons.Github className="h-5 w-5" />
                View source code
                <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Links for Developers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/docs/developer-guide.md"
                target="_blank"
                className="group p-6 rounded-xl bg-white/5 border border-slate-700 hover:border-slate-500 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Icons.BookOpen className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-white mb-2">Developer Guide</h4>
                <p className="text-slate-400 text-sm">Complete integration tutorials</p>
              </Link>

              <Link 
                href="https://github.com/openSVM/svm-pay/tree/main/examples"
                target="_blank"
                className="group p-6 rounded-xl bg-white/5 border border-slate-700 hover:border-slate-500 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Icons.Code className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-white mb-2">Examples</h4>
                <p className="text-slate-400 text-sm">Production-ready code samples</p>
              </Link>

              <Link 
                href="https://github.com/openSVM/svm-pay/blob/main/docs/cross-chain-payments.md"
                target="_blank"
                className="group p-6 rounded-xl bg-white/5 border border-slate-700 hover:border-slate-500 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Icons.ArrowLeftRight className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-white mb-2">Cross-Chain</h4>
                <p className="text-slate-400 text-sm">Bridge integration guide</p>
              </Link>
            </div>

            {/* Developer stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-700">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">10+</div>
                <div className="text-slate-400 font-medium">Supported Networks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">0%</div>
                <div className="text-slate-400 font-medium">Platform Fees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">3</div>
                <div className="text-slate-400 font-medium">Framework SDKs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">MIT</div>
                <div className="text-slate-400 font-medium">Open Source</div>
              </div>
            </div>

            {/* Installation command showcase */}
            <div className="mt-16 p-8 rounded-2xl bg-white/5 border border-slate-700 backdrop-blur-sm">
              <p className="text-slate-400 text-sm mb-4 font-medium">Get started in seconds</p>
              <div className="flex items-center justify-center gap-4 text-slate-200 font-mono">
                <span className="text-slate-500">$</span>
                <span>npm install svm-pay</span>
                <span className="text-slate-500">&&</span>
                <span>npm run dev</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}