import styles from '../styles/Home.module.css';
import { useMoralis, useWeb3ExecuteFunction, useApiContract } from 'react-moralis';
import React, { useState, useEffect } from 'react';
import Moralis from 'moralis';
import Unstaked from '../components/Unstaked';
import Nextmonth from '../components/Nextmonth';

const Main = ({ userTokenUnits, userToken, value }) => {

  const { Moralis, isAuthenticated, user, isInitialized } = useMoralis();

  const contractProcessor = useWeb3ExecuteFunction();

  const [totalDepo, setTotalDepo] = useState(null);

  const [inpValue, setInpValue] = useState(null);

  const [UnstakeInpValue, setUnstakeInpValue] = useState(null);

  const [disabled, setDisabled] = useState('disabled');

  const [unstakeDisabled, setUnstakeDisabled] = useState('disabled');

  const [check, setCheck] = useState(null);




  async function claim() {
    setTimeout(() => {
      setCheck('hide');
    }, 5);

    let options = {
      contractAddress: '0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc',
      functionName: 'getReward',
      abi: [{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    }

    await contractProcessor.fetch({
      params: options
    })
  }

  async function handleClaim() {
    setCheck('claim');
  }

  async function handleStake() {
    setCheck('stake');
  }

  async function handleExit() {
    setCheck('exit');
  }

  async function handleUnstake() {
    setCheck('unstake');
  }

  async function hide() {
    setCheck('hide');
  }

  async function hideunstake() {
    setCheck('hideunstake');
  }

  async function unstake() {
    setTimeout(() => {
      setCheck('hideunstake');
    }, 5);
    if(UnstakeInpValue && UnstakeInpValue <= value && UnstakeInpValue > 0) {
      let options = {
        contractAddress: '0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc',
        functionName: 'withdraw',
        abi: [{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
        params: {
          amount: Moralis.Units.ETH(UnstakeInpValue)
        },
      }

      await contractProcessor.fetch({
        params: options
      })
    }
  }

  async function exit() {
    setTimeout(() => {
      setCheck('hide');
    }, 5);
    let options = {
      contractAddress: '0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc',
      functionName: 'exit',
      abi: [{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    }

    await contractProcessor.fetch({
      params: options
    })
  }

  async function stake() {
    setTimeout(() => {
      setCheck('hide');
    }, 5);
    if(inpValue && inpValue <= userTokenUnits && inpValue > 0){
      let options = {
        contractAddress: '0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc',
        functionName: 'stake',
        abi: [{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
        params: {
          amount: Moralis.Units.ETH(inpValue)
        },
      }

      await contractProcessor.fetch({
        params: options
      })
    }
  }

  const handleBtns = async () => {
    if(check === 'claim') {
      claim();
    }
    if(check === 'stake') {
      stake();
    }
    if(check === 'exit') {
      exit();
    }
  }

  // Get Total Deposits data

  const {
    runContractFunction,
    data,
  } = useApiContract({
    address: "0xE0C255a5D89b6D9fedb5C4e43c11341a072e3bcc",
    functionName: "totalSupply",
    abi: [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
    chain: 'bsc',
  });

  const handleChange = (e) => {
    setInpValue(parseFloat(e.target.value))
    if(e.target.value.length > 0 && e.target.value > 0) {
      setDisabled('')
    } else {
      setDisabled('disabled')
    }
    if(e.target.value > parseFloat(userTokenUnits)) {
      setDisabled('disabled')
    }
  }

  const unstakeInp = (e) => {
    setUnstakeInpValue(parseFloat(e.target.value))
    if(e.target.value.length > 0 && e.target.value > 0) {
      setUnstakeDisabled('')
    } else {
      setUnstakeDisabled('disabled')
    }
    if(e.target.value > parseFloat(value)) {
      setUnstakeDisabled('disabled')
    }
  }

  useEffect(() => {
    if(isInitialized && !data)
        runContractFunction();
  }, [isInitialized, isAuthenticated])

  useEffect(() => {
    if(!totalDepo)
        setTotalDepo(data && data)
  }, [data])

    return ( 
        <div className={styles.main}>
            <div className={`${styles.container} ${styles.div1}`}>
                <span>Next Month Reward Pool</span>
                <Nextmonth />
            </div>
            <div className={`${styles.container} ${styles.div2}`}>
                <span>Total Deposits</span>
                <p>{totalDepo ? parseFloat(Moralis.Units.FromWei(totalDepo)).toFixed(2) + ' BSKT' : '-'}</p>
            </div>
                <div className={`${styles.container} ${styles.div3}`}>
                <span>Staked</span>
                <p>{isAuthenticated ? value ? value + ' BSKT' : '-' : '-'}</p>
                {!isAuthenticated ? '' : <button className={styles.stake} onClick={handleUnstake}>Unstake</button>}
                {!isAuthenticated ? '' : <button className={`${styles.stake} ${styles.withdraw}`} onClick={handleExit}>Withdraw all</button>}
            </div>
            <div className={`${styles.container} ${styles.div4}`}>
                <span>Unclaimed</span>
                <Unstaked />
                {!isAuthenticated ? '' : <button className={styles.stake} onClick={handleClaim}>Claim</button>}
            </div>
                {!isAuthenticated ? '' : 
                <div className={`${styles.container} ${styles.div5}`}>
                <span>Initial stake requirement of 5000 BSKT. Afterwards, all restrictions are lifted and you may un-stake and re-stake any amount of BSKT token.</span>
                <input type="number" className={styles.inp} onChange={handleChange} min='0' max='15000000' pattern='[0-9]*' />
                {inpValue > parseFloat(userTokenUnits) ? <span style={{color: 'red'}}>Your BSKT balance is too low.</span> : 
                (inpValue && inpValue < 0) ? <span style={{color: 'red'}}>Value has to be a positive number.</span> : ((inpValue && value < 1) || (inpValue && inpValue > 50000)) ? <span style={{color: 'red'}}>Initial stake requirement of 5000 BSKT.</span> : ''}
                <button className={styles.btn} disabled={disabled} onClick={handleStake}>Stake</button>
            </div>}
            {check && check != 'unstake' && check != 'hideunstake' ? 
            <div className={check ? (check == 'hide') ? `${styles.popup} ${styles.hide}` : `${styles.popup} ${styles.show}` : styles.popup}>
              <span className={styles.close} onClick={hide}>??</span>
              <h2>Please confirm operation</h2>
              <p>Each operation will cost you 2.5% of your transaction value.</p>
              <div className={styles.btnwrapper}>
                <button className={styles.btn} onClick={hide}>Cancel</button>
                <button className={styles.btn} onClick={handleBtns}>Confirm</button>
              </div>
            </div> :
              <div className={check ? (check == 'hideunstake') ? `${styles.popup} ${styles.hide} ${styles.unstake}` : `${styles.popup} ${styles.show} ${styles.unstake}` : styles.popup}>
                <span className={styles.close} onClick={hideunstake}>??</span>
                <div className={styles.info}>
                  <h2>Unstake</h2>
                  <p>Enter amount to unstake</p>
                </div>
                <input type="number" className={styles.inp} onChange={unstakeInp} min='0' max='15000000' pattern='[0-9]*' />
                <button className={styles.btn} onClick={unstake} disabled={unstakeDisabled}>Unstake</button>
                {UnstakeInpValue && UnstakeInpValue < 0 ? <span style={{color: 'red'}}>Value has to be a positive number.</span> : UnstakeInpValue && UnstakeInpValue > parseFloat(value) ? <span style={{color: 'red'}}>Your staked balance is too low.</span> : ''}
                <p>Each transaction will cost you 2.5% of your transaction value.</p>
              </div>}
            
        </div>
     );
}
 
export default Main;
