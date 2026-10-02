import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // El optimizador de imágenes de Vercel agotó la cuota del plan: toda
    // imagen nueva (no cacheada) devuelve 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
    // y se ve rota en el sitio, aunque el archivo en Supabase Storage esté
    // bien. Con esto las imágenes se sirven tal cual desde su origen (Supabase
    // ya las entrega por CDN, y el admin las redimensiona a ≤1600px antes de
    // subirlas, ver src/lib/image-resize.ts). Si se mejora el plan de Vercel,
    // se puede volver a activar quitando esta línea.
    unoptimized: true,
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
