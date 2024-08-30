import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Realm from "realm-web";
import VideoPlayer from './VideoPlayer';
import '../style/signin.css';

const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });
const user = app.currentUser;
const userIsAn0n = user && user.providerType === "anon-user" ? true : false;
// const videoPlayer = document.getElementById('videoPlayer');


// Create a component that displays the given user's details
function UserDetail({ user }) {
    return (
      <div>
        <h2>{userIsAn0n ? `hello an0n ${user.id}`: `hello ${user.profile.name}`}</h2>
      </div>
    );
  }
  
  // Create a component that lets an anonymous user log in
  function Login({ setUser }) {
    const navigate = useNavigate();
    const loginAnonymous = async () => {
      const user = await app.logIn(Realm.Credentials.anonymous(false));
      console.log("signin.jsx:  Login: user: ", user)
      setUser(user);
      navigate('/');
      location.reload();
    };
    const loginGoogle = async () => {
        const redirectUrl = window.location.origin;
        const credentials = Realm.Credentials.google({redirectUrl})
        const user = await app.logIn(credentials)
            .then((user) => {
                console.log("logged in google user id:", user.id)
                navigate('/');
                location.reload();
            })
            .catch((error) => {console.error("error logging in google: ", error)});
        console.log("signin.jsx:  Login: user: ", user)
        
    };
    
    return (
        <div className='loginCard'>
            <h2>Sign In</h2>
            <label>Sign in with Google</label>
            <br/>
            <button onClick={loginGoogle}>Google</button>
            <br/>
            <label>Sign in as an0n</label>
            <br/>
            <button onClick={loginAnonymous}>an0n</button>
        </div>
    

    );
  }
  
  const SignIn = () => {
    // Keep the logged in Realm user in local state. This lets the app re-render
    // whenever the current user changes (e.g. logs in or logs out).
    const [user, setUser] = React.useState(app.currentUser);
    // Realm.handleAuthRedirect();
    // await videoPlayer.requestPictureInPicture();
    // If a user is logged in, show their details.
    // Otherwise, show the login screen.
    return (
      <div className="App">
        <div className="signInCont">
          {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
        </div>
        <VideoPlayer triggerPIP={true}/>
      </div>
    );
  };
  
  export default SignIn;
  

// const SignIn = (comment) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [username, setUsername] = useState('');

//     const commentObj = comment ? comment : false;
    
//     const handleEmailChange = (e) => {
//         setEmail(e.target.value);
//     };

//     const handleAn0nUsernameChange = (e) => {
//         setUsername(e.target.value);
//     };
//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Add your sign-in logic here
//     };

//     return (
//         <div>
//             <h2>Sign In</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Email:</label>
//                     <input type="email" value={email} onChange={handleEmailChange} />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input type="password" value={password} onChange={handlePasswordChange} />
//                 </div>
//                 <button type="submit">Sign In</button>
//             </form>
//             <br />
//             <span>- OR -</span>
//             <br />
//             <form>
//                 <label>an0n username: </label>
//                 <input type="text" value={username} onChange={handleAn0nUsernameChange}/>
//             </form>
//         </div>
//     );
// };

// export default SignIn;