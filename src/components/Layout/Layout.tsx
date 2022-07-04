import * as React from "react";
import classNames from "classnames";

import Header from "./Header";
import CustomToast from "../Toast/CustomToast";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
    return (
        <>
            <CustomToast />
            <Header />
            <main className={classNames("flex-1", className)} {...props}>
                {children}
            </main>
        </>
    );
}
