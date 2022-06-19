import React from 'react';
import { createRoot } from "react-dom/client";
import { ThemeProvider } from 'next-themes';

// code
import Home from './pages';
import './styles/globals.css';

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