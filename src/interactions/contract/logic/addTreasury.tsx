import { IDAOPageForm } from "types";
import { DisclosureState } from "ariakit";
import { checkCorrectNetwork, deployTreasuryContract, transferTreasuryOwnership } from "interactions/contract";
import { Signer } from "ethers";
import { handleNext, handleReset } from "components";
import { handleContractError } from "utils";

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