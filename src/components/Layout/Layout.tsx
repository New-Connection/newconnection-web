import * as React from "react";
import classNames from "classnames";
import Header from "./Header";
import Footer from "./Footer";
import HeadInfo from "./HeadInfo";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
    isMinHeightTurnOff?: boolean;
}

export default function Layout({ children, className, isMinHeightTurnOff = false, ...props }: ILayoutProps) {
    return (
        <>
            <HeadInfo />
            <div className={isMinHeightTurnOff ? "relative h-[calc(100vh-135px)]" : "relative min-h-screen"}>
                <Header />
                {/* <NewFeaturesBanner /> */}
                {/* <SwitchNetworkBanner /> */}
                <main className={classNames("flex-1 pb-36 mt-[6.5em]", className)} {...props}>
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}
