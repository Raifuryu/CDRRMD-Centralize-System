import prisma from "@/lib/prisma";
import { columns } from "./person-columns";
import { DataTable } from "./data-table";
import { GetServerSideProps } from 'next';

interface DirectoryPageProps {
  directoryData: any;
  officeData: any;
  tagData: any;
}

export const getServerSideProps: GetServerSideProps<DirectoryPageProps> = async () => {
  const directoryData = await prisma.person.findMany({
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

  const officeData = await prisma.office.findMany({});
  const tagData = await prisma.tag.findMany({});

  return {
    props: {
      directoryData,
      officeData,
      tagData,
    },
  };
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ directoryData, officeData, tagData }) => {
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

export default DirectoryPage;