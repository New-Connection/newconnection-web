import * as React from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from "wagmi";
import { Dialog, DisclosureState } from "ariakit";

// OWN
import { useIsMounted } from "hooks";
import { formatAddress } from "utils/address";
import { DialogHeader } from "components/Dialog";

interface Props {
    dialog: DisclosureState;
}

export const WalletSelector = ({ dialog }: Props) => {
    const { address, connector, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address: address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();

    const isMounted = useIsMounted();

    const handleConnect = React.useCallback(
        async (x: Connector) => {
            await connect({ connector: x });
            dialog.toggle();
        },
        [connect, dialog]
    );

    const handlerDisconect = React.useCallback(async () => {
        await disconnect();
        dialog.toggle();
    }, [disconnect, dialog]);

    React.useEffect(() => {
        if (process.env.NEXT_PUBLIC_SAFE === "true" && typeof window !== "undefined") {
            connect({ connector: connectors[0] });
            console.log(connectors[0]);
        }
    }, [connect, connectors]);

    const formattedAddress = address && formatAddress(address);
    return (
        // Display Connected Wallet
        <Dialog state={dialog} className="dialog">
            {isMounted && isConnected ? (
                <>
                    <DialogHeader title="Account" dialog={dialog} />
                    <div className="mt-3 flex flex-col gap-2">
                        <p className="text-sm font-thin text-slate-500">
                            Connected to {connector?.name}
                        </p>
                        <p className="flex items-center gap-4 break-words text-slate-500">
                            {ensName ? `${ensName} (${formattedAddress})` : address}
                        </p>
                        <button
                            className="nav-button mt-5 hover:bg-[#23BD8F] hover:text-white"
                            onClick={() => handlerDisconect()}
                        >
                            Disconnect
                        </button>
                    </div>
                </>
            ) : (
                // Connect Wallet
                <>
                    <DialogHeader title="Connect Wallet" dialog={dialog} />
                    {/* choose profile: metamask, wallet connect  */}
                    <div className="mt-3 flex flex-col gap-2">
                        {connectors.map((x) => (
                            <button
                                key={x?.id}
                                onClick={() => handleConnect(x)}
                                className="rounded border p-2 text-slate-500"
                            >
                                {x?.name}
                                {isLoading && x.id === pendingConnector?.id && " (connecting)"}
                            </button>
                        ))}
                        {error && <div>{error.message}</div>}
                    </div>
                </>
            )}
        </Dialog>
    );
};
