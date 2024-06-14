// import testvid from "/videos/testvid01.mp4";
import "../style/videoPlayer.css"
const videoLink = import.meta.env.VITE_MAIN_VIDEO;
console.log("videoLink", videoLink);
const VideoPlayer = () => {
    return (
        <div className="videoCont">
            <div className="videoHeader">
                <p>Header Tesxt</p>
            </div>
            <video
                width={500}
                height={500}
                title="Embedded Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                controls
                loop
                autoPlay
                muted
                
            >
                <source src={videoLink} type="video/mp4" />
            </video>
        </div>
    );
};

export default VideoPlayer;