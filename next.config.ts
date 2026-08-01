import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React StrictMode to prevent the double-mount that creates two
  // simultaneous WebGL contexts in development. With StrictMode enabled,
  // React intentionally mounts → unmounts → remounts every component, which
  // causes two <Canvas> instances (and therefore two WebGL contexts) to exist
  // at the same time. Chrome's GPU process sees this as a context-loss loop
  // and permanently blocks the page from creating new WebGL contexts.
  reactStrictMode: false,
};

export default nextConfig;
