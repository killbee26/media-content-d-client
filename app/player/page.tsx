// pages/player.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VideoPlayer from '../components/VideoPlayer';

// Example video data (this can be fetched from an API)
const videoData = [
  {
    name: 'large.mp4',
    processedUrls: {
      high: 'https://example.com/video/high.mp4',
      medium: 'https://example.com/video/medium.mp4',
      low: 'https://example.com/video/low.mp4',
    },
    uploadDate: '2024-11-07T10:03:31Z',
  },
  // Add more video objects as needed
];

const PlayerPage: React.FC = () => {
  const router = useRouter();
  const { videoName } = router.query; // Get the videoName from the URL query
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (videoName) {
      const selectedVideo = videoData.find((video) => video.name === videoName);
      setVideo(selectedVideo);
    }
  }, [videoName]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Player</h1>
      <VideoPlayer videoData={video} />
    </div>
  );
};

export default PlayerPage;
