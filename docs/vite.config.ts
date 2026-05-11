import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
// import {nitro} from "nitro/vite"
import { defineConfig } from 'vite';
import * as MdxConfig from './source.config';

const config = defineConfig({
  environments: {
    ssr: { build: { rollupOptions: { input: './src/server.ts' } } },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    nitro(),
    // mode === "production" ? nitro() : null
    viteReact(),
    mdx(MdxConfig),
  ],
  resolve: { tsconfigPaths: true },
});

export default config;
