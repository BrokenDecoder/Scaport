export interface RouteInfo {
  path: string;
  name: string;
  number: string;
  desc: string;
}

export const PORTFOLIO_ROUTES: RouteInfo[] = [
  {
    path: "/",
    name: "Overview & Stack",
    number: "01",
    desc: "Hero & Full-Stack Toolchain",
  },
  {
    path: "/projects",
    name: "Selected Projects",
    number: "02",
    desc: "Systems, AI & Open-Source Tools",
  },
  {
    path: "/about",
    name: "Neurotech & Systems",
    number: "03",
    desc: "Brain-Computer Interfaces & Bio-Modeling",
  },
  {
    path: "/experience",
    name: "Work & Leadership",
    number: "04",
    desc: "Medinest R&D & Engineering Track Record",
  },
  {
    path: "/education",
    name: "Academic & Honors",
    number: "05",
    desc: "AI & Physics Degrees & Certifications",
  },
  {
    path: "/contact",
    name: "Direct Contact",
    number: "06",
    desc: "Get in Touch & Connect",
  },
];

export function getAdjacentRoutes(currentPath: string) {
  const normalized = currentPath === "" ? "/" : currentPath;
  const index = PORTFOLIO_ROUTES.findIndex((r) => r.path === normalized);
  const prev = index > 0 ? PORTFOLIO_ROUTES[index - 1] : null;
  const next =
    index >= 0 && index < PORTFOLIO_ROUTES.length - 1
      ? PORTFOLIO_ROUTES[index + 1]
      : null;
  return {
    prev,
    next,
    current: index >= 0 ? PORTFOLIO_ROUTES[index] : null,
  };
}
