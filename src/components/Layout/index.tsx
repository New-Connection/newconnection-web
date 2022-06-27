import * as React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useDialogState } from "ariakit";
import Header from "./Header";
import CustomToast from "components/CustomToast";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
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
