import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/book",
        permanent: true,
      },
      // {
      //   source: "/login",
      //   destination: "/book",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
