import prisma from "@/lib/prisma";
import { Policies, columns } from "./columns";
import { DataTable } from "./data-table";
import AddForm from "./form";

async function getData(): Promise<Policies[]> {
  const data = await prisma.policies.findMany({});
  return Response.json(data).json();
}

export default async function Page() {
  const data = await getData();

  return (
    <>
      <div className="container flex justify-end">
        <AddForm />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
