module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },

        extend: {
            fontFamily: {
                sans: [""],
            },
        },
    },
    plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/colors/themes")["[data-theme=light]"],
                    primary: "#7343DF", // PURPLE - Main color
                    "primary-focus": "#5E37B5", // PURPLE Hover
                    success: "#54A547", // GREEN
                    warning: "#F8E155", // YELLOW
                    error: "#EB4747", // RED
                    "base-100": "#FFFFFF", // WHITE
                    "base-200": "#F2F3F4", // GRAY (Bg)
                    "base-300": "#AAAAAA", // DARK GRAY(For badges on GRAY)
                },
                dark: {
                    ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
                    primary: "#7343DF", // PURPLE
                },
            },
        ],
    },
};
