"use server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  //   const data = await prisma.training.findMany({ data: {} });

  //   return Response.json(data);
}
