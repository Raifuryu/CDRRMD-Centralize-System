import React, { useMemo } from "react";
import CardNavigator from "./CardNavigator"; // Ensure this path is correct for ESM

const categories = [
  {
    name: "Research and Planning",
    systems: ["Research and Planning System"],
  },
  {
    name: "Administration and Training",
    systems: ["Warning and Training System"],
  },
  {
    name: "Operations and Warning",
    systems: ["Directory System"],
  },
];

interface Card {
  href: string;
  title: string;
  description: string;
}

const cardData: Record<string, Card[]> = {
  "Administration and Training": [
    {
      href: "/training",
      title: "Training System",
      description: "Training - Information and Management System",
    },
    {
      href: "http://192.168.0.69:913/",
      title: "Human Resource Information System",
      description: "Personnel Inventory",
    },
    {
      href: "/",
      title: "Receiving Information System",
      description: "Inventory of Incoming and Outgoing Documents",
    },
    {
      href: "",
      title: "Logistics Information System",
      description: "Inventory of equipment.",
    },
  ],
  "Operations and Warning": [
    {
      href: "/contact-directory",
      title: "Directory System",
      description: "Contact directory",
    },
    {
      href: "",
      title: "Operations Report",
      description: "Inventory of Operations Report",
    },
    {
      href: "",
      title: "Weather Monitoring System",
      description: "Inventory of Advisories, Equipment.",
    },
    {
      href: "",
      title: "Patient Information System",
      description: "Inventory of Patient Information System.",
    },
  ],
  "Research and Planning": [
    {
      href: "./critical-infrastructure",
      title: "Infrastructure System",
      description: "Inventory of Infrastructure",
    },
    {
      href: "./evacuation-centers",
      title: "Evacuation Centers System",
      description: "Inventory of Evacuation Center",
    },
    {
      href: "./policies",
      title: "Policies System",
      description: "Inventory of Policies",
    },
    {
      href: "./",
      title: "Programs, Projects and Activities",
      description: "Inventory of LDRRMP - PPA",
    },
    {
      href: "./",
      title: "Barangay Technical Services Information System",
      description: "Inventory of BDRRMP - PPA",
    },
  ],
};

export default function Page() {
  const categoryContent = useMemo(
    () =>
      categories.map((category) => {
        const cards = cardData[category.name] || []; // Fallback to empty array if no data
        const gridCols = "grid-cols-3";
        return (
          <div key={category.name} className="mb-12 w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 inline-block">
              {category.name}
            </h2>
            <div
              className={`grid ${gridCols} gap-4 justify-center items-center w-full`}
            >
              {cards.map((card, index) => (
                <div key={index} className="m-4">
                  <CardNavigator cardData={[card]} />
                </div>
              ))}
            </div>
          </div>
        );
      }),
    [] // Removed 'categories' from the dependency array
  );

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:px-24 justify-center w-full">
      {categoryContent}
    </main>
  );
}
