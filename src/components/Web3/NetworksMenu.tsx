import * as React from "react";
import {
    Select,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectLabel,
    SelectPopover,
    SelectSeparator,
    useSelectState,
} from "ariakit/select";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Image from "next/image";
import ASSETS from "assets/index";
import { getChainIds, getChainNames, getLogoURI } from "interactions/contract";
import { chains } from "./WagmiClient";

export const NetworksMenu = () => {
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const select = useSelectState({
        defaultValue: chain?.id?.toString() ?? "0",
        sameWidth: true,
        gutter: 8,
    });

    if (!chain || !switchNetwork) return null;

    const currentChains = chains.filter((chain) => getChainIds().includes(chain.id));

    const mainnets = currentChains.filter((chain) => !chain.testnet);

    const nameChain = getChainNames().find((name) => name === chain.name);

    return (
        <>
            <SelectLabel state={select} className="hidden sm:sr-only">
                {"network"}
            </SelectLabel>
            <Select
                state={select}
                className="nav-button border-none hidden items-center justify-between gap-1 text-black font-normal text-sm sm:flex"
            >
                <>
                    {/* <div className="flex h-5 w-5 items-center rounded-full">
                        <Image
                            src={getLogoURI(chain.id) ?? ASSETS.defaultToken}
                            objectFit="contain"
                            layout="fixed"
                            width="20px"
                            height="20px"
                            priority
                        />
                    </div> */}
                    <span>{nameChain ?? "Unsupported"}</span>
                    <ChevronDownIcon className="relative right-[-4px] h-4 w-4" aria-hidden="true" />
                </>
            </Select>
            {select.mounted && (
                <SelectPopover
                    state={select}
                    className="shadow-2 z-10 max-h-[280px] w-fit min-w-[13rem] overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2"
                >
                    {mainnets.length > 0 ? (
                        <>
                            <SelectGroup>
                                <SelectGroupLabel className="p-2 text-sm font-normal text-neutral-500">
                                    Mainnets
                                </SelectGroupLabel>
                                {mainnets.map((chain) => {
                                    return (
                                        <SelectItem
                                            key={chain.id}
                                            value={chain.id?.toString()}
                                            className="btn-state flex rounded-md scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-graySupport outline-none cursor-pointer aria-disabled:opacity-40 "
                                            onClick={() => switchNetwork?.(chain.id)}
                                        >
                                            <Image
                                                src={getLogoURI(chain.id) ?? ASSETS.defaultToken}
                                                alt={chain.name}
                                                objectFit="contain"
                                                width="20px"
                                                height="20px"
                                                priority
                                            />
                                            <span>{chain.name}</span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                            <SelectSeparator className="my-2" />
                        </>
                    ) : (
                        <></>
                    )}

                    <SelectGroup>
                        <SelectGroupLabel className="p-2 text-sm font-normal text-graySupport">
                            Test Chains
                        </SelectGroupLabel>
                        {currentChains
                            .filter((chain) => chain.testnet)
                            .map((chain) => {
                                return (
                                    <SelectItem
                                        key={chain.id}
                                        value={chain.id?.toString()}
                                        className="btn-state flex rounded-md scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-graySupport outline-none cursor-pointer aria-disabled:opacity-40 "
                                        onClick={() => switchNetwork?.(chain.id)}
                                    >
                                        <Image
                                            src={getLogoURI(chain.id) ?? ASSETS.defaultToken}
                                            alt={chain.name}
                                            objectFit="contain"
                                            width="20px"
                                            height="20px"
                                            priority
                                        />
                                        <span>{chain.name}</span>
                                    </SelectItem>
                                );
                            })}
                    </SelectGroup>
                </SelectPopover>
            )}
        </>
    );
};
