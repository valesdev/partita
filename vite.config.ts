import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const pkg = require('./package.json')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
      name: pkg.name,
      fileName: pkg.name
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        sourcemap: true,
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url))
    }
  },
  plugins: [
    vue(),
    dts({
      tsConfigFilePath: fileURLToPath(new URL('./tsconfig.app.json', import.meta.url)),
      rollupTypes: true
    })
  ]
})
