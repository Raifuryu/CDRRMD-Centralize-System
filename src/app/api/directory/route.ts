"use server";
import prisma from "@/lib/prisma";
import z from "zod";
import { PersonPhoneNumberSchema, PersonEmailAddressSchema } from "@/schemas/definitions";


type PersonEmailAddress = z.infer<typeof PersonEmailAddressSchema>;
type PersonPhoneNumber = z.infer<typeof PersonPhoneNumberSchema>;

// Get all Person Data
export async function GET() {
  const data = await prisma.person.findMany({
    include: {
      office: true,
      PhoneNumber: true,
      EmailAddress: true,
      PersonTag: {
        include: {
          tag: true,
        },
      },
    },
  });

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
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
    body.phoneNumber.map(async (e: PersonPhoneNumber) => {
      if (e.number.trim() != "")
        await prisma.personPhoneNumber.create({
          data: {
            personId: personId,
            number: e.number,
            statusId: e.status === true ? 1 : 2,
          },
        });
    });
  }

  if (body.emailAddress.length > 0) {
    body.emailAddress.map(async (e: PersonEmailAddress) => {
      if (e.email.trim() != "")
        await prisma.personEmailAddress.create({
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

export async function PUT(request: Request) {
  const body = await request.json();
  let updated = false;

  const personData = await prisma.person.findUnique({
    where: {
      id: body.id,
    },
  });

  if (
    !personData ||
    personData.firstName !== body.firstName ||
    personData.middleName !== body.middleName ||
    personData.lastName !== body.lastName ||
    personData.extensionName !== body.extensionName ||
    personData.officeId !== body.officeId
  ) {
    updated = true;
    await prisma.person.update({
      where: {
        id: body.id,
      },
      data: {
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        extensionName: body.extensionName,
        officeId: body.officeId,
      },
    });
  }

  // Fetch existing phone numbers
  const numberData = await prisma.personPhoneNumber.findMany({
    where: { personId: body.id },
  });

  // Create or update phone numbers
  await Promise.all(
    body.phoneNumber.map(
      async (phoneNumber: PersonPhoneNumber, index: number) => {
        // If the index is within the existing numberData length, update the number
        if (index < numberData.length) {
          const existingNumber = numberData[index];
          if (
            existingNumber.number !== phoneNumber.number ||
            existingNumber.statusId !== (phoneNumber.status === true ? 1 : 2)
          ) {
            await prisma.personPhoneNumber.update({
              where: { id: existingNumber.id },
              data: {
                number: phoneNumber.number,
                statusId: phoneNumber.status === true ? 1 : 2,
              },
            });
            updated = true;
          }
        } else {
          // If index exceeds the existing numberData length, create new numbers
          const exist = await prisma.personPhoneNumber.count({
            where: { personId: body.id, number: phoneNumber.number },
          });
          if (!exist || phoneNumber.number.trim() != "")
            await prisma.personPhoneNumber.create({
              data: {
                personId: body.id,
                number: phoneNumber.number,
                statusId: phoneNumber.status === true ? 1 : 2,
              },
            });
          updated = true;
        }
      }
    )
  );

  // Delete extra phone numbers if present
  if (numberData.length > body.phoneNumber.length) {
    const numbersToDelete = numberData.slice(body.phoneNumber.length);
    await Promise.all(
      numbersToDelete.map(
        async ({ id, statusId }: { id: number; statusId: number }) => {
          if (statusId === 2)
            await prisma.personPhoneNumber.update({
              where: { id: id },
              data: {
                statusId: 2,
              },
            });
          updated = true;
        }
      )
    );
  }

  // Fetch existing email numbers
  const emailData = await prisma.personEmailAddress.findMany({
    where: { personId: body.id },
  });

  // Create or update email numbers
  await Promise.all(
    body.emailAddress.map(
      async (emailAddress: PersonEmailAddress, index: number) => {
        // If the index is within the existing numberData length, update the number
        if (index < emailData.length) {
          const existingEmail = emailData[index];
          if (
            existingEmail.email !== emailAddress.email ||
            existingEmail.statusId !== (emailAddress.status === true ? 1 : 2)
          ) {
            await prisma.personEmailAddress.update({
              where: { id: existingEmail.id },
              data: {
                email: emailAddress.email,
                statusId: emailAddress.status === true ? 1 : 2,
              },
            });
            updated = true;
          }
        } else {
          // If index exceeds the existing numberData length, create new email
          const exist = await prisma.personEmailAddress.count({
            where: { personId: body.id, email: emailAddress.email },
          });
          if (!exist)
            await prisma.personEmailAddress.create({
              data: {
                personId: body.id,
                email: emailAddress.email,
                statusId: emailAddress.status === true ? 1 : 2,
              },
            });
          updated = true;
        }
      }
    )
  );

  // Delete extra email address if present
  if (emailData.length > body.emailAddress.length) {
    const emailToDelete = emailData.slice(body.emailAddress.length);
    await Promise.all(
      emailToDelete.map(async ({ id }: { id: number }) => {
        await prisma.personEmailAddress.update({
          where: { id: id },
          data: {
            statusId: 2,
          },
        });
        updated = true;
      })
    );
  }

  // personTags
  // Fetch existing tag
  const personTagData = await prisma.personTag.findMany({
    where: { personId: body.id },
  });

  // Create or update tag
  await Promise.all(
    body.tag.map(async (tagId: number, index: number) => {
      // If the index is within the existing tag length, update the tag
      if (index < personTagData.length) {
        const existingTag = personTagData[index];
        if (existingTag.tagId !== tagId) {
          await prisma.personTag.update({
            where: { id: existingTag.id },
            data: { tagId: tagId },
          });
          updated = true;
        }
      } else {
        // If index exceeds the existing tag length, create new tag
        await prisma.personTag.create({
          data: {
            personId: body.id,
            tagId: tagId,
          },
        });
        updated = true;
      }
    })
  );

  // Delete extra tag tag if present
  if (personTagData.length > body.tag.length) {
    const tagToDelete = personTagData.slice(body.tag.length);
    await Promise.all(
      tagToDelete.map(async ({ id }: { id: number }) => {
        await prisma.personTag.delete({
          where: { id: id },
        });
        updated = true;
      })
    );
  }

  return Response.json({ updated: updated });
}
