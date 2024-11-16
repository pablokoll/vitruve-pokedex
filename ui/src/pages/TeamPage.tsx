import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { containerStyle } from "../styles/styles";

const TeamPage: React.FC = () => (
	<IonPage>
		<IonContent>
			<div className={containerStyle}>Teams content</div>
		</IonContent>
	</IonPage>
);

export default TeamPage;
