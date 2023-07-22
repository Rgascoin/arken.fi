import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
	plugins: [require('@tailwindcss/forms')],
	theme: {
		extend: {},
	},
} satisfies Config;
