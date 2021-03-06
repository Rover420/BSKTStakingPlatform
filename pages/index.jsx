import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useERC20Balances, useMoralis, useWeb3ExecuteFunction, useApiContract } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Moralis from 'moralis';
import Main from '../components/Main';


export default function Home() {

  const { Moralis, isAuthenticated, user } = useMoralis();

  const {fetchERC20Balances, data} = useERC20Balances();

  const [userToken, setUserToken] = useState(null);

  const [userTokenUnits, setUserTokenUnits] = useState(0);

  const [addr, setAddr] = useState(null);

  const [value, setValue] = useState(null);

  const [timer, setTimer] = useState(0);


  useEffect(() => {
    setUserToken(null);
  }, [])


  const elo = async () => {
    if(isAuthenticated) {
        await fetchERC20Balances({
            params: {
                chain: 'bsc',
                address: user.get('ethAddress'),
            }
        })
    }
  }

  const {
    runContractFunction,
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
      if(addr) runContractFunction({
        onSuccess: (res) => setValue(parseFloat(Moralis.Units.FromWei(res)).toFixed(2)),
        onError: (err) => console.log(err),
      })
    }, [addr, timer])

    useEffect(() => {
      if(!isAuthenticated) {
        setValue();
      }
    }, [isAuthenticated])



  useEffect(() => {
    elo();
    setTimeout(() => {
      setTimer(timer + 1);
    }, 10000);
  }, [isAuthenticated, timer]);

  useEffect(() => {
     fetchERC20Balances({
      onSuccess: (res) => {
        const zwierzyniec = (res && res.filter(token => token.symbol === 'BSKT'));
        setUserToken(zwierzyniec && zwierzyniec[0].balance);
      }
     })
  }, [isAuthenticated, timer])

  useEffect(() => {
    if(userToken) {
      setUserTokenUnits(parseFloat(Moralis.Units.FromWei(userToken)).toFixed(2));
    }
  }, [userToken])


  return (
    <>
      <Head>
        <title>BSKT Staking App</title>
        <meta name="description" content="BSKT Staking App" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta charSet="utf-8" />
      </Head>

      <Navbar 
        userToken={userToken} 
      />

      <Main 
        userToken={userToken} 
        userTokenUnits={userTokenUnits} 
        value={value}
      />

    </>
  )
}
