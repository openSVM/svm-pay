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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Payment infrastructure
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                for SVM networks
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks. 
              One SDK, multiple chains, zero complexity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                <Button 
                  size="lg"
                  className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Get Started
                  <Icons.ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/openSVM/svm-pay" target="_blank" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                View Documentation <span aria-hidden="true">→</span>
              </Link>
            </div>
            
            {/* Install Command */}
            <div className="mt-12 flex justify-center">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-6 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700/50">
                <CodeCopy />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for developers, by developers
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need to integrate payments into your SVM applications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Cross-Network */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Icons.Cloud className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Cross-Network Support
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Accept payments across Solana, Sonic SVM, Eclipse, and s00n networks with a single integration.
              </p>
            </Card>

            {/* Developer Experience */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <Icons.Blocks className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Developer First
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Clean APIs, comprehensive docs, and TypeScript support. Get started in minutes, not hours.
              </p>
            </Card>

            {/* No Fees */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Icons.Rocket className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Zero Fees
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                No additional fees beyond standard network costs. Keep more of your revenue.
              </p>
            </Card>

            {/* Security */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                <Icons.ShieldCheck className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Security First
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Built with security best practices. Your funds and data are protected by design.
              </p>
            </Card>

            {/* Open Source */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <Icons.Heart className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Open Source
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Fully open source and MIT licensed. Contribute, audit, and customize as needed.
              </p>
            </Card>

            {/* Support */}
            <Card className="relative p-8 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <Icons.User className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                Community Support
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Active community of developers building the future of SVM payments.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24 px-6 sm:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple integration
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get started with just a few lines of code
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">React Integration</h3>
              <div className="rounded-xl bg-gray-900 dark:bg-gray-800 p-6 text-sm">
                <pre className="text-gray-300 overflow-x-auto">
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
    />
  );
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Server-side Verification</h3>
              <div className="rounded-xl bg-gray-900 dark:bg-gray-800 p-6 text-sm">
                <pre className="text-gray-300 overflow-x-auto">
{`import { verifyPayment } from 'svm-pay/server';

app.post('/verify-payment', async (req, res) => {
  const { signature, amount } = req.body;
  
  const isValid = await verifyPayment({
    signature,
    expectedAmount: amount,
    network: 'solana'
  });
  
  res.json({ success: isValid });
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="py-24 px-6 sm:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
              Supported Networks
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="https://solana.com/" target="_blank" className="group">
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Solana</span>
                </div>
              </Link>
              <Link href="https://sonic.xyz/" target="_blank" className="group">
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Sonic SVM</span>
                </div>
              </Link>
              <Link href="https://eclipse.builders/" target="_blank" className="group">
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Eclipse</span>
                </div>
              </Link>
              <Link href="https://s00n.xyz/" target="_blank" className="group">
                <div className="flex items-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">s00n</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 sm:px-16 lg:px-24 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start accepting SVM payments?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join hundreds of developers building the future of decentralized payments.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="https://github.com/openSVM/svm-pay" target="_blank">
              <Button 
                size="lg"
                className="rounded-full bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-gray-50"
              >
                Get Started
                <Icons.ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com/openSVM/svm-pay" target="_blank" className="text-sm font-semibold leading-6 text-white hover:text-blue-100">
              View on GitHub <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}