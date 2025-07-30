export const navigationItems = [
  {
    label: "Categories",
    href: "#categories",
  },
  {
    label: "Discover",
    href: "#discover",
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
