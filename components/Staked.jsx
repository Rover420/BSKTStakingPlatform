import { useMoralis, useApiContract } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Moralis from 'moralis';


const Staked = () => {

    const { isInitialized, isAuthenticated, user } = useMoralis(); 

    const [addr, setAddr] = useState();

    const [value, setValue] = useState();

    const {
      runContractFunction,
      data
    } = useApiContract({
      address: "0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc",
      functionName: "balanceOf",
      abi: [{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
      chain: 'bsc',
      params: { account: addr }
    });

    useEffect(() => {
      if(isAuthenticated && !addr) {
        setAddr(user.get('ethAddress'))
      } else {
        setAddr();
      }
    }, [isAuthenticated])

      useEffect(() => {
        if(addr && !value) runContractFunction({
          onSuccess: (res) => setValue(res),
          onError: (err) => console.log(err),
        })
      }, [addr])

      useEffect(() => {
        if(!isAuthenticated) {
          setValue();
        }
      }, [isAuthenticated])

    return ( 
          <p>{value ? parseFloat(Moralis.Units.FromWei(value)).toFixed(2) + ' BSKT' : '-'}</p>
     );
}
 
export default Staked;