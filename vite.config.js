import { fileURLToPath, URL } from "node:url"; // 建议使用 node:url 前缀

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 暴露到局域网，方便手机调试
    port: 3000,      // Vue 运行端口
    open: true,      // 自动打开浏览器
    proxy: {
      // 代理配置：将所有以 /api 开头的请求转发到 Flask
      '/api': {
        target: 'http://127.0.0.1:5000', // Flask 后端的地址
        changeOrigin: true,              // 允许跨域
        secure: false,                   // 如果是 https 需要设为 true
        // rewrite: (path) => path.replace(/^\/api/, '') // 如果 Flask 接口没有 /api 前缀，请取消此行注释
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
