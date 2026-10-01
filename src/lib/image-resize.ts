// Las fotos que suben los editores desde el celular (o cualquier cámara
// moderna) suelen pesar 3-8 MB. El formulario las manda como base64 dentro
// del JSON a /api/admin/posts, y Vercel corta las peticiones de más de ~4,5 MB
// con un 413 — el guardado falla sin avisar claramente qué pasó (ver
// PostForm/BulletinImport). Para evitarlo, se redimensiona y comprime la
// imagen en el navegador antes de mandarla: no hace falta que el editor sepa
// optimizar fotos a mano.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

export function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no es una imagen válida."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen en este navegador."));
          return;
        }
        // Fondo blanco: si el original era PNG con transparencia, al pasar a
        // JPEG (sin canal alfa) evita que la transparencia salga negra.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
