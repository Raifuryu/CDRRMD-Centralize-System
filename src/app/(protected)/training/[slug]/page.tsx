import prisma from "@/lib/prisma";
import View from "./view";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import SheetAdd from "./sheet-add";

const getTrainerData = async (id: number) => {
  const data = await prisma.office.findUnique({ where: { id: id } });
  return Response.json(data).json();
};

const getTrainingData = async (id: string) => {
  const data = await prisma.training.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      TrainingCourse: {
        include: {
          course: true,
        },
      },
      TrainingOffice: {
        include: {
          office: true,
        },
      },
    },
  });

  return Response.json(data).json();
};

export default async function Page({ params }: { params: { slug: string } }) {
  const trainingData = await getTrainingData(params.slug);
  const trainerData = await getTrainerData(trainingData.trainerId);
  return (
    <main>
      <View trainingData={trainingData} trainerData={trainerData} />
      <div className="container">
        <Separator className="my-4" />
      </div>
      <div className="container">
        <h4 className="m-5">Participants</h4>
        <DataTable columns={columns} data={[]} />
      </div>
      <SheetAdd />
    </main>
  );
}
