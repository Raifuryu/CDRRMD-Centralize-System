import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("certificate") as unknown as File;
  const personnelId: string = data.get("personneLId") as string;
  const certificateName: string = data.get("name") as string;
  const certificateDate: string | null = data.get("date") as string;

  const user = await prisma.person.findFirst({
    where: {
      id: parseInt(personnelId),
    },
  });

  if (!data) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
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
    certificateDate.split("T")[0] +
      "_" +
      certificateName +
      "." +
      file.name.split(".").pop() || "";
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

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}

export async function GET(NextRequest: NextRequest) {
  const personnelId =
    NextRequest.nextUrl.searchParams.get("personnelId") || "0";
  console.log("shlok" + personnelId);
  const data = await prisma.personnelTraining.findMany({
    where: {
      id: parseInt(personnelId),
    },
  });

  console.log(data);

  return Response.json(data).json();
}
