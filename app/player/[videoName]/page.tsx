"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '../../../components/videoPlayer';
import api from '@/lib/api';
import { Clock, Calendar, Eye, ThumbsUp, Share2 } from 'lucide-react';

interface VideoData {
  name: string;
  processedUrls: {
    high: string;
    medium: string;
    low: string;
  };
  uploadDate: string;
  description?: string;
  views?: number;
  likes?: number;
  duration?: number;
  creator?: string;
}

interface PlayerPageProps {
  params: {
    videoName: string;
  };
}

interface ErrorState {
  message: string;
  type: 'error' | 'warning';
}

const PlayerPage: React.FC<PlayerPageProps> = ({ params }) => {
  const { videoName } = params;
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/videos/getAllVideos');
        const videos = response.data;

        const matchedVideo = videos.find((video: VideoData) => video.name === videoName);
        if (matchedVideo) {
          setVideoData(matchedVideo);
        } else {
          setError({
            message: `Video "${videoName}" not found.`,
            type: 'warning'
          });
        }
      } catch (error) {
        setError({
          message: 'Failed to load video. Please try again later.',
          type: 'error'
        });
        console.error('Error fetching video data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoName) {
      fetchVideoData();
    }
  }, [videoName]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoData?.name || 'Video',
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
    // You might want to add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
            <Skeleton className="h-[400px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <Alert variant={error.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!videoData) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-center text-gray-900">
              {videoData.name}
            </h1>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(videoData.uploadDate).toLocaleDateString()}
              </span>
              {videoData.duration && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(videoData.duration)}
                </span>
              )}
              {videoData.views && (
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {videoData.views.toLocaleString()} views
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full lg:w-3/4 xl:w-2/3">
              <VideoPlayer videoData={videoData} />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-b py-4">
            <div className="flex items-center space-x-4">
              {videoData.creator && (
                <span className="text-sm font-medium">
                  Created by: {videoData.creator}
                </span>
              )}
              {videoData.likes !== undefined && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{videoData.likes.toLocaleString()}</span>
                </Button>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={copyToClipboard}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {videoData.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {videoData.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;