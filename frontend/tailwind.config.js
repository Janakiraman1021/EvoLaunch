/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0C0F",
        secondary: "#141417",
        card: "#1C1C21",
        gold: {
          DEFAULT: "#E6C07B",
          hover: "#C6A75E",
          bronze: "#B08D57",
        },
        primary: "#F5F5F4",
        muted: "#A1A1AA",
        status: {
          success: "#15803D",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
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
