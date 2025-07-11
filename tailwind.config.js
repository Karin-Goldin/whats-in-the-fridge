/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				playful: ['var(--font-playful)', 'sans-serif'],
				geist: ['var(--font-geist-sans)', 'sans-serif'],
				'geist-mono': ['var(--font-geist-mono)', 'monospace'],
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
		},
	},
	plugins: [],
};
