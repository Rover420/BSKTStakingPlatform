import styles from '../../styles/Logo.module.css';
import Image from 'next/image';
import { useMoralis } from 'react-moralis';

const Logo = () => {


    return ( 
        <div className={styles.logo_container}>
                <a href="https://basketcoin.io">
                    <Image className={styles.logo} src={'/logo.png'} width='204' height='43' />
                </a>
            <span className={styles.text}>Staking BSC</span>
        </div>
     );
}
 
export default Logo;