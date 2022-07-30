import * as React from "react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

const BackButton = () => {
    const router = useRouter();

    return (
        <button type="button" className="flex items-center gap-1" onClick={router.back}>
            <ArrowNarrowLeftIcon className="h-8 w-7" />
            Back
        </button>
    );
};

export default BackButton;
