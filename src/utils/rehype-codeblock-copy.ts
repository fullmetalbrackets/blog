import { visit } from "unist-util-visit";
import { h } from "hastscript";

export default function rehypeCopyButton() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "pre" && node.children[0]?.tagName === "code" && index !== undefined) {
        const wrapper = h("div", { class: "code-wrapper" }, [
          node,
          h("button", { class: "copy-btn", type: "button" }, "Copy"),
        ]);
        parent.children[index] = wrapper;
      }
    });
  };
}