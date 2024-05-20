import React from "react";
import Details from "./details";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main>
      <Details id={parseInt(params.slug)} />
    </main>
  );
}
