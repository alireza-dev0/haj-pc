/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/types'],
    allowedDevOrigins: ['10.216.218.38'],
    experimental: {
        authInterrupts: true,
    },

    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL}/api/:path*`
            }
        ]
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },

        ],
    }
};

export default nextConfig;
