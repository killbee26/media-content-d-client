"use client";
import { useState } from 'react';
import { signIn, SignInInput } from '@aws-amplify/auth';  // Import signIn and SignInInput
import { Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-export'; // Path to your aws-exports file
import { useRouter } from 'next/navigation';
Amplify.configure(awsExports);
export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);  // Clear any previous error

    const input: SignInInput = {  // Create a SignInInput object
      username: email,
      password: password
    };

    try {
      // Use signIn directly with the input object
      await signIn(input);
      console.log('Logged in successfully');
      router.push('/home');
      // Redirect user or show authenticated content
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-4"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white p-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
