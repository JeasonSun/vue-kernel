import { h, createTextNode } from "../../packages/vue/dist/vue.esm-bundler.js";

export default {
  name: "Child",
  setup(props, context) {
    console.log("props ---> ", props);
    console.log("context ---> ", context);
  },
  render() {
    return h("div", { msg: this.msg }, "child");
  },
};
