// app/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';; // Replace with your actual axios client path

interface Video {
  name: string;
  processedUrls: {
    high: string;
    medium: string;
    low: string;
  };
  uploadDate: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos/getAllVideos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Video List</h1>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            <Link href={`/player/${encodeURIComponent(video.name)}`}>
              {video.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
