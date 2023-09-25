import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy' //배포시 서비스워커 원본 파일 복사

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    copy({
    targets: [
      { src: 'src/sw.js', dest: 'dist' },
      { src: 'public/noti_icon.svg', dest:'dist'}
    ],
    hook: 'writeBundle',
    verbose:true,
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {

  },
})
