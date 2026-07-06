import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [solid()],
  server: {
    port: envPort ?? 5173,
    open: !process.env.PORT,
  },
});
