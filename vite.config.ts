import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 5173,
            hmr: {
                clientPort: 80,
            },
        },
        build: {
            outDir: "dist",
        },
    };
});
