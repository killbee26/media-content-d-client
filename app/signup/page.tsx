"use client";
import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { SignUpInput, SignUpOutput, signUp } from 'aws-amplify/auth';
import awsExports from '../../src/aws-export'; // Path to your aws-exports file
import { useRouter } from 'next/navigation';
Amplify.configure(awsExports);

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUp({ username: email, password });
      console.log('Signup successful! Please confirm your email.');
      router.push('/verify');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignup}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-4"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white p-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
