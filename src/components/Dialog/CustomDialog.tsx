import * as React from "react";
import { DisclosureState } from "ariakit";
import { Dialog } from "ariakit/dialog";
import classNames from "classnames";

import { DialogHeader } from "./Header";

interface NFTDetailDialogProps {
    dialog: DisclosureState;
    children?: React.ReactNode;
    className?: string;
}

export const CustomDialog = ({ dialog, className, children }: NFTDetailDialogProps) => {
    return (
        <Dialog state={dialog} className={classNames("dialog", className)}>
            <DialogHeader title="" dialog={dialog}></DialogHeader>
            <div className="h-full mt-10">
                <div className="p-3">{children}</div>
            </div>
        </Dialog>
    );
};
