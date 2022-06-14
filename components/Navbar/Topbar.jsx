import Login from './Login';
import styles from '../../styles/Topbar.module.css';
import { useMoralis } from 'react-moralis';
import React from 'react';
import Moralis from 'moralis';

const Topbar = ({userToken}) => {

    const { isAuthenticated } = useMoralis();

    return ( 
        <div className={styles.TopBar}>
            <div className={styles.coinbalance}>
                {isAuthenticated ? userToken ? <strong>{parseFloat(Moralis.Units.FromWei(userToken)).toFixed(2)}</strong> : <strong>0</strong> : <strong>0</strong>}
                BSKT
            </div>
            <Login />
        </div>
     );
}
 
export default Topbar;