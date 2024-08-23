import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Realm from 'realm-web'
import axios from 'axios';
import '../style/comments.css';

const COMMENTS_BASE_URL = import.meta.env.VITE_COMMENTS_BASE_URL;
const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });
const user = app.currentUser;
const userIsAn0n = user && user.providerType === "anon-user" ? true : false;
if (user) {
    console.log("user is an0n: ", user.providerType === "anon-user")
    console.log("find username: ", user.profile.name)// undefined if user is anon
}
const Comments = () => {
    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    // const videoPlayer = document.getElementById('videoPlayer');
    // const boomCmnt = document.getElementById('boomCmnt');

    

    const getComments = async () => {
        console.log("fetching comments")
        try {
            const response = await axios.get(COMMENTS_BASE_URL);
            console.log("response.data: ",response.data);
            setCommentsList(response.data)
            // console.log(response);
            
        } catch (error) {
            console.error("Error getting comments getComments: error: ",JSON.stringify(error));
        }
        // console.log("comments fetched", commentsList)
    };

    const sendComment = async (cmntObj) => {
        let newComment;
        console.log("cmntObj: ", cmntObj);
        try {
            console.log("sending comment: ", cmntObj)
            const response = await axios.post(
                COMMENTS_BASE_URL,
                { comment: cmntObj }
            );
            // console.log("response.data: ",response);
            newComment = response.data;
            // console.log(cmntObj, "sent")
        } catch (error) {
            console.error(`ERROR sending comment: ${cmntObj} line 51`,error);

        }
        return newComment;
    };


    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        if (comment == '') {
            e.preventDefault();
            console.error("comment is empty");
            // display UI error message
        } else {
            e.preventDefault();
            // vvv this is intended to trigger PIP on video element
            // but is broken because sign in isnt a modal but a separate route
            // will circle back to this at some point
            // if (user === null) {
            //     boomCmnt.addEventListener('click', async () => {
            //         console.log("boomCmnt pip clicked");
            //         boomCmnt.disabled = true;
            //         await videoPlayer.requestPictureInPicture();
            //         boomCmnt.disabled = false;
            //     });
            // }
            console.log("user is an0n: ", user.providerType === "anon-user")
            let commentObj = {
                cmntTxt: comment,
                username: userIsAn0n ? `an0n${user.id}`: user.profile.name,
                timeCommented: Math.floor(new Date().getTime() / 1000),
                signedIn: userIsAn0n ? false: true,
            };
            console.log("commentObj line 88: ", commentObj);
            let newCommentsList = await sendComment(commentObj);
            console.log("newCommentsList: ", newCommentsList);
            setCommentsList(newCommentsList[1]);
            // console.log("commentObj line 55: ", commentObj);
        
            setComment('');
        }

       
        
        
        
    };

    // randomize color of element text 
    // color pallette:
    //     Hex	RGB
    // #128a84	(18,138,132)
    // #79af30	(121,175,48)
    // #bb5c37	(187,92,55)
    // #4b0055	(75,0,85)

    let colors = ["#128a84", "#79af30", "#bb5c37", "#4b0055"];
    function randomColorIndex(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let number = Math.floor(Math.random() * (max - min + 1)) + min;
        return colors[number]; 
      }


    let time = Math.floor(new Date().getTime() / 1000);

    const getTimeDifference = (time, timeCommented) => {
        const difference = time - timeCommented;
      
        if (difference < 60) {
          return {
            value: Math.floor(difference < 1 ? difference + 3 : difference),
            unit: "seconds"
          };
        } else if (difference < 3600) {
          return {
            value: Math.floor(difference / 60),
            unit: "minutes"
          };
        } else if (difference < 86400) {
          return {
            value: Math.floor(difference / 3600),
            unit: "hours"
          };
        } else {
          return {
            value: Math.floor(difference / 86400),
            unit: "days"
          };
        }
    };
    useEffect( () => {
        getComments();

    }, []);

    return (
        <div className='commentCont' style={{display: "none"}}>
            <div className='commentSctn'>
                {commentsList.reverse().map((comment, index) => (
                    <div className="comment" key={index}>
                        <span className='commentUsername' style={{color: randomColorIndex(0, 3)}}>{comment.username}</span>
                        <span className='commentTxt'>{comment.cmntTxt}</span>
                        {/* find amount of seconds or if more than 60 secs find number of minutes only or if more than 60 minutes hours only */}
                        {/* <span className='timeAgo'>{ time - comment.timeCommented < 60 ? `${time - comment.timeCommented < 1 ? Math.floor((time - comment.timeCommented) + 3): Math.floor(time - comment.timeCommented)} seconds ago`: `${Math.floor((time - comment.timeCommented) / 60) > 60 ? `${Math.trunc(Math.floor((time - comment.timeCommented) / 60)/60)} hours ago`: `${Math.floor((time - comment.timeCommented) / 60)} minutes ago`}  `}</span> */}
                        <span className='timeAgo'>{`${getTimeDifference(time, comment.timeCommented).value} ${getTimeDifference(time, comment.timeCommented).unit} ago`}</span>
                    </div>
                ))}
            </div>
            <form className="commentForm" onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Say something..."
                />
                <button id="boomCmnt" type="submit">
                    {!user ?
                    <Link to={"signin"}>Boom</Link>:'Boom'}
                    </button>
            </form>
        </div>
    );
};

export default Comments;