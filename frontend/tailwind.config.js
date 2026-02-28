/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        secondary: "var(--secondary)",
        card: "var(--card)",
        gold: {
          DEFAULT: "var(--gold)",
          hover: "var(--gold-hover)",
        },
        primary: "var(--primary-text)",
        muted: "var(--muted)",
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          danger: "var(--status-danger)",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E6C07B, #C6A75E)",
      },
      boxShadow: {
        "gold-glow": "0 0 15px rgba(230, 192, 123, 0.35)",
        "gold-subtle": "0 4px 20px rgba(230, 192, 123, 0.1)",
        "luxury-soft": "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        'elegant-pulse': 'elegant-pulse 3s ease-in-out infinite',
        'luxury-glow': 'luxury-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'elegant-pulse': {
          '0%, 100%': { 
            opacity: '0.6', 
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.02)'
          }
        },
        'luxury-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(230, 192, 123, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(230, 192, 123, 0.4), 0 0 35px rgba(230, 192, 123, 0.2)' 
          }
        }
      },
    },
  },
  plugins: [],
};
