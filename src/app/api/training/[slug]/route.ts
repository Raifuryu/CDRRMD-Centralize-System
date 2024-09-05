import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { exec } from "child_process";

function getUniqueElements<T>(
  bodyData: T[],
  trainingParticipantsData: T[]
): {
  uniqueBodyData: T[];
  commonBodyData: T[];
  uniqueTrainingParticipantsData: T[];
} {
  const uniqueBodyData = bodyData.filter(
    (item) => !trainingParticipantsData.includes(item)
  );

  const commonBodyData = bodyData.filter((item) =>
    trainingParticipantsData.includes(item)
  );

  const uniqueTrainingParticipantsData = trainingParticipantsData.filter(
    (item) => !bodyData.includes(item)
  );

  return {
    uniqueBodyData,
    commonBodyData,
    uniqueTrainingParticipantsData,
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  let trainingData, serialData;

  if (body.length == 0) {
    return Response.json({ message: "No Data Submitted", success: false });
  }

  const existingData = await prisma.person.findFirst({
    where: {
      firstName: body.findFirst,
      lastName: body.lastName,
    },
  });

  if (
    existingData?.lastName === body.lastName &&
    existingData?.firstName === body.firstName
  ) {
    return Response.json({ message: "Data Already Exists", success: false });
  }

  trainingData = await prisma.training.findFirst({
    where: {
      id: parseInt(body.trainingId),
    },
    include: {
      TrainingHost: {
        include: {
          trainer: {
            select: {
              acronym: true,
            },
          },
        },
      },
    },
  });

  const res = await prisma.person.create({
    data: {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      extensionName: body.extensionName,
      sex: body.sex,
      officeId: 1,
      birthDate: body.birthDate,
      civilStatus: body.civilStatus,
      bloodtype: body.bloodtype,
      isLGBTQ: body.isLGBTQ,
      isPWD: body.isPWD,
      profession: body.profession,
      PersonAddress: {
        create: {
          partialAddress: body.PersonAddress.partialAddress,
          sitio: body.PersonAddress.sitio,
          barangayId: parseInt(body.PersonAddress.barangay),
        },
      },
      PhoneNumber: {
        create: {
          number: body.phoneNumber || "",
          statusId: 1,
        },
      },
      EmailAddress: {
        create: {
          email: body.emailAddress || "",
          statusId: 1,
        },
      },
    },
  });

  if (trainingData) {
    serialData = await prisma.trainingParticipants.aggregate({
      _count: {
        id: true,
      },
      where: {
        trainingId: parseInt(body.trainingId),
      },
    });
  }

  const participant = await prisma.trainingParticipants.create({
    data: {
      trainingId: parseInt(body.trainingId, 10), // Ensure trainingId is parsed as an integer
      personId: res.id,
    },
  });

  if (
    participant?.id &&
    serialData &&
    trainingData &&
    trainingData.startDate &&
    trainingData.TrainingHost
  ) {
    // Step 2: Create the serial data using the participant ID
    await prisma.uniqueSerial.create({
      data: {
        participantId: participant.id, // Use the created participant's ID
        host: trainingData.TrainingHost.map(
          ({ trainer }) => trainer.acronym
        ).toString(),
        year: trainingData.startDate.getFullYear().toString(),
        batchNumber: trainingData.batchNumber,
        participantNumber: serialData._count.id ? serialData._count.id + 1 : 1,
      },
    });
  }

  // if (
  //   serialData &&
  //   trainingData &&
  //   trainingData.startDate &&
  //   trainingData.TrainingHost
  // ) {
  //   newSerialData = await prisma.trainingParticipantsSerial.create({
  //     data: {
  //       participantId: res.id,
  //       host: trainingData?.TrainingHost?.map(
  //         ({ trainer }) => trainer.acronym
  //       ).toString(),
  //       year: trainingData.startDate?.getFullYear().toString(),
  //       batchNumber: trainingData.batchNumber,
  //       participantNumber: serialData._count.id ? serialData._count.id + 1 : 1,
  //     },
  //   });
  // }

  // if (newSerialData?.id) {
  //   await prisma.trainingParticipants.create({
  //     data: {
  //       trainingId: parseInt(body.trainingId),
  //       personId: res.id,
  //     },
  //   });
  // }

  return Response.json({ message: "Created", success: true });
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    if (formData) {
      // Extract files
      const afterActivityReport = formData.get(
        "after_activity_report"
      ) as File | null;
      const documentationFiles = formData.getAll("documentation") as File[];

      // Extract non-file fields
      const id = (formData.get("id") as string).replace(/"/g, "").trim();
      const venue = (formData.get("venue") as string).replace(/"/g, "").trim();
      const date = formData.get("date") as string;
      const pax = (formData.get("pax") as string).replace(/"/g, "").trim();
      const contactPerson = (formData.get("contactPerson") as string)
        .replace(/"/g, "")
        .trim();
      const contactNumber = (formData.get("contactNumber") as string)
        .replace(/"/g, "")
        .trim();
      const remarks = (formData.get("remarks") as string)
        .replace(/"/g, "")
        .trim();
      const requestingOfficeIdStr = (
        formData.get("requestingOfficeId") as string
      )
        .replace(/"/g, "")
        .trim();
      const requestingOfficeId = parseInt(requestingOfficeIdStr, 10);

      const jsonDate = JSON.parse(date);
      const startDate = new Date(jsonDate.from);
      const endDate = new Date(jsonDate.to || jsonDate.from);

      // Directory path for file uploads
      const dirPath = path.join(process.cwd(), `public/uploads/training/${id}`);
      await fs.mkdir(dirPath, { recursive: true });

      // Handle after activity report file if provided
      if (afterActivityReport) {
        const AARbuffer = Buffer.from(await afterActivityReport.arrayBuffer());
        const extension = afterActivityReport.name.split(".").pop();
        const filename = `After_Activity_Report.${extension}`;
        await fs.writeFile(path.join(dirPath, filename), AARbuffer);

        await prisma.trainingDocuments.upsert({
          create: {
            id: parseInt(id),
            afterActivityReport: true,
          },
          update: {
            afterActivityReport: true,
          },
          where: {
            id: parseInt(id),
          },
        });
      }

      // Handle documentation files if provided
      if (documentationFiles.length > 0) {
        // Remove existing documentation directory if it exists
        await fs.rm(path.join(dirPath, "/documentation"), {
          recursive: true,
          force: true,
        });

        // Create new documentation directory
        const documentationDir = path.join(dirPath, "/documentation");
        await fs.mkdir(documentationDir, { recursive: true });

        let numberOfDocumentation = 0;

        for (let i = 0; i < documentationFiles.length; i++) {
          const file = documentationFiles[i];
          const documentationBuffer = Buffer.from(await file.arrayBuffer());
          const extension = file.name.split(".").pop();
          const filename = `Documentation_${i + 1}.${extension}`;
          await fs.writeFile(
            path.join(documentationDir, filename),
            documentationBuffer
          );
          numberOfDocumentation++;
        }

        await prisma.trainingDocuments.update({
          where: {
            id: parseInt(id),
          },
          data: {
            documentation: true,
            numberOfDocumentaions: numberOfDocumentation,
          },
        });
      }

      // Update the training record in the database
      await prisma.training.update({
        where: {
          id: parseInt(id),
        },
        data: {
          venue: venue,
          startDate: startDate,
          endDate: endDate,
          pax: parseInt(pax),
          contactPerson: contactPerson,
          contactNumber: contactNumber,
          remarks: remarks,
          requestingOfficeId: requestingOfficeId,
        },
      });

      console.log("Update successful");
      return NextResponse.json({ Message: "Success", status: 201 });
    }
  } catch (error) {
    const body = await req.json();

    if (body.password) {
      const trainingId = parseInt(body.trainingId);
      const password = body.password;

      const admin = await prisma.account.findFirst({
        where: {
          username: "admin",
        },
      });

      if (admin) {
        const passwordMatched = await bcrypt.compare(password, admin.password);
        if (passwordMatched) {
          await prisma.training.update({
            where: {
              id: trainingId,
            },
            data: {
              status: "Canceled",
            },
          });
          console.log("Canceled");
          return Response.json({ message: "Canceled", success: true });
        }
        console.log("No admin account");
        return Response.json({ message: "Server issue", success: false });
      }
      console.log("Wrong Password");
      return Response.json({ message: "Wrong Password", success: false });
    }

    if (body.TrainingCourse) {
      if (body.TrainingCourse.length == 0) {
        return Response.json({ Message: "No Training Added", status: 400 });
      }
      await prisma.trainingCourse.deleteMany({
        where: { trainingId: parseInt(body.trainingId) },
      });

      body.TrainingCourse.map(async (id: string) => {
        await prisma.trainingCourse.create({
          data: {
            trainingId: parseInt(body.trainingId),
            courseId: parseInt(id),
          },
        });
      });

      return Response.json({ Message: "Success", status: 201 });
    }

    if (body.participantIds) {
      const trainingId = parseInt(body.trainingId);
      let serialData, trainingData, maxParticipantNumber: number;

      // await prisma.trainingParticipants.deleteMany({
      //   where: {
      //     trainingId: trainingId,
      //   },
      // });

      const existingData = await prisma.trainingParticipants.findMany({
        select: {
          personId: true,
        },
        where: {
          trainingId: trainingId,
        },
      });

      const distinctData = getUniqueElements(
        body.participantIds.map((id: string) => parseInt(id, 10)),
        existingData.map(({ personId }) => personId)
      );

      // Exists in DB Data but not in bodyData (Update to Inactive)
      distinctData.uniqueTrainingParticipantsData.map(async (id: number) => {
        const trainingParticipant = await prisma.trainingParticipants.findFirst(
          {
            where: {
              trainingId: trainingId,
              personId: id,
            },
            select: {
              id: true,
            },
          }
        );

        await prisma.trainingParticipants.update({
          where: {
            id: trainingParticipant!.id,
          },
          data: {
            status: "Inactive",
          },
        });
      });

      // Exists in both DB Data and bodyData (Update to Active)
      distinctData.commonBodyData.map(async (id: number) => {
        const trainingParticipant = await prisma.trainingParticipants.findFirst(
          {
            where: {
              trainingId: trainingId,
              personId: id,
            },
            select: {
              id: true,
            },
          }
        );
        await prisma.trainingParticipants.update({
          where: {
            id: trainingParticipant!.id,
          },
          data: {
            status: "Active",
          },
        });
      });

      // Exists in bodyData but not in DB Data (Add)
      trainingData = await prisma.training.findFirst({
        where: {
          id: trainingId,
        },
        include: {
          TrainingHost: {
            include: {
              trainer: {
                select: {
                  acronym: true,
                },
              },
            },
          },
        },
      });

      serialData = await prisma.trainingParticipants.aggregate({
        _count: {
          id: true,
        },
        where: {
          trainingId: trainingId,
        },
      });

      for (const [index, id] of distinctData.uniqueBodyData.entries()) {
        if (
          trainingData &&
          trainingData.startDate &&
          trainingData.TrainingHost
        ) {
          if (serialData._count.id) {
            maxParticipantNumber = serialData._count.id + 1 + index;
          } else {
            maxParticipantNumber = 1 + index;
          }

          console.log("Max Participants: " + maxParticipantNumber);

          const participantData = await prisma.trainingParticipants.create({
            data: {
              trainingId: trainingId,
              personId: id,
            },
          });

          await prisma.uniqueSerial.create({
            data: {
              participantId: participantData.id,
              host: trainingData?.TrainingHost[0]?.trainer?.acronym,
              year: trainingData.startDate.getFullYear().toString(),
              batchNumber: trainingData.batchNumber,
              participantNumber: maxParticipantNumber,
            },
          });
        }
      }

      return Response.json({ message: "Created", success: true });
    }
  }
  const body = await req.json();

  if (body.password) {
    const trainingId = parseInt(body.trainingId);
    const password = body.password;

    const admin = await prisma.account.findFirst({
      where: {
        username: "admin",
      },
    });

    if (admin) {
      const passwordMatched = await bcrypt.compare(password, admin.password);
      if (passwordMatched) {
        await prisma.training.update({
          where: {
            id: trainingId,
          },
          data: {
            status: "Canceled",
          },
        });
        console.log("Canceled");
        return Response.json({ message: "Canceled", success: true });
      }
      console.log("No admin account");
      return Response.json({ message: "Server issue", success: false });
    }
    console.log("Wrong Password");
    return Response.json({ message: "Wrong Password", success: false });
  }

  if (body.TrainingCourse) {
    if (body.TrainingCourse.length == 0) {
      return Response.json({ Message: "No Training Added", status: 400 });
    }
    await prisma.trainingCourse.deleteMany({
      where: { trainingId: parseInt(body.trainingId) },
    });

    body.TrainingCourse.map(async (id: string) => {
      await prisma.trainingCourse.create({
        data: {
          trainingId: parseInt(body.trainingId),
          courseId: parseInt(id),
        },
      });
    });

    return Response.json({ Message: "Success", status: 201 });
  }

  if (body.participantIds) {
    const trainingId = parseInt(body.trainingId);
    let serialData, trainingData, maxParticipantNumber: number;

    // await prisma.trainingParticipants.deleteMany({
    //   where: {
    //     trainingId: trainingId,
    //   },
    // });

    const existingData = await prisma.trainingParticipants.findMany({
      select: {
        personId: true,
      },
      where: {
        trainingId: trainingId,
      },
    });

    const distinctData = getUniqueElements(
      body.participantIds.map((id: string) => parseInt(id, 10)),
      existingData.map(({ personId }) => personId)
    );

    // Exists in DB Data but not in bodyData (Update to Inactive)
    distinctData.uniqueTrainingParticipantsData.map(async (id: number) => {
      const trainingParticipant = await prisma.trainingParticipants.findFirst({
        where: {
          trainingId: trainingId,
          personId: id,
        },
        select: {
          id: true,
        },
      });

      await prisma.trainingParticipants.update({
        where: {
          id: trainingParticipant!.id,
        },
        data: {
          status: "Inactive",
        },
      });
    });

    // Exists in both DB Data and bodyData (Update to Active)
    distinctData.commonBodyData.map(async (id: number) => {
      const trainingParticipant = await prisma.trainingParticipants.findFirst({
        where: {
          trainingId: trainingId,
          personId: id,
        },
        select: {
          id: true,
        },
      });
      await prisma.trainingParticipants.update({
        where: {
          id: trainingParticipant!.id,
        },
        data: {
          status: "Active",
        },
      });
    });
    // Exists in bodyData but not in DB Data (Add)

    distinctData.uniqueBodyData.map(async (id: number, index) => {
      // const existingData = await prisma.trainingParticipants.findFirst({
      //   where: {
      //     trainingId: trainingId,
      //     personId: id,
      //   },
      // });

      // if (existingData) {
      // } else {
      trainingData = await prisma.training.findFirst({
        where: {
          id: trainingId,
        },
        include: {
          TrainingHost: {
            include: {
              trainer: {
                select: {
                  acronym: true,
                },
              },
            },
          },
        },
      });

      if (trainingData && trainingData.startDate && trainingData.TrainingHost) {
        serialData = await prisma.trainingParticipants.aggregate({
          _count: {
            id: true,
          },
          where: {
            trainingId: trainingId,
          },
        });

        if (serialData._count.id) {
          maxParticipantNumber = serialData._count.id + 1 + index;
        } else {
          maxParticipantNumber = 1 + index;
        }

        const participantData = await prisma.trainingParticipants.create({
          data: {
            trainingId: trainingId,
            personId: id,
          },
        });
        console.log(trainingData);

        await prisma.uniqueSerial.create({
          data: {
            participantId: participantData.id,
            host: trainingData?.TrainingHost[0]?.trainer?.acronym,
            year: trainingData.startDate!.getFullYear().toString(),
            batchNumber: trainingData.batchNumber,
            participantNumber: maxParticipantNumber,
          },
        });
      }
    });

    return Response.json({ message: "Created", success: true });
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  if (body.password) {
    const trainingId = parseInt(body.trainingId);
    const password = body.password;

    const admin = await prisma.account.findFirst({
      where: {
        username: "admin",
      },
    });

    if (admin) {
      const passwordMatched = await bcrypt.compare(password, admin.password);
      if (passwordMatched) {
        await prisma.training.delete({
          where: {
            id: trainingId,
          },
        });
        console.log("Deleted");
        return Response.json({ message: "Delete", success: true });
      }
      console.log("Wrong Password");

      return Response.json({ message: "Wrong Password", success: false });
    }
    console.log("No admin account");
    return Response.json({ message: "Server issue", success: false });
  }
  return Response.json({ message: "No Password Input", success: false });
}
