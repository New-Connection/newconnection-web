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

    const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			const accounts = window.ethereum.request({ method: 'eth_requestAccounts'})
            accounts.then(result => {
                accountChangedHandler(result[0]);
                setConnectButtonText('Account:')
            }).catch(error => {
                setErrorMessage(error.message)
            })
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