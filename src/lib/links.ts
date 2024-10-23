interface Card {
  moduleId: number;
  href: string;
  title: string;
  description: string;
  target: string;
}

export const categories = [
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

export const cardData: Record<string, Card[]> = {
  "Administration and Training": [
    {
      moduleId: 1,
      href: "/training",
      title: "Training System",
      description: "Training - Information and Management System",
      target: "",
    },
    {
      moduleId: 2,
      href: "http://192.168.0.69:913/",
      title: "Human Resource Information System",
      description: "Personnel Inventory",
      target: "",
    },
    {
      moduleId: 3,
      href: "/",
      title: "Receiving Information System",
      description: "Inventory of Incoming and Outgoing Documents",
      target: "",
    },
    {
      moduleId: 4,
      href: "",
      title: "Logistics Information System",
      description: "Inventory of equipment.",
      target: "",
    },
  ],
  "Operations and Warning": [
    {
      moduleId: 5,
      href: "/contact-directory",
      title: "Directory System",
      description: "Contact directory",
      target: "",
    },
  ],

  "Research and Planning": [
    {
      moduleId: 16,
      href: "./critical-infrastructure",
      title: "Infrastructure System",
      description: "Inventory of Infrastructure",
      target: "",
    },
    {
      moduleId: 17,
      href: "./evacuation-centers",
      title: "Evacuation Centers System",
      description: "Inventory of Evacuation Center",
      target: "",
    },
    {
      moduleId: 18,
      href: "./policies",
      title: "Policies System",
      description: "Inventory of Policies",
      target: "",
    },
    {
      moduleId: 19,
      href: "./",
      title: "Programs, Projects and Activities",
      description: "Inventory of LDRRMP - PPA",
      target: "",
    },
    {
      moduleId: 20,
      href: "./",
      title: "Barangay Technical Services Information System",
      description: "Inventory of BDRRMP - PPA",
      target: "",
    },
  ],
};

export const getDccLinks = (ip: string): Card[] => [
  {
    moduleId: 6,
    href: ip + "/ems/entry",
    title: "EMS System",
    description: "Emergency Management System",
    target: "_blank",
  },
  {
    moduleId: 7,
    href: ip + "/maps/routing",
    title: "Vehicle Routing",
    description: "Vehicle routing system",
    target: "_blank",
  },
  {
    moduleId: 8,
    href: ip + "/ers/dashboard",
    title: "911 Dashboard",
    description: "Emergency Response Dashboard",
    target: "_blank",
  },
  {
    moduleId: 9,
    href: ip + "/maps/resource-monitoring",
    title: "Resource Map",
    description: "Resource monitoring map",
    target: "_blank",
  },
  {
    moduleId: 10,
    href: ip + "/pages/report",
    title: "Reports",
    description: "Incident and response reports",
    target: "_blank",
  },
  {
    moduleId: 11,
    href: ip + "/comcenter2/entry",
    title: "Comcenter",
    description: "Communication Center",
    target: "_blank",
  },
  {
    moduleId: 12,
    href: ip + "/logistic/items",
    title: "Logistics",
    description: "Logistics system for items management",
    target: "_blank",
  },
  {
    moduleId: 13,
    href: ip + "/weather/login",
    title: "Weather Watch",
    description: "Weather monitoring system",
    target: "_blank",
  },
  {
    moduleId: 14,
    href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=0e048db3306d49a18985843702fe9701",
    title: "River Basins Map",
    description: "Map of river basins",
    target: "_blank",
  },
  {
    moduleId: 15,
    href: "https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=3e6e8d080e0847f2baf8b668b5755274",
    title: "Zoning Map",
    description: "Zoning information map",
    target: "_blank",
  },
];
