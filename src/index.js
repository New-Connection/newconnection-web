import { React }  from 'react';
import { createRoot } from "react-dom/client";
import { Header }  from './componets/';
import './index.css';

function Page() {
    return (
        <div>
            <Header />
        </div>
    )
}

const container = document.getElementById('root');
const root = createRoot(container)
root.render(<Page />);