import prisma from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getDirectoryData = async () => {
  const data = await prisma.person.findMany({
    include: {
      office: true,
      phoneNumber: true,
      emailAddress: true,
      personTag: {
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
    <main>
      <DataTable
        columns={columns}
        data={directoryData}
        officeData={officeData}
        tagData={tagData}
      />
    </main>
  );
}
