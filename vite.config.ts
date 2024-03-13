import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from '@unocss/svelte-scoped/vite';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	plugins: [
		UnoCSS({
			injectReset: '@unocss/reset/tailwind.css',
			cssFileTransformers: [transformerDirectives()]
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
