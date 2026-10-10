import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'node:path';
import { cpSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: { commonjsOptions: { include: [/node_modules/, /src\/proto/] }, rollupOptions: { input: { index: resolve('src/main/index.ts'), service: resolve('src/service/index.ts') }, output: { format: 'cjs', entryFileNames: '[name].js' } } }
  },
  preload: { plugins: [externalizeDepsPlugin()], build: { rollupOptions: { input: resolve('src/preload/index.ts'), output: { format: 'cjs', entryFileNames: 'index.js' } } } },
  renderer: {
    root: 'src/renderer',
    base: './',
    resolve: { alias: { '@': resolve('src/renderer') } },
    plugins: [vue(), { name: 'development-csp', transformIndexHtml(html, context) { return context.server ? html.replace("script-src 'self';", "script-src 'self' 'unsafe-inline';").replace("connect-src 'self';", "connect-src 'self' ws: wss:;") : html; } }, { name: 'copy-static', closeBundle() { cpSync('static', 'out/renderer/static', { recursive: true }); } }],
    build: { rollupOptions: { input: resolve('src/renderer/index.html') } }
  }
});
