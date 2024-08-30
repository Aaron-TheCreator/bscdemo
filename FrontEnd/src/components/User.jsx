import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Realm from 'realm-web';
import VideoPlayer from './VideoPlayer';
import getTimeDifference from '../utils/getTimeDiff.js';
import { useLocation } from 'react-router-dom';
import '../style/comments.css';

const USER_COMMENTS_BASE_URL = import.meta.env.VITE_USER_COMMENTS_BASE_URL;
const REALM_APP_ID = import.meta.env.VITE_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });


const User = () => {

    const [commentsList, setCommentsList] = useState([]);
    const [userOwnedTokens, setUserOwnedTokens] = useState([]);
    
    let user = useLocation().state;
    console.log("user: ", user)
    console.log("is an0n?: ",app.currentUser?.providerType === "anon-user")
    if (user === null && app.currentUser?.providerType !== "anon-user") {
        user = app.currentUser._profile.data.name;
    } else if (user) {
        user = user.username;
    } else {
        user = `an0n${app.currentUser.id}`;
    }
    console.log("user: ", user)

    const getCommentsForUser = async (user) => {
        console.log("fetching comments for user: ", user);
        try {
            const response = await axios.get(USER_COMMENTS_BASE_URL, {
                params: {
                    username: user,
                }
            });
            console.log("response.data: ",response.data);
            setCommentsList(response.data)
            // console.log(response);
            
        } catch (error) {
            console.error("Error getting user's comments getCommentsForUser: error: ",JSON.stringify(error));
        }
        // console.log("comments fetched", commentsList)
    };

    const getUserOwnedTokens = async (user) => {
        console.log("fetching user's owned tokens");
        setUserOwnedTokens([`${user}test`, `${user}test2`, `${user}test3`]);
    };

    let time = Math.floor(new Date().getTime() / 1000);
    // getTimeDifference(time, comment.comment.timeCommented).value
    useEffect(() => {
        getCommentsForUser(user);
        getUserOwnedTokens(user);
    }, [user]);
    return (
        <div>
            <VideoPlayer triggerPIP={true} />
            <h2>{user}</h2>
            {/* <p>Account created on: {user.creationDate}</p> */}
            <h3>Comments:</h3>
            <div>
                {commentsList.map((comment, index) => (
                    <div key={index} className='comment'>
                        <p className='commentTxt'>{comment.cmntTxt}</p>
                        
                        <small className='timeAgo'>{`${getTimeDifference(time, comment.timeCommented).value} ${getTimeDifference(time, comment.timeCommented).unit} ago`}</small>
                    </div>
                ))}
            </div>
            {/* this section will optionally display user's "badges" which will be NFTs and prestige points? (parsed amount of native token) */}
            <h3>{user}&apos;s Stash</h3>
            <div>
                {userOwnedTokens.map((token, index) => (
                    <p key={index}>{token}</p>
                ))}
            </div>
        </div>
    );
};

export default User;