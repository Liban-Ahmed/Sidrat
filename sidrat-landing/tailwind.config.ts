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
                // Premium Typography Scale
                'h1-desktop': ['72px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
                'h1-mobile': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
                'h2-desktop': ['56px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
                'h2-mobile': ['36px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
                'h3-desktop': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3-mobile': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
                'body-large': ['20px', { lineHeight: '1.6' }],
                'body': ['18px', { lineHeight: '1.6' }],
            },
            spacing: {
                '18': '4.5rem',
                '30': '7.5rem',
                '40': '10rem',    // 160px
                '50': '12.5rem',  // 200px
            },
            maxWidth: {
                'container': '1280px',
            },
            boxShadow: {
                // Layered Premium Shadows
                'subtle': '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04)',
                'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05), 0 16px 32px rgba(0, 0, 0, 0.05)',
                'large': '0 4px 8px rgba(0, 0, 0, 0.06), 0 12px 24px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.1)',
                'primary': '0 8px 24px rgba(12, 116, 137, 0.3), 0 16px 48px rgba(12, 116, 137, 0.2)',
                'phone': '0 8px 24px rgba(0, 0, 0, 0.15)',
                // Enhanced Glow Effects
                'glow': '0 0 20px rgba(12, 116, 137, 0.3), 0 0 40px rgba(12, 116, 137, 0.2)',
                'glow-secondary': '0 0 20px rgba(72, 139, 73, 0.3), 0 0 40px rgba(72, 139, 73, 0.2)',
                'glow-accent': '0 0 20px rgba(218, 165, 32, 0.3), 0 0 40px rgba(218, 165, 32, 0.2)',
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '24px',
                '3xl': '32px',
                '4xl': '40px',
                '5xl': '48px',
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
                'pulse-slower': 'pulse-slower 6s ease-in-out infinite',
                'shine': 'shine 2s ease-in-out',
                'gradient': 'gradient-shift 3s ease infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'slide-in-bottom': 'slide-in-bottom 0.6s ease-out',
                'slide-in-left': 'slide-in-left 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.6s ease-out',
                'scale-in': 'scale-in 0.6s ease-out',
                'rotate-in': 'rotate-in 0.8s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                'pulse-slower': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
                shine: {
                    '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
                    '100%': { transform: 'translateX(200%) skewX(-15deg)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'gradient-x': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(12, 116, 137, 0.3), 0 0 40px rgba(12, 116, 137, 0.2)' },
                    '50%': { boxShadow: '0 0 30px rgba(12, 116, 137, 0.5), 0 0 60px rgba(12, 116, 137, 0.3)' },
                },
                'slide-in-bottom': {
                    '0%': { transform: 'translateY(100px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-in-left': {
                    '0%': { transform: 'translateX(-100px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'rotate-in': {
                    '0%': { transform: 'rotate(-10deg) scale(0.8)', opacity: '0' },
                    '100%': { transform: 'rotate(0) scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
export default config
