"use client";
import { useEffect, useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth'; // Import the function for fetching auth session
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);
export default function Admin() {
  const [user, setUser] = useState<any | null>(null); // Specify the type for user
  const router = useRouter();

  useEffect(() => {
    const currentSession = async () => {
      try {
        const session = await fetchAuthSession(); // Fetch the session
        if (session && session.tokens) {
          const { accessToken, idToken } = session.tokens;
          if (accessToken && idToken) {
            // User is authenticated
            console.log("this was ran 1");
            setUser({ accessToken, idToken });
          } else {
            // No tokens found, redirect to login
            console.log("this was ran no tokens were found");
            router.push('/login');
          }
        } else {
          // No valid session, redirect to login
          console.log("this was ran no valid session");
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        router.push('/login'); // Redirect to login on error
      }
    };

    currentSession(); // Call the async function inside useEffect
  }, [router]); // Add router as a dependency

  if (!user) return <p>Loading...</p>; // Show loading until the session is fetched

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Upload Video</h2>
        {/* Admin content */}
      </div>
    </div>
  );
}
