"use client";

import { useState } from "react";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";

export default function PasswordFlow() {
  const { signIn, setActive } = useSignIn();
  const { user } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"signIn" | "reset" | "mfa" | "done">("signIn");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      // If MFA is required, switch to the MFA step
      if (result.status === "needs_second_factor") {
        setStage("mfa");
        return;
      }

      // If complete, set the active session
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStage("done");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign-in failed");
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // If user has backup code, toggle useBackupCode = true
      const result = await signIn.attemptSecondFactor({
        strategy: "totp", // or 'backup_code'
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStage("done");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "MFA verification failed");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      if (result.status === "needs_first_factor") {
        alert("Password reset email sent!");
        setStage("signIn");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Password reset failed");
    }
  };

  if (stage === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-2xl mb-4">Welcome back, {user?.firstName || "friend"} 👋</h1>
        <SignOutButton>
          <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      {stage === "signIn" && (
        <form onSubmit={handleSignIn} className="flex flex-col gap-3 w-80">
          <h2 className="text-xl font-bold">Sign in with Password</h2>
          <input
            type="email"
            placeholder="Email"
            className="text-black p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="text-black p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
          <button
            type="button"
            className="underline text-sm mt-2"
            onClick={() => setStage("reset")}
          >
            Forgot password?
          </button>
        </form>
      )}

      {stage === "reset" && (
        <form onSubmit={handlePasswordReset} className="flex flex-col gap-3 w-80">
          <h2 className="text-xl font-bold">Reset Password</h2>
          <input
            type="email"
            placeholder="Email"
            className="text-black p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            Send Reset Email
          </button>
        </form>
      )}

      {stage === "mfa" && (
        <form onSubmit={handleMfaVerify} className="flex flex-col gap-3 w-80">
          <h2 className="text-xl font-bold">MFA Verification</h2>
          <input
            type="text"
            placeholder="Enter code from app"
            className="text-black p-2 rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
            Verify Code
          </button>
        </form>
      )}
    </main>
  );
}
