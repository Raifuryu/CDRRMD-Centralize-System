import prisma from "@/lib/prisma";
import React from "react";

import PersonSelect from "./personSelect";

const page = async () => {
  const personData = await prisma.person.findMany({
    include: {
      PersonAccount: {
        include: {
          AccountModules: true,
        },
      },
    },
  });

  return (
    <div className="container">
      <PersonSelect personData={personData} />
    </div>
  );
};

export default page;
