// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        '1l82oc3jiermhald.public.blob.vercel-storage.com' // Add your specific Vercel Blob Storage domain
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;