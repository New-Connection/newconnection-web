import { IDAOPageForm } from "types/pages";
import { DisclosureState } from "ariakit";
import { transferTreasuryOwnership } from "interactions/contract/basic/writeTreasuryContract";
import { deployTreasuryContract } from "interactions/contract/basic/deploy";
import { Signer } from "ethers";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { handleContractError } from "utils/handlers/errorHandlers";
import { checkCorrectNetwork } from "../utils/functions";
import { saveMoralisInstance } from "../../database/functions";

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
        const renounceTx = await transferTreasuryOwnership(treasuryContract.address, DAO.governorAddress, signerData);
        handleNext(setCreateTreasuryStep);
        await renounceTx.wait();
        handleNext(setCreateTreasuryStep);
        handleNext(setCreateTreasuryStep);

        // handleChangeBasic(treasuryContract.address, setDAO, "treasuryAddress");
        return treasuryContract.address;
    } catch (error) {
        handleContractError(error, { dialog: treasuryDialog });
        handleReset(setCreateTreasuryStep);
        return;
    }
}

export async function addTreasureMoralis(DAOMoralisInstance, treasuryAddress: string, treasuryDialog: DisclosureState) {
    try {
        if (DAOMoralisInstance) {
            DAOMoralisInstance.set("treasuryAddress", treasuryAddress);
            await saveMoralisInstance(DAOMoralisInstance);
        }
    } catch (error) {
        handleContractError(error, { dialog: treasuryDialog });
        return;
    }
}
