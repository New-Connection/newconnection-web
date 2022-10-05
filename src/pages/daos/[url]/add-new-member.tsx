import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "components/Layout/Layout";
import { Button, InputTextArea, RadioSelectorNFT } from "components/Form";
import { BackButton } from "components/Button/";
import { validateForm } from "utils/validate";
import { IAddNewMember, INFTVoting } from "types/forms";
import { handleChangeBasic, handleChangeBasicArray, handleTextChangeAddNewMember } from "utils/handlers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useSigner } from "wagmi";
import { useMoralisQuery } from "react-moralis";
import { IAddMemberQuery } from "types/queryInterfaces";
import { handleContractError } from "utils/errors";

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        daoAddress: "",
        votingTokenAddress: "",
        votingTokenName: "",
        blockchainSelected: [],
        note: "",
    });
    const router = useRouter();
    const { data: signer_data } = useSigner();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();

    const { fetch: whitelistFetch } = useMoralisQuery(
        "Whitelist",
        (query) =>
            query.equalTo("daoAddress", formData.daoAddress) &&
            query.equalTo("votingTokenAddress", formData.votingTokenAddress),
        [formData.daoAddress, formData.votingTokenAddress, signer_data],
        {
            autoFetch: false,
        }
    );
    console.log(formData);
    useEffect(() => {
        console.log("fetch query");
        const query = router.query as IAddMemberQuery;

        handleChangeBasic(query.governorAddress, setFormData, "daoAddress");
        handleChangeBasic(query.governorUrl, setFormData, "governorUrl");
        handleChangeBasic(query.chainId, setFormData, "chainId");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainSelected");

        const savedNfts = JSON.parse(localStorage.getItem(query.governorUrl + " NFTs"));
        if (savedNfts) {
            setNFTs(savedNfts);
        }
    }, [router]);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["note"])) {
            return;
        }

        const signerAddress = await signer_data.getAddress();

        if (!(await checkRequestAvailability(signerAddress))) {
            toast.error(`You already send request for token: ${formData.votingTokenName}`);
            return;
        }

        try {
            const moralisInstance = getMoralisInstance(MoralisClassEnum.WHITELIST);
            setFieldsIntoMoralisInstance(moralisInstance, formData);
            moralisInstance.set("walletAddress", signerAddress);

            await saveMoralisInstance(moralisInstance);
            toast.success("Your request was saved", {
                duration: 4000,
                className: "bg-red",
                position: "top-center",
            });
            form.reset();
        } catch (error) {
            handleContractError(error);
            return;
        }

        router.back();
    }

    const checkRequestAvailability = async (walletAddress: string) => {
        let available = false;
        await whitelistFetch({
            onSuccess: (results) => {
                if (results.filter((result) => result.get("walletAddress") === walletAddress).length === 0) {
                    console.log("available=true");
                    available = true;
                }
            },
            onError: (e) => {
                console.log("error" + e);
            },
        });
        return available;
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={sendSignatureRequest}>
                        <BackButton />
                        <div className={"flex flex-col md:flex-row"}>
                            <h1 className="text-highlighter">Become a member of</h1>
                            <h1 className="text-highlighter text-purple capitalize md:ml-4">{formData.governorUrl}</h1>
                        </div>
                        <label>
                            <div className="input-label">Choose voting token</div>
                        </label>
                        {NFTs && (
                            <RadioSelectorNFT
                                name={"tokenAddress"}
                                chainId={+formData?.chainId}
                                className={"nft-cards-grid"}
                                handleChange={(event, votingNFT) => {
                                    handleChangeBasic(votingNFT.title, setFormData, "votingTokenName");
                                    handleChangeBasic(votingNFT.tokenAddress, setFormData, "votingTokenAddress");
                                }}
                                values={NFTs}
                            />
                        )}
                        <InputTextArea
                            name="note"
                            label="Note (optional)"
                            placeholder="You can add note and type something for DAO’s admin"
                            maxLength={2000}
                            handleChange={(event) => handleTextChangeAddNewMember(event, setFormData)}
                        />
                        <Button className="mt-5 w-full">Send a request</Button>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default AddNewMember;

//http://localhost:3000/daos/opti-dao/add-new-member?
// governorAddress=0xC2Ce0B8Ada12B4d71A7EF5E769ce75C373D1760E&
// governorUrl=opti-dao&
// daoName=opti+dao&
// blockchains=Optimism+Goerli&
// tokenAddress=
// 0xACa4227f4403dcFD2f79C58c86090084c832E614&tokenAddress=0x652dCce7C7592cF3A3067c0941525b3c4bF4A586
