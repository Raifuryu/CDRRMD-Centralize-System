import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button>
        <Link href="/directory">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Directory System</CardTitle>
              <CardDescription>Centralized CDRRMD - Directory</CardDescription>
            </CardHeader>
            <CardContent>Directory</CardContent>
            {/* <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter> */}
          </Card>
        </Link>
      </button>
    </main>
  );
}
