import Link from "next/link";
import Logo from "components/Layout/Logo";
import styles from "styles/components/Layout/Layout.module.css";
import classNames from "classnames";
import { Account, WalletSelector, NetworksMenu } from "components/Web3";
import { useAccount } from "wagmi";
import { useDialogState } from "ariakit";
import { useRouter } from "next/router";

import { useIsMounted } from "hooks";

const navigation = [
    { id: 0, title: "Home", path: "/" },
    { id: 1, title: "Create NFT", path: "/create-nft" },
    { id: 2, title: "Create DAO", path: "/create-dao" },
    { id: 3, title: "DAOs", path: "/daos" },
];

const Navbar = () => {
    const { isConnected } = useAccount();
    const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();
    const isMounted = useIsMounted();

    return (
        <>
            <Link href="/" passHref>
                <a>
                    <span className="sr-only">Navigate to Home Page</span>
                    <Logo />
                </a>
            </Link>

            <nav className={styles.nav}>
                {navigation.map(({ id, title, path }) => (
                    <Link key={id} href={path}>
                        <a
                            className={classNames(
                                styles.navMenuButton,
                                router.pathname == path ? styles.navButtonActive : null
                            )}
                        >
                            {title}
                        </a>
                    </Link>
                ))}
                {isMounted && isConnected ? (
                    <>
                        <NetworksMenu />
                        <Account showAccountInfo={walletDailog.toggle} />
                    </>
                ) : (
                    <button className={"nav-button hidden md:block"} onClick={walletDailog.toggle}>
                        Connect Wallet
                    </button>
                )}
            </nav>
            <WalletSelector dialog={walletDailog} />
        </>
    );
};

export default Navbar;
