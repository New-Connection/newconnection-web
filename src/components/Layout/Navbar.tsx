import Link from "next/link";
import { Logo } from "components";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useIsMounted } from "hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navigation = [
    { id: 0, title: "Home", path: "/" },
    { id: 1, title: "DAOs", path: "/daos" },
    { id: 2, title: "Proposals", path: "/proposals" },
];

const Navbar = () => {
    const { isConnected } = useAccount();

    // const walletDailog = useDialogState(); // For pop-up with wallets
    const router = useRouter();
    const isMounted = useIsMounted();

    return (
        <>
            <Link href="/" passHref>
                <div className="cursor-pointer">
                    <span className="sr-only">Navigate to Home Page</span>
                    <Logo />
                </div>
            </Link>

            <ConnectButton accountStatus="address" />

        </>
    );
};

export default Navbar;
