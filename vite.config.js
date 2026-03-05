/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import vitePrerender from 'vite-plugin-prerender'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    vitePrerender({
      staticDir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
      routes: ['/', '/about'],
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  test: {
    globals: true
  }
})
