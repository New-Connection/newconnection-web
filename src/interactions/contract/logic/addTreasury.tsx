import { IDAOPageForm } from "types";
import { DisclosureState } from "ariakit";
import { checkCorrectNetwork, deployTreasuryContract, transferTreasuryOwnership } from "interactions/contract";
import { Signer } from "ethers";
import { handleContractError } from "utils";

export async function addTreasury(
    DAO: IDAOPageForm,
    treasuryDialog: DisclosureState,
    signerData,
    incrementCreateTreasuryStep,
    resetCreateTreasuryStep,
    switchNetwork
) {
    if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
        return;
    }

    resetCreateTreasuryStep();
    treasuryDialog.toggle();

    let treasuryContract;
    try {
        treasuryContract = await deployTreasuryContract(signerData as Signer, {});
        incrementCreateTreasuryStep();
        await treasuryContract.deployed();
        // console.log(
        //     `Deployment successful! Treasury Contract Address: ${treasuryContract.address}`
        // );
        incrementCreateTreasuryStep();
        const renounceTx = await transferTreasuryOwnership(treasuryContract.address, DAO.governorAddress, signerData);
        incrementCreateTreasuryStep();
        await renounceTx.wait();
        incrementCreateTreasuryStep();
        incrementCreateTreasuryStep();

        // handleChangeBasic(treasuryContract.address, setDAO, "treasuryAddress");
        return treasuryContract.address;
    } catch (error) {
        handleContractError(error, { dialog: treasuryDialog });
        resetCreateTreasuryStep();
        return;
    }
}
