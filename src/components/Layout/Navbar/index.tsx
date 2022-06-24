import Link from "next/link";
import Logo from "components/Logo";
import styles from "styles/Layout.module.css";
import classNames from "classnames";
import { Account, WalletSelector } from "components/Web3";
import { useAccount } from "wagmi";
import { useDialogState } from "ariakit";
import { useRouter } from "next/router";

const navigation = [
    { id: 1, title: "Create NFT", path: "/create-nft" },
    { id: 2, title: "Create DAO", path: "/create-dao" },
];

const Navbar = () => {
    const { data: account } = useAccount();
    const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();

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
                                styles.navButton,
                                router.pathname == path ? styles.navButtonActive : null
                            )}
                        >
                            {title}
                        </a>
                    </Link>
                ))}

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
        </>
    );
};

export default Navbar;
