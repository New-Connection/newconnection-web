import { Select, SelectArrow, SelectItem, SelectPopover, useSelectState } from "ariakit/select";

import { ISelectorProps } from "./types";
import { CHAINS, CHAINS_IMG } from "utils/blockchains";

function renderValue(chain: string) {
    const image = CHAINS_IMG[chain];
    return (
        <>
            <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />
            <div className="name">{chain}</div>
        </>
    );
}

export const BlockchainSelector = ({ name, label, className, handleChange }: ISelectorProps) => {
    const select = useSelectState({
        defaultValue: "Ethereum",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });
    return (
        <div className={className}>
            <label>
                <div className="input-label">{label}</div>
            </label>
            <div className="flex flex-col w-full ">
                <Select
                    state={select}
                    name={name}
                    className={
                        "input-field btn-state w-full flex cursor-pointer items-center whitespace-nowrap text-base justify-start gap-3"
                    }
                >
                    {renderValue(select.value)}
                    <SelectArrow />
                </Select>
                <SelectPopover
                    state={select}
                    className="shadow-1 z-10 max-h-[280px] w-fit min-w-full overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2"
                >
                    {CHAINS.map((chain) => (
                        <label key={chain.toUpperCase()} className="">
                            <SelectItem
                                key={chain}
                                value={chain}
                                className="btn-state h-12 border-none rounded-md cursor-pointer flex scroll-m-2 items-center gap-2 p-2"
                                setValueOnClick={handleChange}
                            >
                                {renderValue(chain)}
                            </SelectItem>
                        </label>
                    ))}
                </SelectPopover>
            </div>
        </div>
    );
};
