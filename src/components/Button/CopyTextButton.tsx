import { formatAddress } from "utils";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useBoolean, useCopyToClipboard } from "usehooks-ts";

export const CopyTextButton = ({ copyText }) => {
    const { value: isCopied, setTrue, setFalse } = useBoolean();
    const [, copy] = useCopyToClipboard();

    const handleClick = () => {
        setTrue();
        copy(copyText).then();

        setTimeout(() => {
            setFalse();
        }, 500);
    };

    return (
        <div className={"flex text-base-content hover:text-base-content/50 hover:cursor-pointer"} onClick={handleClick}>
            {formatAddress(copyText)}
            {isCopied ? <CheckIcon className="h-6 w-5" /> : <ClipboardIcon className="h-6 w-5" />}
        </div>
    );
};
