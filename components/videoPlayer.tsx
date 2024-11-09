import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Make sure this path is correct
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
  videoData: VideoData;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData }) => {
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [videoSrc, setVideoSrc] = useState(videoData.processedUrls.high);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideoSrc(videoData.processedUrls[selectedQuality]);
  }, [selectedQuality, videoData.processedUrls]);

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

  // Listen for exit from fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={playerRef}
      className={`space-y-4 ${isFullscreen ? 'fullscreen-player' : ''}`}
    >
      <h2 className="text-lg font-semibold">{videoData.name}</h2>

      {/* Dropdown for Quality Selection */}
      <div className="flex items-center space-x-4">
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

      {/* Video Player */}
      <div
        className={`relative w-full max-w-2xl mx-auto border rounded-lg shadow-lg bg-black ${isFullscreen ? 'fullscreen-video-container' : ''}`}
      >
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          controls={false}
          width="100%"
          className={`rounded-t-lg ${isFullscreen ? 'fullscreen-video' : ''}`}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-b-lg">
          <Button onClick={togglePlayPause} variant="outline">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button onClick={toggleMute} variant="ghost">
            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button onClick={toggleFullscreen} variant="ghost">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
          <span className="text-sm text-gray-400">{new Date(videoData.uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
