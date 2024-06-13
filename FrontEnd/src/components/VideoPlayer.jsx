// import testvid from "/videos/testvid01.mp4";
import "../style/videoPlayer.css"
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
                <source src="https://d19wd71nqr2oyj.cloudfront.net/Video_1.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default VideoPlayer;