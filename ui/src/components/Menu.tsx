import {
	IonContent,
	IonHeader,
	IonList,
	IonMenu,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import type React from "react";
import { css } from "../../styled-system/css";
import RouteItem from "../routes/Route";
import type { NavBarRouteLink } from "../shared/interfaces/routes.interface";

interface MenuProps {
	routes: NavBarRouteLink[];
}

const Menu: React.FC<MenuProps> = ({ routes }) => {

	return (
		<IonMenu contentId="main-content" swipe-gesture={true}>
			<IonHeader
				translucent={true}
				className={css({ backgroundColor: "#3880ff" })}
			>
				<IonToolbar>
					<IonTitle className={css({ justifySelf: "center" })}>Menu</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className={css({ padding: "10px" })}>
				<IonList className={css({ display: "flex", flexDirection: "column" })}>
					{routes.map((route, index) => (
						<div
							key={`${route.path}-${index}`}
							onClick={() => console.log("pablo")}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									console.log("pablo");
								}
							}}
						>
							<RouteItem
								key={route.path}
								route={route}
							/>
						</div>
					))}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
