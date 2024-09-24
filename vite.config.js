import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // Asegúrate de usar './' si quieres rutas relativas para producción
  plugins: [react()],
})
