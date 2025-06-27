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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-violet-500/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Now supporting all SVM networks
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              Payment infrastructure
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-700 bg-clip-text text-transparent">
                for SVM networks
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-gray-600 dark:text-gray-300 font-medium">
              Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks with a single, 
              developer-friendly SDK. Zero complexity, zero additional fees.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <Icons.ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              
              <Link href="https://github.com/openSVM/svm-pay" target="_blank" className="group flex items-center text-lg font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                View Documentation 
                <Icons.ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Install Command */}
            <div className="mt-16 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 backdrop-blur-sm">
                  <CodeCopy />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32 px-6 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 mb-8 backdrop-blur-sm">
              <Icons.Blocks className="w-4 h-4 mr-2" />
              Developer Experience
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Built for developers,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                by developers
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to integrate payments into your SVM applications with enterprise-grade reliability and developer-first experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Cross-Network */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Cloud className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Cross-Network Support
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks with a single integration. One API, multiple chains.
                </p>
              </Card>
            </div>

            {/* Developer Experience */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Blocks className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Developer First
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Clean APIs, comprehensive docs, and TypeScript support. Get started in minutes, not hours, with our intuitive SDK.
                </p>
              </Card>
            </div>

            {/* No Fees */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Rocket className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Zero Fees
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  No additional fees beyond standard network costs. Keep more of your revenue and scale without hidden charges.
                </p>
              </Card>
            </div>

            {/* Security */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Security First
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Built with security best practices and audited smart contracts. Your funds and data are protected by design.
                </p>
              </Card>
            </div>

            {/* Open Source */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Open Source
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Fully open source and MIT licensed. Contribute, audit, and customize as needed. Community-driven development.
                </p>
              </Card>
            </div>

            {/* Support */}
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Icons.User className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white">
                  Community Support
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Active community of developers building the future of SVM payments. Get help when you need it.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="relative py-32 px-6 sm:px-16 lg:px-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 mb-8 backdrop-blur-sm">
              <Icons.Blocks className="w-4 h-4 mr-2" />
              Code Examples
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Simple integration,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                powerful results
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started with just a few lines of code. Our SDK handles the complexity so you can focus on building great products.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-violet-600/20 rounded-2xl opacity-50 group-hover:opacity-75 transition-opacity blur-xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">React Integration</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Frontend
                  </div>
                </div>
                <div className="relative rounded-2xl bg-gray-900 dark:bg-gray-950 overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-3 text-sm text-gray-400 font-mono">Payment.tsx</span>
                  </div>
                  <div className="p-6 text-sm font-mono overflow-x-auto">
                    <pre className="text-gray-300">
{`import { SvmPayment } from 'svm-pay/react';

function Checkout() {
  return (
    <SvmPayment
      amount={10}
      token="USDC"
      network="solana"
      onSuccess={(signature) => {
        console.log('Payment successful:', signature);
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl opacity-50 group-hover:opacity-75 transition-opacity blur-xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Server-side Verification</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Backend
                  </div>
                </div>
                <div className="relative rounded-2xl bg-gray-900 dark:bg-gray-950 overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-3 text-sm text-gray-400 font-mono">verify.js</span>
                  </div>
                  <div className="p-6 text-sm font-mono overflow-x-auto">
                    <pre className="text-gray-300">
{`import { verifyPayment } from 'svm-pay/server';

app.post('/verify-payment', async (req, res) => {
  const { signature, amount } = req.body;
  
  const isValid = await verifyPayment({
    signature,
    expectedAmount: amount,
    network: 'solana'
  });
  
  res.json({ 
    success: isValid,
    verified: true 
  });
});`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.Blocks className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">TypeScript Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full type safety and IntelliSense</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.Rocket className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optimized for performance</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icons.ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Built-in Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure by default implementation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="relative py-32 px-6 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 mb-8 backdrop-blur-sm">
              <Icons.Cloud className="w-4 h-4 mr-2" />
              Multi-Network Support
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              One SDK,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                all SVM networks
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
              Seamlessly accept payments across all major SVM-compatible networks with unified APIs and consistent developer experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Solana */}
            <Link href="https://solana.com/" target="_blank" className="group block">
              <div className="relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="absolute -inset-px bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">S</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Solana</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">The original high-performance blockchain for decentralized apps and crypto</p>
                  <div className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    <span>Learn more</span>
                    <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Sonic SVM */}
            <Link href="https://sonic.xyz/" target="_blank" className="group block">
              <div className="relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="absolute -inset-px bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sonic SVM</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Lightning-fast SVM runtime with enhanced performance and scalability</p>
                  <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    <span>Learn more</span>
                    <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Eclipse */}
            <Link href="https://eclipse.builders/" target="_blank" className="group block">
              <div className="relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="absolute -inset-px bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">E</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Eclipse</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">SVM-compatible L2 with Ethereum settlement and enhanced tooling</p>
                  <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300">
                    <span>Learn more</span>
                    <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* s00n */}
            <Link href="https://s00n.xyz/" target="_blank" className="group block">
              <div className="relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="absolute -inset-px bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">s</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">s00n</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Next-generation SVM stack with optimized consensus and execution</p>
                  <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                    <span>Learn more</span>
                    <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">4+</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Supported Networks</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">1</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Unified API</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">0%</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Additional Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 sm:px-16 lg:px-24 overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute inset-0 opacity-50">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 mb-8 backdrop-blur-sm">
            <Icons.Rocket className="w-4 h-4 mr-2" />
            Ready to launch?
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-8 leading-none">
            Ready to start accepting
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              SVM payments?
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl leading-8 text-blue-100 max-w-4xl mx-auto mb-12 font-medium">
            Join thousands of developers building the future of decentralized payments.
            <br />
            Start integrating today with our comprehensive SDK and documentation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="https://github.com/openSVM/svm-pay" target="_blank">
              <Button 
                size="lg"
                className="w-full sm:w-auto group relative overflow-hidden rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 border-0"
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <Icons.ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </Link>
            
            <Link href="https://github.com/openSVM/svm-pay" target="_blank" className="group flex items-center text-lg font-semibold leading-6 text-white hover:text-blue-100 transition-colors">
              <Icons.Heart className="mr-2 h-5 w-5" />
              Star on GitHub
              <Icons.ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Developer stats/social proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200 font-medium">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$10M+</div>
              <div className="text-blue-200 font-medium">Volume Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-200 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}