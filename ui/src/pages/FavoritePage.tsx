import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useAuth } from "../providers/AuthProvider";
import { containerStyle } from "../styles/styles";

const FavoritePage: React.FC = () => {
	const { useUser } = useAuth();
	const user = useUser();

	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>Favorite content</div>
			</IonContent>
		</IonPage>
	);
};

export default FavoritePage;
