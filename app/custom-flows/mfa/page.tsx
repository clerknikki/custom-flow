"use client";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function MFAFlow() {
  const { signIn, setActive } = useSignIn();
  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ This is the snippet you mentioned:
      const result = await signIn.attemptSecondFactor({
        strategy: useBackupCode ? "backup_code" : "totp",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else {
        setError("Verification failed. Try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <form onSubmit={handleVerify} className="flex flex-col w-[400px] gap-4">
        <h2 className="text-2xl font-bold">
          {useBackupCode ? "Enter Backup Code" : "Enter Authenticator Code"}
        </h2>
        <input
          type="text"
          placeholder="123456"
          className="p-2 text-black rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Verify
        </button>
        <button
          type="button"
          className="underline text-sm text-gray-400"
          onClick={() => setUseBackupCode(!useBackupCode)}
        >
          {useBackupCode ? "Use authenticator app instead" : "Use backup code instead"}
        </button>
      </form>
    </div>
  );
}
