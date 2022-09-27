import { providers } from "ethers";
import { getChain, getTokenSymbol } from "utils/blockchains";
import { useNetwork } from "wagmi";

export const useNetworkProvider = () => {
    const { chain } = useNetwork();

    let chainId = chain?.id ?? null;
    let name: string | null = chain?.name ?? null;
    const chainDetails = getChain(chainId)

    return {
        provider: chainDetails ? providers.getDefaultProvider() : null,
        network: name,
        chainId,
        nativeCurrency: chain?.nativeCurrency,
        unsupported: chain?.unsupported,
        tokenListId: getTokenSymbol(chainId ?? 0),
    };
};
