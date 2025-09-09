import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(220 14% 90%)',
				input: 'hsl(0 0% 98%)',
				ring: 'hsl(192 95% 59%)',
				background: 'hsl(0 0% 100%)',
				foreground: 'hsl(222 47% 15%)',
				primary: {
					DEFAULT: 'hsl(192 95% 59%)',
					foreground: 'hsl(0 0% 100%)'
				},
				secondary: {
					DEFAULT: 'hsl(240 5% 96%)',
					foreground: 'hsl(222 47% 15%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 84% 60%)',
					foreground: 'hsl(0 0% 100%)'
				},
				muted: {
					DEFAULT: 'hsl(240 5% 96%)',
					foreground: 'hsl(220 9% 46%)'
				},
				accent: {
					DEFAULT: 'hsl(192 95% 59%)',
					foreground: 'hsl(0 0% 100%)'
				},
				popover: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222 47% 15%)'
				},
				card: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222 47% 15%)'
				},
				sidebar: {
					DEFAULT: 'hsl(222 47% 15%)',
					foreground: 'hsl(0 0% 100%)',
					primary: 'hsl(192 95% 59%)',
					'primary-foreground': 'hsl(0 0% 100%)',
					accent: 'hsl(192 95% 59%)',
					'accent-foreground': 'hsl(0 0% 100%)',
					border: 'hsl(220 14% 90%)',
					ring: 'hsl(192 95% 59%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
