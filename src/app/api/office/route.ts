"use server";

import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.office.findMany({});

  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  if (body) {
    const isExisting = await prisma.office.findFirst({
      where: {
        name: body.name,
      },
    });
    if (!isExisting) {
      await prisma.office.create({
        data: {
          name: body.name,
          acronym: body.acronym,
          address: body.address,
        },
      });
      console.log("added");
      return Response.json({ message: "New Office Added", success: true });
    }
    return Response.json({
      message: "Office is already added",
      success: false,
    });
  }
  console.log("aw");
  return Response.json({ message: "No Data Passed", success: false });
}
