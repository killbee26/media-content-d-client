import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoData {
  name: string;
  processedUrls: {
    high: string;
    medium: string;
    low: string;
  };
  uploadDate: string;
}

interface VideoPlayerProps {
  videoData?: VideoData;
}

// Default values for videoData
const defaultVideoData: VideoData = {
  name: "Untitled Video",
  processedUrls: {
    high: "",
    medium: "",
    low: ""
  },
  uploadDate: new Date().toISOString()
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData = defaultVideoData }) => {
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<HTMLDivElement>(null);

  // Set initial video source
  useEffect(() => {
    if (videoData?.processedUrls) {
      setVideoSrc(videoData.processedUrls[selectedQuality]);
    }
  }, [selectedQuality, videoData]);

  const handleQualityChange = (quality: 'high' | 'medium' | 'low') => {
    setSelectedQuality(quality);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVolume(videoRef.current.muted ? 0 : 1);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        playerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying && isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // If no video source is available, show a placeholder
  if (!videoSrc) {
    return (
      <div className="flex items-center justify-center w-full max-w-2xl h-64 mx-auto border rounded-lg bg-gray-100">
        <p className="text-gray-500">No video source available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${isFullscreen ? 'hidden' : ''}`}>
        {videoData.name}
      </h2>

      <div className={`flex items-center space-x-4 ${isFullscreen ? 'hidden' : ''}`}>
        <label className="text-sm font-medium">Quality:</label>
        <Select value={selectedQuality} onValueChange={handleQualityChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        ref={playerRef}
        className={`relative ${
          isFullscreen 
            ? 'fixed inset-0 w-screen h-screen bg-black z-50' 
            : 'w-full max-w-2xl mx-auto border rounded-lg shadow-lg bg-black'
        }`}
        onMouseMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          controls={false}
          className={`w-full h-full ${isFullscreen ? 'object-contain' : 'rounded-t-lg'}`}
          onEnded={() => setIsPlaying(false)}
        />
        
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          } ${isFullscreen ? '' : 'rounded-b-lg'}`}
        >
          <div className="flex items-center space-x-4">
            <Button 
              onClick={togglePlayPause} 
              variant="outline"
              className="hover:bg-gray-700"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button 
              onClick={toggleMute} 
              variant="ghost"
              className="hover:bg-gray-700"
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {new Date(videoData.uploadDate).toLocaleDateString()}
            </span>
            <Button 
              onClick={toggleFullscreen} 
              variant="ghost"
              className="hover:bg-gray-700"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;