import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "components/Layout/Layout";
import { Button, InputTextArea, RadioSelectorNFT } from "components/Form";
import { BackButton } from "components/Button/";
import { validateForm } from "utils/validate";
import { INFTVoting, IWhitelistRecord } from "types/forms";
import { handleChangeBasic, handleChangeBasicArray, handleTextChangeAddNewMember } from "utils/handlers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useSigner } from "wagmi";
import { useMoralisQuery } from "react-moralis";
import { handleContractError } from "utils/errors";
import { IAddMemberQuery } from "types/queryInterfaces";

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IWhitelistRecord>({
        governorAddress: "",
        governorUrl: "",
        votingTokenAddress: "",
        votingTokenName: "",
        chainId: 0,
        blockchainSelected: [],
        note: "",
    });
    const router = useRouter();
    const { data: signer_data } = useSigner();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();

    const { fetch: whitelistFetch } = useMoralisQuery(
        "Whitelist",
        (query) =>
            query.equalTo("governorAddress", formData.governorAddress) &&
            query.equalTo("votingTokenAddress", formData.votingTokenAddress),
        [formData.governorAddress, formData.votingTokenAddress, signer_data],
        {
            autoFetch: false,
        }
    );

    useEffect(() => {
        console.log("fetch query");
        const query = router.query as IAddMemberQuery;

        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasic(query.url, setFormData, "governorUrl");
        handleChangeBasic(query.chainId, setFormData, "chainId");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainSelected");

        setNFTs(JSON.parse(localStorage.getItem(query.url + " NFTs")));
    }, [router]);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["note", "votingTokenName"])) {
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