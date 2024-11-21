/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		legacy(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/.*\/api\/.*$/, // Cachear llamadas a /api
						handler: "NetworkFirst", // Intenta red, luego cache si falla
						options: {
							cacheName: "api-cache",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24, // 1 día
							},
						},
					},
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
						handler: "CacheFirst",
						options: {
							cacheName: "image-cache",
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7, // 1 semana
							},
						},
					},
					{
						urlPattern: /\/manifest\.json$/, // Evitar conflictos con manifest.json
						handler: "NetworkFirst",
						options: {
							cacheName: "manifest-cache",
						},
					},
				],
			},
			manifest: {
				name: "Ionic React App",
				short_name: "IonicApp",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#ffffff",
				icons: [],
			},
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
});
