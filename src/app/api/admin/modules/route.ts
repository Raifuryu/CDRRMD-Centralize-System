import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { personId, modules } = body; // `personId` is mapped to `accountId` in the schema

    console.log(personId);

    // Ensure personId and modules are provided
    if (!personId || !Array.isArray(modules)) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    // Retrieve accountId using personId
    const account = await prisma.account.findFirst({
      where: { personId: parseInt(personId) }, // Finding account by personId
      select: { id: true }, // Only select the account id
    });

    // If the account is not found, return an error
    if (!account) {
      return new Response(JSON.stringify({ error: "Account not found" }), {
        status: 404,
      });
    }

    const accountId = account.id; // Get the accountId from the found account

    // Get existing account modules
    const existingModules = await prisma.accountModules.findMany({
      where: { accountId: accountId },
      select: { moduleId: true, access: true }, // Select only necessary fields
    });

    const existingModuleIds = new Set(
      existingModules.map((module) => module.moduleId)
    );

    // Prepare the data for upserting
    const results = await Promise.all(
      modules.map(async (module: { moduleId: number; enabled: boolean }) => {
        const isExisting = existingModuleIds.has(module.moduleId);

        return await prisma.accountModules.upsert({
          where: {
            // Using the unique constraint on accountId and moduleId
            accountId_moduleId: {
              accountId: accountId, // Use the retrieved accountId
              moduleId: module.moduleId,
            },
          },
          update: {
            access: module.enabled, // Update the `access` (enabled/disabled) field
          },
          create: {
            accountId: accountId, // Set the `accountId`
            moduleId: module.moduleId, // Set the `moduleId`
            access: module.enabled, // Set the `access` field based on the module enabled value
          },
        });
      })
    );

    // Return success response with the results
    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/modules", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
