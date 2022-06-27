import {
    Select,
    SelectArrow,
    SelectItem,
    SelectPopover,
    useSelectState,
} from "ariakit/select";
  
import classNames from 'classnames';
import { Selector } from './types';


const types = [
    "Member",
    "Design",
    "VC",
];

  
export const TypeSelector = ({name, label, className, handlerChange, ...props}: Selector) => {
    const select = useSelectState({
        defaultValue: "Member",
        setValueOnMove: true,
        sameWidth: true,
        gutter: 4,
    });
    return (
        <>
        <div>
            <span className="input-label">{label}</span>
            <div className="flex flex-col">
                <Select state={select} name={name} className={classNames('input-field text-slate-500 hover:bg-[#23BD8F] hover:text-gray-50', className)}>
                    <div className="type ">{select.value}</div>
                    <SelectArrow />
                </Select>
                <SelectPopover state={select} className="input-field bg-white flex flex-col overflow-auto overscroll-contain p-1 data-focus-visible focus-visible:ring focus:outline-none text-slate-500">
                    {types.map((type) => (
                    <SelectItem key={type} value={type} className="input-field border-0 flex cursor-default scroll-m-2 items-center gap-2 p-1 hover:bg-[#23BD8F] hover:text-gray-50">
                        <div className="type">{type}</div>
                    </SelectItem>
                    ))}
                </SelectPopover>
            </div>
        </div>
        </>
    );
}