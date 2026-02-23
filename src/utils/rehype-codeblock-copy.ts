import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export default function rehypeCopyButton() {
	return (tree: any) => {
		visit(tree, 'element', (node, index, parent) => {
			if (
				node.tagName === 'pre' &&
				node.children[0]?.tagName === 'code' &&
				index !== undefined
			) {
				const wrapper = h('div', { class: 'code-wrapper' }, [
					node,
					h('button', { class: 'copy-btn', type: 'button' }, [
						h(
							'svg',
							{
								xmlns: 'http://www.w3.org/2000/svg',
								width: '16',
								height: '16',
								viewBox: '0 0 24 24',
								fill: 'none',
								stroke: 'currentColor',
								strokeWidth: '2',
							},
							[
								h('rect', {
									x: '9',
									y: '9',
									width: '13',
									height: '13',
									rx: '2',
									ry: '2',
								}),
								h('path', {
									d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
								}),
							]
						),
					]),
				]);
				parent.children[index] = wrapper;
			}
		});
	};
}
