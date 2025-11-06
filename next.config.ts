import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(tsx|jsx|ts|js)$/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            process.env.NODE_ENV === 'production'
              ? require.resolve('./babel-plugin')
              : false,
          ].filter(Boolean),
        },
      },
    });
    return config;
  },
};

export default nextConfig;
