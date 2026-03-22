/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        matrix: '#00FF41',
        tron: '#00E5FF',
        iso: '#F0F0FF',
      },
      animation: {
        glitch: 'glitch 0.3s ease forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        rain: 'rain 20s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)', filter: 'none' },
          '20%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(90deg) saturate(2)' },
          '40%': { transform: 'translate(2px, -1px)', filter: 'hue-rotate(-90deg) saturate(2)' },
          '60%': { transform: 'translate(-1px, 2px)', filter: 'hue-rotate(45deg)' },
          '80%': { transform: 'translate(1px, -2px)', filter: 'hue-rotate(-45deg)' },
        },
      },
    },
  },
  plugins: [],
}
