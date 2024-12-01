import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig(({ mode }: { mode: string }): UserConfig => ({
  plugins: [vue()],

  build: {
    outDir: '../backend/src/public', // Ensure the output directory matches your backend's static files directory
    sourcemap: mode === 'development', // Enable sourcemaps only in development
  },

}));
