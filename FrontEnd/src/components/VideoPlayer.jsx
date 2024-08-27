// import testvid from "/videos/testvid01.mp4";
import "../style/videoPlayer.css"
const videoLink = import.meta.env.VITE_MAIN_VIDEO;
const VideoPlayer = () => {
    return (
        <div className="video-cont">
            {/* <div className="videoHeader">
                <p></p>
            </div> */}
            <div className="videoCont">
                <video
                    id="videoPlayer"
                    width={500}
                    height={500}
                    title="Embedded Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    controls
                    controlsList="nodownload noplaybackrate"
                    loop
                    autoPlay
                    muted
                >
                    <source src={videoLink} type="video/mp4" />
                </video>
            </div>
            
        </div>
    );
};

export default VideoPlayer;