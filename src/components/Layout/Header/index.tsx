// NPM Dependencies
import * as React from "react";

// OWN Componets
import styles from "styles/Layout.module.css";
import Navbar from "../Navbar";

const Header = () => {
    return (
        <header className={styles.header}>
            <Navbar />
        </header>
    );
};

export default Header;
