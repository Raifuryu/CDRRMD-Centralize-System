"use server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.course.length > 0) {
    const postedData = await prisma.training.create({
      data: {
        trainerId: parseInt(body.trainer),
        venue: body.venue,
        startDate: body.date.from,
        endDate: body.date.to,
        pax: parseInt(body.pax),
        remarks: body.remarks,
        contactPerson: body.contactPerson,
        contactNumber: body.contactNumber,
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

    body.office?.map(async (e: string) => {
      await prisma.trainingOffice.create({
        data: {
          trainingId: postedData.id,
          officeId: parseInt(e),
        },
      });
    });
    console.log("done");
    return Response.json({ success: true });
  }
  return Response.json({ success: false });
}
