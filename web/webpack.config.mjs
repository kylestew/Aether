// webpack.config.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    entry: './index.js',
    output: { path: path.resolve(__dirname, 'dist'), filename: 'index.js' },
    plugins: [
        new HtmlWebpackPlugin({ template: 'index.html' }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '..'), // the Rust crate (parent)
            outDir: path.resolve(__dirname, 'pkg'), // put pkg/ in this folder
            // optional: pick the wasm-pack target explicitly
            // extraArgs: '--target bundler',
        }),
    ],
    mode: 'development',
    experiments: { asyncWebAssembly: true },
}
