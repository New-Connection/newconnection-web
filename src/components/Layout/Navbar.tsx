import Link from "next/link";
import { Logo, MoonIcon, SunIcon } from "components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDarkMode } from "usehooks-ts";

const navigation = [
    { id: 0, title: "Home", path: "/" },
    { id: 1, title: "DAOs", path: "/daos" },
    { id: 2, title: "Proposals", path: "/proposals" },
];

const Navbar = () => {
    const { toggle } = useDarkMode();

    return (
        <>
            <Link href="/" passHref>
                <div className="cursor-pointer">
                    <span className="sr-only">Navigate to Home Page</span>
                    <Logo />
                </div>
            </Link>

            <div className={"flex gap-3"}>
                <ConnectButton accountStatus="address" />

                <label className="swap swap-rotate text-xs">
                    <input type="checkbox" onClick={toggle} />
                    <SunIcon />
                    <MoonIcon />
                </label>
            </div>
        </>
    );
};

export default Navbar;
