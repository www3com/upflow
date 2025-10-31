import routes from './routes';
export default {
  define: {
    SHOW_HEADER: process.env.SHOW_HEADER !== 'false',
  },
  routes: routes,
  npmClient: 'yarn',
  // UmiJS 默认启用 mock，可通过 MOCK=none 环境变量关闭
  mock: {
    exclude: [],
  },
  // 当 mock 关闭时使用的代理配置
  proxy: {
    '/api': {
      target: 'http://192.168.3.102', //测试环境
      changeOrigin: true,
      pathRewrite: { '^/api': '/' },
    },
  },
};
