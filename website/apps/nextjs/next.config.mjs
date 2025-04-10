// @ts-check
import "./src/env.mjs";
import { withNextDevtools } from "@next-devtools/core/plugin";
// import "@saasfly/api/env"
import withMDX from "@next/mdx";
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@saasfly/api",
    "@saasfly/db",
    "@saasfly/common",
    "@saasfly/ui",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-base",
    "@walletconnect/solana-adapter",
    "@walletconnect/universal-provider",
  ],
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    mdxRs: true,
    // serverActions: true,
  },
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com", "www.twillot.com", "cdnv2.ruguoapp.com", "www.setupyourpay.com"],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
};
export default withNextDevtools(withMDX()(config));
