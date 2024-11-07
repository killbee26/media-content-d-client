"use client";
import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Initialize S3
const s3 = new AWS.S3({
  region: 'us-east-1', // Use your region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  const { fileName } = await req.json();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // Add your bucket name
    Key: fileName, // The file name the user uploaded
    Expires: 60, // The time period for the URL to expire (in seconds)
    ContentType: 'video/mp4', // Ensure correct content type
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Error getting pre-signed URL:', err);
    return NextResponse.json({ error: 'Could not generate URL' }, { status: 500 });
  }
}
