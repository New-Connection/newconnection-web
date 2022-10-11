import { useNetworkProvider } from "hooks";
import React from "react";
import { BeatLoader } from "react-spinners";
import { useAccount } from "wagmi";
import text from "./errors.json";

interface FallbackProps {
    isLoading?: boolean;
    isError: boolean;
    noData: boolean;
    type: "createDAO" | "createNFT";
    showLoader?: boolean;
    supressWalletConnection?: boolean;
}

export const Fallback = ({ isLoading, isError, noData, type, supressWalletConnection, showLoader }: FallbackProps) => {
    const { address: basicAccountData } = useAccount();

    const accountData = supressWalletConnection === true || basicAccountData !== undefined;

    const { unsupported } = useNetworkProvider();

    let errorMessage = "error";
    let emptyDataMessage = "";
    let defaultMessage: string | null = null;

    switch (type) {
        case "createDAO":
            errorMessage = text[type].error;
            emptyDataMessage = text[type].noData;
            defaultMessage = !accountData
                ? text[type].connectWallet
                : unsupported
                    ? text[type].networkNotSupported
                    : null;
            break;
        case "createNFT":
            errorMessage = text[type].error;
            emptyDataMessage = text[type].noData;
            defaultMessage = !accountData
                ? text[type].connectWallet
                : unsupported
                    ? text[type].networkNotSupported
                    : null;
            break;
    }

    const loader = showLoader ? (
        <span className="relative top-[2px]">
            <BeatLoader size={6} />
        </span>
    ) : null;

    return (
        <FallbackContainer>
            {defaultMessage ||
                (isLoading ? loader : isError ? <p>{errorMessage}</p> : noData ? <p>{emptyDataMessage}</p> : null)}
        </FallbackContainer>
    );
};

export function FallbackContainer({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="flex min-h-[3.5rem] w-full items-center justify-center break-all rounded border border-dashed border-[#626262] px-3 text-xs font-semibold">
            {children}
        </div>
    );
}
