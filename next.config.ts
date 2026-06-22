import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/curs-practic",
        destination: "/curs-futures",
        permanent: true,
      },
      {
        source: "/curs-practic/multumim",
        destination: "/curs-futures/multumim",
        permanent: true,
      },
      {
        source: "/api/curs-practic/:path*",
        destination: "/api/curs-futures/:path*",
        permanent: false,
      },
      {
        source: "/admin/curs-practic",
        destination: "/admin/curs-futures/clienti",
        permanent: true,
      },
      {
        source: "/admin/curs-practic/:path*",
        destination: "/admin/curs-futures/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
