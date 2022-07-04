// NPM Dependencies
import * as React from "react";

// OWN Componets
import styles from "styles/components/Layout/Layout.module.css";
import Navbar from "components/Layout/Navbar";

const Header = () => {
    return (
        <header className={styles.header}>
            <Navbar />
        </header>
    );
};

export default Header;
