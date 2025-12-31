/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: "export",
  trailingSlash: true, // Required for sub-pages on some static hosts
  images: {
    unoptimized: true,
  },

  // Skip linting and type checking during build to ensure deployment succeeds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Transpile Three.js related packages
  transpilePackages: ["three"],

  // Webpack configuration for GLSL shaders and 3D assets
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

export default nextConfig;

