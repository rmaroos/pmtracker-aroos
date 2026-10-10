import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#172B4D", muted: "#64748B", line: "#DCE3EC", paper: "#F6F8FB", brand: "#2563EB" }, boxShadow: { soft: "0 1px 2px rgba(15,23,42,.04), 0 6px 20px rgba(15,23,42,.04)" } } }, plugins: [] };
export default config;