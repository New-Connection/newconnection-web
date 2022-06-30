import { ethers } from "ethers";
import { networkDetails } from "utils/constants";
import { useNetwork } from "wagmi";

export type Provider = ethers.providers.BaseProvider;

export const useNetworkProvider = () => {
    const { chain } = useNetwork();

    let chainId = chain?.id ?? null;
    let name: string | null = chain?.name ?? null;
    const chainDetails = chainId && networkDetails[chainId];

    return {
        provider: chainDetails ? chainDetails.chainProviders : null,
        network: name,
        chainId,
        nativeCurrency: chain?.nativeCurrency,
        unsupported: chain?.unsupported,
        tokenListId: networkDetails[chainId ?? 0]?.tokenListId,
    };
};
