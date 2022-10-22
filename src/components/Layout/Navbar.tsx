import Link from "next/link";
import { Logo, MoonIcon, SunIcon } from "components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDarkMode } from "usehooks-ts";

const Navbar = () => {
    const { toggle } = useDarkMode();

    return (
        <>
            <div className={"w-1/2 grid grid-flow-col"}>
                <div>
                    <Link href="/home" passHref>
                        <button className="p-1 text-left">
                            <span className="sr-only">Navigate to Home Page</span>
                            <Logo />
                        </button>
                    </Link>
                </div>

                <div className={"grid grid-flow-col "}>
                    <Link href="/home" passHref>
                        <button className="btn-ghost p-1 rounded-xl text-center">
                            <span className={"font-bold"}>Home</span>
                        </button>
                    </Link>

                    <Link href="/daos" passHref>
                        <button className="btn-ghost p-1 rounded-xl text-center">
                            <span className={"font-bold"}>Rooms</span>
                        </button>
                    </Link>
                </div>
            </div>

            <div className={"flex gap-3"}>
                <ConnectButton accountStatus="address" label="Sign in" showBalance={false} />

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
