import { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/comments.css';

const Comments = () => {
    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    
    const getComments = async () => {
        console.log("fetching comments")
        try {
            const response = await axios.get('http://localhost:3000/comments');
            setCommentsList(response.data)
            console.log(response);
            console.log("comments fetched")
        } catch (error) {
            console.error("Error getting comments getComments: error: ",error);
        }
    };

    const sendComment = async (cmntObj) => {
        let newComment;
        try {
            console.log("sending comment: ", cmntObj)
            const response = await axios.post(
                'http://localhost:3000/comments',
                { comment: cmntObj }
            );
            console.log("response.data: line29",response);
            newComment = response.data;
            console.log(cmntObj, "sent")
        } catch (error) {
            console.error(`ERROR sending comment: ${cmntObj} line 31`,error);

        }
        return newComment;
    };


    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        let commentObj = {
            cmntTxt: comment,
            username: "user",
            timeCommented: Math.floor(new Date().getTime() / 1000),
        };
        e.preventDefault();
        let newCommentsList = await sendComment(commentObj);
        console.log("newCommentsList line 53: ", newCommentsList);
        setCommentsList(newCommentsList);
        console.log("commentObj line 55: ", commentObj);
        
        setComment('');
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
                        {/* find amount of seconds or if more than 60 secs find number of minutes only */}
                        <span className='timeAgo'>{ time - comment.timeCommented < 60 ? `${time - comment.timeCommented < 1 ? Math.floor((time - comment.timeCommented) + 3): Math.floor(time - comment.timeCommented)} seconds ago`: `${Math.floor((time - comment.timeCommented) / 60)} minutes ago`}</span>
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
                <button id="boomCmnt" type="submit">Boom</button>
            </form>
        </div>
    );
};

export default Comments;