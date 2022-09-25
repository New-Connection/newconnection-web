import * as React from "react";
import classNames from "classnames";

import Header from "./Header";
import Footer from "./Footer";
import CustomToast from "components/Toast/CustomToast";
import HeadInfo from "./HeadInfo";
import SwitchNetworkBanner from "components/Banners/SwitchNetworksBanner";
// import NewFeaturesBanner from "components/Banners/NewFeaturesBanner";

interface ILayoutProps {
    children: React.ReactNode;
    className?: string;
    isMinHeightTurnOff?: boolean;
}

export default function Layout({
    children,
    className,
    isMinHeightTurnOff = false,
    ...props
}: ILayoutProps) {
    {
        /* pb-20 should be same as a footer height */
    }
    return (
        <>
            <HeadInfo />
            <div
                className={
                    isMinHeightTurnOff ? "relative h-[calc(100vh-135px)]" : "relative min-h-screen"
                }
            >
                <Header />
                {/* <NewFeaturesBanner /> */}
                <SwitchNetworkBanner />
                <main className={classNames("flex-1 pb-20 mt-[6.5em]", className)} {...props}>
                    {children}
                </main>
                <Footer />
                <CustomToast />
            </div>
        </>
    );
}
