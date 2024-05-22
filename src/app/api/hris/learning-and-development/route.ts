import { writeFile } from "fs/promises";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { CertificateStatus } from "@prisma/client";

export async function POST(request: Request) {
  const data = await request.formData();
  const personnelId: string = data.get("personnelId") as string;
  const host: string = data.get("host") as string;
  const name: string = data.get("name") as string;
  const date: string | null = data.get("date") as string;
  const hours: string | null = data.get("hours") as string;
  const certificate: File | null = data.get("certificate") as unknown as File;
  const status: string | null = data.get("status") as string;

  const numericString = personnelId.replace(/\D/g, ""); // Remove non-numeric characters

  const user = await prisma.person.findFirst({
    where: {
      id: parseInt(numericString),
    },
  });

  if (!data) {
    return Response.json({ success: false });
  }

  const bytes = await certificate.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // get name to be used as folder name
  const personnelName =
    user?.lastName +
    ", " +
    user?.firstName +
    " " +
    user?.middleName +
    " " +
    user?.extensionName;
  const filename =
    date.split("T")[0] + "_" + name + "." + certificate.name.split(".").pop() ||
    "";
  const cleanedFilename = filename.replace(/"/g, "");

  try {
    // check if folder exists else create
    const uploadDirectory = "public/uploads/training";

    // Ensure the directory exists or create it
    if (!fs.existsSync("./" + uploadDirectory + "/" + personnelName)) {
      fs.mkdirSync("./" + uploadDirectory + "/" + personnelName, {
        recursive: true,
      });
    }

    //write file
    await writeFile(
      path.join(
        process.cwd(),
        uploadDirectory + "/" + personnelName + "/" + cleanedFilename
      ),
      buffer
    );

    const newCertificateStatus =
      status === "Completion"
        ? CertificateStatus.Completion
        : status === "Participation"
        ? CertificateStatus.Participation
        : CertificateStatus.Attendance;

    await prisma.personnelTraining.create({
      data: {
        id: parseInt(numericString),
        host: JSON.parse(host),
        name: JSON.parse(name),
        dateOfTraining: JSON.parse(date),
        trainingHours: parseInt(hours.replace(/\D/g, "")),
        certificateStatus: newCertificateStatus,
      },
    });

    return Response.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return Response.json({ Message: "Failed", status: 500 });
  }
}
