/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/types'],
    allowedDevOrigins: ['10.216.218.38'],
};

export default nextConfig;
