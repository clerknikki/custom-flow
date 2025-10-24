"use client";
import { useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function SSOCallback() {
  const { isSignedIn } = useAuth();
  const { redirectToSignIn } = useClerk();

  useEffect(() => {
    if (!isSignedIn) redirectToSignIn();
    else window.location.replace("/");
  }, [isSignedIn]);

  return <p className="text-white">Processing login...</p>;
}