const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    i18n: {
      locales: ['en'],
      defaultLocale: 'en',
    },
    images: {
      domains: [''],
    },
    async redirects() {
      return [
        {
          source: '/create-dao',
          destination: '/',
          permanent: true,
        }
      ];
    },
  };
  
  module.exports = withBundleAnalyzer(nextConfig);
  