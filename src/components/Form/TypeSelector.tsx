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
                <Select state={select} name={name} className={classNames('input-field', className)}>
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