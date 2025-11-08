import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
    },
    define: {
      // Prevent "process is not defined" errors in browser
      'process.env': {},
      // Specific override for the API key to ensure it's injected securely at build time
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  }
})