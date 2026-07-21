import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        // OportuniPath design system
        path: {
          navy: '#0F172A',
          'navy-light': '#1E293B',
          teal: '#0D9488',
          'teal-dark': '#0F766E',
          'teal-light': '#CCFBF1',
          amber: '#F59E0B',
          'amber-dark': '#D97706',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
          rose: '#E11D48',
          'rose-light': '#FFE4E6',
          slate: '#64748B',
          'slate-light': '#94A3B8',
          'slate-dark': '#334155',
          cream: '#F8FAFC',
          white: '#FFFFFF',
        },
        // Legacy colors — deprecated, kept for compatibility during migration
        ango: {
          black: '#0F172A',
          red: '#0D9488',
          'red-dark': '#0F766E',
          gold: '#F59E0B',
          white: '#FAFAFA',
          'gray-light': '#F1F5F9',
          'gray-medium': '#64748B',
          'gray-dark': '#334155',
          success: '#059669',
          warning: '#D97706',
          'border-light': '#E2E8F0',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 30px rgba(15, 23, 42, 0.10)',
        search: '0 4px 20px rgba(0, 0, 0, 0.06)',
        'search-focus': '0 4px 20px rgba(13, 148, 136, 0.12)',
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #134E4A 50%, #0F172A 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        'gradient-cta': 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
