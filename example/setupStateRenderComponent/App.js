import { ref, h } from "../../packages/vue/dist/vue.esm-bundler.js";

export default {
  name: "App",
  setup() {
    const count = ref(0);
    const clickHandler = () => {
      count.value++;
    };
    return {
      count,
      clickHandler,
    };
  },
  render() {
    console.log(this.count);
    return h("div", {}, [
      h("p", {}, this.count),
      h("div", { onClick: this.clickHandler }, "Add Btn"),
    ]);
  },
};
