// NPM Dependencies
import * as React from "react";
import { useAccount } from "wagmi";
import { DisclosureState, useDialogState } from "ariakit";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

// OWN Componets
import { WalletSelector, Account } from "../../Web3";
// import { Coins } from '../../Icons';
// import Menu from './Menu';
import Logo from "../../Logo";
import styles from "../../../styles/Layout.module.css";
import Navbar from "../Navbar";

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
