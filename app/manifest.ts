import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personal PM Tracker",
    short_name: "PM Tracker",
    description: "Personal project and task management tracker",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
