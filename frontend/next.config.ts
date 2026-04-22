import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Automatically tree-shake barrel-file imports (lucide-react has 1 500+
    // re-exports; react-icons has thousands). Saves 200-800 ms on cold starts.
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-icons",
    ],
  },
};

export default nextConfig;
