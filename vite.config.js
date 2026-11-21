import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'firestore', test: /node_modules\/@firebase\/firestore/ },
            { name: 'firebase-auth', test: /node_modules\/@firebase\/auth/ },
          ],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['build-forge-training-app-8c4a2af371c5b930.v0.build'],
  },
  plugins: [
    react(),
    {
      name: 'forge-offline',
      apply: 'build',
      closeBundle() {
        const root = resolve('dist'),
          walk = (dir = '') =>
            readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap(
              (f) =>
                f.isDirectory() ? walk(dir + f.name + '/') : [dir + f.name],
            )
        const files = walk().filter((x) => x !== 'sw.js'),
          hash = createHash('sha256')
        files.forEach((f) => hash.update(readFileSync(resolve(root, f))))
        const ver = hash.digest('hex').slice(0, 12)
        writeFileSync(
          resolve(root, 'sw.js'),
          `const prefix='forge:'+self.registration.scope+':',name=prefix+'${ver}',files=${JSON.stringify(files.map((x) => './' + x))};self.addEventListener('install',e=>e.waitUntil(caches.open(name).then(c=>c.addAll(files))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(prefix)&&k!==name).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;e.respondWith(caches.open(name).then(async c=>(await c.match(e.request.mode==='navigate'?'./index.html':e.request))||fetch(e.request)))});`,
        )
      },
    },
  ],
})
