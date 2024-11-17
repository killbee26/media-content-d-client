"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Adjust the import based on your file structure
import { Button } from '@/components/ui/button';
import api from '@/lib/api'; // Replace with your actual axios client path

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
    <div className="container mx-auto px-4 py-8">
      {/* Using standard h1 and styling */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Video List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">{video.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Using standard p and styling */}
              <p className="text-sm text-gray-500 mb-4">
                Uploaded on: {new Date(video.uploadDate).toLocaleDateString()}
              </p>
              <Link href={`/player/${encodeURIComponent(video.name)}`} passHref>
                <Button variant="outline" className="w-full">
                  Watch Video
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
