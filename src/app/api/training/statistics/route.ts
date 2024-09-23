"use server";
import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.course.findMany({
    distinct: ["name"],
    include: {
      _count: {
        select: {
          TrainingCourse: true,
        },
      },
      TrainingCourse: {
        include: {
          training: {
            include: {
              TrainingParticipants: true,
            },
          },
        },
      },
    },
  });

  return Response.json(data);
}
