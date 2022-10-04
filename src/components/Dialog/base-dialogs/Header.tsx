import { DialogHeading } from "ariakit";
import { XIcon } from "@heroicons/react/solid";

export const DialogHeader = ({ title, dialog }) => {
    return (
        <DialogHeading className="text-base font-medium leading-6 text-neutral-700">
            <span>{title}</span>
            <button
                className="absolute top-[18px] right-4 rounded hover:bg-neutral-200"
                onClick={dialog.toggle}
            >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" />
            </button>
        </DialogHeading>
    );
};
