import { DisclosureState } from "ariakit";
import { errors } from "ethers";
import toast from "react-hot-toast";

export const handleContractError = (error: any, dialog?: DisclosureState) => {
    let message: string;
    if (error.code === errors.ACTION_REJECTED) {
        message = "User reject transaction";
    } else if (error.code === errors.INSUFFICIENT_FUNDS) {
        message = "Insufficient funds";
    } else if (error.error) {
        message = error.error?.message?.includes("reverted")
            ? error.error.message
            : error.error.data?.message?.includes("reverted")
                ? error.error.data.message
                : "Execution reverted";
    } else {
        message = "Something went wrong";
    }
    dialog ? dialog.hide() : 0;
    console.error(error);
    toast.error(message);
    return;
};