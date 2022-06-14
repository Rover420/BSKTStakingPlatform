import { useERC20Balances, useMoralis } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Moralis from 'moralis';

const Nextmonth = () => {

    const [token, setToken] = useState();

    const {fetchERC20Balances, data} = useERC20Balances();

    const oof = async () => {
        await fetchERC20Balances({
        params: {
          chain: 'bsc',
          address: "0x47ce1c44b4e4ef8161d1112bc81a96fca553df18"
        }
        })
    }

    useEffect(() => {
        oof();
    }, []);

    useEffect(() => {
        try {
            if(!token && data) {
                setToken(data && data[1].balance)
            }
        } catch (err) {
            console.log(err);
        }
        
    }, [data])

    return (
        <p>
            {token ? parseFloat(Moralis.Units.FromWei(token)*0.67).toFixed(2) + ' BSKT' : '-'}
        </p>
     );
}
 
export default Nextmonth;