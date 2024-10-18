"use client";

// CardNavigator.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card as UICard,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define a type for a single card object
type Card = {
  href: string;
  title: string;
  description: string;
  target: string;
};

interface Category {
  name: string; // Name of the category
  systems: string[]; // Array of system names associated with the category
}

// Define the type for cardData as an array of card objects
type CardNavigatorProps = {
  categories: Category[];
  cardData: Record<string, Card[]>;
  externalIp: string;
};

const extractIP = (url: string): string | null => {
  const match = url.match(/http:\/\/(\d+\.\d+\.\d+\.\d+):911/);
  return match ? match[1] : null;
};

const CardNavigator: React.FC<CardNavigatorProps> = ({
  categories,
  cardData,
  externalIp,
}) => {
  const [data, setData] = useState(cardData);

  useEffect(() => {
    const fetchData = async () => {
      const localIp = "http://192.168.0.200/dcc-webapp";
      let ip = "http://" + externalIp + ":911/dcc-webapp"; // Fallback IP, used first.

      // Ensure data["Operations and Warning"] exists before accessing
      if (!data["Operations and Warning"]) {
        console.error("No 'Operations and Warning' data found.");
        return;
      }

      const lastIndex = data["Operations and Warning"].length - 1;
      const lastLink = extractIP(
        data["Operations and Warning"][lastIndex]?.href
      );

      // Only add DCC links if they're not already present (avoid pushing twice)
      if (!lastLink || lastLink !== ip) {
        console.log("Adding DCC Links for IP:", ip);
        addDccLinks(ip); // Initialize with external IP first
      }

      // Fetch localIp and update if successful
      try {
        const response = await fetch(localIp, {
          method: "HEAD",
          mode: "no-cors",
        });
        if (response) {
          ip = localIp;
          if (
            extractIP(data["Operations and Warning"][lastIndex]?.href) !==
            localIp
          ) {
            console.log("Switching to Local IP:", ip);
            updateDccLinks(ip);
          }
        }
      } catch (error) {
        console.error("Local IP fetch failed, using external IP", error);
      }
    };

    const addDccLinks = (ip: string) => {
      const dccLinks = getDccLinks(ip);

      // Update state immutably
      setData((prevData) => ({
        ...prevData,
        "Operations and Warning": [
          ...(prevData["Operations and Warning"] || []),
          ...dccLinks,
        ],
      }));
    };

    const updateDccLinks = (ip: string) => {
      const dccLinks = getDccLinks(ip);

      setData((prevData) => ({
        ...prevData,
        "Operations and Warning": [
          ...(prevData["Operations and Warning"] || []).slice(0, -10), // Remove the old set
          ...dccLinks, // Add new set with updated IP
        ],
      }));
    };

    const getDccLinks = (ip: string): Card[] => [
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
        href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=0e048db3306d49a18985843702fe9701",
        title: "River Basins Map",
        description: "Map of river basins",
        target: "_blank",
      },
      {
        href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=3e6e8d080e0847f2baf8b668b5755274",
        title: "Zoning Map",
        description: "Zoning information map",
        target: "_blank",
      },
    ];

    fetchData();
  }, [cardData]);

  return (
    <>
      {categories.map((category) => (
        <div key={category.name} className="mb-12 w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 inline-block">
            {category.name}
          </h2>
          <div
            className={`grid grid-cols-3 gap-4 justify-center items-center w-full`}
          >
            {data[category.name]?.map((card, index) => (
              <div key={index} className="flex justify-center">
                <Link href={card.href} target={card.target}>
                  <UICard className="w-[350px]">
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </UICard>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardNavigator;
