import * as React from "react";
import styles from "styles/components/Layout/Layout.module.css";
import Navbar from "./Navbar";

const Header = () => {
    return (
        <header className={styles.header}>
            <Navbar />
        </header>
    );
};

export default Header;
