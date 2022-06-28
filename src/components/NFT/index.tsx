import React, { useState } from "react";
import { useDialogState } from "ariakit";

import {
    InputAmount,
    InputText,
    SubmitButton,
    BlockchainSelector,
    TypeSelector,
    DragAndDropImage,
} from "../Form";
import { hexValue } from "ethers/lib/utils";
import { provider } from "components/Web3/";

import CreateNFTContract from "queries/useCreateNFTContract";
import { Signer, ethers } from "ethers";
import { useSigner } from "wagmi";

// TODO:
// Check ipfs approver

// Check contract is upload to blockchain
// Account(useAccount, useProvider) from wagmi for approve
//

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
    });

    const { data: signer, isError, isLoading } = useSigner();
    const bytecodeERC20 =
        "0x608060405234801561001057600080fd5b506040516103bc3803806103bc83398101604081905261002f9161007c565b60405181815233906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a333600090815260208190526040902055610094565b60006020828403121561008d578081fd5b5051919050565b610319806100a36000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063313ce5671461005157806370a082311461006557806395d89b411461009c578063a9059cbb146100c5575b600080fd5b604051601281526020015b60405180910390f35b61008e610073366004610201565b6001600160a01b031660009081526020819052604090205490565b60405190815260200161005c565b604080518082018252600781526626bcaa37b5b2b760c91b6020820152905161005c919061024b565b6100d86100d3366004610222565b6100e8565b604051901515815260200161005c565b3360009081526020819052604081205482111561014b5760405162461bcd60e51b815260206004820152601a60248201527f696e73756666696369656e7420746f6b656e2062616c616e6365000000000000604482015260640160405180910390fd5b336000908152602081905260408120805484929061016a9084906102b6565b90915550506001600160a01b0383166000908152602081905260408120805484929061019790849061029e565b90915550506040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a350600192915050565b80356001600160a01b03811681146101fc57600080fd5b919050565b600060208284031215610212578081fd5b61021b826101e5565b9392505050565b60008060408385031215610234578081fd5b61023d836101e5565b946020939093013593505050565b6000602080835283518082850152825b818110156102775785810183015185820160400152820161025b565b818111156102885783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156102b1576102b16102cd565b500190565b6000828210156102c8576102c86102cd565b500390565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220d80384ce584e101c5b92e4ee9b7871262285070dbcd2d71f99601f0f4fcecd2364736f6c63430008040033";
    const [createData, setCreateData] = useState<ICreateNFTElements | null>(null);

    // const isApproved = false;

    const confirmDialog = useDialogState();
    // function for set values into formData
    const handleChange = (value: string | boolean, type: keyof typeof formData) => {
        setFormData((prev) => ({ ...prev, [type]: value }));
    };

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

        console.log(formData);
        // if (isApproved) {
        //     confirmDialog.show();
        //     form.reset();
        // }
        // DIDN'T
        // const singer_right = await signer?.connect()
        // const factory = CreateNFTContract(bytecode=bytecodeERC20, singer_right})
        // const contract = await factory.deploy({name}, {description}, {count})
        // await contract.deployed()
        // console.log(`Deployment successful! Contract Address: ${contract.address}`)
    }

    return (
        <section className="relative w-full">
            <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
                <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D]">Create NFT</h1>
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
                    <InputAmount label={"Price"} placeholder="0 (Max. 0)" name="price" isRequired />
                    <BlockchainSelector
                        label={"Type of blockchain"}
                        name={"blockchain"}
                        className="w-full flex cursor-default items-center whitespace-nowrap text-base justify-start gap-3 hover:bg-sky-700"
                    />
                </div>
                <div className="flex justify-between">
                    <TypeSelector
                        label={"Role"}
                        name="role"
                        className="flex cursor-default items-center whitespace-nowrap px-4 text-base justify-start gap-3 hover:bg-sky-700"
                    />
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
                <SubmitButton className="mt-5">Create Contract</SubmitButton>
            </form>
        </section>
    );
}
