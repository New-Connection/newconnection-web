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
import {
    CURRENT_CHAINS,
    getChainIds,
    getChainNames, getLogoURI,
} from "utils/blockchains";
import { chains } from "./WalletConfig";

export const NetworksMenu = () => {
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const select = useSelectState({
        defaultValue: chain?.id?.toString() ?? "0",
        sameWidth: true,
        gutter: 8,
    });

    if (!chain || !switchNetwork) return null;

    const currentChains = chains.filter((chain) => getChainIds(CURRENT_CHAINS).includes(chain.id));

    const nameChain = getChainNames(CURRENT_CHAINS)
        .find((name) => name === chain.name);

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
                            src={getLogoURI(chain.id) ?? defaultImage}
                            objectFit="contain"
                            layout="fixed"
                            width="20px"
                            height="20px"
                            priority
                        />
                    </div>
                    <span>{nameChain ?? "Unsupported"}</span>
                    <SelectorIcon className="relative right-[-4px] h-4 w-4" aria-hidden="true"/>
                </>
            </Select>
            {select.mounted && (
                <SelectPopover
                    state={select}
                    className="shadow-2 z-10 max-h-[280px] w-fit min-w-[13rem] overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2"
                >
                    <SelectGroup>
                        <SelectGroupLabel className="p-2 text-sm font-normal text-graySupport">
                            Chains
                        </SelectGroupLabel>
                        {currentChains.map((chain) => {
                            return (
                                <SelectItem
                                    key={chain.id}
                                    value={chain.id?.toString()}
                                    className="btn-state flex rounded-md scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-graySupport outline-none cursor-pointer aria-disabled:opacity-40 "
                                    onClick={() => switchNetwork?.(chain.id)}
                                >
                                    <Image
                                        src={getLogoURI(chain.id) ?? defaultImage}
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
