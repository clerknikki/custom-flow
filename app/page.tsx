"use client";

import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <SignedOut>
        <SignInButton>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p className="mb-4">You are signed in!</p>
        <SignOutButton>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Sign Out</button>
        </SignOutButton>
      </SignedIn>
    </main>
  );
}
