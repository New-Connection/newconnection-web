import { getTreasuryBalance } from "contract-interactions";
import { IDAOPageForm } from "types/forms";

export async function fetchTreasuryBalance(DAO: IDAOPageForm) {
    const balance = DAO.treasuryAddress ? await getTreasuryBalance(DAO.treasuryAddress, DAO.chainId) : 0;
    return balance.toString().slice(0, 7);
}
