// CardNavigator.tsx
import React from "react";
import Link from "next/link";
import {
  Card as UICard,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Step 1: Define a type for a single card object
type Card = {
  href: string;
  title: string;
  description: string;
  target: string;
};

// Step 2: Define the type for cardData as an array of card objects
type CardNavigatorProps = {
  cardData: Card[];
};

const CardNavigator: React.FC<CardNavigatorProps> = ({ cardData }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {cardData.map((card, index) => (
        <Link key={index} href={card.href} target={card.target}>
          <UICard className="w-[350px]">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </UICard>
        </Link>
      ))}
    </div>
  );
};

export default CardNavigator;
