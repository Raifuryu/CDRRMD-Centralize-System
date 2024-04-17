"use server";
import prisma from "@/lib/prisma";

export async function GET() {
  const data = await prisma.tag.findMany({});

  return Response.json(data);
}

// export async function POST(request: Request) {
//   const body = await request.json();
//   let id = 0;
//   const duplicate = await prisma.person.findFirst({
//     where: {
//       firstName: body.firstName,
//       lastName: body.lastName,
//     },
//   });

//   if (duplicate) {
//     id = duplicate.id;
//   }
//   await prisma.person.upsert({
//     where: {
//       id: id,
//     },
//     update: {
//       firstName: body.firstName,
//       middleName: body.middleName,
//       lastName: body.lastName,
//       extensionName: body.extensionName,
//       officeId: body.officeId,
//       ...(body.phoneNumber && {
//         phoneNumber: {
//           create: { number: body.phoneNumber },
//         },
//       }),
//       ...(body.emailAddress && {
//         emailAddress: {
//           create: { email: body.emailAddress },
//         },
//       }),
//     },
//     create: {
//       firstName: body.firstName,
//       middleName: body.middleName,
//       lastName: body.lastName,
//       extensionName: body.extensionName,
//       officeId: body.officeId,
//       ...(body.phoneNumber && {
//         phoneNumber: {
//           create: { number: body.phoneNumber },
//         },
//       }),
//       ...(body.emailAddress && {
//         emailAddress: {
//           create: { email: body.emailAddress },
//         },
//       }),
//     },
//   });

//   return Response.json({ success: true });
// }
