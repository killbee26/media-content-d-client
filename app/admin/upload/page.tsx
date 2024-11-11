"use client";
import { useEffect, useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../src/aws-export';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';

Amplify.configure(awsExports);

export default function Admin() {
  const [user, setUser] = useState<any | null>(null);
  const [videos, setVideos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const currentSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session && session.tokens) {
          const { accessToken, idToken } = session.tokens;
          if (accessToken && idToken) {
            setUser({ accessToken, idToken });
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        router.push('/login');
      }
    };

    currentSession();
  }, [router]);

  const onDrop = (acceptedFiles: File[]) => {
    setVideos((prevVideos) => [...prevVideos, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: '.mp4, .avi, .mov, .wmv, .flv, .mkv', // Restrict to specific video file types
  });

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const formData = new FormData();
      formData.append('video', video); // Append the video file to the form data

      try {
        const response = await api.post('/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Video uploaded successfully:', response.data);

        // Update progress
        setUploadProgress(((i + 1) / videos.length) * 100);

      } catch (error) {
        console.error(`Error uploading video ${video.name}:`, error);
        alert(`Failed to upload ${video.name}. Please try again.`);
        break;
      }
    }

    setUploading(false);
    setUploadProgress(0);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Upload Video Content</h2>
        
        {/* Drag-and-drop area */}
        <div
          {...getRootProps({
            className: 'border-2 border-dashed border-gray-400 p-6 rounded-md cursor-pointer mb-4 text-center'
          })}
        >
          <input {...getInputProps()} />
          <p>Drag & drop video files here, or</p>
          <button
            type="button"
            onClick={open}
            className="text-blue-500 underline focus:outline-none"
          >
            browse files
          </button>
        </div>

        {/* Display selected videos */}
        <ul className="mb-4">
          {videos.map((video, index) => (
            <li key={index} className="text-sm text-gray-700">
              {video.name}
            </li>
          ))}
        </ul>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 rounded-md ${uploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {uploading ? 'Uploading...' : 'Upload Videos'}
        </button>

        {/* Progress bar */}
        {uploading && (
          <div className="w-full bg-gray-200 h-4 rounded mt-4">
            <div
              className="bg-blue-500 h-4 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
