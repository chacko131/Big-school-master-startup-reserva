import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 30 MB para soportar hasta 6 fotos simultáneas de galería (~2-5 MB/foto).
      // TODO: Cuando el volumen de usuarios escale, migrar la subida de galería a
      //       uploads directos cliente→Cloudinary (unsigned preset) y solo enviar
      //       las URLs resultantes al server action. Esto elimina el límite y la
      //       carga en servidor.
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        // Cloudinary — necesario para usar <Image> con URLs de res.cloudinary.com
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
