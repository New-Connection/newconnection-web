import { IDAOPageForm } from "types/forms";
import { DisclosureState } from "ariakit";
import { transferTreasuryOwnership } from "contract-interactions/writeTreasuryContract";
import { deployTreasuryContract } from "contract-interactions/deploy";
import { Signer } from "ethers";
import { saveMoralisInstance } from "database/interactions";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { checkCorrectNetwork } from "./utils";
import { handleContractError } from "utils/errors";

export async function addTreasury(
    DAO: IDAOPageForm,
    treasuryDialog: DisclosureState,
    signerData,
    setCreateTreasuryStep,
    switchNetwork
) {
    if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
        return;
    }

    handleReset(setCreateTreasuryStep);
    treasuryDialog.toggle();

    let treasuryContract;
    try {
        treasuryContract = await deployTreasuryContract(signerData as Signer, {});
        handleNext(setCreateTreasuryStep);
        await treasuryContract.deployed();
        // console.log(
        //     `Deployment successful! Treasury Contract Address: ${treasuryContract.address}`
        // );
        handleNext(setCreateTreasuryStep);
        const renounceTx = await transferTreasuryOwnership(
            treasuryContract.address,
            DAO.governorAddress,
            signerData
        );
        handleNext(setCreateTreasuryStep);
        await renounceTx.wait();
        handleNext(setCreateTreasuryStep);
        handleNext(setCreateTreasuryStep);

        // handleChangeBasic(treasuryContract.address, setDAO, "treasuryAddress");
        return treasuryContract.address;
    } catch (error) {
        handleContractError(error, treasuryDialog);
        handleReset(setCreateTreasuryStep);
        return;
    }
}

export async function addTreasureMoralis(
    DAOMoralisInstance,
    treasuryAddress: string,
    treasuryDialog: DisclosureState
) {
    try {
        if (DAOMoralisInstance) {
            DAOMoralisInstance.set("treasuryAddress", treasuryAddress);
            await saveMoralisInstance(DAOMoralisInstance);
        }
    } catch (error) {
        handleContractError(error, treasuryDialog);
        return;
    }
}
