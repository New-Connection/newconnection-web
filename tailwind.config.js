const plugin = require('tailwindcss/plugin');

module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        extend: {
            colors: {
                darkGray: "#3D3D3D",
                darkModeBg: "#161818",
                lightGreen: "#23BD8F",
                veryLightGreen: "#1BDBAD",
            },
        },
    },
    plugins: [],
};
