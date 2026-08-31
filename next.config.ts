import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Los mocks locales en /public/images/posts son SVG generados por nosotros.
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // Fallback por si algún post migrado no pudo subir su imagen al bucket.
      { protocol: "https", hostname: "static.wixstatic.com" },
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname }]
        : []),
    ],
  },
};

export default nextConfig;
