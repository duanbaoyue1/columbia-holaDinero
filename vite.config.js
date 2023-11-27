import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { createVuePlugin } from "vite-plugin-vue2";
import postCssPxToRem from "postcss-pxtorem";
import commonjs from "vite-plugin-commonjs";
import { resolve } from "path"; // 主要用于alias文件路径别名

export default defineConfig({
  base: "./",
  define: {
    "process.env.MODE": JSON.stringify(process.env.MODE),
  },
  plugins: [
    commonjs(),
    createVuePlugin(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  build: {
    outDir: "dist", //指定打包输出路径
    assetsDir: "", //指定静态资源存放路径
    cssCodeSplit: true, //css代码拆分,禁用则所有样式保存在一个css里面
    sourcemap: false, //是否构建source map 文件
    emptyOutDir: true, // 构建时清空该目录
    chunkSizeWarningLimit: 1500,
    // 生产环境取消 console
    minify: "terser",
    terserOptions: {
      compress: {
        // drop_console: true, // 删除console语句
        drop_debugger: true, // 删除debugger
      },
      format: {
        comments: false, // 移除注释
      },
    },
  },
  // 别名
  resolve: {
    alias: {
      // 设置别名
      "@": resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5, // 1rem的大小
          propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
        }),
      ],
    },
  },
  server: {
    port: 3001,
    host: true,
    open: true,
    hmr: true,
  },
});
