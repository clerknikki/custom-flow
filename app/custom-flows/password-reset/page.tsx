"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function PasswordResetPage() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"start" | "verify" | "done">("start");
  const [message, setMessage] = useState("");

  const handleRequestReset = async () => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStage("verify");
    } catch (err: any) {
      setMessage(err.errors?.[0]?.message || "Something went wrong.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result.status === "complete") {
        setStage("done");
      }
    } catch (err: any) {
      setMessage(err.errors?.[0]?.message || "Invalid code or password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>

      {stage === "start" && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded p-2 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleRequestReset}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Send Reset Code
          </button>
        </>
      )}

      {stage === "verify" && (
        <>
          <input
            type="text"
            placeholder="Enter the code sent to your email"
            className="border rounded p-2 mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="border rounded p-2 mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="bg-green-500 text-white p-2 rounded"
          >
            Reset Password
          </button>
        </>
      )}

      {stage === "done" && (
        <p className="text-green-600">✅ Password successfully reset!</p>
      )}

      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
