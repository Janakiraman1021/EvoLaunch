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
    },
  },
  plugins: [],
};
