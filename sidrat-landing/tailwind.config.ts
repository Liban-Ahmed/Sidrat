import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0C7489',
                secondary: '#488B49',
                accent: '#DAA520',
                'text-dark': '#2C3E3F',
                'text-secondary': '#6B7280',
                background: '#F5F5F5',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-poppins)', 'sans-serif'],
            },
            fontSize: {
                'h1-desktop': ['52px', { lineHeight: '1.1', fontWeight: '700' }],
                'h1-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2-desktop': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
                'h2-mobile': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
                'h3-mobile': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
            },
            spacing: {
                '18': '4.5rem',
                '30': '7.5rem',
            },
            maxWidth: {
                'container': '1200px',
            },
            boxShadow: {
                'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card': '0 4px 12px rgba(0, 0, 0, 0.1)',
                'large': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'phone': '0 8px 24px rgba(0, 0, 0, 0.15)',
            },
            borderRadius: {
                'xl': '12px',
            },
        },
    },
    plugins: [],
}
export default config
