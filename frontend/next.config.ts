import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Avoid picking C:\Users\user\ when another lockfile exists higher in the tree.
  outputFileTracingRoot: frontendRoot,
};

export default nextConfig;
