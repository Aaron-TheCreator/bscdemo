import { Outlet } from 'react-router-dom';
import * as Realm from 'realm-web'
// import VideoPlayer from './components/VideoPlayer.jsx';
import Comments from './components/Comments.jsx';
import './App.css'

const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });


function App() {
  // const [comments, setComments] = useState(0)
  const user = app.currentUser;
  
  const handleComments = (e) => {
    e.preventDefault();
    const cmtsBtn = document.querySelector(".commentsButton"); 
    cmtsBtn.innerHTML != "Comments" ? cmtsBtn.innerHTML = "Comments": cmtsBtn.innerHTML = "Hide Comments";
    document.querySelector(".commentCont").style.display   == "none" ? document.querySelector(".commentCont").style.display = "block" : document.querySelector(".commentCont").style.display = "none";

  }

  const handleLogout = async (e) => {
    
    try {
      await app.currentUser.logOut();
      console.log("logged out")
      location.reload();
    } catch (error) {
      console.error("error logging out: ", error)
    }
  }

  

  return (
    <>
      <header>
        <h1>Best Served Cold 🧊🥶 0.0.1</h1>
        <div id='userId-login-btn'>{user ? `✅`: `❌`}</div>
      </header>
      <Outlet />
      
      <div className="card">
        <button className="commentsButton" onClick={handleComments}>Comments</button>
        <Comments />
      </div>
      <br/>
      <br/>
      {user ? 
      <button onClick={handleLogout}> Log out</button> :
      <></>}
    </>
  )
}

export default App
