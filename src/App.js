import "./App.css";
import { injected } from "./utils/Metamask";
import { useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";

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
    const context = useWeb3React();
    const { account, error, activate } = context;

    useEffect(() => {
        console.log("window.ethereum", window?.ethereum);
    }, []);

    useEffect(() => {
        if (!!error) {
            const errorMessage = !!error && getErrorMessage(error);
            alert(errorMessage);
        }
    }, [error]);

    const handleMetaMaskConnection = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            alert("No Ethereum wallet found");
            return;
        }
        console.log("etherum", ethereum);
        if (!ethereum._state.initialized) {
            alert("Not intialized");
            window.location.reload(false);
            return;
        }
        console.log("after ifffff");
        // await ethereum.request({ method: "eth_requestAccounts" });
        activate(injected);
    };

    return (
        <div className="App">
            <p>Check console for window.ethereum._state.initialized</p>
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
