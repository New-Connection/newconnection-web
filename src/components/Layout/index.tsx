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
            <Head>
            <title>New Connection</title>
            <meta
              name="description"
              content="New Connection is a multi-chain DAO protocol that allows you to create oranisation based on NFT-membership."
             />
            </Head>   
            <Header />
            <main className={classNames("flex-1", className)} {...props}>
                {children}
            </main>
            <CustomToast />
        </>
    );
}
