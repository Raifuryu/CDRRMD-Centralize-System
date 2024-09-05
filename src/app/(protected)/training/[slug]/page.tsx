import prisma from "@/lib/prisma";
import View from "./view";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import SheetAdd from "./sheet-add";
import ExistingParticipants from "./existing-participants";
import fs from "fs";
import path from "path";

const getDocumentationData = (trainingId: string) => {
  const directoryPath = path.join(
    process.cwd(),
    "public/uploads/training",
    `${trainingId}/documentation`
  );

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  return fs.readdirSync(directoryPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return (
      ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".gif"
    );
  });
};

const getPersonData = async () => {
  const data = await prisma.person.findMany({});

  return data.map((person) => ({
    value: person.id.toString(),
    label: `${person.firstName} ${person.lastName}`,
  }));
};

const getTrainerData = async (id: string) => {
  const data = await prisma.office.findUnique({ where: { id: parseInt(id) } });
  return Response.json(data).json();
};

const getOfficeData = async () => {
  const data = await prisma.office.findMany();

  const transformedData = data.map((data) => ({
    value: data.id.toString(),
    label: data.acronym,
  }));

  return transformedData;
};

const getCourseData = async () => {
  const data = await prisma.course.findMany();
  return Response.json(data).json();
};

const getTrainingData = async (id: string) => {
  const data = await prisma.training.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      TrainingDocuments: true,
      TrainingCourse: {
        include: {
          course: true,
        },
      },
      TrainingHost: true,
      requestingOffice: true,
    },
  });

  return Response.json(data).json();
};

const getBarangayData = async () => {
  const data = await prisma.barangay.findMany();

  const transformedData = data.map((barangay) => ({
    value: barangay.id.toString(),
    label: barangay.name,
  }));

  return transformedData;
};

const getParticipantsData = async (id: string) => {
  const data = await prisma.trainingParticipants.findMany({
    where: {
      trainingId: parseInt(id, 10), // Ensure the id is parsed as an integer
      status: "Active",
    },
    include: {
      person: {
        include: {
          PersonAddress: {
            select: {
              partialAddress: true,
              barangay: true,
              sitio: true,
            },
          },
        },
      },
      UniqueSerial: {
        select: {
          host: true,
          year: true,
          batchNumber: true,
          participantNumber: true,
        },
      },
    },
  });

  // Convert 'year' from string to number
  const transformedData = data.map((item) => ({
    ...item,
    UniqueSerial: {
      host: item.UniqueSerial[0].host,
      year: parseInt(item.UniqueSerial[0].year, 10), // Convert year to integer
      batchNumber: item.UniqueSerial[0].batchNumber,
      participantNumber: item.UniqueSerial[0].participantNumber,
    },
  }));

  return transformedData;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const trainingData = await getTrainingData(params.slug);
  const trainerData = await getTrainerData(
    trainingData.TrainingHost.map(
      ({ trainerId }: { trainerId: number }) => trainerId
    ).toString() || 1
  );
  const officeData = await getOfficeData();
  const personData = await getPersonData();
  const courseData = await getCourseData();
  const barangayData = await getBarangayData();
  const participantData = await getParticipantsData(params.slug);
  const documentationData = getDocumentationData(params.slug);

  return (
    <main>
      <View
        trainingData={trainingData}
        documentationData={documentationData}
        trainerData={trainerData}
        courseData={courseData}
        officeData={officeData}
      />
      {/* <div className="container">
        <Separator className="my-4 h-1 w-full bg-black rounded-lg" />
      </div> */}
      <div className="container grid gap-4 border rounded-2xl shadow-md mt-5">
        <ExistingParticipants
          trainingId={params.slug}
          participantIds={participantData.map(({ personId }) =>
            personId.toString()
          )}
          personOptions={personData}
          barangayData={barangayData}
          isCanceled={trainingData.status == "Canceled" ? true : false}
        />
        {/* <Separator /> */}
        <DataTable columns={columns} data={participantData} />
      </div>
    </main>
  );
}
