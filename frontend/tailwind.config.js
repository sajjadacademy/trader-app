/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mt5-bg': '#000000', // Pitch black background
                'mt5-panel': '#1c1c1e', // Modal/Panel background
                'mt5-text': '#ffffff',
                'mt5-gray': '#8e8e93', // Secondary text
                'mt5-blue': '#007aff', // iOS/MT5 Blue button
                'mt5-red': '#ff3b30',
                'mt5-green': '#34c759',
                'mt5-separator': '#38383a',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
