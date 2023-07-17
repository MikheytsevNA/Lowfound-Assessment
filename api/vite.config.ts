import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'

export default {
  root: './client',
  plugins: [
    viteReact()
  ]
}