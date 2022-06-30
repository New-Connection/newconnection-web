import React, { useState } from "react";
import { useDialogState } from "ariakit";
import { GovernorNFTBytecode } from "abis/GovernanceNFT";
import {
    InputAmount,
    InputText,
    SubmitButton,
    BlockchainSelector,
    TypeSelector,
    DragAndDropImage,
} from "../Form";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { CreateNFTContract } from "queries/useCreateNFTContract";
import { Signer, BigNumber, Contract, ethers } from "ethers";
import { useSigner } from "wagmi";

import { GovernorNFTABI } from "abis/GovernanceNFT";
// TODO:
// Check ipfs approver

interface ICreateNFTElements {
    name: { value: string };
    description: { value: string };
    image: { value: string };
    count: { value: number };
    price: { value: number };
    blockchain: { value: "Ethereum" | "Polygon" | "Arbitrum" | "Binance" };
    role: { value: "Member" | "Design" | "VC" };
    collectionName: { value: string };
    twitterURL: { value: string };
    discordURL: { value: string };
    contractAddress: { value: string };
}

export default function NFTSection() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        blockchain: "Ethereum",
        role: "Member",
        collectionName: "",
        twitterURL: "",
        discordURL: "",
        contractAddress: "",
    });

    const { data: signer_data } = useSigner();

    const [createData, setCreateData] = useState<ICreateNFTElements | null>(null);

    const confirmDialog = useDialogState();
    // function for set values into formData
    const handleChange = (value: string | boolean, type: keyof typeof formData) => {
        setFormData((prev) => ({ ...prev, [type]: value }));
    };

    async function mintClick() {
        console.log(formData.contractAddress);
        const erc20_rw = new ethers.Contract(
            formData.contractAddress,
            GovernorNFTABI,
            signer_data as Signer
        );
        console.log(erc20_rw);
        const max = await erc20_rw.reserve(1);
        console.log(max);

        toast.success(`DONE✅ successful mint!`);
        const supply = await erc20_rw.totalSupply();
        console.log(supply);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement & ICreateNFTElements;
        const name = form.name.value;
        const image = form.image?.value;
        const description = form.description.value;
        const role = form.role.value;
        const collectionName = form.collectionName?.value;
        const twitterURL = form.twitterURL?.value;
        const discordURL = form.discordURL?.value;
        const count = form.count.value;
        const blockchain = form.blockchain.value;
        const price = form.price.value;
        // confirmDialog.show();
        const toastId = toast.loading("Loading on ETH Blockchain");
        const factory = CreateNFTContract(GovernorNFTBytecode, signer_data as Signer);
        const contract = await factory.deploy(name, description, BigNumber.from(count));
        await contract.deployed();
        toast.dismiss(toastId);
        toast.success(`Deployment successful! Contract Address`);
        console.log(`Deployment successful! Contract Address: ${contract.address}`);
        handleChange(contract.address, "contractAddress");
        console.log("Contract address from FormData", formData.contractAddress);
    }

    return (
        <>
            <section className="relative w-full">
                <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
                    <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D]">
                        Create NFT
                    </h1>
                    <InputText label="Name" name="name" placeholder="NFT Name" isRequired />
                    <InputText
                        label="Description"
                        className="pt-1.5 pb-14"
                        name="description"
                        placeholder="A short descption about NFT collection(Max. 250 words)"
                        isRequired
                    />
                    <DragAndDropImage label="Image" name="image" />
                    <div className="flex justify-between">
                        <InputAmount label={"Number of NFT"} name="count" isRequired />
                        <InputAmount
                            label={"Price"}
                            placeholder="0 (Max. 0)"
                            name="price"
                            isRequired
                        />
                        <BlockchainSelector label={"Type of blockchain"} name={"blockchain"} />
                    </div>
                    <div className="flex justify-between">
                        <TypeSelector label={"Role"} name="role" />
                        <InputText
                            label={"Collection (optional)"}
                            name="collectionName"
                            placeholder="Collection name"
                            isRequired={false}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <InputText
                            label={"Twitter (optional)"}
                            name="twitterURL"
                            placeholder="Enter your twitter handler"
                            isRequired={false}
                        />
                        <InputText
                            label={"Discord (optional)"}
                            name="discordURL"
                            placeholder="Enter your discord server"
                            isRequired={false}
                        />
                    </div>
                    <SubmitButton className="mt-5">
                        {/* <BeatLoader size={6} color="white" /> */}
                        Create Contract
                    </SubmitButton>
                </form>
            </section>
            <button onClick={mintClick}>Mint Button</button>
        </>
    );
}
