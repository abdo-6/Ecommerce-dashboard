import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig(({ mode }: { mode: string }): UserConfig => ({
  plugins: [vue()],

  build: {
    outDir: '../backend/src/public', // Ensure the output directory matches your backend's static files directory
    sourcemap: mode === 'development', // Enable sourcemaps only in development
  },

  server: {

    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server for development
        changeOrigin: true, // Change the origin header to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path if necessary
      },
    },
    
  },

}));
