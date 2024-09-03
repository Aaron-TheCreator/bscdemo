import { Outlet, Link } from 'react-router-dom';
import * as Realm from 'realm-web';
import { ThirdwebProvider, ConnectWallet, Web3Button, useDisconnect } from '@thirdweb-dev/react';
// import VideoPlayer from './components/VideoPlayer.jsx';
import Comments from './components/Comments.jsx';
import './App.css'

const THIRDWEB_CLIENT_ID = import.meta.env.VITE_BSCDEV1_THIRDWEB_CLIENT_ID;
const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });


function App() {
  // const [comments, setComments] = useState(0)
  const user = app.currentUser;
  console.log("user: ", user)
  
  const handleComments = (e) => {
    e.preventDefault();
    const cmtsBtn = document.querySelector(".commentsButton"); 
    cmtsBtn.innerHTML != "Comments" ? cmtsBtn.innerHTML = "Comments": cmtsBtn.innerHTML = "Hide Comments";
    document.querySelector(".commentCont").style.display   == "none" ? document.querySelector(".commentCont").style.display = "block" : document.querySelector(".commentCont").style.display = "none";

  }
  // const disconnect = useDisconnect();

  const handleLogout = async () => {
    
    try {
      await app.currentUser.logOut();
      console.log("logged out");
      console.log("wallet disconnected: ");
      location.replace("/");
    } catch (error) {
      console.error("error logging out: ", error)
    }
  };

  Realm.handleAuthRedirect();  

  return (
    <ThirdwebProvider
      activeChain={"polygon"}
      clientId={THIRDWEB_CLIENT_ID}
    >
      <header>
        <h1><Link to={"/"}>Best Served Cold 🧊🥶 0.0.1</Link></h1>
        {user ? 
        <><div id='userId-login-btn'><Link to={"user"}>{"✅"}</Link></div>
        <ConnectWallet />
        <button onClick={handleLogout}> Log out</button></> :
        <div id='userId-login-btn'><Link to={"signin"}>{"❌"}</Link></div>}
      </header>
      <Outlet />
      
      <div className="card">
        <button className="commentsButton" onClick={handleComments}>Comments</button>
        <Comments />
      </div>
      <br/>
      <br/>
      {/* {user ? 
      <button onClick={handleLogout}> Log out</button> :
      <></>} */}
    </ThirdwebProvider>
  )
}

export default App
