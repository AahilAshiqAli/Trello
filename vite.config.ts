import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr, { type VitePluginSvgrOptions } from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { ZodError } from 'zod';
import { env } from './src/env';

export default defineConfig(async ({ mode }) => {
  const loadedEnv = loadEnv(mode, __dirname, '');

  try {
    await env.parseAsync(loadedEnv);
  } catch (error) {
    if (error instanceof ZodError) console.error(error.flatten().fieldErrors);
    throw new Error('❌ Invalid environment variables:');
  }

  const svgrOptions: VitePluginSvgrOptions = {
    svgrOptions: {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      svgoConfig: { floatPrecision: 2 },
    },
  };

  const compilerConfig = {
    target: '19',
  };

  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      svgr(svgrOptions),
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', compilerConfig]],
        },
      }),
    ],
    build: { outDir: 'build' },
  };
});
