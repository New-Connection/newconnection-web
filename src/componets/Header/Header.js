import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');

    // update account, will cause component re-render
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
    }

    const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	//window.ethereum.on('accountsChanged', accountChangedHandler);
    
    // Event for chain changes
	window.ethereum.on('chainChanged', chainChangedHandler);

    async function connectWalletHandler() {
		if (window.ethereum && window.ethereum.isMetaMask) {
            
            // A Web3Provider wraps a standard Web3 provider, which is
            // what MetaMask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            try {
                // MetaMask requires requesting permission to connect users accounts
                const request = await provider.send("eth_requestAccounts", []);
                accountChangedHandler(request[0]);
                setConnectButtonText('Account:')
                // The MetaMask plugin also allows signing transactions to
                // send ether and pay to change state within the blockchain.
                // For this, you need the account signer...
                const signer = provider.getSigner()
                console.log(signer)
            } catch (error) {
                setErrorMessage(error.message)
                console.error(error);
            } 
        } else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
    }
			
    function ConnectWallet() {
        return(
            <div className='btns'>
                <button onClick={()=> connectWalletHandler()} className="wallet-button">{connectButtonText} {defaultAccount}</button>
            </div>
        )
    }
    
    function Logo(){
        return(
            <div className='logo'>
                <img src={logo}></img>
                <p className='logo-spacing'>new<br />connection</p>
            </div>
            
        )
    }
    return (
        <header>
            <nav className='header'>
                <Logo />
                <ConnectWallet />
            </nav>
        </header>
    )
}

export default Header;