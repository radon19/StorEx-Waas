"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { PrimaryButton, GhostButton } from "./Button";
import { Logo } from "./Logo";

function Header() {
  const { data: session } = useSession();
  return (
    <header className="border-b border-abyss-700 bg-abyss-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            {session?.user ? (
              <PrimaryButton onClick={() => signOut()}>Logout</PrimaryButton>
            ) : (
              <GhostButton onClick={() => signIn("google")}>Sign In</GhostButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;