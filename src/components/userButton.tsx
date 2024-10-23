import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import { LogOut, Settings, Lock } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { auth, signOut } from "@/auth";

interface UserButtonProps {
  user: User;
}

export default async function UserButton({ user }: UserButtonProps) {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user.image || "https://github.com/shadcn.png"}
            alt="User profile picture"
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex justify-center">
          {user.name || "User"}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="flex justify-center">
          {session?.user.officeAcronym || "User"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/settings">
              <button type="submit" className="flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </button>
            </Link>
          </DropdownMenuItem>
          {/* TODO: Show this only for admins */}
          {session?.user.type == "admin" ? (
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <button type="submit" className="flex w-full items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Admin
                </button>
              </Link>
            </DropdownMenuItem>
          ) : (
            ""
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {/* TODO: Add a logout functionality */}
          <form
            className="flex w-full items-center"
            action={async () => {
              "use server";
              await signOut(); // This will be executed on the server side
            }}
          >
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
