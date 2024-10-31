import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite el acceso desde fuera del contenedor
    port: 5173, // Asegúrate de que este sea el puerto que usas
  },
})
