import React from 'react'
import Link from 'next/link';


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

const homePage: React.FC = () => {
  return (
    <div>
    <h1>Video List</h1>
    <ul>
      {videoData.map((video, index) => (
        <li key={index}>
          <Link href={`/player?videoName=${video.name}`}>
            <a>{video.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default homePage