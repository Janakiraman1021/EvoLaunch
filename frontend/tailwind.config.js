/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "app/**/*.{js,ts,jsx,tsx,mdx}",
        "components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#faf9f6",
                foreground: "#2d4a2b",
                forest: {
                    DEFAULT: "#2d4a2b",
                    light: "#3e613b",
                    dark: "#1e331d",
                },
                sage: "#7d8471",
                olive: "#a4ac86",
                ivory: "#faf9f6",
                protective: "#8b3a3a",
                growth: "#d4a373",
                expansion: "#2d4a2b",
            },
            backgroundImage: {
                'organic-glow': 'radial-gradient(circle at center, rgba(164, 172, 134, 0.15) 0%, transparent 70%)',
            },
        },
    },
    plugins: [],
}
