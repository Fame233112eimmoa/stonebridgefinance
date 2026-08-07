import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Stonebridge",
    description: "Online banking — checking, savings, cards, and loans in one app.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#128488",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
