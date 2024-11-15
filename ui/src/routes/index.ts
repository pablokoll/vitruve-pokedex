import type { NavBarRouteLink } from "../shared/interfaces/routes.interface";

export const routesLinks: NavBarRouteLink[] = [
	{ path: "/pokedex", content: "Pokedex", private: false },
	{ path: "/favorites", content: "Favorites", private: true },
	{ path: "/team", content: "Teams", private: true },
	{ path: "/signin", content: "Sign in", private: false },
];
