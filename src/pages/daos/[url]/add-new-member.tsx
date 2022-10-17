import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout, { BackButton, Button, InputTextArea, RadioSelectorNFT } from "components";
import { handleChangeBasic, handleContractError, handleTextChangeAddNewMember, validateForm } from "utils";
import { IAddMemberQuery, IDAOPageForm, INFTVoting, IWhitelistRecord } from "types";
import { saveWhitelistRequest, whitelistRequestExists, } from "interactions/database";
import { useAccount, useSigner } from "wagmi";

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
    const { data: signerData } = useSigner();
    const { address: signerAddress } = useAccount();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();

    useEffect(() => {
        console.log("fetch query");
        const query = router.query as IAddMemberQuery;

        const DAO: IDAOPageForm = JSON.parse(localStorage.getItem(query.url));
        if (DAO) {
            handleChangeBasic(DAO.governorAddress, setFormData, "governorAddress");
            handleChangeBasic(DAO.url, setFormData, "governorUrl");
            handleChangeBasic(DAO.chainId, setFormData, "chainId");
            handleChangeBasic(DAO.blockchain, setFormData, "blockchainSelected");
        }

        setNFTs(JSON.parse(localStorage.getItem(query.url + " NFTs")));
    }, [router]);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (!signerData) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["note", "votingTokenName"])) {
            return;
        }

        if (await whitelistRequestExists(formData.governorUrl, signerAddress, formData.votingTokenAddress)) {
            toast.error(`You already send request for token: ${formData.votingTokenName}`);
            return;
        }

        try {
            await saveWhitelistRequest({ ...formData, walletAddress: signerAddress });
            toast.success("Your request was saved", {
                duration: 4000,
                className: "bg-red",
                position: "top-center",
            });
            form.reset();
        } catch (error) {
            handleContractError(error, { hideToast: true });
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={sendSignatureRequest}>
                        <BackButton />
                        <div className={"flex flex-col md:flex-row"}>
                            <h1 className="text-highlighter">Become a member of</h1>
                            <h1 className="text-highlighter text-primary capitalize md:ml-4">{formData.governorUrl}</h1>
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
