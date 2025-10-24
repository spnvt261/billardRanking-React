import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     server: {
//     proxy: {
//       '/api': {
//         target: 'https://192.168.0.101:8443', // backend server
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })
export default defineConfig({
    plugins: [react()],
    server: {
    proxy: {
      '/api': {
        target: 'https://billardranking-sever.onrender.com', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
