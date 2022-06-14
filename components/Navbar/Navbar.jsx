import Logo from "./Logo";
import Topbar from "./Topbar";


const Navbar = ({userToken}) => {
    
    
    return ( 

        <nav className='.nav'>
            <Logo />
            <Topbar userToken={userToken}/>
        </nav>
     );
}
 
export default Navbar;