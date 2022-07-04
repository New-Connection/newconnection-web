import { Select, SelectArrow, SelectItem, SelectPopover, useSelectState } from "ariakit/select";

import classNames from "classnames";
import { Selector } from "./types";

import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";

function renderValue(chain: string) {
    const image = images[chain];
    return (
        <>
            <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />
            <div className="name">{chain}</div>
        </>
    );
}

const chains = ["Ethereum", "Polygon", "Arbitrum", "Binance"];

const images = {
    Ethereum: Ethereum,
    Polygon: Polygon,
    Arbitrum: Arbitrum,
    Binance: Binance,
};

export const BlockchainSelector = ({
    name,
    label,
    className,
    handlerChange,
    ...props
}: Selector) => {
    const select = useSelectState({
        defaultValue: "Ethereum",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });
    return (
        <>
            <div>
                <span className="input-label">{label}</span>
                <div className="flex flex-col w-full">
                    <Select
                        state={select}
                        name={name}
                        className={classNames(
                            "input-field text-slate-500 hover:bg-[#23BD8F] hover:text-gray-50 w-full flex cursor-default items-center whitespace-nowrap text-base justify-start gap-3",
                            className
                        )}
                    >
                        {renderValue(select.value)}
                        <SelectArrow />
                    </Select>
                    <SelectPopover
                        state={select}
                        className="input-field bg-white text-slate-500 flex flex-col overflow-auto overscroll-contain p-1 data-focus-visible focus-visible:ring focus:outline-none "
                    >
                        {chains.map((chain) => (
                            <label key={chain.toUpperCase()} className="input-label">
                                <SelectItem
                                    key={chain}
                                    value={chain}
                                    className="input-field border-0 flex cursor-default scroll-m-2 items-center gap-2 p-1 hover:bg-[#23BD8F] hover:text-gray-50"
                                    setValueOnClick={handlerChange}
                                >
                                    {renderValue(chain)}
                                </SelectItem>
                            </label>
                        ))}
                    </SelectPopover>
                </div>
            </div>
        </>
    );
};
