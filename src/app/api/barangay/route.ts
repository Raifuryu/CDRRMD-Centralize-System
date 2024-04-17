import prisma from "@/lib/prisma";

export const dynamic = "force-static";

export async function GET() {
  const data = await prisma.barangay.findMany({});

  return Response.json(data);
}
