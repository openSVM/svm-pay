import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "~/lib/get-dictionary";

import { CodeCopy } from "~/components/code-copy";
import { Comments } from "~/components/comments";
import { FeaturesGrid } from "~/components/features-grid";
import { RightsideMarketing } from "~/components/rightside-marketing";

import { AnimatedTooltip } from "@saasfly/ui/animated-tooltip";
import { BackgroundLines } from "@saasfly/ui/background-lines";
import { Button } from "@saasfly/ui/button";
import { ColourfulText } from "@saasfly/ui/colorful-text";
import * as Icons from "@saasfly/ui/icons";

import type { Locale } from "~/config/i18n-config";
import {VideoScroll} from "~/components/video-scroll";

const people = [
  {
    id: 1,
    name: "developer1",
    designation: "Lead Developer",
    image: "https://avatars.githubusercontent.com/u/10096899",
    link: "https://github.com/openSVM/svm-pay",
  },
  {
    id: 2,
    name: "developer2",
    designation: "Core Contributor",
    image: "https://avatars.githubusercontent.com/u/10334353",
    link: "https://github.com/openSVM/svm-pay",
  },
  {
    id: 3,
    name: "developer3",
    designation: "Network Specialist",
    image: "https://avatars.githubusercontent.com/u/3849293",
  },
  {
    id: 4,
    name: "developer4",
    designation: "SDK Developer",
    image: "https://avatars.githubusercontent.com/u/22560152",
  },
  {
    id: 5,
    name: "developer5",
    designation: "Security Expert",
    image: "https://avatars.githubusercontent.com/u/3316062",
  },
  {
    id: 6,
    name: "developer6",
    designation: "UI/UX Designer",
    image: "https://avatars.githubusercontent.com/u/41265413",
  },
];

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="container">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <div className="flex flex-col items-start h-full">
            <BackgroundLines className="h-full">
              <div className="flex flex-col pt-4 md:pt-36 lg:pt-36 xl:pt-36">
                <div className="mt-20">
                  <div
                    className="mb-6 max-w-4xl text-left text-4xl font-semibold dark:text-zinc-100 md:text-5xl xl:text-5xl md:leading-[4rem] xl:leading-[4rem]">
                    {dict.marketing.title || "Payment infrastructure for SVM networks with "}
                    <ColourfulText text="SVM-Pay"/>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-neutral-500 dark:text-neutral-400 sm:text-lg">
                    {dict.marketing.sub_title || "A complete payment solution for Solana, Sonic SVM, Eclipse, and s00n networks with one-click integration."}
                  </span>
                </div>

                <div
                  className="mb-4 mt-6 flex w-full flex-col justify-center space-y-4 sm:flex-row sm:justify-start sm:space-x-8 sm:space-y-0 z-10">
                  <Link href="https://github.com/openSVM/svm-pay" target="_blank">
                    <Button
                      className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg px-6 h-12 font-medium">
                      {dict.marketing.get_started || "Get Started"}
                      <Icons.ArrowRight className="h-5 w-5"/>
                    </Button>
                  </Link>

                  <CodeCopy/>
                </div>

                <div className="flex xl:flex-row flex-col items-center justify-start mt-4 w-full">
                  <div className="flex">
                    <AnimatedTooltip items={people}/>
                  </div>
                  <div className="flex flex-col items-center justify-start ml-8">
                    <div className="w-[340px]">
                      <text className="font-semibold">6 </text>
                      <text
                        className="text-neutral-500 dark:text-neutral-400">{dict.marketing.contributors?.contributors_desc || "contributors made SVM-Pay stronger"}</text>
                    </div>
                    <div className="w-[340px]">
                      <text
                        className="text-neutral-500 dark:text-neutral-400">{dict.marketing.contributors?.developers_first || "Help more than "}</text>
                      <ColourfulText text="1000"/>
                      <text
                        className="text-neutral-500 dark:text-neutral-400">{dict.marketing.contributors?.developers_second || " developers"}</text>
                    </div>
                  </div>
                </div>
              </div>
            </BackgroundLines>
          </div>

          <div className="hidden h-full w-full xl:block bg-background">
            <div className="flex flex-col pt-44">
              <RightsideMarketing dict={dict.marketing.right_side}/>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-8 md:mt-[-180px] xl:mt-[-180px]">
        <FeaturesGrid dict={dict.marketing.features_grid}/>
      </section>

      <section className="container pt-24">
        <div className="flex flex-col justify-center items-center pt-10">
          <div className="text-lg text-neutral-500 dark:text-neutral-400">{dict.marketing.sponsor?.title || "Supported Networks"}</div>
          <div className="mt-4 flex items-center gap-4">
            <Link href="https://solana.com/" target="_blank">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-accent dark:hover:bg-neutral-800/30">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-200">Solana</span>
              </div>
            </Link>
            <Link href="https://sonic.xyz/" target="_blank">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-accent dark:hover:bg-neutral-800/30">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-200">Sonic SVM</span>
              </div>
            </Link>
            <Link href="https://eclipse.builders/" target="_blank">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-accent dark:hover:bg-neutral-800/30">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-200">Eclipse</span>
              </div>
            </Link>
            <Link href="https://s00n.xyz/" target="_blank">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-accent dark:hover:bg-neutral-800/30">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-200">s00n</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="container pt-8">
        <VideoScroll dict={dict.marketing.video}/>
      </section>

      <section className="w-full px-8 pt-10 sm:px-0 sm:pt-24 md:px-0 md:pt-24 xl:px-0 xl:pt-24">
        <div className="flex h-full w-full flex-col items-center pb-[100px] pt-10">
          <div>
            <h1 className="mb-6 text-center text-3xl font-bold dark:text-zinc-100 md:text-5xl">
              {dict.marketing.people_comment?.title || "What People Are Saying"}
            </h1>
          </div>
          <div className="mb-6 text-lg text-neutral-500 dark:text-neutral-400">
            {dict.marketing.people_comment?.desc || "Don't just take our word for it. Here's what real developers are saying about SVM-Pay."}
          </div>

          <div className="w-full overflow-x-hidden">
            <Comments/>
          </div>
        </div>
      </section>
    </>
  );
}
