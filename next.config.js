const { withSuperjson } = require('next-superjson');

const nextConfig = {
  experimental: { appDir: true },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = withSuperjson()(nextConfig);
