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
import { AccountModule } from "next-auth";
import { getDccLinks } from "@/lib/links";

// Define a type for a single card object
type Card = {
  moduleId: number;
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
  accountModules: AccountModule[];
};

const extractIP = (url: string): string | null => {
  const match = url.match(/http:\/\/(\d+\.\d+\.\d+\.\d+):911/);
  return match ? match[1] : null;
};

const CardNavigator: React.FC<CardNavigatorProps> = ({
  categories,
  cardData,
  externalIp,
  accountModules,
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
            {accountModules.find(
              (module) => module.Modules.category === category.name
            )
              ? data[category.name]?.map((card, index) => {
                  return accountModules.find(
                    (module) =>
                      module.moduleId === card.moduleId && module.access
                  ) ? (
                    <div key={index} className="flex justify-center">
                      <Link href={card.href} target={card.target}>
                        <UICard className="w-[350px]">
                          <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>
                              {card.description}
                            </CardDescription>
                          </CardHeader>
                        </UICard>
                      </Link>
                    </div>
                  ) : null;
                })
              : null}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardNavigator;
