import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'index' },
    { path: '/flow', component: 'flow' },
    { path: '/datasource', component: 'datasource' },
  ],
  npmClient: 'yarn',
});
