/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- tells Next.js to build static HTML in /out
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // needed for static export to work
  },
};

export default nextConfig;
