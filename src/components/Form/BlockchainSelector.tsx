import {
    Select,
    SelectArrow,
    SelectItem,
    SelectPopover,
    useSelectState,
} from "ariakit/select";

import classNames from 'classnames';
import { Selector } from './types';

import Ethereum from "../../assets/chains/Ethereum.png"
import Polygon from "../../assets/chains/Polygon.png"
import Arbitrum from "../../assets/chains/Arbitrum.png"
import Binance from "../../assets/chains/Binance.png"
  
function renderValue(chain: string) {
    const image = images[chain]
    return (
        <>
        <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />
        <div className="name">{chain}</div>
        </>
    );
}
  
const chains = [
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Binance",
];

const images = {
    "Ethereum" : Ethereum,
    "Polygon": Polygon,
    "Arbitrum": Arbitrum,
    "Binance": Binance
}
  
export const BlockchainSelector = ({name, label, className, handlerChange, ...props}:Selector) => {
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
            <div className="flex flex-col dark:w-full">
                <Select 
                state={select} 
                name={name} 
                className={classNames('input-field', className)}>
                    {renderValue(select.value)}
                    <SelectArrow />
                </Select>
                <SelectPopover state={select} className="input-field flex flex-col overflow-auto overscroll-contain p-1 data-focus-visible focus-visible:ring focus: outline-none ">
                    {chains.map((chain) => (
                    <SelectItem key={chain} value={chain} className="input-field flex cursor-default scroll-m-2 items-center gap-2 p-1 hover:bg-sky-700">
                        {renderValue(chain)}
                    </SelectItem>
                    ))}
                </SelectPopover>
            </div>
        </div>
        </>
    );
}
  