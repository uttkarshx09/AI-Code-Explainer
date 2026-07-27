/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(8,15,31,0.45)',
            },
            fontFamily: {
                sans: ['Trebuchet MS', 'Segoe UI', 'sans-serif'],
                display: ['Georgia', 'Times New Roman', 'serif'],
            },
            colors: {
                ink: {
                    950: '#060b14',
                    900: '#0a1120',
                    800: '#101a30',
                },
            },
        },
    },
    plugins: [],
};