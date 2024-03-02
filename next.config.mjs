/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.ppy.sh",
        pathname: "/beatmaps/**",
      },
      {
        protocol: "https",
        hostname: "osu.ppy.sh",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
