import glob from "glob";
import path from "path";
import { defineConfig } from 'vite'

// vite.config.js
export default defineConfig({
  server: {
    host: 'localhost',
    cors: '*',
    hmr: {
      host: 'localhost',
      protocol: 'ws'
    }
  },
  build: {
    minify: true,
    manifest: true,
    rollupOptions: {
      input:  glob.sync(path.resolve(__dirname, "src/pages", "*.js")),
      output: {
        entryFileNames: '[name].js',
        esModule: false,
        compact: true,
        globals: {
          jquery: '$'
        }
      },
      external: ['jquery']
    }
  }
})
