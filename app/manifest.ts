import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Toluwanimi Odufeko | Engineer, Builder, Voice for Impact",
    short_name: "Toluwanimi",
    description:
      "Portfolio of Toluwanimi Odufeko — Electrical engineer, software builder, and founder of Donate Drive.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffff1",
    theme_color: "#010B13",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
