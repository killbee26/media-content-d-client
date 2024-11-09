// app/page.tsx
"use client";
import React from 'react';
import Link from 'next/link';

const videoData = [
  {
    name: 'testVideo.mp4',
    processedUrls: {
      high: "https://video-content-input.s3.eu-north-1.amazonaws.com/processed/1920x1080/testVideo.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXYKJTXGV5YYGPYH7%2F20241108%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241108T135346Z&X-Amz-Expires=3600&X-Amz-Signature=d672525856de20f1e3794b43d602bf9fdcfc623a21aea838a82c15ada1ee723c&X-Amz-SignedHeaders=host",
           medium : "https://video-content-input.s3.eu-north-1.amazonaws.com/processed/1280x720/testVideo.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXYKJTXGV5YYGPYH7%2F20241108%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241108T135346Z&X-Amz-Expires=3600&X-Amz-Signature=c3922321c422462b478bcc4a2e87929fc0b1f57729746782e95f76c084b05252&X-Amz-SignedHeaders=host",
           low: "https://video-content-input.s3.eu-north-1.amazonaws.com/processed/640x360/testVideo.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXYKJTXGV5YYGPYH7%2F20241108%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241108T135346Z&X-Amz-Expires=3600&X-Amz-Signature=4146019e34227cc391f8a70b97943857a1ccb512b0df8bc961b4d2e2b1b1878d&X-Amz-SignedHeaders=host"
    },
    uploadDate: '2024-11-07T10:03:31Z',
  },
];

const VideoList: React.FC = () => {
  return (
    <div>
      <h1>Video List</h1>
      <ul>
        {videoData.map((video, index) => (
          <li key={index}>
            <Link href={`/player/${encodeURIComponent(video.name)}`}>{video.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
