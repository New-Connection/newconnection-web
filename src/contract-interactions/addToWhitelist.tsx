import { useContractWrite, useProvider, usePrepareContractWrite, useContractRead } from "wagmi";
import { GOVERNANCE_NFT_ABI } from "abis/";
import { ethers, Signer } from "ethers";

interface IAddToWhitelist {
    addressNFT?: string;
    walletAddress?: string;
    signer?: Signer;
}

export const AddToWhitelist = ({ addressNFT, walletAddress, signer }: IAddToWhitelist) => {
    walletAddress = "0x533336d35cA55DC1e0d7cB3CB44187E138664280";

    // const { data, isError, isLoading } = useContractRead({
    //     addressOrName: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    //     contractInterface: ["function getHunger()"],
    //     functionName: "getHunger",
    //     enabled: walletAddress,
    //     args: [
    //         walletAddress,
    //         {
    //             gasLimit
    //         }
    //     ]
    // });

    // const { data, write } = useContractWrite(config);
    // // console.log(data);
    // if (!write) return null;
    // console.log(data);
    // const erc20_rw = new ethers.Contract(
    //     "0xdaA85c03fE04c88e9eb8d61249267F96a83197e5",
    //     GOVERNANCE_NFT_ABI,
    //     signer
    // );
    // const tx = await erc20_rw.;

    // const { data, isLoading, isSuccess, write } = useContractWrite(config);

    // const { data, isError, isLoading } = useContractRead({
    //     addressOrName: "0xdaA85c03fE04c88e9eb8d61249267F96a83197e5",
    //     contractInterface: ["function totalSupply()"],
    //     functionName: "totalSupply",
    // });
    // console.log(data);
    return (
        <div>
            {/* {data ? <button>{data}</button> : <p>Nothing</p>} */}
            <p>LFG</p>
            {/* {isError && <div>Error: {error!.message}</div>} */}
        </div>
    );
};
