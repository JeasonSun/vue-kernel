import App from "./App.js";
import { createApp } from '../../packages/vue/dist/vue.esm-bundler.js'

const rootContainer = document.querySelector("#root");
createApp(App).mount(rootContainer);
