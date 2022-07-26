import * as React from "react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";

const BackButton = () => {
    return (
        <button className="flex items-center gap-1">
            <ArrowNarrowLeftIcon className="h-8 w-7" />
            Back
        </button>
    );
};

export default BackButton;
