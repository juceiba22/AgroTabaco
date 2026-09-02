import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Este proyecto vive anidado dentro del repo del portal principal (que
  // tiene su propio package-lock.json un nivel arriba) — sin esto Turbopack
  // detecta mal la raíz del workspace y termina resolviendo archivos del
  // portal principal (ej. src/middleware.ts) en vez de los de esta app.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
