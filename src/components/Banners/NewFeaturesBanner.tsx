import * as React from "react";
import { useDialogState } from "ariakit";
import { TextDialog } from "components/Dialog";

const NewFeaturesBanner = () => {
    const textDialog = useDialogState();
    const textData = {
        "0.1": [
            "You can create your DAO on three blockchains (Goerli, Avax Fuji, Polygon Mumbai)",
            "Create NFT(ERC721) Membership for DAO",
            "Add people to the whitelist",
            "Create proposals for DAO voting",
            "Voting with your NFT Membership",
        ],
    };
    const firstVersion = textData["0.1"];

    return (
        <>
            <div className="mt-[6.5em] reverse-gradient-btn-color text-center py-3 lg:h-12 h-17 text-white">
                New Connection v0.1 is a live!{" "}
                <button
                    className="hover:underline"
                    onClick={() => {
                        textDialog.toggle();
                    }}
                >
                    Click here to check the features included in the first version.
                </button>
            </div>
            <TextDialog dialog={textDialog} title="Version 0.1">
                <ul className="list-disc py-4 pl-4 space-y-4 text-graySupport">
                    {firstVersion.map((element) => (
                        <li key={element}>{element}</li>
                    ))}
                </ul>
            </TextDialog>
        </>
    );
};

export default NewFeaturesBanner;
