import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'flow' },
    { path: '/app', component: 'flow' },
    { path: '/knowledge', component: 'knowledge' },
  ],
  npmClient: 'yarn',
  mock: {
    exclude: [],
  },
});
