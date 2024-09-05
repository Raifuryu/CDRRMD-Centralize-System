import prisma from "@/lib/prisma";
import { columns } from "./person-columns";
import { DataTable } from "./data-table";

const getDirectoryData = async () => {
  const data = await prisma.person.findMany({
    include: {
      office: true,
      PhoneNumber: true,
      EmailAddress: true,
      PersonTag: {
        include: {
          tag: true,
        },
      },
    },
  });

  return Response.json(data).json();
};

const getOfficeData = async () => {
  const data = await prisma.office.findMany({});

  return Response.json(data).json();
};

const getTagData = async () => {
  const data = await prisma.tag.findMany({});

  return Response.json(data).json();
};

export default async function DirectoryPage() {
  const directoryData = await getDirectoryData();
  const officeData = await getOfficeData();
  const tagData = await getTagData();

  return (
    <main className="h-screen">
      <DataTable
        columns={columns}
        data={directoryData}
        officeData={officeData}
        tagData={tagData}
      />
    </main>
  );
}
