"use server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function POST(request: Request) {
  const body = await request.json();
  if (body) {
    await prisma.policies.create({
      data: {
        policy_number: body.policyNumber,
        name: body.title.toUpperCase(),
        date_approved: format(body.dateApproved, "yyyy-MM-dd"),
        category: body.category,
        type: body.type,
      },
    });
    return Response.json({ success: true });
  }
  return Response.json({ success: false });
}
