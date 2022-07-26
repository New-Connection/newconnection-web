import * as React from "react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";

interface IBackButton {
    title?: string;
    linkToBack: string;
}

const BackButton = ({ title = "Back", linkToBack }: IBackButton) => {
    return (
        <Link href={linkToBack}>
            <button className="flex items-center gap-1">
                <ArrowNarrowLeftIcon className="h-8 w-7" />
                {title}
            </button>
        </Link>
    );
};

export default BackButton;
