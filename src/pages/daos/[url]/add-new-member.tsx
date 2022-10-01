import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "components/Layout/Layout";
import { Button, InputTextArea, RadioSelectorMulti } from "components/Form";
import { BackButton } from "components/Button/";
import { validateForm } from "utils/validate";
import { IAddNewMember } from "types/forms";
import {
    handleTextChangeAddNewMember,
    handleChangeBasicArray,
    handleChangeBasic,
    handleAddArray,
} from "utils/handlers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useSigner } from "wagmi";
import { useMoralisQuery } from "react-moralis";
import { IAddMemberQuery } from "types/queryInterfaces";

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        daoName: "",
        daoAddress: "",
        tokenAddress: [],
        tokenNames: [],
        votingTokenAddress: "",
        votingTokenName: "",
        blockchainSelected: [],
        note: "",
    });
    const { data: signer_data } = useSigner();
    const router = useRouter();

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

    useEffect(() => {
        console.log("fetch query");
        const query = router.query as IAddMemberQuery;

        handleChangeBasic(query.governorAddress, setFormData, "daoAddress");
        handleChangeBasic(query.daoName, setFormData, "daoName");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainSelected");
        handleAddArray(query.tokenAddress, setFormData, "tokenAddress");

        const saved = localStorage.getItem(query.daoName + " NFTs");
        const initialValue = JSON.parse(saved);
        const tokenNames = [];
        console.log("fetch localStorage");
        initialValue.map((object) => {
            tokenNames.push(object.title);
        });
        handleAddArray(tokenNames, setFormData, "tokenNames");
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
            toast.error("Couldn't save your . Please try again");
            return;
        }

        router.back();
    }

    const checkRequestAvailability = async (walletAddress: string) => {
        let available = false;
        await whitelistFetch({
            onSuccess: (results) => {
                if (
                    results.filter((result) => result.get("walletAddress") === walletAddress)
                        .length === 0
                ) {
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
                    <BackButton />
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={sendSignatureRequest}
                    >
                        <h1 className="text-highlighter">Become a member of</h1>
                        <h1 className="text-highlighter mt-0 text-purple">{formData.daoName}</h1>
                        <label>
                            <div className="input-label">Choose voting token</div>
                        </label>
                        {Array.isArray(formData.tokenAddress) ? (
                            <RadioSelectorMulti
                                name="votingTokenAddress"
                                labels={[...formData.tokenNames]}
                                handleChange={(event) => {
                                    // setting tokenName
                                    const currentTokenName =
                                        event.currentTarget.nextSibling.textContent.slice(1);
                                    handleChangeBasic(
                                        currentTokenName,
                                        setFormData,
                                        "votingTokenName"
                                    );

                                    // setting tokenAddress
                                    handleTextChangeAddNewMember(event, setFormData);
                                }}
                                values={formData.tokenAddress}
                            />
                        ) : (
                            <></>
                        )}
                        <InputTextArea
                            name="note"
                            label="Note (optional)"
                            placeholder="You can add note and type something for DAO’s admin"
                            maxLength={2000}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <Button className="mt-5 w-full">Send a request</Button>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default AddNewMember;
