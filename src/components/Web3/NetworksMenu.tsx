import * as React from "react";
import {
    Select,
    SelectItem,
    SelectLabel,
    SelectPopover,
    useSelectState,
    SelectGroup,
    SelectGroupLabel,
} from "ariakit/select";
import { SelectorIcon } from "@heroicons/react/solid";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Image from "next/image";
import defaultImage from "assets/empty-token.webp";
import { chainDetails } from "utils/network"; // this file to add more networks
import { SupportedChainNames } from "utils/blockchains";

export const NetworksMenu = () => {
    const { chain } = useNetwork();
    const { chains, switchNetwork } = useSwitchNetwork();
    const select = useSelectState({
        defaultValue: chain?.id?.toString() ?? "0",
        sameWidth: true,
        gutter: 8,
    });

    const { network } = chainDetails(chain?.id?.toString());
    // How to know what chain is it
    // console.log("Chain", chain?.id?.toString());
    // console.log("Error", error);
    if (!chain || !switchNetwork) return null;

    //const mainnets = chains.filter((chain) => !chain.testnet);
    // ONLY GOERLI. For using all testnets (=> chain.testnet)
    const testnets = chains.filter(
        (chain) =>
            chain.id === 80001 ||
            chain.id === 43113 ||
            chain.id === 4 ||
            chain.id === 97 ||
            chain.id === 421611 ||
            chain.id === 69 ||
            chain.id === 4002
    );
    // console.log(testnets);
    // console.log("name:     " + chain.name);

    // To find name what we need
    const nameChain = SupportedChainNames.find((name) => name === chain.name);
    // console.log(nameChain);
    return (
        <>
            <SelectLabel state={select} className="hidden sm:sr-only">
                {"network"}
            </SelectLabel>
            <Select
                state={select}
                className="nav-button shadow-none border-none hidden items-center justify-between gap-2 sm:flex"
            >
                <>
                    <div className="flex h-5 w-5 items-center rounded-full">
                        <Image
                            src={network?.logoURI ?? defaultImage}
                            alt={network?.prefix}
                            objectFit="contain"
                            layout="fixed"
                            width="20px"
                            height="20px"
                            priority
                        />
                    </div>
                    <span>{nameChain ?? "Unsupported"}</span>
                    <SelectorIcon className="relative right-[-4px] h-4 w-4" aria-hidden="true" />
                </>
            </Select>
            {select.mounted && (
                <SelectPopover
                    state={select}
                    className="shadow-2 z-10 max-h-[280px] w-fit min-w-[13rem] overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2"
                >
                    {/* <SelectGroup>
                        <SelectGroupLabel className="p-2 text-sm font-normal text-neutral-500">
                            Mainnets
                        </SelectGroupLabel>
                        {mainnets.map((value) => {
                            const { network } = chainDetails(value?.id?.toString());
                            return (
                                <SelectItem
                                    key={value.id}
                                    value={value.id?.toString()}
                                    className="flex rounded-md cursor-pointer scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-[#666666] outline-none active-item:text-black active:text-black aria-disabled:opacity-40 hover:bg-[#6858CB] hover:text-white"
                                    onClick={() => switchNetwork(value.id)}
                                >
                                    <div className="flex h-5 w-5 items-center rounded-full">
                                        <Image
                                            src={network?.logoURI ?? defaultImage}
                                            alt={value.name}
                                            objectFit="contain"
                                            width="20px"
                                            height="20px"
                                            priority
                                        />
                                    </div>
                                    <span>{value.name}</span>
                                </SelectItem>
                            );
                        })}
                    </SelectGroup> */}
                    {/* <SelectSeparator className="my-2" /> */}
                    <SelectGroup>
                        <SelectGroupLabel className="p-2 text-sm font-normal text-graySupport">
                            Testnets
                        </SelectGroupLabel>
                        {testnets.map((value) => {
                            const { network } = chainDetails(value?.id?.toString());
                            return (
                                <SelectItem
                                    key={value.id}
                                    value={value.id?.toString()}
                                    className="btn-state flex rounded-md scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-graySupport outline-none cursor-pointer aria-disabled:opacity-40 "
                                    onClick={() => switchNetwork?.(value.id)}
                                >
                                    <Image
                                        src={network?.logoURI ?? defaultImage}
                                        alt={value.name}
                                        objectFit="contain"
                                        width="20px"
                                        height="20px"
                                        priority
                                    />
                                    <span>{value.name}</span>
                                </SelectItem>
                            );
                        })}
                    </SelectGroup>
                </SelectPopover>
            )}
        </>
    );
};
