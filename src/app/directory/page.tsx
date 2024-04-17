import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import ViewForm from "./view-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const getDirectoryData = async () => {
  const res = await fetch("http://localhost:3000/api/directory", {
    next: { tags: ["person"] },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getOfficeData = async () => {
  const res = await fetch("http://localhost:3000/api/office", {
    next: { tags: ["office"] },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getTagData = async () => {
  const res = await fetch("http://localhost:3000/api/tag", {
    next: { tags: ["tag"] },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default async function DirectoryPage() {
  const directoryData = await getDirectoryData();
  const officeData = await getOfficeData();
  const tagData = await getTagData();

  return (
    <main>
      <div className="flex h-full">
        <div className="w-3/4 p-4">
          <div className="rounded-2xl border p-4">
            <DataTable columns={columns} data={directoryData} />
          </div>
        </div>
        <div className="w-1/4 p-4 sticky">
          {/* Ensure the ScrollArea component properly handles its content */}
          <ScrollArea className="rounded-2xl border p-4">
            {/* Ensure enough content inside ViewForm for scrolling */}
            <ViewForm officeData={officeData} tagData={tagData} />
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
