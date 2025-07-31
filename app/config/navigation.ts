export const navigationItems = [
  {
    label: "Discover",
    href: "#discover",
  },
  {
    label: "Categories",
    href: "#categories",
  },
  {
    label: "Read",
    href: "#read",
  },
  {
    label: "About us",
    href: "/about-us",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
