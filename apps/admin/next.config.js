/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: "../../",
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/images/**",
      },
    ],
  },
};

export default nextConfig;
