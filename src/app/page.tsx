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
  target: string;
}

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

const getIp = async () => {
  const res = await fetch("http://ipecho.net/plain", {
    // next: { revalidate: 60 },
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
      // "API-Key": process.env.DATA_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${res.statusText}`);
  }

  return res.text();
};

function extractIP(url: string) {
  const match = url.match(/http:\/\/(\d+\.\d+\.\d+\.\d+):911/);
  return match ? match[1] : null;
}

const addLinks = async () => {
  const localIp = "http://192.168.0.200/dcc-webapp";
  let ip = "http://" + (await getIp()) + ":911/dcc-webapp";

  const lastIndex = cardData["Operations and Warning"].length - 1;
  const lastLink = extractIP(
    cardData["Operations and Warning"][lastIndex].href
  );

  if (lastLink !== null || lastLink === ip) {
    return null;
  }

  const response = await fetch(localIp); // Replace with the IP you want to check
  if (response.ok) {
    ip = localIp;
  }

  if (cardData["Operations and Warning"][lastIndex].title === "Zoning Map") {
    cardData["Operations and Warning"] = cardData[
      "Operations and Warning"
    ].slice(0, -10);
  }

  const dccLinks = [
    {
      href: ip + "/ems/entry",
      title: "EMS System",
      description: "Emergency Management System",
      target: "_blank",
    },
    {
      href: ip + "/maps/routing",
      title: "Vehicle Routing",
      description: "Vehicle routing system",
      target: "_blank",
    },
    {
      href: ip + "/ers/dashboard",
      title: "911 Dashboard",
      description: "Emergency Response Dashboard",
      target: "_blank",
    },
    {
      href: ip + "/maps/resource-monitoring",
      title: "Resource Map",
      description: "Resource monitoring map",
      target: "_blank",
    },
    {
      href: ip + "/pages/report",
      title: "Reports",
      description: "Incident and response reports",
      target: "_blank",
    },
    {
      href: ip + "/comcenter2/entry",
      title: "Comcenter",
      description: "Communication Center",
      target: "_blank",
    },
    {
      href: ip + "/logistic/items",
      title: "Logistics",
      description: "Logistics system for items management",
      target: "_blank",
    },
    {
      href: ip + "/weather/login",
      title: "Weather Watch",
      description: "Weather monitoring system",
      target: "_blank",
    },
    {
      href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=0e048db3306d49a18985843702fe9701&fbclid=IwAR1BWX2BRaahWOYfxA0pjAFWywf3nRmlE4dsF9cgGPMciNpBO5x_o9e_-Xw",
      title: "River Basins Map",
      description: "Map of river basins",
      target: "_blank",
    },
    {
      href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=3e6e8d080e0847f2baf8b668b5755274&fbclid=IwAR3uYptB1GuSMDKXmBz2ycg-5C6rYl4k3Zfa1KrnevvW6RJQ78GxNGw_gfk",
      title: "Zoning Map",
      description: "Zoning information map",
      target: "_blank",
    },
  ];

  dccLinks.forEach((item) => {
    cardData["Operations and Warning"].push(item);
  });
};

export default function Page() {
  addLinks();
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
    []
  );

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:px-24 justify-center w-full">
      {categoryContent}
    </main>
  );
}
