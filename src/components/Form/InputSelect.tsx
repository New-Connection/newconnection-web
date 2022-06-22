import {
    Select,
    SelectArrow,
    SelectItem,
    SelectPopover,
    useSelectState,
} from "ariakit/select";

import Ethereum from "../../assets/chains/Ethereum.png"
import Polygon from "../../assets/chains/Polygon.png"
import Arbitrum from "../../assets/chains/Arbitrum.png"
import Binance from "../../assets/chains/Binance.png"
  
function renderValue(chain: string, index: number) {
    const image = images[index]
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

const images = [
    Ethereum,
    Polygon,
    Arbitrum,
    Binance
]
  
export function InputSelect() {
    const select = useSelectState({
        defaultValue: "Ethereum",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });
    return (
        <>
        <div className=''>
            <span className="input-label">Blockchain</span>
            <div className="flex flex-col">
                <Select state={select} className='input-field flex cursor-default items-center whitespace-nowrap px-4 text-base justify-start gap-3 hover:bg-sky-700'>
                    {renderValue(select.value, 0)}
                    <SelectArrow />
                </Select>
                <SelectPopover state={select} className="input-field flex flex-col overflow-auto overscroll-contain p-1 data-focus-visible focus-visible:ring focus: outline-none ">
                    {chains.map((chain, index) => (
                    <SelectItem key={chain} value={chain} className="input-field flex cursor-default scroll-m-2 items-center gap-2 p-1 hover:bg-sky-700">
                        {renderValue(chain, index)}
                    </SelectItem>
                    ))}
                </SelectPopover>
            </div>
        </div>
        </>
    );
}
  