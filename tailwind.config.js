/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#060812',
        'bg-elevated': '#0b0f1e',
        surface: 'rgba(18, 22, 40, 0.55)',
        primary: '#7c6bff',
        'primary-2': '#a78bfa',
        accent: '#22d3ee',
        'accent-2': '#5eead4',
        success: '#34d399',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Segoe UI"', 'Avenir', 'system-ui', 'sans-serif'],
        mono: ['Consolas', '"SFMono-Regular"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
