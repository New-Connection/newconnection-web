import Link from "next/link";
import { ArrowUpRightIcon } from "components";
import * as React from "react";

export const ViewAllButton = ({ label, pathname }) => {
    return (
        <div className={"flex justify-center"}>
            <Link
                href={{
                    pathname: pathname,
                }}
            >
                <button className="flex gap-2 btn-link mt-8">
                    {label}
                    <div className="mt-[0.125rem]">
                        <ArrowUpRightIcon />
                    </div>
                </button>
            </Link>
        </div>
    );
};
