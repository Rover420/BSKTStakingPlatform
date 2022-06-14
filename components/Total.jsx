import { useERC20Balances } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Moralis from 'moralis';

const Total = () => {

    const {fetchERC20Balances, data} = useERC20Balances();

    const [token, setToken] = useState();
    
    useEffect(() => {
      const oof = async () => {
        await fetchERC20Balances({
          params: {
            chain: 'bsc',
            address: "0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc"
          }
        })
      }
      oof();
    }, []);
  
    useEffect(() => {
        if(!token) {
            setToken(data && data[1].balance)
        }
    }, [data])


    if(token) {
        
        return ( 
            <p>{parseFloat(Moralis.Units.FromWei(token)).toFixed(2)} BSKT</p>
        )

    } else {
        return (
            <p>-</p>
        )
    }
}
 
export default Total;