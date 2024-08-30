import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './App.jsx'
import SignIn from './components/SignIn.jsx';
import './index.css'
import VideoPlayer from './components/VideoPlayer.jsx';
import GoogleAuth from './components/GoogleAuth.jsx';
import User from './components/User.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/",
        element: <VideoPlayer triggerPIP={false}/>,
      },
      {
        path: "/google",
        element: <GoogleAuth />
      },
      {
        path: "/user",
        element: <User />
      }
    ],
  },
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
