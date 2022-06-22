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
import styles from "../../../styles/Header.module.css";

const Header = () => {
    const { data: account } = useAccount();
    const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();

    return (
        <header className={styles.header}>
            <Link href="/" passHref>
                <a>
                    <span className="sr-only">Navigate to Home Page</span>
                    <Logo />
                </a>
            </Link>

            <nav className={styles.nav}>
                <Link href="/create-nft" passHref>
                    <a className={classNames(styles.navButton, router.pathname === "/create-nft")}>
                        Create NFT
                    </a>
                </Link>
                <Link href="/create-dao" passHref>
                    <a className={classNames(styles.navButton, router.pathname === "/create-dao")}>
                        Create DAO
                    </a>
                </Link>
                {account ? (
                    <>
                        <Account showAccountInfo={walletDailog.toggle} />
                    </>
                ) : (
                    <button className={styles.wallet} onClick={walletDailog.toggle}>
                        Connect Wallet
                    </button>
                )}
            </nav>
            <WalletSelector dialog={walletDailog} />
        </header>
    );
};

export default Header;
