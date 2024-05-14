import path from "path";
import {defineConfig} from "vite";
import autoprefixer from "autoprefixer";
import combineSelectors from "postcss-combine-duplicated-selectors";
import combineMediaQueries from "postcss-combine-media-query";
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

const copyFile = (src, dest) => {
    fs.copyFileSync(src, dest);
    console.info(`File copied: ${dest}`)
}

const deleteFile = (src) => {
    fs.unlinkSync(src);
    console.info(`File deleted: ${src}`)
}

export default defineConfig({
    root: path.join(__dirname, "src"),
    css: {
        postcss: {
            plugins: [
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
                assetFileNames: `assets/[name].[hash].[ext]`,
                plugins: [
                    {
                        name: 'copy-index-html',
                        writeBundle() {
                            const src = path.resolve(__dirname, 'dist', 'index.html')
                            const dest = path.resolve(__dirname, 'dist', 'index.hbs')

                            copyFile(src, dest);
                        }
                    },
                    {
                        name: 'remove-index-html',
                        writeBundle() {
                            const src = path.resolve(__dirname, 'dist', 'index.html')

                            deleteFile(src)
                        }
                    }
                ]
            }
        }
    },
    assetsInclude: ["**/*.min.js"]
})