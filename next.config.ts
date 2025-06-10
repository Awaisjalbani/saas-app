import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  sentry: {
    hideSourceMaps: true,
  },
};

// Only use Sentry in production and if token is available
const withSentry = async () => {
  if (process.env.VERCEL_ENV !== "production" || !process.env.SENTRY_AUTH_TOKEN) {
    return nextConfig;
  }

  const { withSentryConfig } = await import("@sentry/nextjs");
  return withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "black-devs-nm",
  project: "bd_converso",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
  
  // Auth token is required
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Disable telemetry
  telemetry: false,
});
}

export default withSentry();
