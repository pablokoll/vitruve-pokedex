import { IonItem } from "@ionic/react";
import type React from "react";
import { useAuth } from "../providers/AuthProvider";
import type { NavBarRouteLink } from "../shared/interfaces/routes.interface";

interface ButtonProps {
	route: NavBarRouteLink;
	className?: string;
}

const RouteItem: React.FC<ButtonProps> = ({ route, className }) => {
	const { useSignOut, isAuthenticated } = useAuth();
	const signOut = useSignOut()

	if (route.path === "/signin" && isAuthenticated) {
		return (
			<IonItem
				routerLink={isAuthenticated ? "/pokedex" : "/signin"}
				className={className}
				onClick={isAuthenticated ? () => signOut() : () => null}
			>
				{isAuthenticated ? "Sign out" : "Sign in"}
			</IonItem>
		);
	}

	return (
		<IonItem routerLink={route.path} className={className}>
			{route.content}
		</IonItem>
	);
};

export default RouteItem;
