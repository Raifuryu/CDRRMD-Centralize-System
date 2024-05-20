import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
  return (
    <main>
      <div className="flex items-center justify-center">
        <div className="container mt-10">
          <DataTable columns={columns} data={[]} />
        </div>
      </div>
    </main>
  );
}
