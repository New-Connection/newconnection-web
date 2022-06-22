import {
    Select,
    SelectArrow,
    SelectItem,
    SelectPopover,
    useSelectState,
} from "ariakit/select";
  
const types = [
    "Charity",
    "Venture",
    "Crypto",
];

  
export function TypeSelector() {
    const select = useSelectState({
        defaultValue: "Venture",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });
    return (
        <>
        <div className=''>
            <span className="input-label">Type of NFT</span>
            <div className="flex flex-col">
                <Select state={select} className='input-field flex cursor-default items-center whitespace-nowrap px-4 text-base justify-start gap-3 hover:bg-sky-700'>
                    <div className="type">{select.value}</div>
                    <SelectArrow />
                </Select>
                <SelectPopover state={select} className="input-field flex flex-col overflow-auto overscroll-contain p-1 data-focus-visible focus-visible:ring focus: outline-none ">
                    {types.map((type) => (
                    <SelectItem key={type} value={type} className="input-field flex cursor-default scroll-m-2 items-center gap-2 p-1 hover:bg-sky-700">
                        <div className="type">{type}</div>
                    </SelectItem>
                    ))}
                </SelectPopover>
            </div>
        </div>
        </>
    );
}