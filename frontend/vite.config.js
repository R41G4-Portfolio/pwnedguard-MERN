import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
// Base correcta para despliegue en raíz de dominio o IP
base: "/",

plugins: [
	react(),

	// React Compiler preset (si ya lo estás usando en tu stack)
	babel({
	presets: [reactCompilerPreset()]
	})
],

build: {
	// Carpeta de salida (default, pero explícito para deploy controlado)
	outDir: "dist",

	// Assets organizados en carpeta dedicada
	assetsDir: "assets",

	// Genera sourcemaps desactivados en producción (mejor seguridad/perf)
	sourcemap: false,

	// Reduce warnings innecesarios en build
	chunkSizeWarningLimit: 1000
},

server: {
	// SOLO desarrollo local (no afecta producción con Nginx)
	proxy: {
	"/api": {
		target: "http://localhost:5000",
		changeOrigin: true
	}
	}
},

preview: {
	port: 4173
}
})