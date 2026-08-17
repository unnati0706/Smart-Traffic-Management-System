import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor_react';
          }
          if (id.includes('node_modules/recharts/')) {
            return 'vendor_charts';
          }
          if (id.includes('node_modules/leaflet/') || id.includes('node_modules/react-leaflet/')) {
            return 'vendor_maps';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor_ui';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor_icons';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
});
