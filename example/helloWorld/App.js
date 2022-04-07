import { ref, h } from "../../packages/vue/dist/vue.esm-bundler.js";
const count = ref(1);

const HelloWorld = {
  name: "HelloWorld",
  setup() {},
  render() {
    return h(
      "div",
      {
        tId: "helloWorld",
      },
      `hello world: count: ${count.value}`
    );
  },
};

export default {
  name: "App",
  setup() {},
  render() {
    console.log('render App')
    return h("div", { tId: 1 }, "hello world");
    // return h("div", { tId: 1 }, [h("p", {}, "homePage"), h(HelloWorld)]);
  },
};
