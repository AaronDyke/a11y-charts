// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'A11y Charts',
			description:
				'Framework-free, accessible chart components for ADAPT reports: line, bar, and segmented bar charts.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mzebley-aem/a11y-charts' },
			],
			editLink: {
				baseUrl: 'https://github.com/mzebley-aem/a11y-charts/edit/main/docs/',
			},
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Your first chart', slug: 'getting-started/first-chart' },
					],
				},
				{
					label: 'Charts',
					items: [
						{ label: 'Line chart', slug: 'charts/line-chart' },
						{ label: 'Bar chart', slug: 'charts/bar-chart' },
						{ label: 'Segmented bar chart', slug: 'charts/segmented-bar-chart' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Data views', slug: 'guides/data-views' },
						{ label: 'Server rendering', slug: 'guides/server-rendering' },
					],
				},
			],
		}),
	],
});
