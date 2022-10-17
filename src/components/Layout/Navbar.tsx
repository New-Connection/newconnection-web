import Link from "next/link";
import { Logo } from "components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDarkMode } from "usehooks-ts";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const navigation = [
    { id: 0, title: "Home", path: "/" },
    { id: 1, title: "DAOs", path: "/daos" },
    { id: 2, title: "Proposals", path: "/proposals" },
];

const Navbar = () => {
    const { isDarkMode, toggle } = useDarkMode();

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

                <button className="btn btn-sm btn-circle btn-outline btn-primary" onClick={toggle}>
                    {isDarkMode ? <MoonIcon className={"h-5 w-5"} /> : <SunIcon className={"h-5 w-5"} />}
                </button>
            </div>
        </>
    );
};

export default Navbar;
