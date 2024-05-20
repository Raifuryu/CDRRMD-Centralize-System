import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-row items-center p-24 flex-wrap justify-center w-[80]">
      <span className="m-2">
        <button>
          <Link href="/training">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Training System</CardTitle>
                <CardDescription>
                  Training - Information and Management System
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </button>
      </span>
      <span className="m-2">
        <button>
          <Link href="/contact-directory">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Directory System</CardTitle>
                <CardDescription>Contact directory</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </button>
      </span>
      <span className="m-2">
        <button>
          <Link href="/critical-infrastructure">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Infrastructure</CardTitle>
                <CardDescription>Critical infrastructure</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </button>
      </span>
      <span className="m-2">
        <button>
          <Link href="/evacuation-centers">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Evacuation Centers</CardTitle>
                <CardDescription>Evacuation Centers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </button>
      </span>
      <span className="m-2">
        <button>
          <Link href="/human-resource-information-system">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>HRIS</CardTitle>
                <CardDescription>
                  Human Resource - Information System
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </button>
      </span>
    </main>
  );
}
