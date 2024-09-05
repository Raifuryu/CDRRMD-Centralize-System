"use server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.course.length > 0) {
    const trainingYear = new Date(body.date.from).getFullYear();
    const dbBatchNumber = await prisma.training.findMany({
      select: {
        batchNumber: true,
      },
      where: {
        startDate: {
          gte: new Date(`${trainingYear}-01-01`),
          lt: new Date(`${trainingYear}-12-31`),
        },
      },
    });

    const previousBatchNumber =
      dbBatchNumber && dbBatchNumber.length > 0
        ? dbBatchNumber[0].batchNumber
        : 0;
    const postedData = await prisma.training.create({
      data: {
        requestingOfficeId: parseInt(body.requestingOffice.id),
        venue: body.venue,
        startDate: body.date.from,
        endDate: body.date.to || body.date.from,
        daysOfTraining: 0,
        pax: parseInt(body.pax),
        remarks: body.remarks,
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
        batchNumber: previousBatchNumber + 1,
      },
    });

    body.course.map(async (e: string) => {
      await prisma.trainingCourse.create({
        data: {
          trainingId: postedData.id,
          courseId: parseInt(e),
        },
      });
    });

    await prisma.trainingHost.create({
      data: {
        trainingId: postedData.id,
        trainerId: parseInt(body.trainer),
      },
    });

    return Response.json({ success: true });
  }
  return Response.json({ success: false });
}
