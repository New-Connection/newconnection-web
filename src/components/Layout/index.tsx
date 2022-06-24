import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useDialogState } from "ariakit";
import Header from "./Header";
import CustomToast from "components/CustomToast";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
    noBanner?: boolean;
}

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
    const router = useRouter();
    const onboardDialog = useDialogState();

    return (
        <>
            <Header />
            <main className={classNames("flex-1", className)} {...props}>
                {children}
            </main>
            <CustomToast />
        </>
    );
}
