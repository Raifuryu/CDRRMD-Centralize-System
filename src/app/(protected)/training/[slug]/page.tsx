import prisma from "@/lib/prisma";
import View from "./view";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";

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
  return (
    <main>
      <View trainingData={trainingData} />
      <div className="container">
        <Separator className="my-4" />
      </div>
      <div className="container">
        <h4 className="m-5">Participants</h4>
        <DataTable columns={columns} data={[]} />
      </div>
    </main>
  );
}
