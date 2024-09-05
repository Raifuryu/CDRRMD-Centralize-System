import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import UserButton from "./userButton";
import Image from "next/image";
import { Button } from "./ui/button";

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 bg-background px-3 shadow-sm z-10 bg-white">
      <nav className="mx-auto flex h-14 w-full items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Image
            src="/favicon.ico"
            alt="User profile picture"
            width={40}
            height={40}
            className="aspect-square rounded-full bg-background object-cover"
          />
          <Link href="/" className="font-bold">
            CDRRMD - Centralize System
          </Link>
        </div>
        {user ? <UserButton user={user} /> : <SignInButton />}
      </nav>
    </header>
  );
}

function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  );
}
