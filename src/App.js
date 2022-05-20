import logo from "./logo.svg";
import "./App.css";
import { hooks, injected, metaMask } from "./utils/Metamask";
import { useEffect, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import {
    InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useEagerConnect, useInactiveListener } from "./utils/hooks";

function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
        return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
    } else if (error instanceof UserRejectedRequestErrorInjected) {
        return "Please authorize this website to access your Ethereum account.";
    } else {
        console.error(error);
        return "An unknown error occurred. Check the console for more details.";
    }
}

function App() {
    const [activatingConnector, setActivatingConnector] = useState();
    const [intialized, setInitialized] = useState(false);

    // MetaMask Connection
    const context = useWeb3React();
    const {
        account,
        activate,
        active,
        chainId,
        connector,
        deactivate,
        error,
        library: provider,
        setConnector,
    } = context;

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    const currentConnector = injected;
    const activating = currentConnector === activatingConnector;
    const connected = currentConnector === connector;
    const disabled = !!activatingConnector || connected || !!error;

    useEffect(() => {
        console.log("window.ethereum", window.ethereum);
        if (!!window.ethereum._state.initialized) {
            setInitialized(true);
        }
    }, [window.ethereum._state.initialized]);

    useEffect(() => {
        if (!!error) {
            const errorMessage = !!error && getErrorMessage(error);
            alert(errorMessage);
        }
    }, [error]);

    const handleMetaMaskConnection = async () => {
        const { ethereum } = window;
        if (!ethereum._state.initialized) {
            alert("Not intialized");
            window.location.reload(false);
        }
        await ethereum.request({ method: "eth_requestAccounts" });
        // activate(injected);
    };

    return (
        <div className="App">
            <p>
                window.ethereum._state.initialized:
                {String(intialized)}
            </p>
            {account ? (
                account
            ) : (
                <button onClick={handleMetaMaskConnection}>
                    Connect MetaMask
                </button>
            )}
        </div>
    );
}

export default App;
