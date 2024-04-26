import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center p-24">
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
    </main>
  );
}
