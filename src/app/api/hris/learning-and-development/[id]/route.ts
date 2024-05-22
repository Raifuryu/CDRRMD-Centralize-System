import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(params.id);
  const data = await prisma.person.findMany({
    where: {
      id: parseInt(params.id.replace(/\D/g, "")),
    },
  });

  return Response.json(data);
}
