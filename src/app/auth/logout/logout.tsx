"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export default function Logout() {
  return (
    <main>
      <Button onClick={() => logout()}>Logout</Button>
    </main>
  );
}
