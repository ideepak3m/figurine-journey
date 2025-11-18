import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import videoSrc from "@/assets/Reel/Animation-BuyLocal.mp4";
import AnimationWelcome from "@/assets/Reel/Animation-Welcome.mp4";
import MemoryStory from "@/assets/Reel/MemoryStory.mp4";
import MiniVersion from "@/assets/Reel/MiniVersion.mp4";
import PuppyCupcake from "@/assets/Reel/PuppyCupcake.mp4";
import Video1113 from "@/assets/Reel/1113.mp4";

const videoList = [
    {
        src: videoSrc,
        title: "Buy Local Animation",
    },
    {
        src: AnimationWelcome,
        title: "Welcome Animation",
    },
    {
        src: MemoryStory,
        title: "Memory Story",
    },
    {
        src: MiniVersion,
        title: "Mini Version",
    },
    {
        src: PuppyCupcake,
        title: "Puppy Cupcake",
    },
    {
        src: Video1113,
        title: "1113",
    },
];

const HomeVideoModal: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [ended, setEnded] = useState(false);
    const [muted, setMuted] = useState(true);
    const [showMoreVideos, setShowMoreVideos] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(videoSrc);
    const [currentTitle, setCurrentTitle] = useState("Buy Local Animation");
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && videoRef.current) {
            videoRef.current.muted = muted;
            videoRef.current.play();
        }
    }, [open, muted, currentVideo]);

    const handleVideoEnd = () => {
        setEnded(true);
    };

    const handleGoToShop = () => {
        setOpen(false);
        navigate("/shop");
    };

    const handleReplay = () => {
        setEnded(false);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const handleUnmute = () => {
        setMuted(false);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play();
            }
        }, 0);
    };

    const handleSkip = () => {
        setOpen(false);
        navigate("/shop");
    };

    const handleSelectVideo = (src: string, title: string) => {
        setCurrentVideo(src);
        setCurrentTitle(title);
        setEnded(false);
        setShowMoreVideos(false);
        setMuted(true);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
            }
        }, 0);
    };

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            showClose={true}
            extraTopRight={
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 h-8 w-8 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-none"
                    onClick={handleSkip}
                    aria-label="Skip"
                >
                    {/* Fast-forward/skip icon */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3,4 13,10 3,16" fill="currentColor" />
                        <rect x="15" y="4" width="2" height="12" fill="currentColor" />
                    </svg>
                </Button>
            }
        >
            <div className="flex flex-col items-center justify-center p-4 relative min-w-[350px] min-h-[300px]">
                {/* Video or Thumbnails */}
                {!showMoreVideos ? (
                    <>
                        <video
                            ref={videoRef}
                            src={currentVideo}
                            controls={false}
                            autoPlay
                            muted={muted}
                            playsInline
                            onEnded={handleVideoEnd}
                            className="rounded-lg max-w-full max-h-[70vh] shadow-lg"
                        />
                        {/* Enable Audio Button */}
                        {muted && !ended && (
                            <Button
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-lg px-8 py-4 bg-primary text-white shadow-lg animate-bounce"
                                onClick={handleUnmute}
                                style={{ fontSize: 24 }}
                            >
                                🔊 Enable Audio
                            </Button>
                        )}
                        {/* Ended Buttons - horizontal layout */}
                        {ended && (
                            <div className="flex flex-row items-center gap-4 mt-6 justify-center w-full">
                                <Button variant="secondary" className="w-40" onClick={() => setShowMoreVideos(true)}>
                                    More Videos...
                                </Button>
                                <Button variant="secondary" className="w-40" onClick={handleReplay}>
                                    Replay
                                </Button>
                                <Button className="w-40" onClick={handleGoToShop} autoFocus>
                                    Explore...
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
                        <div className="overflow-y-auto max-h-[60vh] w-full px-2">
                            <div className="grid grid-cols-2 gap-4">
                                {videoList.map((vid) => (
                                    <button
                                        key={vid.title}
                                        className="flex flex-col items-center w-full hover:scale-105 transition-transform"
                                        onClick={() => handleSelectVideo(vid.src, vid.title)}
                                    >
                                        <video
                                            src={vid.src}
                                            className="rounded w-full h-24 object-cover mb-1 border-2 border-primary"
                                            muted
                                            playsInline
                                        />
                                        <span className="text-xs text-center font-medium">
                                            {vid.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button variant="outline" className="mt-6 w-40" onClick={() => setShowMoreVideos(false)}>
                            Back to Video
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default HomeVideoModal;
