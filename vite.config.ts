import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        lang: "ja",
        name: "Diary Cloud",
        short_name: "Diary",
        theme_color: "#2196f3",
        background_color: "#2196f3",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "app-icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
