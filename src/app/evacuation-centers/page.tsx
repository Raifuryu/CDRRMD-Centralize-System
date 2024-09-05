import prisma from "@/lib/prisma";
import { EvacuationCenter, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<EvacuationCenter[]> {
  const data = await prisma.evacuationCenter.findMany({});
  return Response.json(data).json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
