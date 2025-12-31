/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: "export",
  images: {
    unoptimized: true,
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

