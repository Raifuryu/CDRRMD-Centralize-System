import React from "react";
import CardNavigator from "./CardNavigator";

interface Card {
  href: string;
  title: string;
  description: string;
  target: string;
}

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

const cardData: Record<string, Card[]> = {
  "Administration and Training": [
    {
      href: "/training",
      title: "Training System",
      description: "Training - Information and Management System",
      target: "",
    },
    {
      href: "http://192.168.0.69:913/",
      title: "Human Resource Information System",
      description: "Personnel Inventory",
      target: "",
    },
    {
      href: "/",
      title: "Receiving Information System",
      description: "Inventory of Incoming and Outgoing Documents",
      target: "",
    },
    {
      href: "",
      title: "Logistics Information System",
      description: "Inventory of equipment.",
      target: "",
    },
  ],
  "Operations and Warning": [
    {
      href: "/contact-directory",
      title: "Directory System",
      description: "Contact directory",
      target: "",
    },
  ],

  "Research and Planning": [
    {
      href: "./critical-infrastructure",
      title: "Infrastructure System",
      description: "Inventory of Infrastructure",
      target: "",
    },
    {
      href: "./evacuation-centers",
      title: "Evacuation Centers System",
      description: "Inventory of Evacuation Center",
      target: "",
    },
    {
      href: "./policies",
      title: "Policies System",
      description: "Inventory of Policies",
      target: "",
    },
    {
      href: "./",
      title: "Programs, Projects and Activities",
      description: "Inventory of LDRRMP - PPA",
      target: "",
    },
    {
      href: "./",
      title: "Barangay Technical Services Information System",
      description: "Inventory of BDRRMP - PPA",
      target: "",
    },
  ],
};

const getIp = async (): Promise<string> => {
  try {
    const res = await fetch("http://ipecho.net/plain", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    return await res.text();
  } catch (error) {
    console.error("Error fetching public IP:", error);
    return ""; // Return empty string on error
  }
};

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:px-24 justify-center w-full">
      <CardNavigator
        categories={categories}
        cardData={cardData}
        externalIp={await getIp()}
      />
    </main>
  );
}
