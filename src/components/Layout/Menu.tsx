import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { DisclosureState } from "ariakit";
import { Menu, MenuItem } from "components/NestedMenu";
import { useIsMounted, useWindowSize } from "hooks";
import { formatAddress } from "utils/address";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useTheme } from "next-themes";

export default function HeaderMenu({ walletDialog }: { walletDialog: DisclosureState }) {
    const { address: accountData, isConnected } = useAccount();
    const { setTheme, resolvedTheme } = useTheme();
    const isMounted = useIsMounted();
    // const isDark = resolvedTheme === "dark";

    const address = accountData ? formatAddress(accountData) : null;

    const { chain } = useNetwork();
    const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
    const mainnets = chains.filter((chain) => !chain.testnet);

    const size = useWindowSize();
    const isSm = size && size.width && size.width < 640;
    const isLg = size && size.width && size.width < 1024;

    return (
        <Menu
            label={
                <>
                    <span className="sr-only">menu</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 font-light"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </>
            }
        >
            {isConnected && isMounted ? (
                <MenuItem
                    label={
                        <div className="flex flex-col gap-1 p-2 cursor-pointer">
                            <p className="text-xs text-black">Connected as</p>
                            <p className="font-normal text-black">{address}</p>
                        </div>
                    }
                    className="md:hidden"
                    onClick={walletDialog.toggle}
                />
            ) : (
                <MenuItem
                    label="Connect Wallet"
                    className="break-words font-normal text-black border-2 rounded-md hover:bg-purple hover:text-white p-2 md:hidden cursor-pointer"
                    onClick={walletDialog.toggle}
                />
            )}

            {/* Chain switcher */}
            {/* {chain && switchNetwork && isSm && (
                <Menu
                    label={chain?.name ?? "unsupported"}
                    className="flex items-center justify-between p-2 font-normal text-[#666666] outline-none active-item:text-black aria-disabled:opacity-40 sm:hidden"
                >
                    {mainnets.map((value) => {
                        const { network } = chainDetails(value?.id?.toString());
                        return (
                            <MenuItem
                                key={value.id}
                                label={
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-5 w-5 items-center rounded-full">
                                            <Image
                                                src={network?.logoURI ?? ""}
                                                alt={"logoAlt"}
                                                objectFit="contain"
                                                width="20px"
                                                height="20px"
                                                priority
                                            />
                                        </div>
                                        <span className="whitespace-nowrap">{value.name}</span>
                                    </div>
                                }
                                onClick={() => switchNetwork?.(value.id)}
                            />
                        );
                    })}
                </Menu>
            )} */}

            {/* {isLg && (
                <MenuItem
                    label={
                        <Link passHref href="/">
                            <div className="flex w-full items-center justify-between gap-4 font-normal cursor-pointer">
                                <span className="">Home</span>
                                <HomeIcon className="h-4 w-4" />
                            </div>
                        </Link>
                    }
                />
            )}

            {isLg && (
                <MenuItem
                    label={
                        <Link passHref href="/daos">
                            <div className="flex w-full items-center justify-between gap-4 font-normal cursor-pointer">
                                <span className="">DAOs</span>
                                <UserGroupIcon className="h-4 w-4" />
                            </div>
                        </Link>
                    }
                />
            )}

            {isLg && (
                <MenuItem
                    label={
                        <Link passHref href="/proposals">
                            <div className="flex w-full items-center justify-between gap-4 font-normal cursor-pointer">
                                <span className="">Proposals</span>
                                <ScaleIcon className="h-4 w-4" />
                            </div>
                        </Link>
                    }
                />
            )} */}

            <MenuItem
                label={
                    <a
                        href="https://www.newconnection.xyz/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex w-full items-center justify-between gap-4 font-normal"
                    >
                        <span>About us</span>
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                    </a>
                }
            />

            {/* 
            
            TODO: DARK MODE maybe in one day
            {isMounted && (
                <MenuItem
                    label={
                        <>
                            <span className="cursor-pointer">
                                {isDark ? "Light Theme" : "Dark Theme"}
                            </span>
                            {isDark ? (
                                <SunIcon className="h-4 w-4" />
                            ) : (
                                <MoonIcon className="h-4 w-4" />
                            )}
                        </>
                    }
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                />
            )} */}
        </Menu>
    );
}
