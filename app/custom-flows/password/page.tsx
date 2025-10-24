"use client";
import { useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";

export default function PasswordFlow() {
  const { signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      console.log("Sign in result:", result);

      if (result.status === "needs_second_factor") {
        // redirect user to MFA page
        window.location.href = "/custom-flows/mfa";
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <form onSubmit={handleSubmit} className="flex flex-col w-[400px] gap-4">
        <h2 className="text-2xl font-bold">Email + Password Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="p-2 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
