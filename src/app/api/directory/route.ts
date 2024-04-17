"use server";
import prisma from "@/lib/prisma";
import { EmailAddress, PhoneNumber } from "@prisma/client";

export async function GET() {
  const data = await prisma.person.findMany({
    include: {
      office: true,
      phoneNumber: true,
      emailAddress: true,
      personTag: {
        include: {
          tag: true,
        },
      },
    },
  });

  // const data = await prisma.phoneNumber.findMany({
  //   include: {
  //     person: {
  //       include: {
  //         emailAddress: true
  //       },
  //     },
  //   },
  // });

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const status = await prisma.person.create({
    data: {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      extensionName: body.extensionName,
      officeId: body.officeId,
    },
  });

  const personId = status.id;

  if (body.phoneNumber.length > 0) {
    body.phoneNumber.map(async (e: PhoneNumber) => {
      if (e.number.trim() != "")
        await prisma.phoneNumber.create({
          data: {
            personId: personId,
            number: e.number,
          },
        });
    });
  }

  if (body.emailAddress.length > 0) {
    body.emailAddress.map(async (e: EmailAddress) => {
      if (e.email.trim() != "")
        await prisma.emailAddress.create({
          data: {
            personId: personId,
            email: e.email,
          },
        });
    });
  }

  if (body.tag.length > 0) {
    body.tag.map(async (e: number) => {
      await prisma.personTag.create({ data: { personId: personId, tagId: e } });
    });
  }

  return Response.json({ success: true });
}
