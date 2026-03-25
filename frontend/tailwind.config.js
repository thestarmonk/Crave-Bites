/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366F1', // Electric Indigo
                    dark: '#4F46E5',
                    light: '#818CF8',
                },
                secondary: {
                    DEFAULT: '#1A1A1A',
                    light: '#2D2D2D',
                },
                accent: '#06B6D4', // Vibrant Cyan
                royal: '#8B5CF6',  // Violet
                berry: '#EC4899',  // Pinkish
            },
            fontFamily: {
                plus: ['Plus Jakarta Sans', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
