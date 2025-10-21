import {defineConfig} from "umi";

export default defineConfig({
    routes: [
        {path: "/", component: "index"},
        {path: "/flow", component: "flow"},
    ],
    npmClient: 'yarn',
});
