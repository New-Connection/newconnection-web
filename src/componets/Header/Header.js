import { React } from 'react';
import { ethers } from "ethers";
import './Header.css';
import logo from '../../assets/logo.png';
import twitter_img from '../../assets/twitter.png'
import discord_img from '../../assets/discord.png'

const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
};
const TwitterURL = 'https://twitter.com/NewConnectionX'

function SocialMedia() {
    return (
        <div className='btns'>
            <button onClick={()=> connectWallet()} className="social-btn">Connect Wallet</button>
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

async function connectWallet(){
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
}

function Header() {
    return (
        <header>
            <nav className='header'>
                <Logo />
                <SocialMedia />
            </nav>
        </header>
    )
}

export default Header;