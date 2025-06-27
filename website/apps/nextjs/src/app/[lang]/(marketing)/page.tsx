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
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-5xl mx-auto">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              Supporting all SVM networks
            </div>
            
            {/* Main heading */}
            <h1 className="text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-[-0.02em] text-gray-900 dark:text-white leading-[1.1] mb-8">
              Payment infrastructure
              <br />
              <span className="text-gray-600 dark:text-gray-400">for SVM networks</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
              Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks. 
              One SDK, zero fees, enterprise-grade reliability.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                <Button 
                  size="lg"
                  className="h-12 px-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Get Started
                  <Icons.ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link 
                href="https://github.com/openSVM/svm-pay" 
                target="_blank" 
                className="inline-flex items-center gap-2 h-12 px-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200"
              >
                View Documentation
                <Icons.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Install command */}
            <div className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">
              <span className="text-gray-500 dark:text-gray-500">$</span>
              <CodeCopy />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-gray-900 dark:text-white mb-6">
              Built for developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to integrate payments into your SVM applications with enterprise-grade reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cross-Network */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.Cloud className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Cross-Network Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Accept payments across multiple SVM networks with a single integration. One API, multiple chains.
                </p>
              </Card>
            </div>

            {/* Developer Experience */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.Blocks className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Developer First
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Clean APIs, comprehensive docs, and TypeScript support. Get started in minutes with our intuitive SDK.
                </p>
              </Card>
            </div>

            {/* No Fees */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.Rocket className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Zero Fees
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  No additional fees beyond standard network costs. Keep more of your revenue and scale without hidden charges.
                </p>
              </Card>
            </div>

            {/* Security */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.ShieldCheck className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Security First
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Built with security best practices and audited smart contracts. Your funds and data are protected by design.
                </p>
              </Card>
            </div>

            {/* Open Source */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.Heart className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Open Source
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fully open source and MIT licensed. Contribute, audit, and customize as needed. Community-driven development.
                </p>
              </Card>
            </div>

            {/* Support */}
            <div className="group">
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-6">
                  <Icons.User className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Community Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Active community of developers building the future of SVM payments. Get help when you need it.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-gray-900 dark:text-white mb-6">
              Simple integration
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with just a few lines of code. Our SDK handles the complexity so you can focus on building.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* React Integration */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">React Integration</h3>
                <p className="text-gray-600 dark:text-gray-400">Frontend payment component</p>
              </div>
              <div className="rounded-lg bg-gray-900 dark:bg-gray-950 overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm text-gray-400 font-mono">Payment.tsx</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto">
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
            
            {/* Server Verification */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Server Verification</h3>
                <p className="text-gray-600 dark:text-gray-400">Backend payment verification</p>
              </div>
              <div className="rounded-lg bg-gray-900 dark:bg-gray-950 overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm text-gray-400 font-mono">verify.js</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto">
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
      </section>

      {/* Supported Networks */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-gray-900 dark:text-white mb-6">
              Supporting all SVM networks
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              One SDK works across all major SVM-compatible networks with consistent APIs and developer experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Solana */}
            <Link href="https://solana.com/" target="_blank" className="group block">
              <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-xl font-bold text-white">S</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Solana</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">High-performance blockchain for decentralized apps</p>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <span>Learn more</span>
                  <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Sonic SVM */}
            <Link href="https://sonic.xyz/" target="_blank" className="group block">
              <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-xl font-bold text-white">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sonic SVM</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Lightning-fast SVM runtime with enhanced performance</p>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <span>Learn more</span>
                  <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Eclipse */}
            <Link href="https://eclipse.builders/" target="_blank" className="group block">
              <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-xl font-bold text-white">E</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Eclipse</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">SVM-compatible L2 with Ethereum settlement</p>
                <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                  <span>Learn more</span>
                  <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* s00n */}
            <Link href="https://s00n.xyz/" target="_blank" className="group block">
              <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-xl font-bold text-white">s</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">s00n</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Next-generation SVM stack with optimized consensus</p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <span>Learn more</span>
                  <Icons.ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-900 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white mb-6">
            Ready to start accepting payments?
          </h2>
          
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Join developers building the future of decentralized payments. Start integrating today with our comprehensive SDK.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="https://github.com/openSVM/svm-pay" target="_blank">
              <Button 
                size="lg"
                className="h-12 px-8 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors duration-200 shadow-sm"
              >
                Get Started
                <Icons.ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link 
              href="https://github.com/openSVM/svm-pay" 
              target="_blank" 
              className="inline-flex items-center gap-2 h-12 px-6 text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              <Icons.Heart className="h-4 w-4" />
              Star on GitHub
              <Icons.ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Simple stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">1000+</div>
              <div className="text-sm text-gray-400">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">4+</div>
              <div className="text-sm text-gray-400">Networks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">0%</div>
              <div className="text-sm text-gray-400">Extra Fees</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}