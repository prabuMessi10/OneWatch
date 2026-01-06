/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Bebas Neue', 'cursive'],
            },
            colors: {
                netflix: {
                    red: '#E50914',
                    dark: '#0f0f0f',
                    card: '#1a1a1a',
                    gray: '#b3b3b3'
                }
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
}
