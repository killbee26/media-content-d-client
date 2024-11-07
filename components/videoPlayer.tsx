// components/VideoPlayer.tsx

import React, { useState } from 'react';

// Define the interface for the video data
interface VideoData {
  name: string;
  processedUrls: {
    high: string;
    medium: string;
    low: string;
  };
  uploadDate: string;
}

// Define the props interface for the component
interface VideoPlayerProps {
  videoData: VideoData;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData }) => {
  // State to store the selected video quality
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'low'>('high'); // Default to high quality

  // Handler to update the selected video quality
  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuality(event.target.value as 'high' | 'medium' | 'low');
  };

  return (
    <div className="video-container">
      <h2>{videoData.name}</h2>

      {/* Dropdown to select the video quality */}
      <select onChange={handleQualityChange} value={selectedQuality}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Display the video player with the selected quality */}
      <div className="video-player">
        <video controls width="100%">
          <source src={videoData.processedUrls[selectedQuality]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <p>Upload Date: {new Date(videoData.uploadDate).toLocaleDateString()}</p>
    </div>
  );
};

export default VideoPlayer;
