// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



// import type { NextConfig } from "next";


// const nextConfig: any = {
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     // Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // We removed the 'eslint' block because Next.js 15 handles it differently
  // and it was causing warnings.
};

export default nextConfig;

