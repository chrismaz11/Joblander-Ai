import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const enablePWA = false; // Disabled to prevent deployment errors
  
  return {
    plugins: [
      react({
        // Optimize JSX runtime for production
        jsxRuntime: 'automatic',
      }),
      // Bundle analyzer for production builds
      isProduction && visualizer({
        filename: 'dist/bundle-analysis.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
      // PWA plugin (opt-in via ENABLE_PWA=true)
      enablePWA &&
        VitePWA({
          disable: !isProduction,
          minify: false,
          registerType: 'autoUpdate',
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.ts',
          injectManifest: {
            minify: false,
          },
          manifest: {
            name: 'Job Lander',
            short_name: 'JobLander',
            description: 'AI-Powered Resume Builder with Blockchain Verification',
            theme_color: '#000000',
            icons: [
              {
                src: 'logo.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'logo-512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
        }),
    ].filter(Boolean),
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
        options: {
          from: undefined,
        },
      },
      // Minify CSS in production
      minify: isProduction,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production debugging
      sourcemap: isProduction ? 'hidden' : true,
      // Minification options
      minify: isProduction ? 'esbuild' : false,
      // Target modern browsers for better optimization
      target: 'esnext',
      rollupOptions: {
        external: ['canvas', './renderer/canvas'],
        treeshake: {
          preset: 'recommended',
          manualPureFunctions: ['console.log', 'console.info'],
        },
        output: {
          // Optimized manual chunks for better caching
          manualChunks: {
            // Keep React core together to prevent bundling issues
            'react-vendor': ['react', 'react-dom'],
            // UI libraries
            'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog', 'framer-motion', 'lucide-react'],
            // Form libraries
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // Utility libraries
            'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          },
          // Optimize asset filenames for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || ['unknown'];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Compression and optimization
      reportCompressedSize: isProduction,
    },
    optimizeDeps: {
      force: true,
      exclude: ['canvas', 'qrcode'],
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        'wouter',
        'react-hook-form',
        '@hookform/resolvers/zod',
        'zod',
      ],
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      // Enable HMR for better development experience
      hmr: {
        overlay: true,
      },
    },
    // Environment variables configuration
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '4.0.0'),
    },
    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },
  };
});
