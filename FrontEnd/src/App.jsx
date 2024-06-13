// import { useState } from 'react';
import VideoPlayer from './components/VideoPlayer.jsx';
import Comments from './components/Comments.jsx';
import './App.css'

function App() {
  // const [comments, setComments] = useState(0)
  const handleComments = (e) => {
    e.preventDefault();
    const cmtsBtn = document.querySelector(".commentsButton"); 
    cmtsBtn.innerHTML != "Comments" ? cmtsBtn.innerHTML = "Comments": cmtsBtn.innerHTML = "Hide Comments";
    document.querySelector(".commentCont").style.display   == "none" ? document.querySelector(".commentCont").style.display = "block" : document.querySelector(".commentCont").style.display = "none";

  }

  return (
    <>
      <div>
      <div className="a"></div><div id="circle"></div> 
      </div>
      <h1>Best Served Cold 🧊🥶 0.0.1</h1>

      <div className='video-cont'>
        <VideoPlayer />
      </div>
      <div className="card">
        <button className="commentsButton" onClick={handleComments}>Comments</button>
        <Comments />
      </div>
    
    </>
  )
}

export default App
