// NPM Dependencies
import * as React from "react";
import { useAccount } from "wagmi";
import { DisclosureState, useDialogState } from "ariakit";
import { useRouter } from "next/router";

// OWN Componets
import styles from "styles/Layout.module.css";
import Navbar from "components/Layout/Navbar";

const Header = () => {
    const { data: account } = useAccount();
    const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();

    return (
        <header className={styles.header}>
            <Navbar />
        </header>
    );
};

export default Header;
