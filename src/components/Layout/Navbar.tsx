import Link from "next/link";
import Logo from "components/Layout/Logo";
import styles from "styles/components/Layout/Layout.module.css";
import classNames from "classnames";
import { Account, WalletSelector, NetworksMenu } from "components/Web3";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useDialogState } from "ariakit";
import { useRouter } from "next/router";
import Menu from "./Menu";
import CustomNotification from "components/Toast/CustomNotification";

import { useIsMounted } from "hooks";

const navigation = [
    { id: 0, title: "Home", path: "/" },
    { id: 1, title: "DAOs", path: "/daos" },
    { id: 2, title: "Proposals", path: "/proposals" },
];

const Navbar = () => {
    const { isConnected } = useAccount();
    const { chain } = useNetwork();

    const chainIDs = ["5", "80001", "43113"]; // Goerli, Mumbai, FUJI
    const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();
    const isMounted = useIsMounted();

    const isIncludeNumber = (id: string) => chainIDs.some((val) => val === id); // return true if we have this chainID in chainIDs

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
            </nav>

            <div className="flex gap-3">
                <>
                    {isMounted && isConnected ? (
                        <>
                            <NetworksMenu />
                            <Account showAccountInfo={walletDailog.toggle} />
                        </>
                    ) : (
                        <button
                            className="form-submit-button hidden md:block"
                            onClick={walletDailog.toggle}
                        >
                            Connect Wallet
                        </button>
                    )}
                </>
                {/* //notification for switch network, because it's wrong network */}
                <>
                    {isConnected ? (
                        <>
                            {isIncludeNumber(chain?.id?.toString()!) ? (
                                <div></div>
                            ) : (
                                CustomNotification()
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </>
                <Menu walletDialog={walletDailog} />
            </div>
            <WalletSelector dialog={walletDailog} />
        </>
    );
};

export default Navbar;
