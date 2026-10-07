import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maulana Rizky — Visual Designer & Photographer",
    short_name: "Maulana Rizky",
    description: "Portfolio Maulana Rizky, visual designer and photographer.",
    start_url: "/",
    display: "browser",
    background_color: "#f2f0ea",
    theme_color: "#f2f0ea",
  };
}
