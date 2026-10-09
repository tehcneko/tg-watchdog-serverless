import { defineConfig } from 'tsdown'

const isSdk = (id: string) => id === 'sdk' || id.startsWith('sdk/')

export default defineConfig({
  entry: ['cloud/endpoints/*.ts', 'cloud/handlers/*.ts', 'cloud/schema.ts'],
  outDir: 'tgcloud',
  format: 'esm',
  platform: 'neutral',
  target: 'es2026',
  tsconfig: 'tsconfig.cloud.json',
  envFile: '.env',
  inputOptions: {
    resolve: {
      mainFields: ['module'],
    },
  },
  deps: {
    alwaysBundle: (id) => !isSdk(id),
    neverBundle: (id) => isSdk(id),
    onlyBundle: false,
  },
  outputOptions: {
    entryFileNames: '[name].js',
    chunkFileNames: 'lib/[name].js',
  },
})
