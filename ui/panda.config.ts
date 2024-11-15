import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	outdir: "styled-system",
	presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
	prefix: "panda",
});
