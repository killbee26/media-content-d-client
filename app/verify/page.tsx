"use client";
import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth'; // Direct import of confirmSignUp function
import { Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports'
Amplify.configure(awsExports);
export default function VerifyAccount() {
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Using an object for the confirmSignUp function
      await confirmSignUp({ username: email, confirmationCode: code });
      setSuccess('Account verified successfully! You can now log in.');
    } catch (err) {
      setError((err as Error).message || 'Failed to verify account.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold mb-4">Verify Your Account</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-4"
            required
          />
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-4"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white p-2 rounded"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
}
