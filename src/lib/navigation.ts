export type MenuKey =
  | "Corporate"
  | "Production"
  | "Product"
  | "Media"
  | "Solutions"
  | "Support";

export type MenuItem = {
  label: MenuKey;

  href?: string;

  children: {
    label: string;

    href: string;
  }[];
};

export const menuItems: MenuItem[] = [
  {
    label: "Corporate",

    children: [
      { label: "About Us", href: "/about-us" },

      { label: "History", href: "/history" },

      { label: "Our Quality Policy", href: "/quality" },

      { label: "FAQ", href: "/faq" },

      { label: "Blog", href: "/blog" },

      { label: "News & Announcements", href: "/news" },

      { label: "Events", href: "/media" },

      { label: "Sustainability", href: "/sustainability" },

      { label: "I'm Pump Technology", href: "/im-pump-technology" },

      {
        label: "Law on the Protection of Personal Data",

        href: "/personal-data",
      },

      {
        label: "Cookie Notification",

        href: "/cookie-notification",
      },
    ],
  },

  {
    label: "Production",

    href: "/production",

    children: [],
  },

  {
    label: "Product",

    href: "/pump-series",

    children: [],
  },

  {
    label: "Media",

    href: "/media",

    children: [],
  },

  {
    label: "Solutions",

    href: "/solutions",

    children: [],
  },

  {
    label: "Support",

    href: "/e-service",

    children: [],
  },
];

