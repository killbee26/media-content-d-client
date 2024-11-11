// app/player/[videoName]/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import VideoPlayer from '../../../components/videoPlayer';
import api from '@/lib/api'; // Replace with the actual path to your axios client

interface PlayerPageProps {
  params: {
    videoName: string;
  };
}

const PlayerPage: React.FC<PlayerPageProps> = ({ params }) => {
  const { videoName } = params;
  const [videoData, setVideoData] = useState<any | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await api.get('/videos/getAllVideos');
        const videos = response.data;

        // Find the video that matches the videoName from params
        const matchedVideo = videos.find((video: any) => video.name === videoName);
        if (matchedVideo) {
          setVideoData(matchedVideo);
          console.log(matchedVideo);
        } else {
          console.warn(`Video with name ${videoName} not found.`);
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    if (videoName) {
      fetchVideoData();
    }
  }, [videoName]);

  if (!videoData) return <p>Loading...</p>;
  console.log("player page date: ",videoData.uploadDate);
  return (
    <div>
      <h1>Video Player</h1>
      <VideoPlayer videoData={videoData} />
    </div>
  );
};

export default PlayerPage;
