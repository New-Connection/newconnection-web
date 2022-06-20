import * as React from 'react';
import { useConnect } from 'wagmi'

// Choose connection which you set up in WalletConfig
export function WalletProfile() {
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect()

  return (
    <div className="mt-3 flex flex-col gap-2">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="rounded border p-2"
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
      {error && <div>{error.message}</div>}
    </div>
  )
}