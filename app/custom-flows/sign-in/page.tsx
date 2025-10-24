"use client";

import { useState } from "react";
import {
  useSignIn,
  useSignUp,
  useClerk,
} from "@clerk/nextjs";

export default function CustomSignInPage() {
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const { client } = useClerk();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // 1️⃣ Start sign-in with email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn.create({
        identifier: email,
        strategy: "email_code",
      });

      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || "Failed to send OTP");
    }
  };

  // 2️⃣ Verify OTP and finish sign-in
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.replace("/");
      } else {
        console.log("Next step:", result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || "Invalid or expired OTP");
    }
  };

  // 3️⃣ OAuth sign-in
  const handleOAuth = async (provider: string) => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error(err);
      setError("OAuth failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-semibold mb-4">Custom Sign In Flow</h1>

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4 w-80">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded text-black"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 rounded py-2"
          >
            Send OTP
          </button>

          <div className="text-center text-gray-400">or</div>

          <button
            type="button"
            onClick={() => handleOAuth("github")}
            className="bg-gray-800 hover:bg-gray-700 rounded py-2"
          >
            Continue with GitHub
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="bg-red-600 hover:bg-red-700 rounded py-2"
          >
            Continue with Google
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 w-80">
          <input
            type="text"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="p-2 rounded text-black"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 rounded py-2"
          >
            Verify OTP
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      )}
    </main>
  );
}