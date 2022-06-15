import styles from '../../styles/Login.module.css';
import { useMoralis } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Moralis from 'moralis';


const Login = () => {

    const { authenticate, isAuthenticated, user, logout, isWeb3Enabled, isInitialized } = useMoralis();

    const [check, setCheck] = useState(false);

    const handleAuth = async () => {
        if(isInitialized) {
            await authenticate({signingMessage: "Welcome to BasketCoin staking platform! :>"});
            await Moralis.enableWeb3();
        }
    }

    const handleLogout = async () => {
        if(isInitialized) {
            await logout();
            await Moralis.User.logOut();
        }
    }

    useEffect(() => {
        if (typeof window.ethereum !== "undefined" || (typeof window.web3 !== "undefined")) {
            setCheck(true);
        } else {
            setCheck(false);
        }
    }, []);

    useEffect(() => {
        if(!isWeb3Enabled) {
            handleLogout();
        }
    }, [isWeb3Enabled, isInitialized])
    
    if(!check) {
        return (
            <>
                <a className={styles.link} target="_blank" href='https://metamask.io'><button className={styles.btn}>Click to install MetaMask</button></a>
            </>
        )
    } else {

        if(!isAuthenticated && !isWeb3Enabled) {
            return (
                <button className={styles.btn} onClick={handleAuth}>Connect to a wallet</button>
            )
        } else {

            const useraddr = user.get('ethAddress');
            const lngth = useraddr.length;
            const sliced = useraddr.slice(0, 6) + '...' + useraddr.slice(lngth-4, lngth);

            return ( 
                <>
                    <div className={styles.userid} onClick={handleLogout} title={useraddr}>{sliced}</div>
                </>
            );
        }
    }
}
 
export default Login;
