import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;

export default defineConfig({
  plugins: [solid()],
  server: {
    port: envPort ?? 5173,
    open: !process.env.PORT,
  },
  build: {
    // Published source maps: the project is open-source, they aid debugging
    // in production, and Lighthouse flags large scripts without them.
    sourcemap: true,
  },
});
