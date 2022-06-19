import React from 'react';
import { createRoot } from "react-dom/client";
import Home from './pages';
// import './index.css';
import './styles/globals.css';
import { ThemeProvider } from 'next-themes';

function Page() {
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <Home />
        </ThemeProvider>
    )
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container)
root.render(<Page />);