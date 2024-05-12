import path from "path";
import {defineConfig} from "vite";
import autoprefixer from "autoprefixer";
import combineSelectors from "postcss-combine-duplicated-selectors";
import combineMediaQueries from "postcss-combine-media-query";

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    root: path.join(__dirname, "src"),
    css: {
        postcss: {
            plugins: [
                combineMediaQueries(),
                combineSelectors({removeDuplicatedValues: true}),
                autoprefixer(),
            ]
        }
    },
    resolve: {
      alias: {
          '@': path.resolve(__dirname, 'src')
      }
    },
    base: '',
    build: {
        minify: isProd,
        outDir: path.join(__dirname, "dist"),
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].[hash].js`,
                chunkFileNames: `assets/[name].[hash].js`,
                assetFileNames: `assets/[name].[hash].[ext]`
            }
        }
    },
    assetsInclude: ["**/*.min.js"]
})