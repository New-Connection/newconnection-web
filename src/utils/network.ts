import { chains, networkDetails } from "./constants";

export function chainDetails(chainId: unknown) {
    if (typeof chainId !== "string") return {};

    const id = Number(chainId);

    // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
    if (Number.isNaN(id)) {
        const chain = chains.find((c) => c.name?.toLowerCase() === chainId.toLowerCase());
        const network = chain && networkDetails[chain?.id];
        return { network, chain };
    } else {
        const network = networkDetails[id];
        //console.log(network);
        const chain = chains.find((c) => c.id === id);
        return { network, chain };
    }
}

export function getChainScanner(chainId: number | undefined, address: string | undefined) {
    if (!chainId || !address) {
        return "";
    }
    switch (chainId) {
        case 5:
            return "https://goerli.etherscan.io/address/" + address;
    }
}
