import { formatAddress } from "utils/address";
import { CheckIcon, ClipboardCopyIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

export const CopyTextButton = ({ copyText }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(copyText).then().catch();

        setTimeout(() => {
            setIsCopied(false);
        }, 500);
    };

    return (
        <div
            className={"flex text-lightGray hover:text-gray5 hover:cursor-pointer"}
            onClick={handleClick}
        >
            {formatAddress(copyText)}
            {isCopied ? (
                <CheckIcon className="h-6 w-5" />
            ) : (
                <ClipboardCopyIcon className="h-6 w-5" />
            )}
        </div>
    );
};
