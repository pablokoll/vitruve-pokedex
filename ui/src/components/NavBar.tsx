import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from "@ionic/react";
import type React from "react";
import { css } from "../../styled-system/css";
import useIsMobile from "../hooks/useMobile";
import { routesLinks } from "../routes";
import Menu from "./Menu";
import RouteItem from "./RouteItem";

const Navbar: React.FC = () => {
	const isMobile = useIsMobile();
	
	return (
		<>
			{isMobile && <Menu routes={routesLinks} />}

			<IonHeader style={{ height: "56px" }} translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">{isMobile && <IonMenuButton />}</IonButtons>
					<div className={css({ display: "flex", justifyContent: "end" })}>
						{!isMobile &&
							routesLinks.map((route) => (
								<RouteItem
									key={route.path}
									route={route}
								/>
							))}
					</div>
				</IonToolbar>
			</IonHeader>
		</>
	);
};

export default Navbar;
