import {
	IonButtons,
	IonHeader,
	IonMenuButton,
	IonText,
	IonToolbar,
} from "@ionic/react";
import type React from "react";
import { css } from "../../styled-system/css";
import useIsMobile from "../hooks/useMobile";
import useNetworkStatus from "../hooks/useNetworkStatus";
import { routesLinks } from "../routes";
import RouteItem from "../routes/Route";
import Menu from "./Menu";

const Navbar: React.FC = () => {
	const isOnline = useNetworkStatus();
	const isMobile = useIsMobile();

	return (
		<>
			{isMobile && <Menu routes={routesLinks} />}

			<IonHeader style={{ height: "56px" }} translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">{isMobile && <IonMenuButton />}</IonButtons>
					<div
						className={css({
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
						})}
					>
						{!isOnline && (
							<IonText
								className={css({
									marginRight: "2",
								})}
							>
								<span
									className={css({
										color: "red.400",
										fontSize: "2xl",
										fontWeight: "bold",
									})}
								>
									OFFLINE
								</span>
							</IonText>
						)}
						{!isMobile &&
							routesLinks.map((route) => (
								<RouteItem key={route.path} route={route} />
							))}
					</div>
				</IonToolbar>
			</IonHeader>
		</>
	);
};

export default Navbar;
