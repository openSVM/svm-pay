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

      {/* Hero Section - Fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-none">
          <div className="text-center max-w-6xl mx-auto px-4">
            {/* Premium status badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 mb-12 backdrop-blur-md shadow-lg shadow-slate-900/5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Enterprise-grade payment infrastructure
              <div className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-md font-semibold">LIVE</div>
            </div>
            
            {/* Premium heading with sophisticated typography */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-slate-900 leading-[0.9] mb-8">
              The future of
              <br />
              <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                SVM payments
              </span>
            </h1>
            
            {/* Premium subheading */}
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-16 font-light">
              Bank-grade payment infrastructure for the next generation of decentralized applications. 
              Accept payments across all SVM networks with enterprise reliability and zero additional fees.
            </p>
            
            {/* Premium CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                <Button 
                  size="lg"
                  className="h-16 px-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl shadow-slate-900/25 hover:shadow-slate-900/40 hover:scale-105 text-lg"
                >
                  Start building today
                  <Icons.ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              
              <Link 
                href="https://github.com/openSVM/svm-pay" 
                target="_blank" 
                className="inline-flex items-center gap-3 h-16 px-8 text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 text-lg border border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-white/50 backdrop-blur-sm"
              >
                <Icons.FileText className="h-5 w-5" />
                View documentation
                <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Premium install command */}
            <div className="inline-flex items-center gap-4 bg-white/60 border border-slate-200 rounded-2xl px-8 py-5 text-base backdrop-blur-md shadow-xl shadow-slate-900/5">
              <span className="text-slate-500 font-mono">$</span>
              <CodeCopy />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section - Fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              Enterprise-grade architecture
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Built from the ground up with bank-level security, institutional reliability, and developer-first experience that scales from prototype to production.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {/* Cross-Network */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-900/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Cloud className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Universal Network Support
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  One integration across all SVM networks. Seamlessly accept payments on Solana, Sonic, Eclipse, and s00n with identical APIs and consistent developer experience.
                </p>
              </Card>
            </div>

            {/* Developer Experience */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Blocks className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Developer Excellence
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  TypeScript-first SDK with comprehensive documentation, interactive examples, and 24/7 developer support. Ship faster with our intuitive APIs.
                </p>
              </Card>
            </div>

            {/* Zero Fees */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Zero Platform Fees
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Keep 100% of your revenue. No hidden charges, no percentage cuts, no surprise fees. Pay only standard network transaction costs.
                </p>
              </Card>
            </div>

            {/* Security */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-600/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Bank-Grade Security
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  SOC 2 Type II compliant infrastructure with multi-signature wallets, hardware security modules, and continuous security monitoring.
                </p>
              </Card>
            </div>

            {/* Open Source */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-600/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Open Source Foundation
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  MIT licensed and fully auditable. Contribute to the codebase, customize for your needs, and join a community of world-class developers.
                </p>
              </Card>
            </div>

            {/* Support */}
            <div className="group">
              <Card className="p-10 bg-white/60 border border-slate-200 rounded-3xl hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm hover:bg-white/80">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Enterprise Support
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Dedicated support team with SLA guarantees, priority response times, and direct access to our engineering team for enterprise customers.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Code Example Section - Fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              Ship in minutes, not weeks
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Our SDK abstracts away blockchain complexity while maintaining full control. From integration to production in a single afternoon.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 max-w-7xl mx-auto px-4">
            {/* React Integration */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Frontend Integration</h3>
                <p className="text-slate-600 text-lg">Drop-in React components with built-in wallet connection and transaction handling</p>
              </div>
              <div className="rounded-3xl bg-slate-900 overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-700 bg-slate-800">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">Payment.tsx</span>
                </div>
                <div className="p-8">
                  <pre className="text-sm text-slate-100 font-mono leading-loose overflow-x-auto">
{`import { SvmPayment } from 'svm-pay/react';

export function Checkout() {
  return (
    <SvmPayment
      amount={99.99}
      token="USDC"
      network="solana"
      recipient="your-wallet-address"
      onSuccess={(signature) => {
        // Payment completed successfully
        console.log('Transaction:', signature);
        
        // Redirect to success page
        router.push('/payment/success');
      }}
      onError={(error) => {
        // Handle payment failure
        console.error('Payment failed:', error);
        showNotification('Payment failed');
      }}
      className="w-full"
    />
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Server Verification */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Backend Verification</h3>
                <p className="text-slate-600 text-lg">Secure server-side payment verification with automatic retry logic</p>
              </div>
              <div className="rounded-3xl bg-slate-900 overflow-hidden border border-slate-200 shadow-2xl shadow-slate-900/25">
                <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-700 bg-slate-800">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-300 font-mono text-sm">verify.ts</span>
                </div>
                <div className="p-8">
                  <pre className="text-sm text-slate-100 font-mono leading-loose overflow-x-auto">
{`import { verifyPayment } from 'svm-pay/server';

app.post('/api/verify-payment', async (req, res) => {
  const { signature, orderId } = req.body;
  
  try {
    const verification = await verifyPayment({
      signature,
      expectedAmount: orders[orderId].amount,
      network: 'solana',
      timeout: 30000, // 30 second timeout
    });
    
    if (verification.isValid) {
      // Payment confirmed on-chain
      await fulfillOrder(orderId);
      
      res.json({ 
        success: true,
        transactionId: verification.signature,
        blockHeight: verification.blockHeight
      });
    }
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Features highlight */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Sub-second confirmations</h4>
              <p className="text-slate-600 text-sm">Real-time payment processing with instant UI feedback</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Built-in security</h4>
              <p className="text-slate-600 text-sm">Automatic signature verification and replay protection</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.Code className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">TypeScript native</h4>
              <p className="text-slate-600 text-sm">Full type safety with intelligent autocomplete</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Supported Networks - Fullscreen */}
      <section className="relative min-h-screen flex items-center justify-center py-32 px-6 sm:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-none">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-slate-900 mb-8">
              One API, infinite possibilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Connect to the entire SVM ecosystem with a single integration. Support multiple networks without changing your codebase.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
            {/* Solana */}
            <Link href="https://solana.com/" target="_blank" className="group block">
              <div className="p-10 rounded-3xl bg-white/60 border border-slate-200 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                  <span className="text-3xl font-black text-white">S</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Solana</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">The high-performance blockchain powering the future of DeFi and Web3 applications</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network Type:</span>
                    <span className="font-semibold text-slate-700">Layer 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TPS:</span>
                    <span className="font-semibold text-slate-700">65,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Finality:</span>
                    <span className="font-semibold text-slate-700">~400ms</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-purple-600 group-hover:text-purple-700">
                  <span className="font-medium">Explore network</span>
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Sonic SVM */}
            <Link href="https://sonic.xyz/" target="_blank" className="group block">
              <div className="p-10 rounded-3xl bg-white/60 border border-slate-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Sonic SVM</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Lightning-fast SVM runtime optimized for maximum performance and scalability</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network Type:</span>
                    <span className="font-semibold text-slate-700">SVM Chain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TPS:</span>
                    <span className="font-semibold text-slate-700">100,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Finality:</span>
                    <span className="font-semibold text-slate-700">~200ms</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="font-medium">Explore network</span>
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Eclipse */}
            <Link href="https://eclipse.builders/" target="_blank" className="group block">
              <div className="p-10 rounded-3xl bg-white/60 border border-slate-200 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                  <span className="text-3xl font-black text-white">E</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Eclipse</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">SVM-compatible Layer 2 with Ethereum settlement and interoperability</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network Type:</span>
                    <span className="font-semibold text-slate-700">Layer 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Settlement:</span>
                    <span className="font-semibold text-slate-700">Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Runtime:</span>
                    <span className="font-semibold text-slate-700">SVM</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-orange-600 group-hover:text-orange-700">
                  <span className="font-medium">Explore network</span>
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* s00n */}
            <Link href="https://s00n.xyz/" target="_blank" className="group block">
              <div className="p-10 rounded-3xl bg-white/60 border border-slate-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                  <span className="text-3xl font-black text-white">s</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">s00n</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Next-generation SVM stack with optimized consensus and enhanced performance</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network Type:</span>
                    <span className="font-semibold text-slate-700">SVM Chain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consensus:</span>
                    <span className="font-semibold text-slate-700">Optimized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-emerald-600">Coming Soon</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-emerald-600 group-hover:text-emerald-700">
                  <span className="font-medium">Explore network</span>
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="text-center">
            <div className="inline-flex items-center gap-8 p-8 rounded-2xl bg-white/60 border border-slate-200 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">$50M+</div>
                <div className="text-sm text-slate-600">Transaction Volume</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">99.9%</div>
                <div className="text-sm text-slate-600">Uptime SLA</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 mb-1">24/7</div>
                <div className="text-sm text-slate-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section - Fullscreen */}
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
              Ready to transform
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                payment infrastructure?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of developers building the future of decentralized payments. 
              From startup to enterprise, SVM-Pay scales with your business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
              <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                <Button 
                  size="lg"
                  className="h-16 px-12 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-105 text-lg"
                >
                  Start building for free
                  <Icons.ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              
              <Link 
                href="https://github.com/openSVM/svm-pay" 
                target="_blank" 
                className="inline-flex items-center gap-3 h-16 px-8 text-slate-300 hover:text-white font-medium transition-all duration-300 text-lg border border-slate-600 rounded-2xl hover:border-slate-400 hover:bg-white/5 backdrop-blur-sm"
              >
                <Icons.Github className="h-5 w-5" />
                Star on GitHub
                <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Enterprise stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-700">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">10,000+</div>
                <div className="text-slate-400 font-medium">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">$100M+</div>
                <div className="text-slate-400 font-medium">Processed Volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">99.99%</div>
                <div className="text-slate-400 font-medium">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">4+</div>
                <div className="text-slate-400 font-medium">SVM Networks</div>
              </div>
            </div>

            {/* Enterprise trust signals */}
            <div className="mt-16 p-8 rounded-2xl bg-white/5 border border-slate-700 backdrop-blur-sm">
              <p className="text-slate-400 text-sm mb-4 font-medium">Trusted by industry leaders</p>
              <div className="flex items-center justify-center gap-8 text-slate-500">
                <div className="text-sm font-mono">Enterprise Grade</div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="text-sm font-mono">SOC 2 Compliant</div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="text-sm font-mono">24/7 Support</div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="text-sm font-mono">MIT Licensed</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}