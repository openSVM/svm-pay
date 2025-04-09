import { Card } from "@saasfly/ui/card"
import * as Icons from "@saasfly/ui/icons";

export function Comments() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-8 scrollbar-hide">
      <Card className="min-w-[350px] p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <h3 className="font-semibold">John Developer</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Solana Developer</p>
            </div>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            "SVM-Pay made it incredibly easy to add payment functionality to my dApp. The cross-network compatibility is a game-changer, and I was up and running in less than an hour."
          </p>
        </div>
      </Card>

      <Card className="min-w-[350px] p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
              ST
            </div>
            <div>
              <h3 className="font-semibold">Sarah Tech</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Startup Founder</p>
            </div>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            "We integrated SVM-Pay into our marketplace and were amazed at how seamless the process was. The fact that it's free to use with no additional fees was the cherry on top."
          </p>
        </div>
      </Card>

      <Card className="min-w-[350px] p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
              MC
            </div>
            <div>
              <h3 className="font-semibold">Mike Crypto</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">DeFi Engineer</p>
            </div>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            "The security features in SVM-Pay are top-notch. I appreciate how they've implemented best practices for blockchain payments while keeping the integration process simple."
          </p>
        </div>
      </Card>

      <Card className="min-w-[350px] p-6 rounded-3xl dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              AL
            </div>
            <div>
              <h3 className="font-semibold">Amy Lee</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Web3 Product Manager</p>
            </div>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">
            "Our team was able to implement SVM-Pay across multiple projects with minimal effort. The SDK is well-designed and the documentation is clear and comprehensive."
          </p>
        </div>
      </Card>
    </div>
  )
}
